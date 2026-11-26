import type {
  LkpdSeedIdea,
  MatrixViewId,
  QuadrantDefinition,
  QuadrantId,
  ScamperCode,
} from '@/types/idea';

export const LKPD_META = {
  brand: 'IdeaQuest',
  version: '3.0',
  heroHeadline: 'Banyak ide. Pilih yang paling berdampak.',
  heroLead:
    'Bandingkan sepuluh ide dari sisi kelayakan dan dampaknya. Pahami alasan di balik setiap pilihan, lalu tentukan ide yang paling siap dikembangkan.',
  documentTitle: 'LKPD 5 · Ideasi & Unique Selling Point (USP)',
  subject: 'Kreativitas, Inovasi, dan Kewirausahaan',
  studentLead: 'Revand Aqilal Al Hafiz',
  teamMembers: [
    'Revand Aqilal Al Hafiz',
    'Bagus Pambudi Priyambodo',
    'Davin Alfarrel Nasrullah',
    'Dema Arya Ramadhan',
  ],
  className: '11 PPLG 3',
  semester: 'Ganjil / 2026–2027',
  persona: {
    name: 'Kak Zahira',
    age: 23,
    role: 'Staf Admin Pengelola Orderan Cabang Toko Kue & Roti · Bogor',
    targetMargin: '35%–50%',
    safeFloor: '35%',
    quote:
      'Paling malas kalau sudah urusan ngitung diskon dan promo di aplikasi, bikin pusing karena takut salah hitung dan malah bikin keuntungan toko jadi tipis.',
    pov: 'Kak Zahira (pegawai yang mengelola orderan cabang) membutuhkan alat bantu kalkulator margin keuntungan otomatis, karena ia kewalahan dengan rumitnya aturan hitung diskon serta promo di aplikasi yang membingungkan.',
    hmw: 'Bagaimana cara kita membantu Kak Zahira menghitung rincian margin keuntungan secara otomatis dan akurat tanpa harus pusing memikirkan rumus diskon manual?',
  },
} as const;

export const QUADRANT_IDS: readonly QuadrantId[] = ['I', 'II', 'III', 'IV'] as const;

export const QUADRANTS: Record<QuadrantId, QuadrantDefinition> = {
  I: {
    id: 'I',
    roman: 'I',
    name: 'Prioritas Utama',
    shortDesc: 'Kelayakan 4–5 · Dampak 4–5',
    ruleLabel: 'Kelayakan Tinggi, Dampak Tinggi',
    detailDesc:
      'Dampak besar dan realistis dibangun tim. Fokus utama untuk konsep produk dan prototipe MVP.',
    colorKey: 'mint',
    representativePoint: { feasibility: 5, impact: 5 },
    bounds: { minF: 4, maxF: 5, minI: 4, maxI: 5 },
  },
  II: {
    id: 'II',
    roman: 'II',
    name: 'Quick Wins',
    shortDesc: 'Kelayakan 4–5 · Dampak 1–3',
    ruleLabel: 'Kelayakan Tinggi, Dampak Rendah',
    detailDesc:
      'Mudah direalisasikan dalam waktu singkat. Cocok sebagai fitur pelengkap yang mempercepat alur kerja.',
    colorKey: 'blue',
    representativePoint: { feasibility: 4, impact: 3 },
    bounds: { minF: 4, maxF: 5, minI: 1, maxI: 3 },
  },
  III: {
    id: 'III',
    roman: 'III',
    name: 'Tantangan',
    shortDesc: 'Kelayakan 1–3 · Dampak 4–5',
    ruleLabel: 'Kelayakan Rendah, Dampak Tinggi',
    detailDesc:
      'Potensi manfaat besar, tetapi menuntut kompleksitas teknis atau akses pihak ketiga yang lebih berat.',
    colorKey: 'peach',
    representativePoint: { feasibility: 2, impact: 4 },
    bounds: { minF: 1, maxF: 3, minI: 4, maxI: 5 },
  },
  IV: {
    id: 'IV',
    roman: 'IV',
    name: 'Prioritas Rendah',
    shortDesc: 'Kelayakan 1–3 · Dampak 1–3',
    ruleLabel: 'Kelayakan Rendah, Dampak Rendah',
    detailDesc:
      'Sulit dikerjakan dengan dampak terbatas pada masalah inti. Sebaiknya ditunda atau ditinjau ulang.',
    colorKey: 'coral',
    representativePoint: { feasibility: 2, impact: 2 },
    bounds: { minF: 1, maxF: 3, minI: 1, maxI: 3 },
  },
};

