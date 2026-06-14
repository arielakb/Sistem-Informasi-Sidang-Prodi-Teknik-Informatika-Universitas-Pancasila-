-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ADMIN_AKADEMIK', 'SEKRETARIAT', 'KAPRODI', 'DOSEN_REGULER', 'DOSEN_PEMBIMBING', 'DOSEN_PENGUJI', 'STAF_PRODI', 'MAHASISWA', 'PUBLIC');

-- CreateEnum
CREATE TYPE "StatusSkripsi" AS ENUM ('PENGAJUAN_TOPIK', 'BIMBINGAN', 'SEMINAR_PROPOSAL', 'SIDANG_KOMPREHENSIF', 'SIDANG_SKRIPSI', 'REVISI', 'LULUS', 'DITOLAK');

-- CreateEnum
CREATE TYPE "JenisSidang" AS ENUM ('SEMINAR_PROPOSAL', 'SIDANG_KOMPREHENSIF', 'SIDANG_SKRIPSI');

-- CreateEnum
CREATE TYPE "StatusJadwal" AS ENUM ('DIJADWALKAN', 'BERLANGSUNG', 'SELESAI', 'DIBATALKAN');

-- CreateEnum
CREATE TYPE "StatusBerkas" AS ENUM ('DIAJUKAN', 'DIVERIFIKASI', 'DITOLAK', 'DISETUJUI');

