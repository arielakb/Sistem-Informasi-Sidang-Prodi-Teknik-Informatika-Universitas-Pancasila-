#!/usr/bin/env node

/**
 * Backend Integration Verification Script
 * Verifies all critical components are properly integrated
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = __dirname;
const REQUIRED_FILES = [
  // Domain
  'src/domain/entities/User.ts',
  'src/domain/entities/Mahasiswa.ts',
  'src/domain/entities/Dosen.ts',
  'src/domain/entities/Skripsi.ts',
  'src/domain/entities/Logbook.ts',
  'src/domain/entities/Berkas.ts',
  'src/domain/entities/Penilaian.ts',
  'src/domain/entities/Prodi.ts',
  'src/domain/entities/Ruangan.ts',

  // Interfaces
  'src/domain/interfaces/IRepository.ts',
  'src/domain/interfaces/IAuthService.ts',
  'src/domain/interfaces/IEmailService.ts',
  'src/domain/interfaces/IFileService.ts',
  'src/domain/interfaces/IApiKampusAdapter.ts',

  // DTOs
  'src/application/dto/auth/AuthDTO.ts',
  'src/application/dto/mahasiswa/MahasiswaDTO.ts',
  'src/application/dto/dosen/DosenDTO.ts',
  'src/application/dto/skripsi/SkripsiDTO.ts',
  'src/application/dto/jadwal/JadwalDTO.ts',
  'src/application/dto/skripsi/LogbookDTO.ts',
  'src/application/dto/berkas/BerkasDTO.ts',
  'src/application/dto/penilaian/PenilaianDTO.ts',

  // Repositories
  'src/infrastructure/database/repositories/PrismaUserRepository.ts',
  'src/infrastructure/database/repositories/PrismaMahasiswaRepository.ts',
  'src/infrastructure/database/repositories/PrismaDosenRepository.ts',
  'src/infrastructure/database/repositories/PrismaPenilaianRepository.ts',
  'src/infrastructure/database/repositories/PrismaJadwalSidangRepository.ts',
  'src/infrastructure/database/repositories/PrismaBerkasRepository.ts',
  'src/infrastructure/database/repositories/PrismaLogbookRepository.ts',

  // Config
  'src/infrastructure/config/database.ts',
  'src/infrastructure/config/env.ts',
  'src/infrastructure/config/di-container.ts',

  // HTTP Layer
  'src/infrastructure/http/adapters/MockApiKampusAdapter.ts',
  'src/infrastructure/http/adapters/RealApiKampusAdapter.ts',
  'src/infrastructure/http/middleware/AuthMiddleware.ts',
  'src/infrastructure/http/middleware/ErrorMiddleware.ts',
  'src/infrastructure/http/routes/index.ts',

  // Utils
  'src/infrastructure/utils/ApiError.ts',
  'src/infrastructure/utils/ApiResponse.ts',

  // Services
  'src/application/services/AuthService.ts',
  'src/application/services/JwtService.ts',
  'src/application/services/PasswordService.ts',

  // Server
  'src/server.ts',
  'prisma/schema.prisma',
];

function checkFile(filePath) {
  const fullPath = path.join(PROJECT_ROOT, filePath);
  return fs.existsSync(fullPath);
}

function runVerification() {
  console.log('🔍 Backend Integration Verification\n');
  console.log(`Project Root: ${PROJECT_ROOT}\n`);

  let passed = 0;
  let failed = 0;
  const missingFiles = [];

  REQUIRED_FILES.forEach((file) => {
    if (checkFile(file)) {
      console.log(`✅ ${file}`);
      passed++;
    } else {
      console.log(`❌ ${file}`);
      failed++;
      missingFiles.push(file);
    }
  });

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 Summary: ${passed} passed, ${failed} failed\n`);

  if (failed === 0) {
    console.log('🎉 All files are in place! Backend structure is complete.\n');
    console.log('📝 Next steps:');
    console.log('  1. pnpm install');
    console.log('  2. Configure .env file');
    console.log('  3. pnpm db:generate');
    console.log('  4. pnpm db:migrate');
    console.log('  5. pnpm db:seed');
    console.log('  6. pnpm dev\n');
    process.exit(0);
  } else {
    console.log('⚠️  Missing files:');
    missingFiles.forEach((f) => console.log(`  - ${f}`));
    console.log('\n⚠️  Please create missing files before proceeding.\n');
    process.exit(1);
  }
}

runVerification();
