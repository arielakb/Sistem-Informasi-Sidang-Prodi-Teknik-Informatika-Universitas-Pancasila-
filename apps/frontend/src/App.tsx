import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SkripsiPage from './pages/mahasiswa/SkripsiPage';
import PengajuanTopikForm from './pages/mahasiswa/forms/PengajuanTopikForm';
import LogbookForm from './pages/mahasiswa/forms/LogbookForm';
import BimbinganPage from './pages/dosen/pembimbing/BimbinganPage';
import JadwalMengujiPage from './pages/dosen/penguji/JadwalMengujiPage';
import PenilaianForm from './pages/dosen/penguji/PenilaianForm';
import KoordinatorDashboardPage from './pages/koordinator/DashboardPage';
import DataMasterPage from './pages/admin/DataMasterPage';
import PublicJadwalPage from './pages/PublicJadwalPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicJadwalPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/dashboard" element={
          <DashboardLayout><DashboardPage /></DashboardLayout>
        } />
        <Route path="/skripsi" element={
          <DashboardLayout><SkripsiPage /></DashboardLayout>
        } />
        <Route path="/skripsi/topik" element={
          <DashboardLayout><PengajuanTopikForm /></DashboardLayout>
        } />
        <Route path="/skripsi/logbook" element={
          <DashboardLayout><LogbookForm /></DashboardLayout>
        } />
        <Route path="/bimbingan" element={
          <DashboardLayout><BimbinganPage /></DashboardLayout>
        } />
        <Route path="/penguji/jadwal" element={
          <DashboardLayout><JadwalMengujiPage /></DashboardLayout>
        } />
        <Route path="/penguji/penilaian/:jadwalId" element={
          <DashboardLayout><PenilaianForm /></DashboardLayout>
        } />
        <Route path="/koordinator" element={
          <DashboardLayout><KoordinatorDashboardPage /></DashboardLayout>
        } />
        <Route path="/admin/data-master" element={
          <DashboardLayout><DataMasterPage /></DashboardLayout>
        } />
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;