export const SCORE_LEVEL_LABELS: Record<number, { level: string; summary: string }> = {
  1: { level: 'Level 1', summary: 'Sangat Rendah' },
  2: { level: 'Level 2', summary: 'Rendah' },
  3: { level: 'Level 3', summary: 'Sedang' },
  4: { level: 'Level 4', summary: 'Tinggi' },
  5: { level: 'Level 5', summary: 'Sangat Tinggi' },
};

export const SCAMPER_OPTIONS: ReadonlyArray<{ code: ScamperCode; label: string; short: string }> = [
  { code: 'S', label: 'S — Substitute (Ganti)', short: 'S — Substitute' },
  { code: 'C', label: 'C — Combine (Gabung)', short: 'C — Combine' },
  { code: 'A', label: 'A — Adapt (Adaptasi)', short: 'A — Adapt' },
  { code: 'M', label: 'M — Modify (Modifikasi)', short: 'M — Modify' },
  { code: 'P', label: 'P — Put to Another Use (Alih Fungsi)', short: 'P — Put to Another Use' },
  { code: 'E', label: 'E — Eliminate (Pangkas)', short: 'E — Eliminate' },
  { code: 'R', label: 'R — Reverse (Balik Alur)', short: 'R — Reverse' },
  { code: 'NONE', label: 'Tidak dirinci terpisah di tabel SCAMPER', short: 'Tanpa baris SCAMPER terpisah' },
];

export interface MatrixViewMeta {
  id: MatrixViewId;
  code: string;
  label: string;
  shortLabel: string;
  summary: string;
  audienceHint: string;
}

export const MATRIX_VIEWS: readonly MatrixViewMeta[] = [
  {
    id: 'map2x2',
    code: 'A',
    label: 'Peta Prioritas 2×2',
    shortLabel: 'Peta 2×2',
    summary: 'Bidang koordinat formal Kelayakan vs Dampak (skor 1–5) dengan batas kuadran 3,5 dan simulasi geser pin.',
    audienceHint: 'Evaluasi formal & guru',
  },
  {
    id: 'space3d',
    code: 'B',
    label: 'Ruang Ide 3D',
    shortLabel: 'Ruang 3D',
    summary: 'Eksplorasi interaktif Three.js dengan orbit, zoom, sorotan kursor, dan klik node. Sumbu Z khusus kedalaman visual.',
    audienceHint: 'Eksplorasi spasial interaktif',
  },
  {
    id: 'staircase',
    code: 'C',
    label: 'Tangga Prioritas',
    shortLabel: 'Tangga',
    summary: 'Susunan anak tangga dari skor tertinggi di puncak hingga dasar, memisahkan Kelayakan dan Dampak serta menjaga skor seri.',
    audienceHint: 'Urutan kesiapan eksekusi',
  },
  {
    id: 'levels',
    code: 'D',
    label: 'Level Kelayakan & Dampak',
    shortLabel: 'Meter Level',
    summary: 'Progress meter Level 1–5 (Sangat Rendah hingga Sangat Tinggi) untuk menjawab kemudahan realisasi dan besarnya dampak.',
    audienceHint: 'Pembacaan intuitif cepat',
  },
  {
    id: 'quadrantCards',
    code: 'E',
    label: 'Kartu Kuadran',
    shortLabel: 'Kartu Kuadran',
    summary: 'Empat kelompok kuadran terstruktur dengan ringkasan padat untuk membandingkan isi tiap kategori secara langsung.',
    audienceHint: 'Ringkasan terkelompok',
  },
  {
    id: 'priorityBoard',
    code: 'F',
    label: 'Papan Prioritas',
    shortLabel: 'Papan Geser',
    summary: 'Empat kolom kuadran bergaya papan kerja dengan fitur geser-dan-lepas (drag-and-drop) untuk simulasi perpindahan ide.',
    audienceHint: 'Simulasi diskusi tim',
  },
  {
    id: 'ranking',
    code: 'G',
    label: 'Peringkat Ide',
    shortLabel: 'Peringkat',
    summary: 'Daftar urutan ide berdasarkan total skor (Kelayakan + Dampak) dengan posisi skor seri tetap dipertahankan transparan.',
    audienceHint: 'Perbandingan skor berdampingan',
  },
] as const;

