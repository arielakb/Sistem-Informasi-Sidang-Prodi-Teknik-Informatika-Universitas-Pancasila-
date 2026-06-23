import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { PeerReviewUseCases } from '../../../application/use-cases/mahasiswa/PeerReviewUseCases';
import { ValidationService } from '../../utils/ValidationService';
import { z } from 'zod';

const useCases = new PeerReviewUseCases(prisma);

export const PeerReviewController = {
  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({ reviewerId: z.string().uuid(), mahasiswaId: z.string().uuid(), komentar: z.string().optional(), skor: z.number().int().min(0).max(100).optional() });
      const validation = ValidationService.validate(schema, req.body);
      if (!validation.valid) return res.status(400).json({ errors: validation.errors });

      const created = await useCases.submit(req.body);
      res.status(201).json({ data: created });
    } catch (err) {
      next(err);
    }
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const mahasiswaId = req.query.mahasiswaId as string;
      if (!mahasiswaId) return res.status(400).json({ error: 'mahasiswaId query param required' });
      const data = await useCases.listForMahasiswa(mahasiswaId);
      res.json({ data });
    } catch (err) {
      next(err);
    }
  },
};
