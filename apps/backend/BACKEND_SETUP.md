# Sistem Administrasi Skripsi - Backend Setup Guide

## 📋 Ringkasan Project

Backend untuk Sistem Administrasi Skripsi Universitas Pancasila dengan arsitektur **Clean Architecture** menggunakan:
- **Runtime**: Node.js 22 LTS  
- **Framework**: Express.js  
- **Database**: PostgreSQL 17  
- **ORM**: Prisma 6  
- **Auth**: JWT (Access + Refresh Token) + bcrypt  
- **File Storage**: Local/MinIO  
- **PDF Generator**: Puppeteer  

## 🏗️ Arsitektur Layers

```
┌────────────────────────────────────────┐
│      PRESENTATION LAYER (HTTP)         │
│  Controllers, Routes, Middleware       │
├────────────────────────────────────────┤
│      APPLICATION LAYER                 │
│  Use Cases, DTOs, Services, Validators │
├────────────────────────────────────────┤
│      DOMAIN LAYER                      │
│  Entities, Interfaces, Enums, Rules    │
├────────────────────────────────────────┤
│      INFRASTRUCTURE LAYER              │
│  Repositories, DB, External Services   │
└────────────────────────────────────────┘
```

## 📁 Struktur Project

```
src/
├── domain/                    # Domain Layer
│   ├── entities/             # Business objects
│   ├── interfaces/           # Contracts
│   └── enums/                # Domain constants
│
├── application/              # Application Layer
│   ├── dto/                  # Data transfer objects
│   ├── use-cases/            # Business logic
│   ├── services/             # Application services
│   └── validators/           # Input validation
│
├── infrastructure/           # Infrastructure Layer
│   ├── config/              # Configuration
│   ├── database/            # Repositories & Prisma
│   ├── http/                # Controllers, routes, middleware
│   ├── external-services/   # Email, file storage, PDF
│   └── utils/               # Helpers
│
└── presentation/            # Presentation Layer (if needed)
```

## 🚀 Setup & Installation

### 1. Prerequisites

```bash
- Node.js 22.x
- PostgreSQL 17.x
- npm or pnpm
```

### 2. Install Dependencies

```bash
cd apps/backend
pnpm install
```

atau jika menggunakan npm:

```bash
npm install
```

### 3. Environment Setup

Copy `.env.example` ke `.env` dan sesuaikan:

```bash
cp .env.example .env
```

Edit `.env`:

```ini
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/skripsi_db"

# Server
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your-secret-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# API Kampus (Mock or Real)
API_KAMPUS_URL=https://api-kampus.univpancasila.ac.id
API_KAMPUS_API_KEY=placeholder-key  # Use 'placeholder' for mock adapter

# File Storage
STORAGE_TYPE=local  # local or minio
UPLOAD_DIR=./uploads

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 4. Database Setup

```bash
# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed data
pnpm db:seed
```

atau untuk reset database:

```bash
pnpm db:reset
```

## 🎯 Development

### Start Development Server

```bash
pnpm dev
```

Server akan berjalan di `http://localhost:3000`

### API Health Check

```bash
GET http://localhost:3000/
GET http://localhost:3000/health
```

### Test Mock Adapter

```bash
GET http://localhost:3000/api/v1/test/mock-adapter
```

## 📦 Fitur & Modules

### 🔐 Authentication
- Login / Register
- Refresh Token
- JWT-based auth
- Password hashing with bcrypt

### 👨‍🎓 Mahasiswa
- Pengajuan topik skripsi
- Logbook bimbingan
- Upload berkas sidang
- Upload berkas final
- Monitoring progress

### 👨‍🏫 Dosen Pembimbing
- Validasi logbook
- Approve berkas final
- Catatan revisi

### 📋 Dosen Penguji
- Input penilaian (presentasi, materi, teknik)
- Rekap nilai

### 🏛️ Koordinator / Kaprodi
- Jadwal sidang
- Penugasan dosen pembimbing
- Dashboard akreditasi

### 🖥️ Admin / Staf Akademik
- Manajemen user (CRUD)
- Penjadwalan (Seminar, Komprehensif, Skripsi)
- Generate dokumen (SK, Berita Acara)
- Atur deadline

### 🔓 Public
- Lihat jadwal sidang (tanpa login)
- Filter & pencarian

## 🧪 Testing