export const LKPD_SEED_IDEAS: readonly LkpdSeedIdea[] = Object.freeze([
  {
    id: 1,
    name: 'Kalkulator Margin Otomatis & Peringatan Batas Aman (Margin Alert)',
    shortLabel: 'Margin Alert',
    conceptName: 'SmartMargin Guard',
    description:
      'Form input otomatis berbasis HPP yang langsung memotong biaya admin, layanan, dan diskon, dilengkapi peringatan merah otomatis saat margin turun di bawah batas aman 35%.',
    scamper: 'S — Substitute',
    scamperCode: 'S',
    scamperNote:
      'Menggabungkan S — Substitute (Kalkulator Margin Otomatis Berbasis Input HPP) dan A — Adapt (Peringatan Dini / Batas Merah) dari tabel brainstorming LKPD 5.',
    originalFeasibility: 5,
    originalImpact: 5,
    originalQuadrantLabel: 'Prioritas Utama (Feasibility Tinggi, Impact Tinggi)',
    isOriginalFinalSelection: true,
    rationale:
      'Menjawab langsung kendala inti Kak Zahira dengan mengganti hitungan Excel rumit menjadi indikator warna aman/bahaya yang instan sebelum promo dipublikasikan.',
    sellerBenefit:
      'Admin langsung mengetahui laba bersih akurat dan terlindung dari skema promo yang menggerus margin toko.',
    buyerBenefit:
      'Promo tampil lebih konsisten tanpa risiko pesanan dibatalkan sepihak akibat toko salah memasang harga.',
    buyerBenefitStatus: 'direct',
    sourceNote: null,
    quadrantDiscrepancyNote: null,
  },
  {
    id: 2,
    name: 'Kalkulator Reverse Margin (Target Laba ke Harga Jual)',
    shortLabel: 'Reverse Margin',
    conceptName: 'ReversePrice Planner',
    description:
      'Membalik alur hitung konvensional: admin cukup memasukkan target laba bersih lebih dulu, lalu sistem menghitung harga jual ideal dan batas maksimal diskon.',
    scamper: 'R — Reverse',
    scamperCode: 'R',
    scamperNote: null,
    originalFeasibility: 4,
    originalImpact: 5,
    originalQuadrantLabel: 'Prioritas Utama (Feasibility Tinggi, Impact Tinggi)',
    isOriginalFinalSelection: true,
    rationale:
      'Sangat praktis saat toko mengikuti kampanye tanggal kembar karena admin tidak perlu menebak harga jual lewat hitung mundur manual.',
    sellerBenefit:
      'Mempercepat penentuan harga jual dan batas diskon aman langsung dari angka target keuntungan bersih.',
    buyerBenefit:
      'Harga produk tetap kompetitif dan transparan sesuai skema promo kampanye yang berlaku.',
    buyerBenefitStatus: 'direct',
    sourceNote: null,
    quadrantDiscrepancyNote: null,
  },
  {
    id: 3,
    name: 'Simulasi Multi-Platform E-Commerce dengan Preset Biaya Admin',
    shortLabel: 'Multi-Platform',
    conceptName: 'Simulasi Multi-Platform',
    description:
      'Menggabungkan rumus potongan biaya admin dari berbagai aplikasi e-commerce (Shopee, Tokopedia, GoFood, TikTok) beserta preset tarifnya dalam satu layar perbandingan.',
    scamper: 'C — Combine',
    scamperCode: 'C',
    scamperNote: null,
    originalFeasibility: 4,
    originalImpact: 5,
    originalQuadrantLabel: 'Prioritas Utama (Feasibility Tinggi, Impact Tinggi)',
    isOriginalFinalSelection: true,
    rationale:
      'Menyatukan perbandingan potongan lintas platform yang sebelumnya membuat admin harus berpindah-pindah tab dan kalkulator.',
    sellerBenefit:
      'Admin tidak perlu membuka banyak tab aplikasi dan dapat langsung membandingkan margin bersih antarplatform.',
    buyerBenefit:
      'Tidak dirinci secara terpisah pada kolom pembeli di tabel ide sumber LKPD 5.',
    buyerBenefitStatus: 'not-specified',
    sourceNote:
      'Pada tabel SCAMPER baris C — Combine di LKPD 5, kolom pembeli fokus mencantumkan manfaat paket bundling (Ide #7).',
    quadrantDiscrepancyNote: null,
  },
  {
    id: 4,
    name: 'Slider Simulasi Harga & Diskon Real-Time',
    shortLabel: 'Live Slider',
    conceptName: null,
    description:
      'Memodifikasi kolom input angka kaku menjadi penggeser (slider) interaktif untuk menguji persentase diskon dan melihat perubahan laba rupiah seketika.',
    scamper: 'M — Modify',
    scamperCode: 'M',
    scamperNote: null,
    originalFeasibility: 5,
    originalImpact: 3,
    originalQuadrantLabel: 'Quick Wins (Feasibility Tinggi, Impact Rendah)',
    isOriginalFinalSelection: false,
    rationale:
      'Sangat mudah dibuat di sisi antarmuka web dan mempercepat eksperimen angka diskon sebagai pelengkap kalkulator utama.',
    sellerBenefit:
      'Mempercepat simulasi coba-coba skema promo tanpa perlu mengetik ulang nominal berkali-kali.',
    buyerBenefit:
      'Tidak digunakan secara langsung oleh pembeli (kontrol simulasi internal toko).',
    buyerBenefitStatus: 'indirect',
    sourceNote:
      'Sumber LKPD 5 mencatat fitur ini berperan sebagai alat bantu simulasi internal bagi staf admin.',
    quadrantDiscrepancyNote: null,
  },
  {
    id: 5,
    name: 'Sistem Rekomendasi Batas Maksimal Diskon',
    shortLabel: 'Rekomendasi Batas Diskon',
    conceptName: null,
    description:
      'Mengganti perkiraan manual besaran promo dengan angka rekomendasi batas diskon tertinggi agar target margin minimal 35% tetap terjaga.',
    scamper: 'S — Substitute',
    scamperCode: 'S',
    scamperNote: null,
    originalFeasibility: 4,
    originalImpact: 3,
    originalQuadrantLabel: 'Quick Wins (Feasibility Tinggi, Impact Rendah)',
    isOriginalFinalSelection: false,
    rationale:
      'Memberikan patokan angka batas atas diskon yang jelas dan mudah digabungkan ke alur penentuan promo.',
    sellerBenefit:
      'Memberi acuan batas aman diskon secara instan berbasis target margin minimal 35%.',
    buyerBenefit:
      'Promo lebih terukur sehingga meminimalkan pembatalan pesanan akibat kesalahan harga.',
    buyerBenefitStatus: 'direct',
    sourceNote: null,
    quadrantDiscrepancyNote: null,
  },
  {
    id: 6,
    name: 'Generator Laporan Rekap Potongan Promo Harian',
    shortLabel: 'Laporan Promo Harian',
    conceptName: null,
    description:
      'Memanfaatkan riwayat perhitungan kalkulator promo menjadi rekap laporan harian otomatis untuk diserahkan ke kepala cabang atau pusat.',
    scamper: 'P — Put to Another Use',
    scamperCode: 'P',
    scamperNote: null,
    originalFeasibility: 3,
    originalImpact: 4,
    originalQuadrantLabel: 'Tantangan (Feasibility Rendah, Impact Tinggi)',
    isOriginalFinalSelection: false,
    rationale:
      'Berdampak besar pada kerapian evaluasi shift, namun membutuhkan penyimpanan riwayat transaksi harian yang konsisten.',
    sellerBenefit:
      'Menghemat waktu admin saat merekap selisih omzet kotor dan pendapatan bersih di akhir jam kerja.',
    buyerBenefit:
      'Tidak berdampak langsung pada pembeli karena merupakan pelaporan keuangan internal cabang.',
    buyerBenefitStatus: 'indirect',
    sourceNote:
      'Sumber LKPD 5 mencatat fitur ini khusus untuk pelaporan internal cabang ke pusat.',
    quadrantDiscrepancyNote: null,
  },
  {
    id: 7,
    name: 'Kalkulator Bundling Paket Promo + Cek Margin',
    shortLabel: 'Kalkulator Bundling',
    conceptName: null,
    description:
      'Menggabungkan penyusunan paket hemat beberapa produk sekaligus dengan pengecekan laba bersih otomatis per paket.',
    scamper: 'C — Combine',
    scamperCode: 'C',
    scamperNote: null,
    originalFeasibility: 3,
    originalImpact: 4,
    originalQuadrantLabel: 'Tantangan (Feasibility Rendah, Impact Tinggi)',
    isOriginalFinalSelection: false,
    rationale:
      'Menarik untuk mendongkrak nilai belanja, tetapi logika kombinasi banyak HPP produk dalam satu paket lebih kompleks dibanding produk tunggal.',
    sellerBenefit:
      'Memudahkan pembuatan paket bundling hemat tanpa khawatir total potongan menggerus laba bersih.',
    buyerBenefit:
      'Mendapatkan pilihan paket bundling produk yang lebih hemat dibandingkan membeli satuan.',
    buyerBenefitStatus: 'direct',
    sourceNote: null,
    quadrantDiscrepancyNote: null,
  },
  {
    id: 8,
    name: 'Audit Promo Otomatis Pasca-Order',
    shortLabel: 'Audit Promo Pasca-Order',
    conceptName: null,
    description:
      'Membalik waktu evaluasi ke tahap setelah pesanan selesai untuk mendeteksi secara otomatis transaksi mana yang marginnya bocor.',
    scamper: 'R — Reverse',
    scamperCode: 'R',
    scamperNote: null,
    originalFeasibility: 2,
    originalImpact: 4,
    originalQuadrantLabel: 'Tantangan (Feasibility Rendah, Impact Tinggi)',
    isOriginalFinalSelection: false,
    rationale:
      'Berguna untuk audit kebocoran laba, tetapi sifatnya reaktif setelah transaksi terjadi dan memerlukan impor data pesanan selesai.',
    sellerBenefit:
      'Memudahkan evaluasi efektivitas promo dan mendeteksi pesanan yang keuntungannya tergerus.',
    buyerBenefit:
      'Tidak ada manfaat langsung bagi pembeli yang dirinci pada dokumen sumber LKPD 5.',
    buyerBenefitStatus: 'not-specified',
    sourceNote:
      'Sumber LKPD 5 tidak mencantumkan dampak langsung ke pembeli untuk evaluasi pasca-order.',
    quadrantDiscrepancyNote: null,
  },
  {
    id: 9,
    name: 'Template Preset Promo Cepat (1-Click Promo Terpisah)',
    shortLabel: 'Quick Promo Preset',
    conceptName: null,
    description:
      'Menghilangkan input berulang komponen biaya admin dan biaya layanan melalui tombol preset tarif platform sekali klik.',
    scamper: 'E — Eliminate',
    scamperCode: 'E',
    scamperNote: null,
    originalFeasibility: 4,
    originalImpact: 2,
    originalQuadrantLabel: 'Quick Wins (Feasibility Tinggi, Impact Rendah)',
    isOriginalFinalSelection: false,
    rationale:
      'Mudah dibuat untuk memangkas ketikan berulang, namun jika berdiri sendiri dampaknya terbatas dan lebih kuat bila dilebur ke Simulasi Multi-Platform.',
    sellerBenefit:
      'Mengurangi pekerjaan berulang saat memasukkan persentase potongan admin tiap marketplace.',
    buyerBenefit:
      'Aktivasi promo toko berlangsung lebih cepat sehingga pembeli segera menikmati penawaran diskon.',
    buyerBenefitStatus: 'direct',
    sourceNote: null,
    quadrantDiscrepancyNote: null,
  },
  {
    id: 10,
    name: 'Integrasi Sinkronisasi API Langsung ke Marketplace',
    shortLabel: 'Integrasi API Marketplace',
    conceptName: null,
    description:
      'Menghubungkan sistem toko secara langsung ke API resmi marketplace untuk menarik tarif potongan, harga produk, dan pesanan secara otomatis.',
    scamper: 'Tidak dirinci terpisah di tabel SCAMPER',
    scamperCode: 'NONE',
    scamperNote:
      'Muncul langsung pada baris ke-10 tabel skoring Matriks Prioritas LKPD 5 tanpa baris tersendiri pada tabel SCAMPER.',
    originalFeasibility: 1,
    originalImpact: 4,
    originalQuadrantLabel: 'Prioritas Rendah (Feasibility Rendah, Impact Tinggi)',
    isOriginalFinalSelection: false,
    rationale:
      'Dampak otomatisasinya tinggi, namun skor kelayakan 1 karena membutuhkan izin kemitraan API pihak ketiga yang belum realistis untuk prototipe kelas 11 PPLG.',
    sellerBenefit:
      'Menyinkronkan data harga dan potongan marketplace tanpa rekap manual apabila akses API tersedia.',
    buyerBenefit:
      'Tidak dirinci secara terpisah pada dokumen sumber LKPD 5.',
    buyerBenefitStatus: 'not-specified',
    sourceNote:
      'Dokumen LKPD 5 mencantumkan ide ini pada tabel matriks sebagai pembanding kendala teknis akses pihak ketiga.',
    quadrantDiscrepancyNote:
      'Catatan Transparansi LKPD 5: Pada tabel dokumen asli, Ide #10 tertulis berlabel "Prioritas Rendah (Feasibility Rendah, Impact Tinggi)". Berdasarkan aturan koordinat baku (Kelayakan 1 = Rendah, Dampak 4 = Tinggi), ide ini dipetakan secara konsisten di Kuadran III (Tantangan) tanpa mengubah skor asli maupun menyembunyikan catatan label dokumennya.',
  },
]);

