import { Response } from 'express';
import { db } from '../../db/index.js';
import { applications, jobs, companies, profiles, users } from '../../db/schema/index.js';
import { eq, and } from 'drizzle-orm';
import { AuthRequest } from '../middleware/auth.js';

export const applyToJob = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can apply to jobs' });
    }

    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    // Check if job exists
    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if already applied
    const [existingApplication] = await db.select().from(applications).where(
      and(eq(applications.userId, req.user.id), eq(applications.jobId, jobId))
    ).limit(1);

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    const [newApplication] = await db.insert(applications).values({
      userId: req.user.id,
      jobId,
      coverLetter,
      status: 'pending',
    }).returning();

    res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can view their applications' });
    }

    const myApplications = await db.select({
      id: applications.id,
      status: applications.status,
      coverLetter: applications.coverLetter,
      appliedAt: applications.appliedAt,
      jobId: jobs.id,
      jobTitle: jobs.title,
      jobLocation: jobs.location,
      jobEmploymentType: jobs.employmentType,
      companyName: companies.name,
      companyLogoUrl: companies.logoUrl,
    }).from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(applications.userId, req.user.id));

    res.json({ applications: myApplications });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getJobApplications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can view job applications' });
    }

    const { jobId } = req.params;

    // Get company for this user
    const [company] = await db.select().from(companies).where(eq(companies.userId, req.user.id)).limit(1);

    if (!company) {
      return res.status(400).json({ error: 'Company profile not found' });
    }

    // Check if job belongs to this company
    const [job] = await db.select().from(jobs).where(
      and(eq(jobs.id, jobId), eq(jobs.companyId, company.id))
    ).limit(1);

    if (!job) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }

    const jobApplications = await db.select({
      id: applications.id,
      status: applications.status,
      coverLetter: applications.coverLetter,
      appliedAt: applications.appliedAt,
      candidateId: users.id,
      candidateName: users.name,
      candidateEmail: users.email,
      professionalHeadline: profiles.professionalHeadline,
      candidateLocation: profiles.location,
      candidateSkills: profiles.skills,
    }).from(applications)
      .innerJoin(users, eq(applications.userId, users.id))
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .where(eq(applications.jobId, jobId));

    res.json({ applications: jobApplications });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can update application status' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'reviewing', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Get company for this user
    const [company] = await db.select().from(companies).where(eq(companies.userId, req.user.id)).limit(1);

    if (!company) {
      return res.status(400).json({ error: 'Company profile not found' });
    }

    // Check if application belongs to a job of this company
    const [application] = await db.select({
      id: applications.id,
      jobId: applications.jobId,
    }).from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .where(and(eq(applications.id, id), eq(jobs.companyId, company.id)))
      .limit(1);

    if (!application) {
      return res.status(404).json({ error: 'Application not found or unauthorized' });
    }

    const [updatedApplication] = await db.update(applications)
      .set({ status, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();

    res.json({ message: 'Application status updated successfully', application: updatedApplication });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

