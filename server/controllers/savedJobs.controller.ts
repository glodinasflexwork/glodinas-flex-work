import { Response } from 'express';
import { db } from '../../db/index.js';
import { savedJobs, jobs, companies } from '../../db/schema/index.js';
import { eq, and } from 'drizzle-orm';
import { AuthRequest } from '../middleware/auth.js';

export const saveJob = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can save jobs' });
    }

    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    // Check if job exists
    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if already saved
    const [existingSave] = await db.select().from(savedJobs).where(
      and(eq(savedJobs.userId, req.user.id), eq(savedJobs.jobId, jobId))
    ).limit(1);

    if (existingSave) {
      return res.status(400).json({ error: 'Job already saved' });
    }

    const [newSave] = await db.insert(savedJobs).values({
      userId: req.user.id,
      jobId,
    }).returning();

    res.status(201).json({ message: 'Job saved successfully', savedJob: newSave });
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const unsaveJob = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can unsave jobs' });
    }

    const { jobId } = req.params;

    await db.delete(savedJobs).where(
      and(eq(savedJobs.userId, req.user.id), eq(savedJobs.jobId, jobId))
    );

    res.json({ message: 'Job unsaved successfully' });
  } catch (error) {
    console.error('Unsave job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSavedJobs = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can view saved jobs' });
    }

    const mySavedJobs = await db.select({
      id: savedJobs.id,
      savedAt: savedJobs.savedAt,
      jobId: jobs.id,
      jobTitle: jobs.title,
      jobDescription: jobs.description,
      jobLocation: jobs.location,
      jobEmploymentType: jobs.employmentType,
      jobSalaryMin: jobs.salaryMin,
      jobSalaryMax: jobs.salaryMax,
      jobSalaryCurrency: jobs.salaryCurrency,
      jobIsRemote: jobs.isRemote,
      companyName: companies.name,
      companyLogoUrl: companies.logoUrl,
      companyLocation: companies.location,
    }).from(savedJobs)
      .innerJoin(jobs, eq(savedJobs.jobId, jobs.id))
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(savedJobs.userId, req.user.id));

    res.json({ savedJobs: mySavedJobs });
  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

