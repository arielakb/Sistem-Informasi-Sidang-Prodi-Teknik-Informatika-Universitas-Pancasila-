-- AddForeignKey
ALTER TABLE "jadwal_sidang" ADD CONSTRAINT "jadwal_sidang_penguji_2_id_fkey" FOREIGN KEY ("penguji_2_id") REFERENCES "dosen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jadwal_sidang" ADD CONSTRAINT "jadwal_sidang_penguji_3_id_fkey" FOREIGN KEY ("penguji_3_id") REFERENCES "dosen"("id") ON DELETE SET NULL ON UPDATE CASCADE;
