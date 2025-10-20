import { Response } from 'express';
import { db } from '../../db/index.js';
import { profiles, users } from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { AuthRequest } from '../middleware/auth.js';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, req.user.id)).limit(1);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can create profiles' });
    }

    // Check if profile already exists
    const [existingProfile] = await db.select().from(profiles).where(eq(profiles.userId, req.user.id)).limit(1);

    if (existingProfile) {
      return res.status(400).json({ error: 'Profile already exists' });
    }

    const {
      professionalHeadline,
      bio,
      skills,
      experience,
      education,
      location,
      phone,
      resumeUrl,
    } = req.body;

    const [newProfile] = await db.insert(profiles).values({
      userId: req.user.id,
      professionalHeadline,
      bio,
      skills,
      experience,
      education,
      location,
      phone,
      resumeUrl,
    }).returning();

    res.status(201).json({ message: 'Profile created successfully', profile: newProfile });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'job_seeker') {
      return res.status(403).json({ error: 'Only job seekers can update profiles' });
    }

    const updateData = { ...req.body, updatedAt: new Date() };
    delete updateData.id;
    delete updateData.userId;

    const [updatedProfile] = await db.update(profiles)
      .set(updateData)
      .where(eq(profiles.userId, req.user.id))
      .returning();

    if (!updatedProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ message: 'Profile updated successfully', profile: updatedProfile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPublicProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [profile] = await db.select({
      id: profiles.id,
      professionalHeadline: profiles.professionalHeadline,
      bio: profiles.bio,
      skills: profiles.skills,
      experience: profiles.experience,
      education: profiles.education,
      location: profiles.location,
      user: {
        name: users.name,
      },
    }).from(profiles)
      .innerJoin(users, eq(profiles.userId, users.id))
      .where(eq(profiles.userId, id))
      .limit(1);

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

