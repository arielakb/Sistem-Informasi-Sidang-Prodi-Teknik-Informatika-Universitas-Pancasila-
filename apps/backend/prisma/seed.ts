import { PrismaClient, Role, StatusSkripsi } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import mahasiswaData from './seed-data/mahasiswa.json';
import dosenData from './seed-data/dosen.json';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  // 1. Create Prodi
  const prodiTI = await prisma.prodi.upsert({
    where: { kode: 'TI' },
    update: {},
    create: { kode: 'TI', nama: 'Teknik Informatika' },
  });

  const prodiSI = await prisma.prodi.upsert({
    where: { kode: 'SI' },
    update: {},
    create: { kode: 'SI', nama: 'Sistem Informasi' },
  });

  console.log(`✅ Created Prodi: ${prodiTI.nama}, ${prodiSI.nama}`);

  // 2. Create Admin
  const adminPassword = '$2a$10$abcdefghijklmnopqrstuvwx';
  const admin = await prisma.user.upsert({
    where: { email: 'admin@univpancasila.ac.id' },
    update: {},
    create: {
      email: 'admin@univpancasila.ac.id',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      adminProfile: {
        create: { nama: 'Administrator Sistem' },
      },
    },
  });
  console.log(`✅ Created Admin: ${admin.email}`);

  // 3. Create Dosen
  for (const dosen of dosenData) {
    const password = await bcrypt.hash('dosen123', 10);
    const prodiId = dosen.prodi === 'Teknik Informatika' ? prodiTI.id : prodiSI.id;
    
    await prisma.user.upsert({
      where: { email: dosen.email },
      update: {},
      create: {
        email: dosen.email,
        passwordHash: password,
        role: Role.DOSEN_PEMBIMBING,
        dosen: {
          create: {
            nidn: dosen.nidn,
            nama: dosen.nama,
            prodiId: prodiId,
            jabatan: dosen.jabatan,
            isPembimbing: true,
            isPenguji: true,
          },
        },
      },
    });
    console.log(`✅ Created Dosen: ${dosen.nama}`);
  }

  // 4. Create Mahasiswa
  for (const mhs of mahasiswaData) {
    const password = await bcrypt.hash('mahasiswa123', 10);
    const prodiId = mhs.prodi === 'Teknik Informatika' ? prodiTI.id : prodiSI.id;
    
    await prisma.user.upsert({
      where: { email: mhs.email },
      update: {},
      create: {
        email: mhs.email,
        passwordHash: password,
        role: Role.MAHASISWA,
        mahasiswa: {
          create: {
            nim: mhs.nim,
            nama: mhs.nama,
            prodiId: prodiId,
            angkatan: mhs.angkatan,
            statusSkripsi: StatusSkripsi.PENGAJUAN_TOPIK,
          },
        },
      },
    });
    console.log(`✅ Created Mahasiswa: ${mhs.nama}`);
  }

  // 5. Create Ruangan
  const ruanganList = [
    { nama: 'Lab Komputer 1', kapasitas: 40, prodiId: prodiTI.id, fasilitas: 'Proyektor, AC, 40 PC' },
    { nama: 'Lab Komputer 2', kapasitas: 30, prodiId: prodiTI.id, fasilitas: 'Proyektor, AC, 30 PC' },
    { nama: 'Ruang Sidang A', kapasitas: 20, prodiId: prodiTI.id, fasilitas: 'Proyektor, AC, Whiteboard' },
    { nama: 'Ruang Sidang B', kapasitas: 20, prodiId: prodiSI.id, fasilitas: 'Proyektor, AC, Whiteboard' },
  ];

  for (const ruang of ruanganList) {
    await prisma.ruangan.create({ data: ruang });
    console.log(`✅ Created Ruangan: ${ruang.nama}`);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });