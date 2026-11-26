# IdeaQuest 3.0 — Studio Matriks Kelayakan vs Dampak (LKPD 5)

Aplikasi evaluasi ideasi **SCAMPER** dan **Matriks Prioritas Kelayakan vs Dampak** untuk **LKPD 5 — Kreativitas, Inovasi, dan Kewirausahaan (Kelas 11 PPLG 3)** yang dibangun ulang menggunakan **Next.js App Router**, **React 19**, **TypeScript**, dan **Three.js**.

## Fitur Utama

1. **7 Pilihan Visualisasi Matriks Sinkron**:
   - **A. Peta Prioritas 2×2** — Bidang koordinat formal Kelayakan vs Dampak (skor 1–5, ambang 3,5) dengan simulasi *drag-and-drop*.
   - **B. Ruang Ide 3D** — Visualisasi interaktif Three.js (orbit, zoom, hover, klik node, mode hemat GPU, dan fallback 2D otomatis).
   - **C. Tangga Prioritas** — Podium bertingkat berdasarkan total skor dengan pelestarian skor seri.
   - **D. Level Kelayakan & Dampak** — Meter progres Level 1–5 (*Sangat Rendah* s.d. *Sangat Tinggi*) dengan skor numerik tetap tampil.
   - **E. Kartu Kuadran** — Empat kelompok kuadran terstruktur.
   - **F. Papan Prioritas** — Empat kolom kuadran bergaya papan kerja dengan *drag-and-drop* simulasi.
   - **G. Peringkat Ide** — Daftar urutan berdasarkan total skor dengan nilai seri dipertahankan.
2. **CRUD Penuh & Penyimpanan Lokal**:
   - Tambah ide baru, cari/filter/urutkan, edit ide & simulasi skor real-time, konfirmasi hapus dengan perlindungan data awal LKPD 5, serta pemulihan satu klik.
   - Data tersimpan lokal di `localStorage` browser tanpa klaim sinkronisasi antarpengguna.
3. **Telemetri Performa Low-Level**:
   - Mengukur waktu muat halaman, inisialisasi Three.js, durasi CRUD, durasi perubahan skor, FPS, *frame time*, React `<Profiler>`, LCP, CLS, INP, *long tasks*, dan ukuran bundle JS aktif.

## Cara Menjalankan

```bash
# Mode pengembangan (development)
npm run dev

# Pemeriksaan kualitas kode & pengujian
npm run lint
npm run typecheck
npm test

# Build & jalankan server produksi
npm run build
npm run start
```
