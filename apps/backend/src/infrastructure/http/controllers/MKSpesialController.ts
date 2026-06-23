import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/database';
import { MKSpesialUseCases } from '../../../application/use-cases/admin/MKSpesialUseCases';
import { ValidationService } from '../../utils/ValidationService';
import { z } from 'zod';

const useCases = new MKSpesialUseCases(prisma);

export const MKSpesialController = {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await useCases.list();
      res.json({ data });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({ mahasiswaId: z.string().uuid(), alasan: z.string().min(5) });
      const validation = ValidationService.validate(schema, req.body);
      if (!validation.valid) return res.status(400).json({ errors: validation.errors });

      const record = await useCases.create(req.body);
      res.status(201).json({ data: record });
    } catch (err) {
      next(err);
    }
  },
};