### Run All Tests

```bash
pnpm test
```

### Run Tests in Watch Mode

```bash
pnpm test:watch
```

### Coverage Report

```bash
pnpm test:coverage
```

## 📚 API Documentation

Base URL: `http://localhost:3000/api/v1`

### Authentication

```
POST   /auth/register       # Register user
POST   /auth/login          # Login
POST   /auth/refresh        # Refresh token
```

### Mahasiswa

```
GET    /mahasiswa           # Get all mahasiswa
GET    /mahasiswa/:id       # Get mahasiswa detail
POST   /mahasiswa           # Create mahasiswa (admin)
PUT    /mahasiswa/:id       # Update mahasiswa
```

### Dosen

```
GET    /dosen               # Get all dosen
GET    /dosen/:id           # Get dosen detail
```

### Skripsi / Topik

```
POST   /mahasiswa/:id/topik               # Ajukan topik
GET    /mahasiswa/:id/logbook             # Get logbook
POST   /mahasiswa/:id/logbook             # Buat logbook
PUT    /logbook/:id/validasi              # Validasi logbook (dosen)
```

### Jadwal Sidang

```
GET    /public/jadwal-sidang              # Get public jadwal (no auth)
GET    /jadwal-sidang                     # Get all jadwal (auth)
GET    /jadwal-sidang/:id                 # Get jadwal detail
POST   /jadwal-sidang                     # Create jadwal (koordinator)
PUT    /jadwal-sidang/:id                 # Update jadwal
DELETE /jadwal-sidang/:id                 # Delete jadwal
```

### Berkas

```
POST   /mahasiswa/:id/berkas-sidang       # Upload berkas sidang
POST   /mahasiswa/:id/berkas-final        # Upload berkas final
PUT    /berkas/:id/verifikasi             # Verify berkas (admin)
PUT    /berkas-final/:id/approve          # Approve berkas final (dosen)
```

### Penilaian

```
POST   /jadwal/:id/penilaian              # Input penilaian (dosen penguji)
GET    /mahasiswa/:id/penilaian           # Get penilaian mahasiswa
PUT    /penilaian/:id                     # Update penilaian
```

## 🔑 API Kampus Adapter Pattern

### Mock Adapter (Development)

Gunakan data dari `prisma/seed-data/` untuk development tanpa API kampus:

```typescript
// Otomatis aktif jika NODE_ENV=development dan API_KAMPUS_API_KEY="placeholder"
const adapter = diContainer.getApiKampusAdapter();
const mahasiswa = await adapter.getAllMahasiswa();
const dosen = await adapter.getAllDosen();
```

### Real Adapter (Production)

Ganti ke API kampus nyata dengan update config:

```ini
API_KAMPUS_API_KEY=your-real-api-key
NODE_ENV=production
```

Tidak perlu ubah logic bisnis - tinggal swap adapter configuration di `di-container.ts`!

## 🛡️ Security Features

- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Role-Based Access Control (RBAC)
- ✅ CORS Protection
- ✅ Helmet.js
- ✅ Input Validation (Zod)
- ✅ SQL Injection Prevention (Prisma ORM)
- ✅ Rate Limiting (ready to add)

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check DATABASE_URL di .env
# Pastikan PostgreSQL running
# Test connection:
pnpm db:generate
```

### Port Already in Use

```bash
# Change PORT di .env atau
lsof -i :3000  # Linux/Mac
netstat -ano | findstr :3000  # Windows
```

### Migration Issues

```bash
# Reset database (WARNING: hapus semua data)
pnpm db:reset

# Atau pull database state
pnpm db:generate
```

## 📝 Best Practices

1. **DTOs** - Always use DTOs untuk request/response
2. **Error Handling** - Use `ApiError` utility untuk consistent error response
3. **Validation** - Validate input di middleware atau use-case
4. **Logging** - Log important operations untuk debugging
5. **Testing** - Write unit tests untuk use-cases & repositories
6. **Security** - Jangan hardcode secrets, use environment variables

## 🚀 Deployment

### Build Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Docker Support

```bash
# Build image
docker build -t skripsi-backend .

# Run container
docker run -p 3000:3000 --env-file .env skripsi-backend
```

## 📞 Support & Issues

Untuk issues, silakan buat di repository atau hubungi team development.

---

**Last Updated**: June 14, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
