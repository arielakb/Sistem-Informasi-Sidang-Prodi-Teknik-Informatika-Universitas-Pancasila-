import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PublicJadwalPage from './pages/PublicJadwalPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardLayout from './components/layout/DashboardLayout';

// Mahasiswa
import SkripsiPage from './pages/mahasiswa/SkripsiPage';
import PengajuanTopikForm from './pages/mahasiswa/forms/PengajuanTopikForm';
import LogbookForm from './pages/mahasiswa/forms/LogbookForm';
import BerkasSidangPage from './pages/mahasiswa/BerkasSidangPage';
import BerkasFinalPage from './pages/mahasiswa/BerkasFinalPage';
import JadwalSidangPage from './pages/mahasiswa/JadwalSidangPage';
import PeminjamanLabPage from './pages/mahasiswa/PeminjamanLabPage';
import KodeEtikPage from './pages/mahasiswa/KodeEtikPage';

// Dosen Pembimbing
import BimbinganPage from './pages/dosen/pembimbing/BimbinganPage';
import PembimbingDashboardPage from './pages/dosen/pembimbing/DashboardPage';
import BimbinganListPage from './pages/dosen/pembimbing/BimbinganListPage';
import LogbookValidationPage from './pages/dosen/pembimbing/LogbookValidationPage';
import PersetujuanKelayakanPage from './pages/dosen/pembimbing/PersetujuanKelayakanPage';

// Dosen Penguji
import JadwalMengujiPage from './pages/dosen/penguji/JadwalMengujiPage';
import PenilaianForm from './pages/dosen/penguji/PenilaianForm';
import HistoriPenilaianPage from './pages/dosen/penguji/HistoriPenilaianPage';

// Koordinator
import KoordinatorDashboardPage from './pages/koordinator/DashboardPage';
import PenugasanPembimbingPage from './pages/koordinator/PenugasanPembimbingPage';
import LaporanKinerjaPage from './pages/koordinator/LaporanKinerjaPage';

// Admin
import DataMasterPage from './pages/admin/DataMasterPage';
import PengumumanPage from './pages/admin/PengumumanPage';
import DeadlinePage from './pages/admin/DeadlinePage';
import PenjadwalanSidangPage from './pages/admin/PenjadwalanSidangPage';

// Sekretariat
import SekretariatDashboardPage from './pages/sekretariat/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicJadwalPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard (semua role) */}
        <Route path="/dashboard" element={
          <DashboardLayout><DashboardPage /></DashboardLayout>
        } />

        {/* ============ MAHASISWA ============ */}
        <Route path="/skripsi" element={
          <DashboardLayout><SkripsiPage /></DashboardLayout>
        } />
        <Route path="/skripsi/topik" element={
          <DashboardLayout><PengajuanTopikForm /></DashboardLayout>
        } />
        <Route path="/skripsi/logbook" element={
          <DashboardLayout><LogbookForm /></DashboardLayout>
        } />
        <Route path="/berkas" element={
          <DashboardLayout><BerkasSidangPage /></DashboardLayout>
        } />
        <Route path="/berkas/final" element={
          <DashboardLayout><BerkasFinalPage /></DashboardLayout>
        } />
        <Route path="/jadwal" element={
          <DashboardLayout><JadwalSidangPage /></DashboardLayout>
        } />
        <Route path="/peminjaman-lab" element={
          <DashboardLayout><PeminjamanLabPage /></DashboardLayout>
        } />
        <Route path="/kode-etik" element={
          <DashboardLayout><KodeEtikPage /></DashboardLayout>
        } />

        {/* ============ DOSEN PEMBIMBING ============ */}
        <Route path="/bimbingan" element={
          <DashboardLayout><BimbinganPage /></DashboardLayout>
        } />
        <Route path="/pembimbing/dashboard" element={
          <DashboardLayout><PembimbingDashboardPage /></DashboardLayout>
        } />
        <Route path="/pembimbing/bimbingan-list" element={
          <DashboardLayout><BimbinganListPage /></DashboardLayout>
        } />
        <Route path="/pembimbing/logbook-validasi" element={
          <DashboardLayout><LogbookValidationPage /></DashboardLayout>
        } />
        <Route path="/pembimbing/kelayakan" element={
          <DashboardLayout><PersetujuanKelayakanPage /></DashboardLayout>
        } />

        {/* ============ DOSEN PENGUJI ============ */}
        <Route path="/penguji/jadwal" element={
          <DashboardLayout><JadwalMengujiPage /></DashboardLayout>
        } />
        <Route path="/penguji/penilaian/:jadwalId" element={
          <DashboardLayout><PenilaianForm /></DashboardLayout>
        } />
        <Route path="/penguji/histori" element={
          <DashboardLayout><HistoriPenilaianPage /></DashboardLayout>
        } />

        {/* ============ KOORDINATOR ============ */}
        <Route path="/koordinator" element={
          <DashboardLayout><KoordinatorDashboardPage /></DashboardLayout>
        } />
        <Route path="/koordinator/penugasan" element={
          <DashboardLayout><PenugasanPembimbingPage /></DashboardLayout>
        } />
        <Route path="/koordinator/laporan" element={
          <DashboardLayout><LaporanKinerjaPage /></DashboardLayout>
        } />

        {/* ============ ADMIN ============ */}
        <Route path="/admin/data-master" element={
          <DashboardLayout><DataMasterPage /></DashboardLayout>
        } />
        <Route path="/admin/pengumuman" element={
          <DashboardLayout><PengumumanPage /></DashboardLayout>
        } />
        <Route path="/admin/deadline" element={
          <DashboardLayout><DeadlinePage /></DashboardLayout>
        } />
        <Route path="/admin/jadwal" element={
          <DashboardLayout><PenjadwalanSidangPage /></DashboardLayout>
        } />

        {/* ============ SEKRETARIAT ============ */}
        <Route path="/sekretariat" element={
          <DashboardLayout><SekretariatDashboardPage /></DashboardLayout>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;