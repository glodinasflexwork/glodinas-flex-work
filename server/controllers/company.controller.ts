import { Response } from 'express';
import { db } from '../../db/index.js';
import { companies } from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { AuthRequest } from '../middleware/auth.js';

export const getCompany = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const [company] = await db.select().from(companies).where(eq(companies.userId, req.user.id)).limit(1);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({ company });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCompany = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can create companies' });
    }

    // Check if company already exists
    const [existingCompany] = await db.select().from(companies).where(eq(companies.userId, req.user.id)).limit(1);

    if (existingCompany) {
      return res.status(400).json({ error: 'Company already exists' });
    }

    const {
      name,
      description,
      industry,
      companySize,
      website,
      logoUrl,
      location,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    const [newCompany] = await db.insert(companies).values({
      userId: req.user.id,
      name,
      description,
      industry,
      companySize,
      website,
      logoUrl,
      location,
    }).returning();

    res.status(201).json({ message: 'Company created successfully', company: newCompany });
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCompany = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can update companies' });
    }

    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData.id;
    delete updateData.userId;

    const [updatedCompany] = await db.update(companies)
      .set(updateData)
      .where(eq(companies.userId, req.user.id))
      .returning();

    if (!updatedCompany) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({ message: 'Company updated successfully', company: updatedCompany });
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

