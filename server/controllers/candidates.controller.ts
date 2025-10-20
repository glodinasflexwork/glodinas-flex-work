import { Response } from 'express';
import { db } from '../../db/index.js';
import { profiles, users } from '../../db/schema/index.js';
import { eq, ilike, or } from 'drizzle-orm';
import { AuthRequest } from '../middleware/auth.js';

export const getAllCandidates = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can browse candidates' });
    }

    const { search, location } = req.query;

    let query = db.select({
      id: profiles.id,
      userId: profiles.userId,
      professionalHeadline: profiles.professionalHeadline,
      bio: profiles.bio,
      skills: profiles.skills,
      location: profiles.location,
      user: {
        name: users.name,
      },
    }).from(profiles).innerJoin(users, eq(profiles.userId, users.id));

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(profiles.professionalHeadline, `%${search}%`),
          ilike(profiles.bio, `%${search}%`),
          ilike(users.name, `%${search}%`)
        )!
      );
    }

    if (location) {
      conditions.push(ilike(profiles.location, `%${location}%`));
    }

    // Note: For skills array search, we'd need a more sophisticated query
    // This is a simplified version

    const candidates = conditions.length > 0 
      ? await query.where(or(...conditions))
      : await query;

    res.json({ candidates });
  } catch (error) {
    console.error('Get all candidates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCandidateById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can view candidate profiles' });
    }

    const { id } = req.params;

    const [candidate] = await db.select({
      id: profiles.id,
      userId: profiles.userId,
      professionalHeadline: profiles.professionalHeadline,
      bio: profiles.bio,
      skills: profiles.skills,
      experience: profiles.experience,
      education: profiles.education,
      location: profiles.location,
      user: {
        name: users.name,
        email: users.email,
      },
    }).from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(eq(profiles.userId, id))
      .limit(1);

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json({ candidate });
  } catch (error) {
    console.error('Get candidate by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

