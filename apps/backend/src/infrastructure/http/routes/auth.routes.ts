import { Router, IRouter } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { validateRequest } from '../middleware/ValidationMiddleware';
import { loginSchema, registerSchema } from '../../../application/validators/AuthValidator';
import { LoginUseCase } from '../../../application/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from '../../../application/use-cases/auth/RegisterUseCase';
import { RefreshTokenUseCase } from '../../../application/use-cases/auth/RefreshTokenUseCase';
import { AuthService } from '../../../application/services/AuthService';
import { PrismaUserRepository } from '../../database/repositories/PrismaUserRepository';
import { prisma } from '../../config/database';

const router: IRouter = Router();

// Dependencies
const userRepository = new PrismaUserRepository(prisma);
const authService = new AuthService();
const loginUseCase = new LoginUseCase(userRepository, authService);
const registerUseCase = new RegisterUseCase(userRepository, authService);
const refreshTokenUseCase = new RefreshTokenUseCase(userRepository, authService);
const authController = new AuthController(loginUseCase, registerUseCase, refreshTokenUseCase);

// Public routes dengan validasi
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/refresh', authController.refreshToken);

// Protected routes
router.get('/me', AuthMiddleware, authController.getMe);
router.post('/logout', AuthMiddleware, authController.logout);

export default router;