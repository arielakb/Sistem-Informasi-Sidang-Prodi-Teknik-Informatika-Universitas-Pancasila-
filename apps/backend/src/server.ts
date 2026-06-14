import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './infrastructure/config/env';
import { ApiResponse } from './infrastructure/utils/ApiResponse';
import { ApiError } from './infrastructure/utils/ApiError';
import routes from './infrastructure/http/routes';
import publicRoutes from './infrastructure/http/routes/public.routes';
import { ErrorMiddleware } from './infrastructure/http/middleware/ErrorMiddleware';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req: Request, res: Response) => {
  ApiResponse.success(res, {
    name: 'Sistem Administrasi Skripsi API',
    version: '1.0.0',
    university: 'Universitas Pancasila',
    status: 'running',
    environment: env.NODE_ENV,
    mockApiEnabled: env.API_KAMPUS_API_KEY.includes('placeholder') || env.API_KAMPUS_API_KEY === '',
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  ApiResponse.success(res, { status: 'UP', timestamp: new Date().toISOString() });
});

// Public routes (tanpa login)
app.use('/api/v1/public', publicRoutes);

// Test mock adapter
app.get('/api/v1/test/mock-adapter', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { diContainer } = await import('./infrastructure/config/di-container');
    const adapter = diContainer.getApiKampusAdapter();
    
    const isAvailable = await adapter.isAvailable();
    const mahasiswa = await adapter.getAllMahasiswa();
    const dosen = await adapter.getAllDosen();
    
    ApiResponse.success(res, {
      adapterType: env.API_KAMPUS_API_KEY.includes('placeholder') || env.API_KAMPUS_API_KEY === '' ? 'MOCK' : 'REAL',
      isAvailable,
      mahasiswaCount: mahasiswa.length,
      dosenCount: dosen.length,
      sampleMahasiswa: mahasiswa[0],
      sampleDosen: dosen[0],
    });
  } catch (error) {
    next(error);
  }
});

// Protected API Routes
app.use('/api/v1', routes);

// 404 handler
app.use((req: Request, res: Response) => {
  ApiResponse.error(res, 'Route not found', 404);
});

// Error handler
app.use(ErrorMiddleware);

// Start server
app.listen(env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  console.log(`📦 Environment: ${env.NODE_ENV}`);
  console.log(`🗄️  Database: PostgreSQL`);
  console.log(`🔌 Mock API Kampus: ${env.API_KAMPUS_API_KEY.includes('placeholder') || env.API_KAMPUS_API_KEY === '' ? 'ENABLED' : 'DISABLED'}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   - POST /api/v1/auth/login`);
  console.log(`   - GET  /api/v1/public/jadwal (tanpa login)`);
  console.log(`   - GET  /api/v1/mahasiswa/profil`);
  console.log(`   - POST /api/v1/dosen/logbook/:id/validasi`);
  console.log(`   - POST /api/v1/penilaian/:jadwalId`);
  console.log(`   - GET  /api/v1/koordinator/dashboard-akreditasi`);
});

export default app;