export const FINAL_SELECTION_SUMMARY = {
  title: 'Tiga Konsep Produk Terpilih (LKPD 5)',
  subtitle:
    'Tiga ide terbaik dari Kuadran Prioritas Utama yang ditetapkan kelompok untuk dikembangkan ke tahap prototipe aplikasi web.',
  scamperReflection:
    'Teknik SCAMPER membantu tim keluar dari kebuntuan ide kalkulator standar—khususnya pemicu Reverse yang melahirkan ReversePrice Planner serta Combine & Eliminate yang melahirkan preset biaya admin lintas platform.',
  reasoning: [
    {
      code: '01',
      label: 'Menjawab Masalah Inti Kak Zahira',
      text: 'Ketiga konsep langsung mengatasi kerepotan menghitung margin bersih secara cepat dan menjaga batas aman keuntungan cabang di rentang 35%–50%.',
    },
    {
      code: '02',
      label: 'Realistis untuk Prototipe Kelas 11 PPLG',
      text: 'Seluruh logika perhitungan dapat dibangun mandiri berbasis web tanpa bergantung pada persetujuan API tertutup milik marketplace seperti pada Ide #10.',
    },
    {
      code: '03',
      label: 'Kepastian Instan Saat Jam Sibuk',
      text: 'Indikator warna aman/bahaya pada SmartMargin Guard dan alur balik ReversePrice Planner langsung mudah dipahami admin cabang tanpa menghafal rumus diskon.',
    },
  ],
} as const;