-- CreateEnum
CREATE TYPE "StatusLogbook" AS ENUM ('MENUNGGU', 'DIVALIDASI', 'DITOLAK');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mahasiswa" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "prodi_id" TEXT NOT NULL,
    "angkatan" INTEGER NOT NULL,
    "pembimbing_1_id" TEXT,
    "pembimbing_2_id" TEXT,
    "judul_skripsi" TEXT,
    "status_skripsi" "StatusSkripsi" NOT NULL DEFAULT 'PENGAJUAN_TOPIK',
    "topik_diajukan" TEXT,
    "kode_etik_signed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mahasiswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dosen" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nidn" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "prodi_id" TEXT NOT NULL,
    "jabatan" TEXT,
    "bidang_keahlian" TEXT,
    "is_pembimbing" BOOLEAN NOT NULL DEFAULT false,
    "is_penguji" BOOLEAN NOT NULL DEFAULT false,
    "is_koordinator" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dosen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prodi" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prodi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logbooks" (
    "id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "dosen_id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "topik_bahasan" TEXT NOT NULL,
    "hasil_bimbingan" TEXT,
    "status" "StatusLogbook" NOT NULL DEFAULT 'MENUNGGU',
    "catatan_dosen" TEXT,
    "file_bukti" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "logbooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ruangan" (
    "id" TEXT NOT NULL,
    "prodi_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kapasitas" INTEGER NOT NULL,
    "fasilitas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ruangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jadwal_sidang" (
    "id" TEXT NOT NULL,
    "jenis_sidang" "JenisSidang" NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "waktu_mulai" TIMESTAMP(3) NOT NULL,
    "waktu_selesai" TIMESTAMP(3) NOT NULL,
    "ruangan_id" TEXT NOT NULL,
    "penguji_1_id" TEXT,
    "penguji_2_id" TEXT,
    "penguji_3_id" TEXT,
    "status" "StatusJadwal" NOT NULL DEFAULT 'DIJADWALKAN',
    "link_meeting" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jadwal_sidang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "berkas_sidang" (
    "id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "jadwal_sidang_id" TEXT,
    "jenis_berkas" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "status" "StatusBerkas" NOT NULL DEFAULT 'DIAJUKAN',
    "catatan_verifikasi" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "berkas_sidang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "berkas_final" (
    "id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "file_naskah" TEXT NOT NULL,
    "file_pengesahan" TEXT NOT NULL,
    "file_berkas_lain" TEXT,
    "status_pembimbing" "StatusBerkas" NOT NULL DEFAULT 'DIAJUKAN',
    "status_koordinator" "StatusBerkas" NOT NULL DEFAULT 'DIAJUKAN',
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "berkas_final_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penilaian" (
    "id" TEXT NOT NULL,
    "jadwal_sidang_id" TEXT NOT NULL,
    "dosen_id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "nilai_presentasi" DECIMAL(65,30),
    "nilai_materi" DECIMAL(65,30),
    "nilai_teknik" DECIMAL(65,30),
    "catatan" TEXT,
    "total_nilai" DECIMAL(65,30),
    "is_submitted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penilaian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "peminjaman_lab" (
    "id" TEXT NOT NULL,
    "mahasiswa_id" TEXT NOT NULL,
    "ruangan_id" TEXT NOT NULL,
    "tanggal_pinjam" TIMESTAMP(3) NOT NULL,
    "waktu_mulai" TIMESTAMP(3) NOT NULL,
    "waktu_selesai" TIMESTAMP(3) NOT NULL,
    "keperluan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'MENUNGGU',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "peminjaman_lab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dokumen_admin" (
    "id" TEXT NOT NULL,
    "jadwal_sidang_id" TEXT NOT NULL,
    "jenis_dokumen" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "generated_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dokumen_admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pengumuman" (
    "id" TEXT NOT NULL,
    "prodi_id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "target_role" "Role",
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pengumuman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deadline" (
    "id" TEXT NOT NULL,
    "jenis_deadline" TEXT NOT NULL,
    "tanggal_deadline" TIMESTAMP(3) NOT NULL,
    "prodi_id" TEXT,
    "keterangan" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deadline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mahasiswa_user_id_key" ON "mahasiswa"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "mahasiswa_nim_key" ON "mahasiswa"("nim");

-- CreateIndex
CREATE UNIQUE INDEX "dosen_user_id_key" ON "dosen"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "dosen_nidn_key" ON "dosen"("nidn");

-- CreateIndex
CREATE UNIQUE INDEX "prodi_kode_key" ON "prodi"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "admin_profiles_user_id_key" ON "admin_profiles"("user_id");

-- AddForeignKey
ALTER TABLE "mahasiswa" ADD CONSTRAINT "mahasiswa_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa" ADD CONSTRAINT "mahasiswa_prodi_id_fkey" FOREIGN KEY ("prodi_id") REFERENCES "prodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa" ADD CONSTRAINT "mahasiswa_pembimbing_1_id_fkey" FOREIGN KEY ("pembimbing_1_id") REFERENCES "dosen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mahasiswa" ADD CONSTRAINT "mahasiswa_pembimbing_2_id_fkey" FOREIGN KEY ("pembimbing_2_id") REFERENCES "dosen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dosen" ADD CONSTRAINT "dosen_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dosen" ADD CONSTRAINT "dosen_prodi_id_fkey" FOREIGN KEY ("prodi_id") REFERENCES "prodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_profiles" ADD CONSTRAINT "admin_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logbooks" ADD CONSTRAINT "logbooks_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logbooks" ADD CONSTRAINT "logbooks_dosen_id_fkey" FOREIGN KEY ("dosen_id") REFERENCES "dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ruangan" ADD CONSTRAINT "ruangan_prodi_id_fkey" FOREIGN KEY ("prodi_id") REFERENCES "prodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal_sidang" ADD CONSTRAINT "jadwal_sidang_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal_sidang" ADD CONSTRAINT "jadwal_sidang_ruangan_id_fkey" FOREIGN KEY ("ruangan_id") REFERENCES "ruangan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal_sidang" ADD CONSTRAINT "jadwal_sidang_penguji_1_id_fkey" FOREIGN KEY ("penguji_1_id") REFERENCES "dosen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "berkas_sidang" ADD CONSTRAINT "berkas_sidang_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "berkas_sidang" ADD CONSTRAINT "berkas_sidang_jadwal_sidang_id_fkey" FOREIGN KEY ("jadwal_sidang_id") REFERENCES "jadwal_sidang"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "berkas_final" ADD CONSTRAINT "berkas_final_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penilaian" ADD CONSTRAINT "penilaian_jadwal_sidang_id_fkey" FOREIGN KEY ("jadwal_sidang_id") REFERENCES "jadwal_sidang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penilaian" ADD CONSTRAINT "penilaian_dosen_id_fkey" FOREIGN KEY ("dosen_id") REFERENCES "dosen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penilaian" ADD CONSTRAINT "penilaian_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peminjaman_lab" ADD CONSTRAINT "peminjaman_lab_mahasiswa_id_fkey" FOREIGN KEY ("mahasiswa_id") REFERENCES "mahasiswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peminjaman_lab" ADD CONSTRAINT "peminjaman_lab_ruangan_id_fkey" FOREIGN KEY ("ruangan_id") REFERENCES "ruangan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dokumen_admin" ADD CONSTRAINT "dokumen_admin_jadwal_sidang_id_fkey" FOREIGN KEY ("jadwal_sidang_id") REFERENCES "jadwal_sidang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pengumuman" ADD CONSTRAINT "pengumuman_prodi_id_fkey" FOREIGN KEY ("prodi_id") REFERENCES "prodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
