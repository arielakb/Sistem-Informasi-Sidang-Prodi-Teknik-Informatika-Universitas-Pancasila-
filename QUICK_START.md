# 🚀 Backend Quick Start Guide

## ⚡ Fastest Way to Get Started (5 minutes)

### 1️⃣ Prepare Environment

```bash
cd apps/backend
cp .env.example .env
```

**Edit `.env` file** with your database URL:
```ini
DATABASE_URL="postgresql://user:password@localhost:5432/skripsi_db"
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key-here
API_KAMPUS_API_KEY=placeholder  # Gunakan mock adapter
```

### 2️⃣ Install & Setup Database

```bash
# Install dependencies
pnpm install

# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed data (dosen + mahasiswa)
pnpm db:seed
```

### 3️⃣ Start Development Server

```bash
pnpm dev
```

Server akan berjalan di `http://localhost:3000`

### 4️⃣ Test API

```bash
# Health check
curl http://localhost:3000/health

# Root info
curl http://localhost:3000/

# Public jadwal (no auth needed)
curl http://localhost:3000/api/v1/public/jadwal-sidang
```

---

## 📝 Test Login

**Default Admin Account:**
```
Email: admin@univpancasila.ac.id
Password: admin123
```

**Example Login Request:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@univpancasila.ac.id",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600,
    "user": {
      "id": "uuid",
      "email": "admin@univpancasila.ac.id",
      "role": "ADMIN"
    }
  }
}
```

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── domain/        # Business logic (entities, interfaces)
│   ├── application/   # Use-cases, DTOs, services
│   ├── infrastructure/# Repositories, config, adapters
│   └── server.ts      # Express app setup
├── prisma/
│   ├── schema.prisma  # Database schema
│   ├── migrations/    # Database migrations
│   ├── seed.ts        # Seed script
│   └── seed-data/     # JSON data
├── .env               # Environment variables
├── package.json       # Dependencies
└── verify-setup.js    # Verification script
```

---

## 🔑 Important Commands

```bash
# Development
pnpm dev              # Start dev server with hot reload
pnpm build            # Build for production
pnpm start            # Start production server

# Testing
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode

# Database
pnpm db:generate      # Generate Prisma Client
pnpm db:migrate       # Run pending migrations
pnpm db:seed          # Run seed script
pnpm db:reset         # Reset database (destructive!)
pnpm db:studio        # Open Prisma Studio (GUI)

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format code

# Verification
node verify-setup.js  # Verify all files are in place
```

---

## 📌 Key Files to Know

| File | Purpose |
|------|---------|
| `src/server.ts` | Express app & middleware setup |
| `src/infrastructure/config/env.ts` | Environment config |
| `prisma/schema.prisma` | Database schema |
| `src/infrastructure/http/routes/index.ts` | Route registration |
| `.env` | Your local environment variables |
| `package.json` | Dependencies & scripts |

---

## 🔐 Authentication

All protected endpoints require JWT token in header:

```bash
Authorization: Bearer <accessToken>
```

**Token expires in**: 1 hour (configurable)  
**Refresh token expires in**: 7 days  

Use refresh token endpoint to get new access token:
```bash
POST /api/v1/auth/refresh
{
  "refreshToken": "..."
}
```

---

## 🐛 Common Issues & Solutions

### ❌ "DATABASE_URL not found"
```bash
# Make sure .env file is created and DATABASE_URL is set
cat .env | grep DATABASE_URL
```

### ❌ "Cannot connect to PostgreSQL"
```bash
# Check if PostgreSQL is running
# Test connection string manually
# Verify database exists
```

### ❌ "Port 3000 already in use"
```bash
# Change PORT in .env file or kill process
# Linux/Mac: lsof -i :3000
# Windows: netstat -ano | findstr :3000
```

### ❌ "Migrations pending"
```bash
# Run migrations
pnpm db:migrate

# Or reset database
pnpm db:reset
```

---

## 📚 API Response Format

All responses follow standardized format:

**Success Response:**
```json
{
  "success": true,
  "data": { /* ... */ },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Bad Request",
    "details": "Email already exists"
  }
}
```

---

## 🌐 Mock API Adapter

Development menggunakan **Mock Adapter** otomatis ketika:
- `NODE_ENV=development`
- `API_KAMPUS_API_KEY=placeholder`

Data dari: `prisma/seed-data/mahasiswa.json` dan `dosen.json`

**Switch ke Real API kapan saja:**
1. Update `API_KAMPUS_API_KEY` dengan real key
2. Update `API_KAMPUS_URL`
3. Deploy - DI container otomatis switch adapter!

---

## ✨ Features Ready

✅ User Authentication (JWT)  
✅ Mahasiswa Management  
✅ Dosen Management  
✅ Jadwal Sidang  
✅ Penilaian (Grading)  
✅ Berkas Management  
✅ Logbook  
✅ Public Jadwal View  
✅ Role-Based Access Control  
✅ File Upload Support  

---

## 🎯 Next: Frontend Integration

Once backend is running:

1. **Update Frontend API Base URL**
   ```typescript
   const API_BASE = 'http://localhost:3000/api/v1'
   ```

2. **Implement Login Flow**
   - POST `/auth/login` → get JWT tokens
   - Store tokens in localStorage/cookies
   - Add Authorization header to requests

3. **Create Protected Routes**
   - Verify JWT before accessing protected endpoints
   - Handle token refresh automatically

4. **Build UI Components**
   - Dashboard (per-role)
   - Forms for submissions
   - Data tables with pagination

---

## 📖 Full Documentation

For complete setup guide, see: [BACKEND_SETUP.md](./BACKEND_SETUP.md)

---

## ✅ Verification Checklist

- [ ] `.env` file created & configured
- [ ] `pnpm install` completed
- [ ] `pnpm db:generate` done
- [ ] `pnpm db:migrate` done
- [ ] `pnpm db:seed` done
- [ ] `pnpm dev` running without errors
- [ ] `curl http://localhost:3000/health` returns 200
- [ ] Login endpoint working
- [ ] Can access public jadwal endpoint

---

**Everything set up? Great! Now connect your frontend.** 🎉

---

💡 **Pro Tips:**
- Use Postman/Insomnia for API testing
- Check Prisma Studio: `pnpm db:studio`
- Enable console logs in `.env` for debugging
- Use `pnpm db:reset` if you need clean state
- Read verification output: `node verify-setup.js`