export const CRITICAL_ANALYSIS_ITEMS = [
  {
    id: 'formula-components',
    category: 'lkpd-fact',
    categoryLabel: 'Fakta LKPD + Teknis',
    title: 'Rincian Komponen Laba Bersih Harus Transparan',
    lkpdStatement:
      'LKPD 5 menekankan kalkulator otomatis harus langsung memotong HPP, biaya admin, biaya layanan, dan diskon agar laba bersih akurat.',
    recommendation:
      'Pisahkan tampilan nominal potongan HPP, diskon toko, biaya admin kategori, dan biaya layanan program agar admin tahu persis sumber penyusutan margin.',
  },
  {
    id: 'dynamic-fee-presets',
    category: 'tech-rec',
    categoryLabel: 'Rekomendasi Arsitektur',
    title: 'Preset Tarif Marketplace Tidak Boleh Hardcoded',
    lkpdStatement:
      'LKPD 5 mengusulkan preset biaya admin tiap platform (Shopee, Tokopedia, GoFood, TikTok), tanpa merinci cara pemeliharaan tarifnya.',
    recommendation:
      'Kebijakan potongan platform sering berubah. Sediakan preset yang bisa diedit langsung oleh admin cabang agar kalkulator tetap akurat sepanjang tahun.',
  },
  {
    id: 'margin-context',
    category: 'lkpd-fact',
    categoryLabel: 'Konteks Persona LKPD 3 & 4',
    title: 'Ambang Margin 35%–50% Kontekstual untuk Studi Kasus Toko Kue',
    lkpdStatement:
      'Target margin aman 35%–50% dan peringatan merah di bawah 35% berasal dari wawancara Kak Zahira & Kak Nurul pada LKPD 3 dan 4.',
    recommendation:
      'Jadikan 35% sebagai nilai bawaan studi kasus, namun izinkan pengaturan batas aman diubah jika prototipe dipakai kategori usaha lain.',
  },
  {
    id: 'api-dependency-risk',
    category: 'lkpd-fact',
    categoryLabel: 'Risiko Ketergantungan (Ide #10)',
    title: 'Integrasi API Marketplace Ditahan untuk Tahap Lanjut',
    lkpdStatement:
      'Kesimpulan LKPD 5 mencatat Ide #10 (Kelayakan 1, Dampak 4) terkendala izin akses API pihak ketiga untuk skala tugas siswa.',
    recommendation:
      'Fokuskan MVP pada input cepat, slider real-time, dan preset tarif yang dapat dikelola mandiri sebelum menjajaki integrasi API terbuka.',
  },
  {
    id: 'validate-alert-ux',
    category: 'tech-rec',
    categoryLabel: 'Validasi Pengalaman Pengguna',
    title: 'Uji Keterbacaan Status Aman/Bahaya di Layar HP & Desktop',
    lkpdStatement:
      'Kelompok memprediksi indikator batas merah pada Margin Alert akan menjadi fitur yang paling cepat dilirik admin saat orderan ramai.',
    recommendation:
      'Pastikan status peringatan tidak hanya mengandalkan warna merah/hijau, melainkan disertai teks selisih rupiah dan rekomendasi harga koreksi.',
  },
] as const;
