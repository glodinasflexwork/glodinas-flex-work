import { Response } from 'express';
import { db } from '../../db/index.js';
import { jobs, companies } from '../../db/schema/index.js';
import { eq, and, or, ilike, sql } from 'drizzle-orm';
import { AuthRequest } from '../middleware/auth.js';

export const getAllJobs = async (req: AuthRequest, res: Response) => {
  try {
    const {
      search,
      location,
      employmentType,
      experienceLevel,
      isRemote,
      salaryMin,
      salaryMax,
    } = req.query;

    let query = db.select({
      id: jobs.id,
      title: jobs.title,
      description: jobs.description,
      requirements: jobs.requirements,
      responsibilities: jobs.responsibilities,
      salaryMin: jobs.salaryMin,
      salaryMax: jobs.salaryMax,
      salaryCurrency: jobs.salaryCurrency,
      location: jobs.location,
      employmentType: jobs.employmentType,
      experienceLevel: jobs.experienceLevel,
      isRemote: jobs.isRemote,
      status: jobs.status,
      createdAt: jobs.createdAt,
      company: {
        id: companies.id,
        name: companies.name,
        logoUrl: companies.logoUrl,
        location: companies.location,
      },
    }).from(jobs).innerJoin(companies, eq(jobs.companyId, companies.id));

    const conditions = [eq(jobs.status, 'active')];

    if (search) {
      conditions.push(
        or(
          ilike(jobs.title, `%${search}%`),
          ilike(jobs.description, `%${search}%`),
          ilike(companies.name, `%${search}%`)
        )!
      );
    }

    if (location) {
      conditions.push(ilike(jobs.location, `%${location}%`));
    }

    if (employmentType) {
      conditions.push(eq(jobs.employmentType, employmentType as string));
    }

    if (experienceLevel) {
      conditions.push(eq(jobs.experienceLevel, experienceLevel as string));
    }

    if (isRemote === 'true') {
      conditions.push(eq(jobs.isRemote, true));
    }

    if (salaryMin) {
      conditions.push(sql`${jobs.salaryMin} >= ${Number(salaryMin)}`);
    }

    if (salaryMax) {
      conditions.push(sql`${jobs.salaryMax} <= ${Number(salaryMax)}`);
    }

    const result = await query.where(and(...conditions));

    res.json({ jobs: result });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getJobById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [job] = await db.select({
      id: jobs.id,
      title: jobs.title,
      description: jobs.description,
      requirements: jobs.requirements,
      responsibilities: jobs.responsibilities,
      salaryMin: jobs.salaryMin,
      salaryMax: jobs.salaryMax,
      salaryCurrency: jobs.salaryCurrency,
      location: jobs.location,
      employmentType: jobs.employmentType,
      experienceLevel: jobs.experienceLevel,
      isRemote: jobs.isRemote,
      status: jobs.status,
      createdAt: jobs.createdAt,
      company: {
        id: companies.id,
        name: companies.name,
        description: companies.description,
        logoUrl: companies.logoUrl,
        location: companies.location,
        website: companies.website,
      },
    }).from(jobs).innerJoin(companies, eq(jobs.companyId, companies.id)).where(eq(jobs.id, id)).limit(1);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can create jobs' });
    }

    // Get company for this user
    const [company] = await db.select().from(companies).where(eq(companies.userId, req.user.id)).limit(1);

    if (!company) {
      return res.status(400).json({ error: 'Please create a company profile first' });
    }

    const {
      title,
      description,
      requirements,
      responsibilities,
      salaryMin,
      salaryMax,
      salaryCurrency,
      location,
      employmentType,
      experienceLevel,
      isRemote,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const [newJob] = await db.insert(jobs).values({
      companyId: company.id,
      title,
      description,
      requirements,
      responsibilities,
      salaryMin,
      salaryMax,
      salaryCurrency,
      location,
      employmentType,
      experienceLevel,
      isRemote: isRemote || false,
      status: 'active',
    }).returning();

    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can update jobs' });
    }

    const { id } = req.params;

    // Get company for this user
    const [company] = await db.select().from(companies).where(eq(companies.userId, req.user.id)).limit(1);

    if (!company) {
      return res.status(400).json({ error: 'Company profile not found' });
    }

    // Check if job belongs to this company
    const [existingJob] = await db.select().from(jobs).where(
      and(eq(jobs.id, id), eq(jobs.companyId, company.id))
    ).limit(1);

    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }

    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData.id;
    delete updateData.companyId;

    const [updatedJob] = await db.update(jobs).set(updateData).where(eq(jobs.id, id)).returning();

    res.json({ message: 'Job updated successfully', job: updatedJob });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can delete jobs' });
    }

    const { id } = req.params;

    // Get company for this user
    const [company] = await db.select().from(companies).where(eq(companies.userId, req.user.id)).limit(1);

    if (!company) {
      return res.status(400).json({ error: 'Company profile not found' });
    }

    // Check if job belongs to this company
    const [existingJob] = await db.select().from(jobs).where(
      and(eq(jobs.id, id), eq(jobs.companyId, company.id))
    ).limit(1);

    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }

    await db.delete(jobs).where(eq(jobs.id, id));

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyJobs = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can view their jobs' });
    }

    // Get company for this user
    const [company] = await db.select().from(companies).where(eq(companies.userId, req.user.id)).limit(1);

    if (!company) {
      return res.json({ jobs: [] });
    }

    const myJobs = await db.select().from(jobs).where(eq(jobs.companyId, company.id));

    res.json({ jobs: myJobs });
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

