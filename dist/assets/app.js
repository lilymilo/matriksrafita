
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// --- src/data/ideas.js ---
/**
 * Canonical source data for IdeaQuest (LKPD 5 · Ideation — Unique Selling Point).
 * Grounded strictly in LKPD_5_Ideation_USP.md and IdeaQuest_Design.md.
 * Never alter original LKPD scores or invent missing source facts.
 */

const LKPD_META = Object.freeze({
  brand: 'IdeaQuest',
  headline: 'From Ideas to Impact.',
  subtitle: 'Sepuluh ide. Empat kuadran. Tiga prioritas utama.',
  documentTitle: 'LKPD 5 · Ideation (Unique Selling Point)',
  subject: 'Kreativitas, Inovasi, dan Kewirausahaan',
  studentLead: 'Revand Aqilal Al Hafiz',
  teamMembers: ['Revand Aqilal Al Hafiz', 'Bagus Pambudi Priyambodo', 'Davin Alfarrel Nasrullah', 'Dema Arya Ramadhan'],
  className: '11 PPLG 3',
  semester: 'Ganjil / 2026-2027',
  persona: {
    name: 'Kak Zahira',
    role: 'Staf Admin / Pegawai Pengelola Orderan Cabang Toko (23 Tahun, Bogor)',
    targetMargin: '35%–50%',
    pov: 'Kak Zahira (pegawai yang menghandle orderan cabang) membutuhkan alat bantu atau fitur kalkulator margin keuntungan yang otomatis, karena ia merasa sangat kerepotan dan tidak suka dengan rumitnya aturan hitung diskon serta promo di aplikasi yang membingungkan.',
    hmw: 'Bagaimana cara kita membantu Kak Zahira agar dapat menghitung rincian margin keuntungan secara otomatis dan akurat tanpa harus pusing memikirkan rumus diskon manual?',
  },
});

const QUADRANT_IDS = Object.freeze(['I', 'II', 'III', 'IV']);

const QUADRANTS = Object.freeze({
  I: {
    id: 'I',
    roman: 'I',
    name: 'Prioritas Utama',
    englishName: 'Top Priority',
    shortDesc: 'Feasibility Tinggi (4–5) · Impact Tinggi (4–5)',
    detailDesc: 'Dampak besar dan realistis dikerjakan tim. Fokus utama untuk konsep produk dan prototipe.',
    colorKey: 'mint',
    representativePoint: { feasibility: 5, impact: 5 },
    bounds: { minF: 4, maxF: 5, minI: 4, maxI: 5 },
  },
  II: {
    id: 'II',
    roman: 'II',
    name: 'Quick Wins',
    englishName: 'Quick Wins',
    shortDesc: 'Feasibility Tinggi (4–5) · Impact Rendah (1–3)',
    detailDesc: 'Mudah diimplementasikan dengan cepat, cocok sebagai fitur pendukung atau peningkatan UX.',
    colorKey: 'blue',
    representativePoint: { feasibility: 4, impact: 3 },
    bounds: { minF: 4, maxF: 5, minI: 1, maxI: 3 },
  },
  III: {
    id: 'III',
    roman: 'III',
    name: 'Tantangan',
    englishName: 'Challenge',
    shortDesc: 'Feasibility Rendah (1–3) · Impact Tinggi (4–5)',
    detailDesc: 'Berdampak tinggi bagi pengguna, tetapi butuh kompleksitas teknis atau ketergantungan lebih besar.',
    colorKey: 'peach',
    representativePoint: { feasibility: 2, impact: 4 },
    bounds: { minF: 1, maxF: 3, minI: 4, maxI: 5 },
  },
  IV: {
    id: 'IV',
    roman: 'IV',
    name: 'Prioritas Rendah',
    englishName: 'Low Priority',
    shortDesc: 'Feasibility Rendah (1–3) · Impact Rendah (1–3)',
    detailDesc: 'Sulit direalisasikan dengan dampak terbatas. Sebaiknya ditunda atau dievaluasi ulang.',
    colorKey: 'coral',
    representativePoint: { feasibility: 2, impact: 2 },
    bounds: { minF: 1, maxF: 3, minI: 1, maxI: 3 },
  },
});

const INITIAL_IDEAS = Object.freeze([
  {
    id: 1,
    name: 'Kalkulator Margin Otomatis & Peringatan Batas Aman (Margin Alert)',
    shortLabel: 'Margin Alert',
    conceptName: 'SmartMargin Guard',
    scamper: 'S — Substitute',
    scamperCode: 'S',
    scamperNote: 'Menggabungkan S — Substitute (Kalkulator Margin Otomatis Berbasis Input HPP) dan A — Adapt (Peringatan Dini / Batas Merah) dari tabel brainstorming LKPD.',
    originalFeasibility: 5,
    originalImpact: 5,
    originalQuadrantLabel: 'Prioritas Utama (Feasibility Tinggi, Impact Tinggi)',
    isOriginalFinalSelection: true,
    icon: 'shield',
    rationale: 'Mengganti hitung manual/Excel rumit dengan form input otomatis yang langsung memotong HPP, biaya admin, dan diskon, sekaligus mengadaptasi notifikasi merah otomatis jika pengaturan promo membuat margin turun di bawah 35%.',
    sellerBenefit: 'Admin langsung tahu laba bersih akurat dan terlindung dari promo yang menggerus margin.',
    buyerBenefit: 'Promo lebih konsisten tanpa risiko pesanan dibatalkan akibat toko salah pasang harga.',
    buyerBenefitStatus: 'direct',
    sourceNote: null,
    quadrantDiscrepancyNote: null,
  },
  {
    id: 2,
    name: 'Kalkulator Reverse Margin (Target Laba ke Harga Jual)',
    shortLabel: 'Reverse Margin',
    conceptName: 'ReversePrice Planner',
    scamper: 'R — Reverse',
    scamperCode: 'R',
    scamperNote: null,
    originalFeasibility: 4,
    originalImpact: 5,
    originalQuadrantLabel: 'Prioritas Utama (Feasibility Tinggi, Impact Tinggi)',
    isOriginalFinalSelection: true,
    icon: 'calculator',
    rationale: 'Membalik alur hitung konvensional: admin memasukkan target laba bersih terlebih dahulu, lalu sistem otomatis menghitung harga jual dan batas maksimal diskon saat mengikuti campaign.',
    sellerBenefit: 'Admin tidak perlu menghitung mundur manual saat mengikuti campaign; sistem menghitung harga jual dan batas maksimal diskon dari target laba.',
    buyerBenefit: 'Harga produk tampil kompetitif sesuai skema promo yang berlaku.',
    buyerBenefitStatus: 'direct',
    sourceNote: null,
    quadrantDiscrepancyNote: null,
  },
  {
    id: 3,
    name: 'Simulasi Multi-Platform E-Commerce dengan Preset Biaya Admin',
    shortLabel: 'Multi-Platform',
    conceptName: 'Simulasi Multi-Platform',
    scamper: 'C — Combine',
    scamperCode: 'C',
    scamperNote: null,
    originalFeasibility: 4,
    originalImpact: 5,
    originalQuadrantLabel: 'Prioritas Utama (Feasibility Tinggi, Impact Tinggi)',
    isOriginalFinalSelection: true,
    icon: 'storefront',
    rationale: 'Menggabungkan rumus potongan biaya admin berbagai platform e-commerce (Shopee, Tokopedia, dll.) dengan preset biaya admin dalam satu layar perbandingan.',
    sellerBenefit: 'Admin tidak perlu membuka banyak tab aplikasi dan mudah membandingkan biaya admin.',
    buyerBenefit: 'Tidak ada manfaat langsung yang dirinci secara terpisah pada tabel ide LKPD.',
    buyerBenefitStatus: 'not-specified',
    sourceNote: 'Pada tabel SCAMPER baris C — Combine, kolom pembeli hanya menuliskan manfaat paket bundling (Ide #7). Manfaat pembeli terpisah untuk Simulasi Multi-Platform tidak dinyatakan di sumber LKPD.',
    quadrantDiscrepancyNote: null,
  },
  {
    id: 4,
    name: 'Slider Simulasi Harga & Diskon Real-Time',
    shortLabel: 'Live Slider',
    conceptName: null,
    scamper: 'M — Modify',
    scamperCode: 'M',
    scamperNote: null,
    originalFeasibility: 5,
    originalImpact: 3,
    originalQuadrantLabel: 'Quick Wins (Feasibility Tinggi, Impact Rendah)',
    isOriginalFinalSelection: false,
    icon: 'sliders',
    rationale: 'Memodifikasi input angka kaku menjadi slider interaktif agar admin dapat menggeser persentase diskon dan melihat perubahan laba rupiah secara langsung.',
    sellerBenefit: 'Mempercepat simulasi coba-coba skema promo tanpa mengetik ulang angka berkali-kali.',
    buyerBenefit: 'Tidak digunakan secara langsung oleh pembeli.',
    buyerBenefitStatus: 'indirect',
    sourceNote: 'Sumber LKPD menyatakan fitur ini tidak digunakan secara langsung oleh pembeli karena berperan sebagai alat bantu simulasi internal admin.',
    quadrantDiscrepancyNote: null,
  },
  {
    id: 5,
    name: 'Sistem Rekomendasi Batas Maksimal Diskon',
    shortLabel: 'Max Diskon',
    conceptName: null,
    scamper: 'S — Substitute',
    scamperCode: 'S',
    scamperNote: null,
    originalFeasibility: 4,
    originalImpact: 3,
    originalQuadrantLabel: 'Quick Wins (Feasibility Tinggi, Impact Rendah)',
    isOriginalFinalSelection: false,
    icon: 'priceTag',
    rationale: 'Mengganti tebakan besaran promo dengan rekomendasi batas maksimal diskon otomatis berdasarkan target margin minimal 35%.',
    sellerBenefit: 'Memberikan batas aman promo berdasarkan target margin minimal 35%.',
    buyerBenefit: 'Promo lebih konsisten tanpa risiko pesanan dibatalkan akibat toko salah pasang harga.',
    buyerBenefitStatus: 'direct',
    sourceNote: null,
    quadrantDiscrepancyNote: null,
  },
  {
    id: 6,
    name: 'Generator Laporan Rekap Potongan Promo Harian',
    shortLabel: 'Laporan Harian',
    conceptName: null,
    scamper: 'P — Put to Another Use',
    scamperCode: 'P',
    scamperNote: null,
    originalFeasibility: 3,
    originalImpact: 4,
    originalQuadrantLabel: 'Tantangan (Feasibility Rendah, Impact Tinggi)',
    isOriginalFinalSelection: false,
    icon: 'report',
    rationale: 'Memanfaatkan data hasil perhitungan kalkulator promo menjadi laporan harian otomatis untuk kepala cabang atau pusat.',
    sellerBenefit: 'Menghemat waktu admin saat rekap selisih omzet kotor dan pendapatan bersih di akhir shift.',
    buyerBenefit: 'Tidak relevan langsung karena berupa laporan keuangan internal cabang.',
    buyerBenefitStatus: 'indirect',
    sourceNote: 'Sumber LKPD mencatat fitur ini tidak relevan bagi pembeli karena merupakan laporan keuangan internal cabang.',
    quadrantDiscrepancyNote: null,
  },
  {
    id: 7,
    name: 'Kalkulator Bundling Paket Promo + Cek Margin',
    shortLabel: 'Bundling + Margin',
    conceptName: null,
    scamper: 'C — Combine',
    scamperCode: 'C',
    scamperNote: null,
    originalFeasibility: 3,
    originalImpact: 4,
    originalQuadrantLabel: 'Tantangan (Feasibility Rendah, Impact Tinggi)',
    isOriginalFinalSelection: false,
    icon: 'bundle',
    rationale: 'Menggabungkan penyusunan paket bundling promo dengan perhitungan laba bersih otomatis agar toko dapat membuat paket hemat tanpa merugi.',
    sellerBenefit: 'Tidak perlu membuat paket hemat tanpa menghitung laba bersih; bundling dan pengecekan margin digabung.',
    buyerBenefit: 'Mendapat pilihan paket bundling yang lebih hemat dibanding beli satuan.',
    buyerBenefitStatus: 'direct',
    sourceNote: null,
    quadrantDiscrepancyNote: null,
  },
  {
    id: 8,
    name: 'Audit Promo Otomatis Pasca-Order',
    shortLabel: 'Audit Pasca-Order',
    conceptName: null,
    scamper: 'R — Reverse',
    scamperCode: 'R',
    scamperNote: null,
    originalFeasibility: 2,
    originalImpact: 4,
    originalQuadrantLabel: 'Tantangan (Feasibility Rendah, Impact Tinggi)',
    isOriginalFinalSelection: false,
    icon: 'audit',
    rationale: 'Membalik momen evaluasi ke tahap setelah pesanan selesai untuk mendeteksi secara otomatis orderan yang marginnya bocor.',
    sellerBenefit: 'Memudahkan evaluasi promo dan mendeteksi orderan yang marginnya bocor.',
    buyerBenefit: 'Tidak ada manfaat langsung bagi pembeli yang dinyatakan pada sumber LKPD.',
    buyerBenefitStatus: 'not-specified',
    sourceNote: 'Sumber LKPD tidak merinci manfaat langsung bagi pembeli untuk fitur audit pasca-order ini.',
    quadrantDiscrepancyNote: null,
  },
  {
    id: 9,
    name: 'Template Preset Promo Cepat (1-Click Promo Terpisah)',
    shortLabel: 'Preset 1-Click',
    conceptName: null,
    scamper: 'E — Eliminate',
    scamperCode: 'E',
    scamperNote: null,
    originalFeasibility: 4,
    originalImpact: 2,
    originalQuadrantLabel: 'Quick Wins (Feasibility Tinggi, Impact Rendah)',
    isOriginalFinalSelection: false,
    icon: 'preset',
    rationale: 'Menghilangkan input berulang komponen biaya admin dan layanan dengan menyediakan preset biaya tiap platform yang tersimpan otomatis.',
    sellerBenefit: 'Mengurangi input berulang komponen biaya admin dan layanan dengan preset biaya tiap platform yang tersimpan otomatis.',
    buyerBenefit: 'Aktivasi promo lebih cepat sehingga pembeli segera menikmati diskon.',
    buyerBenefitStatus: 'direct',
    sourceNote: null,
    quadrantDiscrepancyNote: null,
  },
  {
    id: 10,
    name: 'Integrasi Sinkronisasi API Langsung ke Marketplace',
    shortLabel: 'API Marketplace',
    conceptName: null,
    scamper: 'Tidak dirinci terpisah di tabel SCAMPER',
    scamperCode: 'NONE',
    scamperNote: 'Muncul langsung sebagai baris ke-10 pada tabel skoring Matriks Prioritas LKPD 5 tanpa baris SCAMPER tersendiri.',
    originalFeasibility: 1,
    originalImpact: 4,
    originalQuadrantLabel: 'Prioritas Rendah (Feasibility Rendah, Impact Tinggi)',
    isOriginalFinalSelection: false,
    icon: 'api',
    rationale: 'Menyinkronkan data marketplace secara langsung ke aplikasi. Dinilai Feasibility 1 dan Impact 4 karena membutuhkan akses API pihak ketiga yang sulit dijangkau untuk prototipe web sederhana siswa kelas 11 PPLG.',
    sellerBenefit: 'Bertujuan menyinkronkan data marketplace secara langsung; pada tabel LKPD diberi skor Feasibility 1 dan Impact 4.',
    buyerBenefit: 'Sumber LKPD tidak memberikan manfaat pembeli terpisah untuk baris ini.',
    buyerBenefitStatus: 'not-specified',
    sourceNote: 'Sumber LKPD tidak mencantumkan manfaat pembeli terpisah untuk Ide #10; tidak ada manfaat tambahan yang dibuat-buat.',
    quadrantDiscrepancyNote: 'Perbedaan Label Sumber: Tabel skoring asli LKPD melabeli Ide #10 sebagai "Prioritas Rendah (Feasibility Rendah, Impact Tinggi)". Sesuai logika koordinat (Feasibility 1 = Rendah, Impact 4 = Tinggi), ide ini dipetakan secara konsisten di Kuadran III (Tantangan / Feasibility Rendah, Impact Tinggi) sambil tetap mempertahankan catatan label aslinya.',
  },
]);

const FINAL_SELECTION_SUMMARY = Object.freeze({
  title: 'Tiga Konsep Produk Terpilih (Asli LKPD 5)',
  subtitle: 'Keputusan final kelompok dari kuadran Prioritas Utama tetap dipertahankan terpisah dari simulasi skor.',
  reasoning: [
    {
      label: 'Relevansi Masalah Kak Zahira',
      text: 'Ketiga ide menjawab langsung kebutuhan Kak Zahira (LKPD 4) untuk menghitung margin bersih secara cepat dan menjaga batas aman keuntungan toko di kisaran 35%–50%.',
    },
    {
      label: 'Kesiapan Teknis Kelas 11 PPLG',
      text: 'Realistis dibangun sebagai prototipe aplikasi web sederhana oleh tim siswa 11 PPLG, berbeda dengan integrasi API marketplace (Ide #10) yang bergantung pada akses pihak ketiga.',
    },
    {
      label: 'Daya Tarik Utama Bagi Pengguna',
      text: 'Kelompok menilai SmartMargin Guard (Margin Alert) dan ReversePrice Planner paling cepat menarik perhatian admin cabang karena memberi kepastian instan lewat indikator warna aman/bahaya tanpa menghitung rumus diskon manual.',
    },
  ],
  scamperReflection: 'Teknik SCAMPER membantu tim keluar dari ide kalkulator biasa—terutama pemicu Reverse (melahirkan ReversePrice Planner) dan Eliminate (melahirkan preset biaya admin tiap platform).',
});

const CRITICAL_ANALYSIS_ITEMS = Object.freeze([
  {
    id: 'formula-components',
    category: 'lkpd-fact',
    categoryLabel: 'Dasar LKPD + Implementasi',
    title: 'Komponen Lengkap Perhitungan Margin Bersih',
    lkpdStatement: 'LKPD 5 menyebut kalkulator otomatis harus langsung memotong HPP, biaya admin, biaya layanan, dan diskon agar laba bersih akurat.',
    recommendation: 'Pastikan formula prototipe memisahkan komponen HPP, persentase/nominal diskon, biaya admin platform, serta biaya layanan secara transparan agar admin mudah mengecek sumber pengurangan margin.',
    icon: 'calculator',
  },
  {
    id: 'dynamic-fee-presets',
    category: 'tech-rec',
    categoryLabel: 'Rekomendasi Teknis',
    title: 'Preset Biaya Admin Marketplace Harus Mudah Diperbarui',
    lkpdStatement: 'LKPD 5 mengusulkan preset biaya admin per platform (Shopee, Tokopedia, dll.), tetapi tidak menskor pemeliharaan tarif secara terpisah.',
    recommendation: 'Pertimbangan implementasi: tarif biaya admin dan layanan marketplace sering berubah. Sediakan preset yang dapat diedit admin atau diperbarui dari konfigurasi, bukan angka mati di dalam kode.',
    icon: 'storefront',
  },
  {
    id: 'margin-context',
    category: 'lkpd-fact',
    categoryLabel: 'Konteks Persona LKPD',
    title: 'Target Margin 35%–50% Bersifat Kontekstual',
    lkpdStatement: 'Angka batas aman keuntungan 35%–50% (dan batas peringatan <35%) berasal langsung dari hasil wawancara penjual toko kue/roti Kak Zahira pada LKPD 3 & 4.',
    recommendation: 'Perlakukan 35%–50% sebagai konteks studi kasus tim, bukan aturan baku semua industri e-commerce. Pada pengembangan lanjutan, ambang batas margin sebaiknya dapat disesuaikan tiap toko.',
    icon: 'coins',
  },
  {
    id: 'api-dependency-risk',
    category: 'lkpd-fact',
    categoryLabel: 'Risiko Teknis (Tercatat di LKPD)',
    title: 'Ketergantungan Tinggi pada Integrasi API Marketplace',
    lkpdStatement: 'Kesimpulan LKPD 5 secara eksplisit mencatat bahwa integrasi API langsung ke marketplace (Ide #10, F=1, I=4) sulit dikerjakan karena bergantung pada akses pihak ketiga.',
    recommendation: 'Pertahankan input manual cepat + preset biaya pada tahap prototipe awal (MVP). Integrasi API resmi baru layak dipertimbangkan setelah verifikasi mitra/sandbox marketplace tersedia.',
    icon: 'api',
  },
  {
    id: 'validate-alert-ux',
    category: 'tech-rec',
    categoryLabel: 'Validasi UX',
    title: 'Uji Efektivitas Indikator Aman/Bahaya ke Admin Cabang',
    lkpdStatement: 'Tim memperkirakan indikator warna aman/bahaya pada Margin Alert dan ReversePrice Planner akan langsung dilirik admin cabang saat menangani orderan cepat.',
    recommendation: 'Lakukan uji prototipe singkat dengan pengguna nyata (atau simulasi skenario jam sibuk) untuk memvalidasi apakah indikator warna, teks batas aman, dan alur input benar-benar mempercepat keputusan tanpa salah tafsir.',
    icon: 'shield',
  },
]);

// --- src/utils/matrix.js ---
/**
 * Pure domain utilities for the Feasibility vs Impact Matrix (2D + 3D + Decision Lenses).
 * Preserves exact 1–5 LKPD scores and the High (4–5) / Low (1–3) threshold.
 */


const SCORE_MIN = 1;
const SCORE_MAX = 5;
const HIGH_THRESHOLD = 4;

/**
 * Clamp an integer score safely to [1, 5].
 */
function clampScore(value) {
  const num = Math.round(Number(value));
  if (Number.isNaN(num)) return SCORE_MIN;
  return Math.max(SCORE_MIN, Math.min(SCORE_MAX, num));
}

/**
 * Classify a (feasibility, impact) coordinate into quadrant I, II, III, or IV.
 * High = 4–5, Low = 1–3 (threshold between 3 and 4).
 */
function getQuadrantId(feasibility, impact) {
  const highF = feasibility >= HIGH_THRESHOLD;
  const highI = impact >= HIGH_THRESHOLD;
  if (highF && highI) return 'I';
  if (highF && !highI) return 'II';
  if (!highF && highI) return 'III';
  return 'IV';
}

function getQuadrantMeta(feasibility, impact) {
  return QUADRANTS[getQuadrantId(feasibility, impact)];
}

function getTotalScore(feasibility, impact) {
  return feasibility + impact;
}

/**
 * 2D Cartesian coordinate scale:
 * Strictly linear & proportional on scores 1..5 with clean 14% top/bottom and
 * 12% left/right architectural margins so quadrant corner headers and marker pills
 * never collide at extreme coordinates (1, 1) or (5, 5):
 *   Y: 1 -> 14%, 2 -> 32%, 3 -> 50%, threshold 3.5 -> 59%, 4 -> 68%, 5 -> 86%
 *   X: 1 -> 12%, 2 -> 31%, 3 -> 50%, threshold 3.5 -> 59.5%, 4 -> 69%, 5 -> 88%
 */
const THRESHOLD_X_PERCENT = 59.5;
const THRESHOLD_Y_PERCENT = 59;
const THRESHOLD_PERCENT = 59;

function scoreToPercentX(score) {
  return 12 + (clampScore(score) - 1) * 19;
}

function scoreToPercentY(score) {
  return 14 + (clampScore(score) - 1) * 18;
}

function scoreToPercent(score, axis = 'x') {
  return axis === 'y' ? scoreToPercentY(score) : scoreToPercentX(score);
}

/**
 * Inverse mapping for 2D drag-and-drop: maps drop percentage inside the Cartesian
 * plane to the nearest valid integer score inside the target quadrant.
 */
function dropPositionToQuadrantScores(percentX, percentY, targetQuadrantId) {
  const q = QUADRANTS[targetQuadrantId];
  if (!q) return { feasibility: 4, impact: 4 };
  if (typeof percentX !== 'number' || typeof percentY !== 'number' || Number.isNaN(percentX) || Number.isNaN(percentY)) {
    return { ...q.representativePoint };
  }

  const rawF = Math.round((percentX - 12) / 19) + 1;
  const rawI = Math.round((percentY - 14) / 18) + 1;

  return {
    feasibility: Math.max(q.bounds.minF, Math.min(q.bounds.maxF, rawF)),
    impact: Math.max(q.bounds.minI, Math.min(q.bounds.maxI, rawI)),
  };
}

/**
 * Deterministic 2D layout for markers so coincident coordinates (e.g., Ideas 2 & 3
 * at (4,5) and Ideas 6 & 7 at (3,4)) remain clearly separated and individually
 * clickable without altering stored scores.
 */
function computeMarkerPositions(ideas) {
  const groups = new Map();
  for (const idea of ideas) {
    const key = `${idea.feasibility},${idea.impact}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(idea);
  }

  const layout = new Map();
  for (const [key, group] of groups.entries()) {
    const sorted = [...group].sort((a, b) => a.id - b.id);
    const count = sorted.length;

    sorted.forEach((idea, idx) => {
      const baseX = scoreToPercentX(idea.feasibility);
      const baseY = scoreToPercentY(idea.impact);
      let offsetX = 0;
      let offsetY = 0;

      if (count === 2) {
        offsetX = idx === 0 ? -16 : 16;
        offsetY = idx === 0 ? 15 : -15;
      } else if (count === 3) {
        const offsets = [
          { x: 0, y: 20 },
          { x: -28, y: -14 },
          { x: 28, y: -14 },
        ];
        offsetX = offsets[idx].x;
        offsetY = offsets[idx].y;
      } else if (count >= 4) {
        const angle = (Math.PI * 2 * idx) / count - Math.PI / 2;
        offsetX = Math.round(Math.cos(angle) * 30);
        offsetY = Math.round(Math.sin(angle) * 22);
      }

      layout.set(idea.id, {
        baseX,
        baseY,
        offsetX,
        offsetY,
        clusterSize: count,
        clusterIndex: idx,
        clusterKey: key,
        peers: sorted.map((p) => p.id),
      });
    });
  }

  return layout;
}

/**
 * 3D World Space Coordinate Mapping for Three.js Idea Space:
 * - X axis = Feasibility (1..5), metric step 1.45, centered around 3.0
 * - Y axis = Impact (1..5), metric step 1.45, resting cleanly above ground plinth
 * - Z axis = VISUAL DEPTH ONLY (deterministic slight separation for coincident coordinates;
 *   never represents a third scoring dimension).
 */
const SCENE_STEP = 1.45;
const SCENE_Y_BASE = 0.85;

function scoreToWorldX(feasibility) {
  return (clampScore(feasibility) - 3) * SCENE_STEP;
}

function scoreToWorldY(impact) {
  return SCENE_Y_BASE + (clampScore(impact) - 1) * SCENE_STEP;
}

function compute3DNodePositions(ideas) {
  const groups = new Map();
  for (const idea of ideas) {
    const key = `${idea.feasibility},${idea.impact}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(idea);
  }

  const positions = new Map();
  for (const [key, group] of groups.entries()) {
    const sorted = [...group].sort((a, b) => a.id - b.id);
    const count = sorted.length;

    sorted.forEach((idea, idx) => {
      const x = scoreToWorldX(idea.feasibility);
      const y = scoreToWorldY(idea.impact);
      // Visual depth only: single nodes sit at z=0.58; coincident points separate cleanly along Z
      let z = 0.58;
      if (count === 2) {
        z = idx === 0 ? 0.36 : 1.04;
      } else if (count >= 3) {
        z = 0.32 + idx * 0.54;
      }

      positions.set(idea.id, {
        x,
        y,
        z,
        origX: scoreToWorldX(idea.originalFeasibility),
        origY: scoreToWorldY(idea.originalImpact),
        clusterSize: count,
        clusterIndex: idx,
        clusterKey: key,
      });
    });
  }

  return positions;
}

/**
 * Derived total-score ranking (Feasibility + Impact) with ties explicitly preserved.
 * Not a separate scoring criterion — strictly derived from the two LKPD scores.
 */
function computeScoreRanking(ideas) {
  const enriched = ideas.map((idea) => ({
    idea,
    total: getTotalScore(idea.feasibility, idea.impact),
    originalTotal: getTotalScore(idea.originalFeasibility, idea.originalImpact),
    quadrant: getQuadrantMeta(idea.feasibility, idea.impact),
  }));

  enriched.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (b.idea.impact !== a.idea.impact) return b.idea.impact - a.idea.impact;
    if (b.idea.feasibility !== a.idea.feasibility) return b.idea.feasibility - a.idea.feasibility;
    return a.idea.id - b.idea.id;
  });

  // Assign competition ranks (1, 2, 2, 4, 5, 5, 5, 8, 8, 10) and tie counts
  const totalCounts = new Map();
  for (const item of enriched) {
    totalCounts.set(item.total, (totalCounts.get(item.total) || 0) + 1);
  }

  let currentRank = 1;
  return enriched.map((item, idx) => {
    if (idx > 0 && item.total < enriched[idx - 1].total) {
      currentRank = idx + 1;
    }
    return {
      ...item,
      rank: currentRank,
      isTied: totalCounts.get(item.total) > 1,
      tieCount: totalCounts.get(item.total),
    };
  });
}

/**
 * Group ideas by current quadrant ID for the 4 Mini-Matrices comparison view.
 */
function groupIdeasByQuadrant(ideas) {
  const grouped = { I: [], II: [], III: [], IV: [] };
  for (const idea of ideas) {
    const qId = getQuadrantId(idea.feasibility, idea.impact);
    grouped[qId].push(idea);
  }
  return grouped;
}

/**
 * Compute dynamic summary statistics from the current ideas array.
 */
function computeSummaryStats(ideas) {
  const totalIdeas = ideas.length;
  const countsByQuadrant = { I: 0, II: 0, III: 0, IV: 0 };
  const originalCountsByQuadrant = { I: 0, II: 0, III: 0, IV: 0 };
  let totalScoreSum = 0;
  let originalScoreSum = 0;
  let modifiedCount = 0;

  for (const idea of ideas) {
    const q = getQuadrantId(idea.feasibility, idea.impact);
    const origQ = getQuadrantId(idea.originalFeasibility, idea.originalImpact);
    countsByQuadrant[q] += 1;
    originalCountsByQuadrant[origQ] += 1;
    totalScoreSum += getTotalScore(idea.feasibility, idea.impact);
    originalScoreSum += getTotalScore(idea.originalFeasibility, idea.originalImpact);
    if (idea.feasibility !== idea.originalFeasibility || idea.impact !== idea.originalImpact) {
      modifiedCount += 1;
    }
  }

  const averageTotal = totalIdeas > 0 ? totalScoreSum / totalIdeas : 0;
  const originalAverageTotal = totalIdeas > 0 ? originalScoreSum / totalIdeas : 0;

  return {
    totalIdeas,
    quadrantTotal: QUADRANT_IDS.length,
    priorityCount: countsByQuadrant.I,
    originalPriorityCount: originalCountsByQuadrant.I,
    countsByQuadrant,
    originalCountsByQuadrant,
    averageTotal,
    averageTotalFormatted: averageTotal.toFixed(1),
    originalAverageTotal,
    originalAverageTotalFormatted: originalAverageTotal.toFixed(1),
    modifiedCount,
    hasModifications: modifiedCount > 0,
  };
}

function csvEscape(value) {
  const str = String(value ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generate RFC 4180 CSV export with UTF-8 BOM containing original & simulated scores.
 */
function buildCsvContent(ideas) {
  const headers = [
    'No',
    'Nama Ide',
    'SCAMPER',
    'Feasibility Asli',
    'Impact Asli',
    'Total Asli',
    'Kuadran Asli LKPD',
    'Feasibility Saat Ini',
    'Impact Saat Ini',
    'Total Saat Ini',
    'Kuadran Saat Ini',
    'Status Simulasi',
    'Pilihan Final LKPD',
  ];

  const rows = ideas.map((idea) => {
    const origTotal = getTotalScore(idea.originalFeasibility, idea.originalImpact);
    const currTotal = getTotalScore(idea.feasibility, idea.impact);
    const currQ = getQuadrantMeta(idea.feasibility, idea.impact);
    const isModified = idea.feasibility !== idea.originalFeasibility || idea.impact !== idea.originalImpact;

    return [
      idea.id,
      idea.name,
      idea.scamper,
      idea.originalFeasibility,
      idea.originalImpact,
      origTotal,
      idea.originalQuadrantLabel,
      idea.feasibility,
      idea.impact,
      currTotal,
      `${currQ.roman} — ${currQ.name}`,
      isModified ? 'Simulasi' : 'Asli LKPD',
      idea.isOriginalFinalSelection ? `Ya (${idea.conceptName})` : 'Tidak',
    ].map(csvEscape).join(',');
  });

  return `\uFEFF${headers.map(csvEscape).join(',')}\n${rows.join('\n')}\n`;
}

// --- src/state/store.js ---
/**
 * Unidirectional reactive store for IdeaQuest 2.0.
 * Coordinates synchronized state across the 3D Idea Space, 2D Matrix,
 * 4 Decision Lenses, Idea Explorer, Inspector, and Presentation Mode.
 */



function createInitialIdeaRecords() {
  return INITIAL_IDEAS.map((item) => ({
    ...item,
    feasibility: item.originalFeasibility,
    impact: item.originalImpact,
    isModified: false,
    modificationSource: null,
  }));
}

function createIdeaQuestStore() {
  let state = {
    ideas: createInitialIdeaRecords(),
    selectedIdeaId: 1,
    viewMode: '3d', // '3d' | '2d'
    webglStatus: 'pending', // 'pending' | 'ready' | 'unavailable'
    cameraPreset: 'iso', // 'iso' | 'front' | 'top'
    cameraNonce: 0,
    activeLens: 'portfolio', // 'portfolio' | 'priority' | 'quadrants' | 'ranking'
    filters: {
      quadrant: 'all',
      scamper: 'all',
      search: '',
    },
    presentation: {
      open: false,
      slide: 0,
      useSimulatedData: false,
      focusedIdeaId: 1,
    },
    notice: null,
    noticeTimerId: null,
  };

  const listeners = new Set();

  function emit(changeType = 'all') {
    for (const listener of listeners) {
      listener(state, changeType);
    }
  }

  function showNotice(text, tone = 'info') {
    if (state.noticeTimerId && typeof clearTimeout === 'function') {
      clearTimeout(state.noticeTimerId);
    }
    state = {
      ...state,
      notice: { text, tone, id: Date.now() },
      noticeTimerId: null,
    };
    emit('notice');
    if (typeof setTimeout === 'function') {
      const timerId = setTimeout(() => {
        state = { ...state, notice: null, noticeTimerId: null };
        emit('notice');
      }, 4800);
      state.noticeTimerId = timerId;
    }
  }

  return {
    getState() {
      return state;
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    selectIdea(id) {
      const numericId = Number(id);
      if (!state.ideas.some((i) => i.id === numericId)) return;
      state = {
        ...state,
        selectedIdeaId: numericId,
      };
      emit('selection');
    },

    setViewMode(mode) {
      if (mode !== '3d' && mode !== '2d') return;
      if (mode === '3d' && state.webglStatus === 'unavailable') {
        showNotice('WebGL tidak tersedia di perangkat ini; tampilan otomatis menggunakan 2D Matrix.', 'info');
        return;
      }
      if (state.viewMode === mode) return;
      state = {
        ...state,
        viewMode: mode,
      };
      emit('viewMode');
    },

    setWebglStatus(status) {
      if (state.webglStatus === status) return;
      const nextViewMode = status === 'unavailable' ? '2d' : state.viewMode;
      state = {
        ...state,
        webglStatus: status,
        viewMode: nextViewMode,
      };
      emit('viewMode');
    },

    setCameraPreset(preset) {
      if (!['iso', 'front', 'top'].includes(preset)) return;
      state = {
        ...state,
        cameraPreset: preset,
        cameraNonce: state.cameraNonce + 1,
      };
      emit('camera');
    },

    setActiveLens(lens) {
      if (!['portfolio', 'priority', 'quadrants', 'ranking'].includes(lens)) return;
      if (state.activeLens === lens) return;
      state = {
        ...state,
        activeLens: lens,
      };
      emit('lens');
    },

    updateScore(id, nextFeasibility, nextImpact, source = 'slider') {
      const numericId = Number(id);
      const f = clampScore(nextFeasibility);
      const im = clampScore(nextImpact);

      let updatedIdea = null;
      const nextIdeas = state.ideas.map((idea) => {
        if (idea.id !== numericId) return idea;
        const isModified = f !== idea.originalFeasibility || im !== idea.originalImpact;
        updatedIdea = {
          ...idea,
          feasibility: f,
          impact: im,
          isModified,
          modificationSource: isModified ? source : null,
        };
        return updatedIdea;
      });

      if (!updatedIdea) return;
      state = {
        ...state,
        ideas: nextIdeas,
        selectedIdeaId: numericId,
      };
      emit('scores');
    },

    moveIdeaToQuadrant(id, targetQuadrantId, dropCoords = null, source = 'drag') {
      const numericId = Number(id);
      const idea = state.ideas.find((item) => item.id === numericId);
      const quadrant = QUADRANTS[targetQuadrantId];
      if (!idea || !quadrant) return;

      const currentQ = getQuadrantId(idea.feasibility, idea.impact);
      let nextCoords;

      if (dropCoords && typeof dropCoords.percentX === 'number' && typeof dropCoords.percentY === 'number') {
        nextCoords = dropPositionToQuadrantScores(dropCoords.percentX, dropCoords.percentY, targetQuadrantId);
      } else {
        nextCoords = { ...quadrant.representativePoint };
      }

      if (source === 'quadrant-button' && currentQ === targetQuadrantId) {
        nextCoords = { ...quadrant.representativePoint };
      }

      this.updateScore(numericId, nextCoords.feasibility, nextCoords.impact, source);
      const qMeta = getQuadrantMeta(nextCoords.feasibility, nextCoords.impact);
      showNotice(
        `Simulasi: Ide #${idea.id} dipindahkan ke Kuadran ${qMeta.roman} (${qMeta.name}) — F:${nextCoords.feasibility}, I:${nextCoords.impact}. Skor asli LKPD tetap terjaga.`,
        'simulation'
      );
    },

    resetIdea(id) {
      const numericId = Number(id);
      const target = state.ideas.find((item) => item.id === numericId);
      if (!target) return;

      const nextIdeas = state.ideas.map((idea) => {
        if (idea.id !== numericId) return idea;
        return {
          ...idea,
          feasibility: idea.originalFeasibility,
          impact: idea.originalImpact,
          isModified: false,
          modificationSource: null,
        };
      });

      state = {
        ...state,
        ideas: nextIdeas,
      };
      emit('scores');
      showNotice(`Ide #${target.id} dikembalikan ke skor asli LKPD (${target.originalFeasibility}, ${target.originalImpact}).`, 'success');
    },

    resetAll() {
      state = {
        ...state,
        ideas: createInitialIdeaRecords(),
      };
      emit('scores');
      showNotice('Seluruh 10 ide dikembalikan ke skor asli LKPD 5.', 'success');
    },

    setFilter(patch) {
      state = {
        ...state,
        filters: {
          ...state.filters,
          ...patch,
        },
      };
      emit('filters');
    },

    openPresentation(slide = 0) {
      state = {
        ...state,
        presentation: {
          ...state.presentation,
          open: true,
          slide: Math.max(0, Math.min(3, slide)),
          useSimulatedData: false,
        },
      };
      emit('presentation');
    },

    closePresentation() {
      state = {
        ...state,
        presentation: {
          ...state.presentation,
          open: false,
        },
      };
      emit('presentation');
    },

    setPresentationSlide(slide) {
      state = {
        ...state,
        presentation: {
          ...state.presentation,
          slide: Math.max(0, Math.min(3, slide)),
        },
      };
      emit('presentation');
    },

    setPresentationFocusIdea(id) {
      const numericId = Number(id);
      if (!state.ideas.some((i) => i.id === numericId)) return;
      state = {
        ...state,
        presentation: {
          ...state.presentation,
          focusedIdeaId: numericId,
        },
      };
      emit('presentation');
    },

    togglePresentationDataSource(useSimulated) {
      state = {
        ...state,
        presentation: {
          ...state.presentation,
          useSimulatedData: Boolean(useSimulated),
        },
      };
      emit('presentation');
    },

    notify(text, tone = 'info') {
      showNotice(text, tone);
    },
  };
}

// --- src/components/Icons.js ---
/**
 * Minimal architectural 1.5px stroke SVG icons for IdeaQuest 2.0.
 * Zero emojis, zero decorative cartoon assets.
 */

function icon(name, size = 16) {
  const attrs = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`;

  const paths = {
    cube: `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>`,
    grid: `<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/>`,
    play: `<polygon points="6 4 20 12 6 20 6 4"/>`,
    download: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>`,
    printer: `<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>`,
    reset: `<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><polyline points="3 3 3 8 8 8"/>`,
    arrowDownRight: `<line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 7 17 17 7 17"/>`,
    arrowRight: `<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>`,
    arrowLeft: `<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>`,
    close: `<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,
    search: `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>`,
    target: `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>`,
    layers: `<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>`,
    bars: `<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="15" y2="12"/><line x1="4" y1="18" x2="11" y2="18"/>`,
    alert: `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`,
    diamond: `<path d="M12 3l9 9-9 9-9-9 9-9z"/>`,
    check: `<polyline points="20 6 9 17 4 12"/>`,
    camera: `<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>`,
  };

  return `<svg ${attrs}>${paths[name] || paths.diamond}</svg>`;
}

// --- src/components/IdeaSpace3D.js ---
/**
 * IdeaSpace3D — Real Three.js / WebGL interactive 3D strategy coordinate space.
 *
 * Coordinate Semantics (strictly faithful to LKPD 5):
 *   - X-axis: Feasibility / Kelayakan (1..5)
 *   - Y-axis: Impact / Dampak (1..5)
 *   - Z-axis: Visual depth ONLY (separates coincident coordinates like (4,5) and (3,4)
 *             deterministically without implying a third scoring criterion).
 *
 * Includes damped OrbitControls, camera presets, raycaster hover tooltip, click-to-select,
 * orbital halo highlights on the 3 original selected ideas, live score interpolation with
 * simulation ghost tethers, reduced-motion compliance, WebGL fallback, and full resource cleanup.
 */



const QUADRANT_HEX = Object.freeze({
  mint: 0x0f8a5f,
  blue: 0x2563eb,
  peach: 0xc46e09,
  coral: 0xc94558,
});

const CAMERA_PRESETS = Object.freeze({
  iso: { pos: [2.25, 5.05, 10.15], target: [0.05, 3.95, 0.25] },
  front: { pos: [0.05, 4.0, 11.2], target: [0.05, 4.0, 0.2] },
  top: { pos: [0.35, 9.1, 7.0], target: [0.05, 3.9, 0.4] },
});

function isWebGLAvailable() {
  try {
    if (typeof document === 'undefined') return false;
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Create a crisp high-DPI CanvasTexture for architectural axis & quadrant typography.
 */
function createLabelTexture(THREE, text, options = {}) {
  const {
    font = '600 32px Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    color = '#3A4254',
    width = 512,
    height = 96,
    align = 'center',
    bg = null,
    border = null,
    radius = 16,
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height);

  if (bg) {
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(4, 4, width - 8, height - 8, radius);
    ctx.fill();
  }
  if (border) {
    ctx.strokeStyle = border;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(4, 4, width - 8, height - 8, radius);
    ctx.stroke();
  }

  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  const x = align === 'left' ? 16 : align === 'right' ? width - 16 : width / 2;
  ctx.fillText(text, x, height / 2 + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

function createTextPlane(THREE, text, worldW, worldH, options = {}) {
  const tex = createLabelTexture(THREE, text, options);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(worldW, worldH), mat);
  return { mesh, texture: tex, material: mat };
}

function createNodeBadgeSprite(THREE, id, isTrio) {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 88;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = isTrio ? '#111827' : 'rgba(255,255,255,0.94)';
  ctx.beginPath();
  ctx.roundRect(14, 14, 132, 60, 14);
  ctx.fill();

  ctx.strokeStyle = isTrio ? '#0F8A5F' : '#CBD2DF';
  ctx.lineWidth = isTrio ? 4 : 3;
  ctx.stroke();

  ctx.font = '700 32px "Geist Mono", ui-monospace, monospace';
  ctx.fillStyle = isTrio ? '#FFFFFF' : '#151923';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`#${id}`, 80, 45);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.68, 0.37, 1);
  sprite.renderOrder = 12;
  return { sprite, texture, material };
}

/**
 * Mount a full Three.js WebGL interactive Idea Space into `containerEl`.
 * Returns a controller `{ update(state), setCameraPreset(preset), dispose() }`.
 */
async function mountIdeaSpace3D(containerEl, initialState, callbacks) {
  if (!isWebGLAvailable()) {
    callbacks?.onWebglUnavailable?.();
    return null;
  }

  let THREE;
  let OrbitControls;
  try {
    [THREE, { OrbitControls }] = await Promise.all([
      import('three'),
      import('three/addons/controls/OrbitControls.js'),
    ]);
  } catch (err) {
    console.error('Failed to load Three.js module:', err);
    callbacks?.onWebglUnavailable?.();
    return null;
  }

  // Guard against unmount while async import was in flight
  if (!containerEl || !containerEl.isConnected) {
    return null;
  }

  const reducedMotion = prefersReducedMotion();
  const disposables = [];
  const track = (obj) => {
    disposables.push(obj);
    return obj;
  };

  // Clear loading placeholder
  const mountHost = containerEl.querySelector('[data-three-canvas-host]') || containerEl;
  mountHost.innerHTML = '';

  const tooltipEl = containerEl.querySelector('[data-three-tooltip]');

  // Scene & Studio Atmosphere
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xedf0f5);
  scene.fog = new THREE.Fog(0xedf0f5, 19, 34);

  // Renderer with mobile-friendly pixel ratio cap
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
  });
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.domElement.className = 'three-webgl-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  mountHost.appendChild(renderer.domElement);

  // Camera
  const width = Math.max(320, mountHost.clientWidth || 720);
  const height = Math.max(380, mountHost.clientHeight || 540);
  const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 80);
  camera.position.set(...CAMERA_PRESETS.iso.pos);
  renderer.setSize(width, height, false);

  // Restrained OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = !reducedMotion;
  controls.dampingFactor = 0.075;
  controls.enablePan = false;
  controls.rotateSpeed = 0.65;
  controls.zoomSpeed = 0.75;
  controls.minDistance = 5.6;
  controls.maxDistance = 15.5;
  controls.minPolarAngle = 0.34;
  controls.maxPolarAngle = Math.PI * 0.54;
  controls.minAzimuthAngle = -Math.PI * 0.42;
  controls.maxAzimuthAngle = Math.PI * 0.42;
  controls.target.set(...CAMERA_PRESETS.iso.target);
  controls.update();

  // Studio Three-Point Lighting
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd4dbe8, 1.15);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfffdf8, 1.25);
  keyLight.position.set(5.5, 11.5, 9.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = isMobile ? 1024 : 2048;
  keyLight.shadow.mapSize.height = isMobile ? 1024 : 2048;
  keyLight.shadow.camera.near = 2;
  keyLight.shadow.camera.far = 28;
  keyLight.shadow.camera.left = -7.5;
  keyLight.shadow.camera.right = 7.5;
  keyLight.shadow.camera.top = 8.5;
  keyLight.shadow.camera.bottom = -3;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xd9e4ff, 0.55);
  rimLight.position.set(-7.5, 4.5, 6.0);
  scene.add(rimLight);

  // =========================================================================
  // Architectural Studio Floor Plinth + Back Coordinate Plane
  // =========================================================================
  const minX = scoreToWorldX(1) - SCENE_STEP * 0.55;
  const maxX = scoreToWorldX(5) + SCENE_STEP * 0.55;
  const minY = scoreToWorldY(1) - SCENE_STEP * 0.5;
  const maxY = scoreToWorldY(5) + SCENE_STEP * 0.86; // Extra header headroom above Impact = 5 badges
  const threshX = (scoreToWorldX(3) + scoreToWorldX(4)) / 2;
  const threshY = (scoreToWorldY(3) + scoreToWorldY(4)) / 2;
  const planeW = maxX - minX;
  const planeH = maxY - minY;
  const planeCenterX = (minX + maxX) / 2;
  const planeCenterY = (minY + maxY) / 2;

  // Floor plane (receives soft shadows)
  const floorGeo = track(new THREE.PlaneGeometry(24, 18));
  const floorMat = track(new THREE.MeshStandardMaterial({
    color: 0xe6eaf1,
    roughness: 0.94,
    metalness: 0.0,
  }));
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 0.0, 1.4);
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  // Subtle raised plinth base directly underneath the coordinate plane
  const plinthGeo = track(new THREE.BoxGeometry(planeW + 0.5, 0.11, 2.35));
  const plinthMat = track(new THREE.MeshStandardMaterial({
    color: 0xf7f8fb,
    roughness: 0.72,
    metalness: 0.04,
  }));
  const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
  plinthMesh.position.set(planeCenterX, 0.055, 0.92);
  plinthMesh.receiveShadow = true;
  plinthMesh.castShadow = false;
  scene.add(plinthMesh);

  // Coordinate backplate (crisp matte white architectural board)
  const backGeo = track(new THREE.PlaneGeometry(planeW, planeH));
  const backMat = track(new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.88,
    metalness: 0.02,
  }));
  const backPlane = new THREE.Mesh(backGeo, backMat);
  backPlane.position.set(planeCenterX, planeCenterY, -0.02);
  backPlane.receiveShadow = true;
  scene.add(backPlane);

  // Subtle translucent semantic quadrant washes on the coordinate backplate
  const quadRects = [
    // I — Prioritas Utama (top right: threshX..maxX, threshY..maxY)
    { x0: threshX, x1: maxX, y0: threshY, y1: maxY, color: 0x0f8a5f, opacity: 0.085, label: 'I · PRIORITAS UTAMA', lx: (threshX + maxX) / 2, ly: maxY - 0.28 },
    // II — Quick Wins (bottom right: threshX..maxX, minY..threshY)
    { x0: threshX, x1: maxX, y0: minY, y1: threshY, color: 0x2563eb, opacity: 0.06, label: 'II · QUICK WINS', lx: (threshX + maxX) / 2, ly: minY + 0.28 },
    // III — Tantangan (top left: minX..threshX, threshY..maxY)
    { x0: minX, x1: threshX, y0: threshY, y1: maxY, color: 0xc46e09, opacity: 0.065, label: 'III · TANTANGAN', lx: (minX + threshX) / 2, ly: maxY - 0.28 },
    // IV — Prioritas Rendah (bottom left: minX..threshX, minY..threshY)
    { x0: minX, x1: threshX, y0: minY, y1: threshY, color: 0xc94558, opacity: 0.05, label: 'IV · PRIORITAS RENDAH', lx: (minX + threshX) / 2, ly: minY + 0.28 },
  ];

  for (const qr of quadRects) {
    const qw = qr.x1 - qr.x0;
    const qh = qr.y1 - qr.y0;
    const qGeo = track(new THREE.PlaneGeometry(qw, qh));
    const qMat = track(new THREE.MeshBasicMaterial({
      color: qr.color,
      transparent: true,
      opacity: qr.opacity,
      depthWrite: false,
    }));
    const qMesh = new THREE.Mesh(qGeo, qMat);
    qMesh.position.set((qr.x0 + qr.x1) / 2, (qr.y0 + qr.y1) / 2, -0.008);
    scene.add(qMesh);

    const lbl = createTextPlane(THREE, qr.label, 2.5, 0.36, {
      font: '700 22px "Geist Mono", ui-monospace, monospace',
      color: '#' + qr.color.toString(16).padStart(6, '0'),
      width: 560,
      height: 80,
    });
    track(lbl.texture);
    track(lbl.material);
    track(lbl.mesh.geometry);
    lbl.mesh.position.set(qr.lx, qr.ly, 0.008);
    scene.add(lbl.mesh);
  }

  // Crisp perimeter border & integer gridlines (1..5)
  const gridPoints = [];
  for (let s = 1; s <= 5; s += 1) {
    const gx = scoreToWorldX(s);
    const gy = scoreToWorldY(s);
    gridPoints.push(new THREE.Vector3(gx, minY, 0.003), new THREE.Vector3(gx, maxY, 0.003));
    gridPoints.push(new THREE.Vector3(minX, gy, 0.003), new THREE.Vector3(maxX, gy, 0.003));
  }
  const gridGeo = track(new THREE.BufferGeometry().setFromPoints(gridPoints));
  const gridMat = track(new THREE.LineBasicMaterial({ color: 0xcbd2df, transparent: true, opacity: 0.85 }));
  scene.add(new THREE.LineSegments(gridGeo, gridMat));

  // Perimeter frame
  const borderPoints = [
    new THREE.Vector3(minX, minY, 0.006),
    new THREE.Vector3(maxX, minY, 0.006),
    new THREE.Vector3(maxX, maxY, 0.006),
    new THREE.Vector3(minX, maxY, 0.006),
    new THREE.Vector3(minX, minY, 0.006),
  ];
  const borderGeo = track(new THREE.BufferGeometry().setFromPoints(borderPoints));
  const borderMat = track(new THREE.LineBasicMaterial({ color: 0x9aa4b6 }));
  scene.add(new THREE.Line(borderGeo, borderMat));

  // Threshold crosshairs (3.5 on X and 3.5 on Y) — crisp dark architectural rails
  const threshBarMat = track(new THREE.MeshBasicMaterial({ color: 0x262e40 }));
  const vRailGeo = track(new THREE.BoxGeometry(0.028, planeH, 0.022));
  const vRail = new THREE.Mesh(vRailGeo, threshBarMat);
  vRail.position.set(threshX, planeCenterY, 0.01);
  scene.add(vRail);

  const hRailGeo = track(new THREE.BoxGeometry(planeW, 0.028, 0.022));
  const hRail = new THREE.Mesh(hRailGeo, threshBarMat);
  hRail.position.set(planeCenterX, threshY, 0.01);
  scene.add(hRail);

  // Numeric axis ticks (1..5) and axis titles
  for (let s = 1; s <= 5; s += 1) {
    const xTick = createTextPlane(THREE, String(s), 0.42, 0.34, {
      font: '700 30px "Geist Mono", ui-monospace, monospace',
      color: '#4B5568',
      width: 120,
      height: 96,
    });
    track(xTick.texture);
    track(xTick.material);
    track(xTick.mesh.geometry);
    xTick.mesh.position.set(scoreToWorldX(s), 0.14, 1.92);
    xTick.mesh.rotation.x = -Math.PI / 2;
    scene.add(xTick.mesh);

    const yTick = createTextPlane(THREE, String(s), 0.42, 0.34, {
      font: '700 30px "Geist Mono", ui-monospace, monospace',
      color: '#4B5568',
      width: 120,
      height: 96,
    });
    track(yTick.texture);
    track(yTick.material);
    track(yTick.mesh.geometry);
    yTick.mesh.position.set(minX - 0.32, scoreToWorldY(s), 0.02);
    scene.add(yTick.mesh);
  }

  // Axis titles
  const xTitle = createTextPlane(THREE, 'FEASIBILITY / KELAYAKAN  (1 → 5)', 4.2, 0.44, {
    font: '700 22px "Geist Mono", ui-monospace, monospace',
    color: '#151923',
    width: 760,
    height: 80,
  });
  track(xTitle.texture);
  track(xTitle.material);
  track(xTitle.mesh.geometry);
  xTitle.mesh.position.set(planeCenterX, 0.125, 2.38);
  xTitle.mesh.rotation.x = -Math.PI / 2;
  scene.add(xTitle.mesh);

  const yTitle = createTextPlane(THREE, 'IMPACT / DAMPAK  (1 → 5)', 3.8, 0.42, {
    font: '700 22px "Geist Mono", ui-monospace, monospace',
    color: '#151923',
    width: 680,
    height: 80,
  });
  track(yTitle.texture);
  track(yTitle.material);
  track(yTitle.mesh.geometry);
  yTitle.mesh.position.set(minX - 0.72, planeCenterY, 0.02);
  yTitle.mesh.rotation.z = Math.PI / 2;
  scene.add(yTitle.mesh);

  // =========================================================================
  // Ten Sculpted 3D Idea Nodes + Stems + Anchors + Orbital Halos
  // =========================================================================
  const sharedSphereGeo = track(new THREE.SphereGeometry(0.255, 36, 36));
  const sharedStemGeo = track(new THREE.CylinderGeometry(0.016, 0.016, 1, 14));
  const sharedFootprintGeo = track(new THREE.CylinderGeometry(0.085, 0.085, 0.018, 24));
  const sharedHaloGeo = track(new THREE.TorusGeometry(0.375, 0.02, 16, 48));
  const sharedSelectGeo = track(new THREE.TorusGeometry(0.445, 0.024, 16, 48));
  const sharedGhostGeo = track(new THREE.RingGeometry(0.11, 0.16, 28));

  const stemMatDefault = track(new THREE.MeshStandardMaterial({ color: 0x8b95a7, roughness: 0.45, metalness: 0.45 }));
  const haloMatTrio = track(new THREE.MeshStandardMaterial({ color: 0x0f8a5f, roughness: 0.25, metalness: 0.35 }));
  const selectRingMat = track(new THREE.MeshBasicMaterial({ color: 0x2546f5 }));
  const ghostMat = track(new THREE.MeshBasicMaterial({ color: 0x2546f5, transparent: true, opacity: 0.48, side: THREE.DoubleSide }));
  const tetherMat = track(new THREE.LineDashedMaterial({ color: 0x2546f5, dashSize: 0.12, gapSize: 0.08, transparent: true, opacity: 0.75 }));

  const nodeEntries = new Map();
  const pickableMeshes = [];

  const initialPosMap = compute3DNodePositions(initialState.ideas);

  for (const idea of initialState.ideas) {
    const pos = initialPosMap.get(idea.id);
    const q = getQuadrantMeta(idea.feasibility, idea.impact);

    const sphereMat = track(new THREE.MeshPhysicalMaterial({
      color: QUADRANT_HEX[q.colorKey],
      roughness: 0.28,
      metalness: 0.08,
      clearcoat: 0.48,
      clearcoatRoughness: 0.22,
    }));

    const sphere = new THREE.Mesh(sharedSphereGeo, sphereMat);
    sphere.position.set(pos.x, pos.y, pos.z);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.userData.ideaId = idea.id;
    scene.add(sphere);
    pickableMeshes.push(sphere);

    // Stem connecting back-plane (x, y, 0) to node (x, y, z)
    const stem = new THREE.Mesh(sharedStemGeo, stemMatDefault);
    stem.rotation.x = Math.PI / 2;
    stem.scale.set(1, pos.z, 1);
    stem.position.set(pos.x, pos.y, pos.z / 2);
    stem.castShadow = true;
    scene.add(stem);

    // Footprint pin on coordinate wall
    const footMat = track(new THREE.MeshStandardMaterial({
      color: QUADRANT_HEX[q.colorKey],
      roughness: 0.5,
      metalness: 0.15,
    }));
    const footprint = new THREE.Mesh(sharedFootprintGeo, footMat);
    footprint.rotation.x = Math.PI / 2;
    footprint.position.set(pos.x, pos.y, 0.012);
    scene.add(footprint);

    // Subtle orbital halo for the 3 original selected ideas
    let trioHalo = null;
    if (idea.isOriginalFinalSelection) {
      trioHalo = new THREE.Mesh(sharedHaloGeo, haloMatTrio);
      trioHalo.position.set(pos.x, pos.y, pos.z);
      trioHalo.rotation.set(Math.PI * 0.16, -Math.PI * 0.12, 0);
      scene.add(trioHalo);
    }

    // Floating crisp ID sprite
    const badge = createNodeBadgeSprite(THREE, idea.id, idea.isOriginalFinalSelection);
    track(badge.texture);
    track(badge.material);
    badge.sprite.position.set(pos.x, pos.y + 0.44, pos.z);
    scene.add(badge.sprite);

    // Simulation ghost anchor & dashed tether (visible only when modified)
    const ghostAnchor = new THREE.Mesh(sharedGhostGeo, ghostMat);
    ghostAnchor.position.set(pos.origX, pos.origY, 0.025);
    ghostAnchor.visible = false;
    scene.add(ghostAnchor);

    const tetherGeo = track(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(pos.origX, pos.origY, 0.03),
      new THREE.Vector3(pos.x, pos.y, pos.z),
    ]));
    const tetherLine = new THREE.Line(tetherGeo, tetherMat);
    tetherLine.computeLineDistances();
    tetherLine.visible = false;
    scene.add(tetherLine);

    nodeEntries.set(idea.id, {
      id: idea.id,
      sphere,
      sphereMat,
      stem,
      footprint,
      footMat,
      trioHalo,
      badgeSprite: badge.sprite,
      ghostAnchor,
      tetherLine,
      tetherGeo,
      currentPos: new THREE.Vector3(pos.x, pos.y, pos.z),
      targetPos: new THREE.Vector3(pos.x, pos.y, pos.z),
      origPos: new THREE.Vector3(pos.origX, pos.origY, 0.03),
      targetScale: 1,
    });
  }

  // Active Selection Ring (shared ring that tracks selected idea smoothly)
  const selectionRing = new THREE.Mesh(sharedSelectGeo, selectRingMat);
  selectionRing.position.copy(nodeEntries.get(initialState.selectedIdeaId)?.currentPos || new THREE.Vector3());
  scene.add(selectionRing);

  // Subtle vertical drop line from selected node to floor plinth (aids spatial reading)
  const dropLineGeo = track(new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0.11, 0),
    new THREE.Vector3(0, 1, 0),
  ]));
  const dropLineMat = track(new THREE.LineBasicMaterial({ color: 0x2546f5, transparent: true, opacity: 0.38 }));
  const dropLine = new THREE.Line(dropLineGeo, dropLineMat);
  scene.add(dropLine);

  // =========================================================================
  // State Synchronization, Hover Raycasting, and Camera Presets
  // =========================================================================
  let latestState = initialState;
  let hoveredIdeaId = null;
  let cameraLerpTarget = null;
  let pointerDownPos = null;

  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();
  const projectedVec = new THREE.Vector3();

  function applyState(nextState) {
    latestState = nextState;
    const posMap = compute3DNodePositions(nextState.ideas);

    for (const idea of nextState.ideas) {
      const entry = nodeEntries.get(idea.id);
      const pos = posMap.get(idea.id);
      if (!entry || !pos) continue;

      const q = getQuadrantMeta(idea.feasibility, idea.impact);
      const colorHex = QUADRANT_HEX[q.colorKey];
      entry.sphereMat.color.setHex(colorHex);
      entry.footMat.color.setHex(colorHex);

      entry.targetPos.set(pos.x, pos.y, pos.z);
      if (reducedMotion) {
        entry.currentPos.copy(entry.targetPos);
      }

      const isSelected = idea.id === nextState.selectedIdeaId;
      const isHovered = idea.id === hoveredIdeaId;
      entry.targetScale = isSelected ? 1.18 : isHovered ? 1.1 : 1.0;

      entry.ghostAnchor.visible = idea.isModified;
      entry.tetherLine.visible = idea.isModified;
    }
  }

  function updateTooltip() {
    if (!tooltipEl) return;
    if (!hoveredIdeaId) {
      tooltipEl.classList.remove('is-visible');
      return;
    }

    const idea = latestState.ideas.find((i) => i.id === hoveredIdeaId);
    const entry = nodeEntries.get(hoveredIdeaId);
    if (!idea || !entry) {
      tooltipEl.classList.remove('is-visible');
      return;
    }

    projectedVec.copy(entry.currentPos);
    projectedVec.y += 0.45;
    projectedVec.project(camera);

    const rect = mountHost.getBoundingClientRect();
    const px = (projectedVec.x * 0.5 + 0.5) * rect.width;
    const py = (-projectedVec.y * 0.5 + 0.5) * rect.height;

    const q = getQuadrantMeta(idea.feasibility, idea.impact);
    const total = getTotalScore(idea.feasibility, idea.impact);

    tooltipEl.innerHTML = `
      <div class="canvas-tooltip__head">
        <span class="mono">#${String(idea.id).padStart(2, '0')}</span>
        <span class="canvas-tooltip__quad">${q.roman} · ${q.name}</span>
      </div>
      <strong class="canvas-tooltip__title">${idea.name}</strong>
      <div class="canvas-tooltip__scores mono">
        <span>F: <b>${idea.feasibility}/5</b></span>
        <span>I: <b>${idea.impact}/5</b></span>
        <span>Total: <b>${total}/10</b></span>
      </div>
      ${idea.isModified ? `<div class="canvas-tooltip__sim mono">Simulasi (Asli LKPD: ${idea.originalFeasibility}/${idea.originalImpact})</div>` : ''}
    `;

    // Clamp cleanly inside stage bounds so tooltip never overflows or covers axes
    const clampedX = Math.max(135, Math.min(rect.width - 135, px));
    const clampedY = Math.max(95, Math.min(rect.height - 24, py - 12));
    tooltipEl.style.left = `${clampedX}px`;
    tooltipEl.style.top = `${clampedY}px`;
    tooltipEl.classList.add('is-visible');
  }

  function handlePointerMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointerNdc, camera);
    const hits = raycaster.intersectObjects(pickableMeshes, false);
    const hitId = hits.length > 0 ? hits[0].object.userData.ideaId : null;

    if (hitId !== hoveredIdeaId) {
      hoveredIdeaId = hitId;
      renderer.domElement.style.cursor = hitId ? 'pointer' : 'grab';
      applyState(latestState);
    }
    updateTooltip();
  }

  function handlePointerLeave() {
    if (hoveredIdeaId !== null) {
      hoveredIdeaId = null;
      renderer.domElement.style.cursor = 'grab';
      applyState(latestState);
      updateTooltip();
    }
  }

  function handlePointerDown(event) {
    pointerDownPos = { x: event.clientX, y: event.clientY };
    cameraLerpTarget = null; // Yield camera control immediately to user orbit
  }

  function handlePointerUp(event) {
    if (!pointerDownPos) return;
    const dist = Math.hypot(event.clientX - pointerDownPos.x, event.clientY - pointerDownPos.y);
    pointerDownPos = null;
    if (dist > 6) return; // User orbited, not clicked

    const rect = renderer.domElement.getBoundingClientRect();
    pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNdc, camera);
    const hits = raycaster.intersectObjects(pickableMeshes, false);
    if (hits.length > 0) {
      const clickedId = hits[0].object.userData.ideaId;
      callbacks?.onSelectIdea?.(clickedId);
    }
  }

  renderer.domElement.addEventListener('pointermove', handlePointerMove);
  renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
  renderer.domElement.addEventListener('pointerdown', handlePointerDown);
  renderer.domElement.addEventListener('pointerup', handlePointerUp);

  // Responsive ResizeObserver
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const w = Math.max(280, Math.floor(entry.contentRect.width));
      const h = Math.max(360, Math.floor(entry.contentRect.height));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
  });
  resizeObserver.observe(mountHost);

  // Animation Loop
  let rafId = null;
  let disposed = false;

  function setCameraPreset(presetName) {
    const preset = CAMERA_PRESETS[presetName] || CAMERA_PRESETS.iso;
    if (reducedMotion) {
      camera.position.set(...preset.pos);
      controls.target.set(...preset.target);
      controls.update();
      cameraLerpTarget = null;
    } else {
      cameraLerpTarget = {
        pos: new THREE.Vector3(...preset.pos),
        target: new THREE.Vector3(...preset.target),
      };
    }
  }

  function animate() {
    if (disposed) return;
    rafId = requestAnimationFrame(animate);

    // Smooth camera preset transition
    if (cameraLerpTarget) {
      camera.position.lerp(cameraLerpTarget.pos, 0.11);
      controls.target.lerp(cameraLerpTarget.target, 0.11);
      if (camera.position.distanceTo(cameraLerpTarget.pos) < 0.03) {
        camera.position.copy(cameraLerpTarget.pos);
        controls.target.copy(cameraLerpTarget.target);
        cameraLerpTarget = null;
      }
    }

    // Smoothly interpolate nodes, stems, halos, badges, and simulation tethers
    const lerpFactor = reducedMotion ? 1 : 0.14;
    for (const entry of nodeEntries.values()) {
      entry.currentPos.lerp(entry.targetPos, lerpFactor);
      const { x, y, z } = entry.currentPos;

      entry.sphere.position.set(x, y, z);
      const nextScale = THREE.MathUtils.lerp(entry.sphere.scale.x, entry.targetScale, lerpFactor);
      entry.sphere.scale.setScalar(nextScale);

      entry.stem.scale.set(1, Math.max(0.02, z), 1);
      entry.stem.position.set(x, y, z / 2);

      entry.footprint.position.set(x, y, 0.012);
      entry.badgeSprite.position.set(x, y + 0.44 * nextScale, z);

      if (entry.trioHalo) {
        entry.trioHalo.position.set(x, y, z);
        entry.trioHalo.scale.setScalar(nextScale);
      }

      if (entry.tetherLine.visible) {
        const posAttr = entry.tetherGeo.attributes.position;
        posAttr.setXYZ(0, entry.origPos.x, entry.origPos.y, 0.03);
        posAttr.setXYZ(1, x, y, z);
        posAttr.needsUpdate = true;
        entry.tetherLine.computeLineDistances();
      }
    }

    // Update active selection ring + drop plumb line
    const selectedEntry = nodeEntries.get(latestState.selectedIdeaId);
    if (selectedEntry) {
      selectionRing.position.copy(selectedEntry.currentPos);
      selectionRing.lookAt(camera.position);

      const dropPos = dropLineGeo.attributes.position;
      dropPos.setXYZ(0, selectedEntry.currentPos.x, 0.11, selectedEntry.currentPos.z);
      dropPos.setXYZ(1, selectedEntry.currentPos.x, selectedEntry.currentPos.y - 0.28, selectedEntry.currentPos.z);
      dropPos.needsUpdate = true;
    }

    controls.update();
    if (hoveredIdeaId) updateTooltip();
    renderer.render(scene, camera);
  }

  applyState(initialState);
  callbacks?.onReady?.();
  animate();

  return {
    update(nextState) {
      applyState(nextState);
    },
    setCameraPreset,
    dispose() {
      disposed = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();
      for (const item of disposables) {
        if (item && typeof item.dispose === 'function') item.dispose();
      }
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    },
  };
}

// --- src/components/OverviewHero.js ---
/**
 * OverviewHero — Editorial topbar and cinematic strategy-studio hero header.
 * Compact navigation (no floating pill capsule), confident Geist Sans display type,
 * concise LKPD 5 exercise summary, and slim hairline metric strip.
 */




function renderOverviewHero(state) {
  const stats = computeSummaryStats(state.ideas);

  return `
    <header class="topbar">
      <div class="topbar__inner">
        <a href="#top" class="brand-mark" aria-label="IdeaQuest Home">
          <span class="brand-mark__square" aria-hidden="true"></span>
          <span class="brand-mark__name">${LKPD_META.brand}</span>
          <span class="brand-mark__divider" aria-hidden="true">/</span>
          <span class="brand-mark__context">LKPD 5 · ${LKPD_META.className}</span>
        </a>

        <nav class="topbar__nav" aria-label="Navigasi utama">
          <a href="#matrix-section">Idea Space</a>
          <a href="#lenses-section">Decision Lenses</a>
          <a href="#explorer-section">Explorer</a>
          <a href="#final-selection-section">Selected Trio</a>
          <a href="#analysis-section">Analysis</a>
        </nav>

        <div class="topbar__actions">
          ${stats.hasModifications ? `
            <button type="button" class="btn btn--subtle btn--sm" data-action="reset-all">
              ${icon('reset', 14)} Reset (${stats.modifiedCount})
            </button>
          ` : ''}
          <button type="button" class="btn btn--ghost btn--sm" data-action="export-csv">
            ${icon('download', 14)} CSV
          </button>
          <button type="button" class="btn btn--primary btn--sm" data-action="open-presentation">
            ${icon('play', 14)} Present
          </button>
        </div>
      </div>
    </header>

    <section id="top" class="hero-band" aria-labelledby="hero-heading">
      <div class="hero-band__grid">
        <div class="hero-band__copy">
          <div class="eyebrow-line">
            <span class="mono-tag">LKPD 5 · IDEATION (USP)</span>
            <span class="eyebrow-sep" aria-hidden="true">/</span>
            <span class="eyebrow-meta">Feasibility vs Impact · ${LKPD_META.className}</span>
            ${stats.hasModifications
              ? `<span class="sim-inline-flag" role="status">Simulasi · ${stats.modifiedCount} diubah</span>`
              : ''}
          </div>

          <h1 id="hero-heading" class="hero-display">Ten ideas. One clear direction.</h1>

          <p class="hero-lead">
            Studio visualisasi interaktif hasil brainstorming <strong>SCAMPER</strong> untuk menyelesaikan masalah
            <strong>${LKPD_META.persona.name}</strong> dalam menghitung margin bersih secara cepat dan menjaga batas aman
            keuntungan <strong>${LKPD_META.persona.targetMargin}</strong>—dari 10 gagasan awal hingga 3 konsep prototipe terpilih.
          </p>
        </div>

        <div class="hero-band__actions">
          <div class="hero-cta-group">
            <a href="#matrix-section" class="btn btn--primary btn--lg">
              Explore the matrix ${icon('arrowDownRight', 16)}
            </a>
            <button type="button" class="btn btn--outline btn--lg" data-action="open-presentation">
              ${icon('play', 15)} Presentation mode
            </button>
          </div>
          <p class="hero-attribution">
            Tim ${LKPD_META.className}: ${LKPD_META.teamMembers.join(', ')} · ${LKPD_META.semester}
          </p>
        </div>
      </div>
    </section>
  `;
}

// --- src/components/SummaryStats.js ---
/**
 * SummaryStats — Slim architectural hairline metric strip (replaces noisy 4-card grid).
 * Dynamically computes counts and average total score from current state.
 */


function renderSummaryStats(state) {
  const stats = computeSummaryStats(state.ideas);
  const priorityChanged = stats.priorityCount !== stats.originalPriorityCount;
  const avgChanged = stats.averageTotalFormatted !== stats.originalAverageTotalFormatted;

  return `
    <section class="metric-strip" aria-label="Ringkasan metrik ideasi LKPD 5">
      <div class="metric-cell">
        <span class="metric-cell__label">Total Ideas</span>
        <div class="metric-cell__row">
          <strong class="metric-cell__value mono" data-stat="total-ideas">${String(stats.totalIdeas).padStart(2, '0')}</strong>
          <span class="metric-cell__sub">SCAMPER · Skala 1–5</span>
        </div>
      </div>

      <div class="metric-cell">
        <span class="metric-cell__label">Original Selected / Kuadran I</span>
        <div class="metric-cell__row">
          <strong class="metric-cell__value mono" data-stat="priority-count">${String(stats.priorityCount).padStart(2, '0')}</strong>
          <span class="metric-cell__sub">
            ${priorityChanged
              ? `Simulasi (asli LKPD: 0${stats.originalPriorityCount})`
              : `Prioritas Utama · F ≥ 4, I ≥ 4`}
          </span>
        </div>
      </div>

      <div class="metric-cell">
        <span class="metric-cell__label">Average Total Score</span>
        <div class="metric-cell__row">
          <strong class="metric-cell__value mono" data-stat="average-score">${stats.averageTotalFormatted}<span class="metric-cell__denom">/10</span></strong>
          <span class="metric-cell__sub">
            ${avgChanged
              ? `Simulasi (asli LKPD: ${stats.originalAverageTotalFormatted}/10)`
              : `Dihitung dari Feasibility + Impact`}
          </span>
        </div>
      </div>

      <div class="metric-cell">
        <span class="metric-cell__label">Quadrant Distribution</span>
        <div class="metric-cell__row">
          <strong class="metric-cell__value mono" data-stat="quadrant-total">0${stats.quadrantTotal}</strong>
          <span class="metric-cell__sub mono">
            I:${stats.countsByQuadrant.I} · II:${stats.countsByQuadrant.II} · III:${stats.countsByQuadrant.III} · IV:${stats.countsByQuadrant.IV}
          </span>
        </div>
      </div>
    </section>
  `;
}

// --- src/components/PriorityMatrix.js ---
/**
 * PriorityMatrix — Main Decision Matrix Studio Centerpiece.
 * Hosts the segmented [ 3D Space | 2D Matrix ] toggle, camera presets for Three.js,
 * keyboard-accessible node selector, WebGL fallback notice, and a crisp architectural
 * 2D Cartesian coordinate plot with cluster list and drag-and-drop simulation.
 */




const GRID_SCORES = [1, 2, 3, 4, 5];

// uses shared escapeHtml

function renderMatrixQuadrant(quadrantId, count, readOnly) {
  const q = QUADRANTS[quadrantId];
  const posClass = {
    I: 'mquad--tr',
    II: 'mquad--br',
    III: 'mquad--tl',
    IV: 'mquad--bl',
  }[quadrantId];

  return `
    <div
      class="mquad mquad--${q.colorKey} ${posClass}"
      data-quadrant="${q.id}"
      ${readOnly ? '' : 'data-drop-quadrant="' + q.id + '"'}
      aria-label="Kuadran ${q.roman} ${q.name}, ${count} ide"
    >
      <div class="mquad__header">
        <span class="mquad__roman mono">${q.roman}</span>
        <div class="mquad__meta">
          <strong class="mquad__name">${q.name}</strong>
          <span class="mquad__rule mono">${q.shortDesc}</span>
        </div>
        <span class="mquad__count mono" data-quadrant-count="${q.id}">${count}</span>
      </div>
      ${readOnly ? '' : `
        <div class="mquad__drop-overlay" aria-hidden="true">
          Lepas di Kuadran ${q.roman} · ${q.name}
        </div>
      `}
    </div>
  `;
}

function renderIdeaMarker(idea, pos, isSelected, readOnly) {
  const quadrant = getQuadrantMeta(idea.feasibility, idea.impact);
  const total = getTotalScore(idea.feasibility, idea.impact);
  const isModified = idea.feasibility !== idea.originalFeasibility || idea.impact !== idea.originalImpact;
  const tooltipPlacement = idea.impact >= 5 ? 'mtooltip--below' : 'mtooltip--above';
  const tooltipAlign = idea.feasibility <= 1 ? 'mtooltip--left' : idea.feasibility >= 5 ? 'mtooltip--right' : '';

  const ariaLabel = `Ide ${idea.id}: ${idea.name}. Feasibility ${idea.feasibility} dari 5, Impact ${idea.impact} dari 5, Total ${total} dari 10. Kuadran ${quadrant.roman} ${quadrant.name}.${isModified ? ' Skor simulasi.' : ''}`;

  return `
    <button
      type="button"
      class="mnode mnode--${quadrant.colorKey} ${isSelected ? 'is-selected' : ''} ${idea.isOriginalFinalSelection ? 'is-trio' : ''} ${isModified ? 'is-modified' : ''}"
      style="left: ${pos.baseX}%; bottom: ${pos.baseY}%; --ox: ${pos.offsetX}px; --oy: ${pos.offsetY}px;"
      data-marker-id="${idea.id}"
      data-action="${readOnly ? 'presentation-select-idea' : 'select-idea'}"
      data-idea-id="${idea.id}"
      ${readOnly ? '' : 'draggable="true"'}
      aria-pressed="${isSelected ? 'true' : 'false'}"
      aria-label="${escapeHtml(ariaLabel)}"
    >
      <span class="mnode__id mono">#${idea.id}</span>
      <span class="mnode__label">${escapeHtml(idea.shortLabel)}</span>
      ${isModified ? '<span class="mnode__sim" title="Skor Simulasi" aria-hidden="true"></span>' : ''}

      <span class="mtooltip ${tooltipPlacement} ${tooltipAlign}" role="tooltip">
        <span class="mtooltip__head mono">
          <span>#${String(idea.id).padStart(2, '0')}</span>
          <span>${quadrant.roman} · ${quadrant.name}</span>
        </span>
        <strong class="mtooltip__name">${escapeHtml(idea.name)}</strong>
        <span class="mtooltip__scores mono">
          <span>F: <b>${idea.feasibility}/5</b></span>
          <span>I: <b>${idea.impact}/5</b></span>
          <span>Total: <b>${total}/10</b></span>
        </span>
        ${isModified ? `<span class="mtooltip__sim mono">Simulasi (asli ${idea.originalFeasibility}/${idea.originalImpact})</span>` : ''}
      </span>
    </button>
  `;
}

function renderCoincidentAnchors(ideas, positions) {
  const seen = new Set();
  const html = [];

  for (const idea of ideas) {
    const pos = positions.get(idea.id);
    if (!pos || pos.clusterSize < 2 || seen.has(pos.clusterKey)) continue;
    seen.add(pos.clusterKey);
    html.push(`
      <div
        class="cluster-pin"
        style="left: ${pos.baseX}%; bottom: ${pos.baseY}%;"
        title="${pos.clusterSize} ide berbagi koordinat exact (${idea.feasibility}, ${idea.impact})"
        aria-hidden="true"
      >
        <span class="cluster-pin__dot"></span>
      </div>
    `);
  }
  return html.join('');
}

/**
 * Render an explicit quiet strip underneath the 2D matrix listing any overlapping
 * coordinates so teachers & keyboard users can jump cleanly between coincident ideas.
 */
function renderCoincidentStrip(ideas, selectedIdeaId, readOnly) {
  const groups = new Map();
  for (const idea of ideas) {
    const key = `${idea.feasibility},${idea.impact}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(idea);
  }
  const clusters = [...groups.entries()].filter(([, arr]) => arr.length > 1);
  if (clusters.length === 0) return '';

  return `
    <div class="coincident-bar" aria-label="Koordinat bersama">
      <span class="coincident-bar__label mono">COINCIDENT POINTS</span>
      <div class="coincident-bar__items">
        ${clusters.map(([key, arr]) => `
          <div class="coincident-group">
            <span class="mono coincident-group__coord">(${key})</span>
            ${arr.map((idea) => `
              <button
                type="button"
                class="coincident-chip ${idea.id === selectedIdeaId ? 'is-selected' : ''}"
                data-action="${readOnly ? 'presentation-select-idea' : 'select-idea'}"
                data-idea-id="${idea.id}"
              >
                <span class="mono">#${idea.id}</span> ${escapeHtml(idea.shortLabel)}
              </button>
            `).join('')}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Reusable architectural 2D Cartesian Matrix Canvas (used in 2D Studio Mode & Presentation Mode).
 */
function renderMatrixCanvas({ ideas, selectedIdeaId, readOnly = false, compact = false }) {
  const stats = computeSummaryStats(ideas);
  const positions = computeMarkerPositions(ideas);

  const vGrid = GRID_SCORES.map((s) => {
    const pct = scoreToPercentX(s);
    return `
      <span class="cgrid__v" style="left: ${pct}%;" aria-hidden="true"></span>
      <span class="ctick ctick--x mono" style="left: ${pct}%;" aria-hidden="true">${s}</span>
    `;
  }).join('');

  const hGrid = GRID_SCORES.map((s) => {
    const pct = scoreToPercentY(s);
    return `
      <span class="cgrid__h" style="bottom: ${pct}%;" aria-hidden="true"></span>
      <span class="ctick ctick--y mono" style="bottom: ${pct}%;" aria-hidden="true">${s}</span>
    `;
  }).join('');

  const markersHtml = ideas
    .map((idea) => renderIdeaMarker(idea, positions.get(idea.id), idea.id === selectedIdeaId, readOnly))
    .join('');

  return `
    <div class="matrix2d-shell ${compact ? 'matrix2d-shell--compact' : ''}">
      <div class="matrix2d-frame ${readOnly ? 'is-readonly' : ''}" data-matrix-canvas="${readOnly ? 'presentation' : 'workspace'}">
        <div class="matrix2d-top-axis mono">
          <span>IMPACT / DAMPAK TINGGI (4–5)</span>
        </div>

        <div class="matrix2d-body">
          <div class="matrix2d-y-title mono" aria-hidden="true">IMPACT / DAMPAK (1 → 5)</div>

          <div
            class="matrix2d-plane"
            style="--split-x: ${THRESHOLD_X_PERCENT}%; --split-y: ${THRESHOLD_Y_PERCENT}%;"
            role="region"
            aria-label="Matriks 2D Koordinat Kartesius Feasibility (X, 1–5) versus Impact (Y, 1–5)"
          >
            <div class="mquad-grid">
              ${renderMatrixQuadrant('III', stats.countsByQuadrant.III, readOnly)}
              ${renderMatrixQuadrant('I', stats.countsByQuadrant.I, readOnly)}
              ${renderMatrixQuadrant('IV', stats.countsByQuadrant.IV, readOnly)}
              ${renderMatrixQuadrant('II', stats.countsByQuadrant.II, readOnly)}
            </div>

            <div class="cgrid-layer" aria-hidden="true">
              ${vGrid}
              ${hGrid}
            </div>

            <!-- Threshold Crosshairs at 3.5 -->
            <div class="cthresh cthresh--v" style="left: ${THRESHOLD_X_PERCENT}%;" aria-hidden="true"></div>
            <div class="cthresh cthresh--h" style="bottom: ${THRESHOLD_Y_PERCENT}%;" aria-hidden="true"></div>
            <span class="cthresh-tag mono" style="left: ${THRESHOLD_X_PERCENT}%; bottom: ${THRESHOLD_Y_PERCENT}%;" aria-hidden="true">3.5</span>

            <div class="anchors-layer" data-anchors-layer>
              ${renderCoincidentAnchors(ideas, positions)}
            </div>

            <div class="markers-layer" data-markers-layer>
              ${markersHtml}
            </div>
          </div>
        </div>

        <div class="matrix2d-bottom-axis mono">
          <span>FEASIBILITY RENDAH (1–3)</span>
          <span class="matrix2d-bottom-center">FEASIBILITY / KELAYAKAN (1 → 5)</span>
          <span>FEASIBILITY TINGGI (4–5)</span>
        </div>
      </div>
    </div>

    <div data-coincident-slot>
      ${renderCoincidentStrip(ideas, selectedIdeaId, readOnly)}
    </div>
  `;
}

/**
 * Main Studio Centerpiece combining the 3D Idea Space (Three.js) and the 2D Matrix
 * behind a crisp segmented toggle + keyboard-accessible node navigator.
 */
function renderPriorityMatrix(state) {
  const stats = computeSummaryStats(state.ideas);
  const is3D = state.viewMode === '3d';
  const webglUnavailable = state.webglStatus === 'unavailable';

  return `
    <div class="studio-matrix-stage">
      <div class="studio-toolbar">
        <div class="studio-toolbar__left">
          <div class="view-toggle" role="tablist" aria-label="Mode tampilan matriks">
            <button
              type="button"
              role="tab"
              aria-selected="${is3D ? 'true' : 'false'}"
              class="view-toggle__btn ${is3D ? 'is-active' : ''}"
              data-action="set-view-mode"
              data-view-mode="3d"
              ${webglUnavailable ? 'disabled title="WebGL tidak tersedia pada browser ini"' : ''}
            >
              ${icon('cube', 14)} <span>3D Space</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected="${!is3D ? 'true' : 'false'}"
              class="view-toggle__btn ${!is3D ? 'is-active' : ''}"
              data-action="set-view-mode"
              data-view-mode="2d"
            >
              ${icon('grid', 14)} <span>2D Matrix</span>
            </button>
          </div>

          ${is3D ? `
            <div class="camera-controls" role="group" aria-label="Sudut kamera 3D">
              <button type="button" class="cam-btn ${state.cameraPreset === 'iso' ? 'is-active' : ''}" data-action="camera-preset" data-preset="iso">Isometric</button>
              <button type="button" class="cam-btn ${state.cameraPreset === 'front' ? 'is-active' : ''}" data-action="camera-preset" data-preset="front">Front X/Y</button>
              <button type="button" class="cam-btn ${state.cameraPreset === 'top' ? 'is-active' : ''}" data-action="camera-preset" data-preset="top">Depth View</button>
            </div>
          ` : `
            <span class="toolbar-hint">Drag pin antar kuadran untuk simulasi · Klik untuk inspeksi</span>
          `}
        </div>

        <div class="studio-toolbar__right">
          ${stats.hasModifications
            ? `<span class="sim-inline-flag" data-matrix-sim-flag>Simulasi · ${stats.modifiedCount} diubah</span>`
            : `<span class="mono-quiet" data-matrix-sim-flag>EXACT LKPD SCORES</span>`}
        </div>
      </div>

      ${webglUnavailable ? `
        <div class="fallback-notice" role="status">
          ${icon('alert', 15)}
          <span>WebGL tidak aktif di perangkat ini — menampilkan <strong>2D Cartesian Matrix</strong> sebagai fallback penuh.</span>
        </div>
      ` : ''}

      <!-- 3D Three.js Idea Space Viewport -->
      <div class="stage-3d-wrap ${is3D ? '' : 'is-hidden'}" data-stage-3d>
        <div class="stage-3d-canvas-host" data-three-canvas-host>
          <div class="stage-3d-loading">
            <span class="mono">INITIALIZING 3D IDEA SPACE...</span>
          </div>
        </div>
        <div class="canvas-tooltip" data-three-tooltip role="status" aria-live="polite"></div>

        <div class="stage-3d-overlay-meta">
          <span class="mono">X: FEASIBILITY (1–5) · Y: IMPACT (1–5) · Z: VISUAL DEPTH ONLY</span>
          <span class="stage-3d-controls-hint">Drag to orbit · Scroll to zoom · Click node to inspect</span>
        </div>

        <!-- Keyboard-accessible direct node selector for 3D space -->
        <div class="kbd-node-strip" role="group" aria-label="Pilih node ide via keyboard">
          <span class="kbd-node-strip__label mono">NODES</span>
          <div class="kbd-node-strip__buttons" data-kbd-node-strip>
            ${state.ideas.map((idea) => {
              const q = getQuadrantMeta(idea.feasibility, idea.impact);
              return `
                <button
                  type="button"
                  class="kbd-node-btn kbd-node-btn--${q.colorKey} ${idea.id === state.selectedIdeaId ? 'is-selected' : ''} ${idea.isOriginalFinalSelection ? 'is-trio' : ''}"
                  data-action="select-idea"
                  data-idea-id="${idea.id}"
                  aria-pressed="${idea.id === state.selectedIdeaId ? 'true' : 'false'}"
                  title="#${idea.id} ${escapeHtml(idea.name)}"
                >
                  <span class="mono">#${idea.id}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- 2D Precision Cartesian Matrix Viewport -->
      <div class="stage-2d-wrap ${is3D ? 'is-hidden' : ''}" data-stage-2d>
        ${renderMatrixCanvas({
          ideas: state.ideas,
          selectedIdeaId: state.selectedIdeaId,
          readOnly: false,
        })}
      </div>
    </div>
  `;
}

/**
 * In-place DOM updater for the 2D matrix & keyboard node strip so markers animate
 * smoothly without destroying the live WebGL canvas in the sibling container!
 */
function updatePriorityMatrixInPlace(rootEl, state) {
  const stage = rootEl.querySelector('.studio-matrix-stage');
  if (!stage) return false;

  const stats = computeSummaryStats(state.ideas);
  const positions = computeMarkerPositions(state.ideas);

  // Sync top status flag
  const simFlag = stage.querySelector('[data-matrix-sim-flag]');
  if (simFlag) {
    if (stats.hasModifications) {
      simFlag.className = 'sim-inline-flag';
      simFlag.textContent = `Simulasi · ${stats.modifiedCount} diubah`;
    } else {
      simFlag.className = 'mono-quiet';
      simFlag.textContent = 'EXACT LKPD SCORES';
    }
  }

  // Sync keyboard node strip
  stage.querySelectorAll('[data-kbd-node-strip] .kbd-node-btn').forEach((btn) => {
    const id = Number(btn.dataset.ideaId);
    const idea = state.ideas.find((i) => i.id === id);
    if (!idea) return;
    const q = getQuadrantMeta(idea.feasibility, idea.impact);
    const isSel = id === state.selectedIdeaId;
    btn.className = `kbd-node-btn kbd-node-btn--${q.colorKey} ${isSel ? 'is-selected' : ''} ${idea.isOriginalFinalSelection ? 'is-trio' : ''}`;
    btn.setAttribute('aria-pressed', isSel ? 'true' : 'false');
  });

  // Sync 2D Matrix elements
  const plane = stage.querySelector('[data-matrix-canvas="workspace"]');
  if (!plane) return true;

  for (const [qId, count] of Object.entries(stats.countsByQuadrant)) {
    const countEl = plane.querySelector(`[data-quadrant-count="${qId}"]`);
    if (countEl) countEl.textContent = String(count);
  }

  const anchorsLayer = plane.querySelector('[data-anchors-layer]');
  if (anchorsLayer) {
    anchorsLayer.innerHTML = renderCoincidentAnchors(state.ideas, positions);
  }

  const coincidentSlot = stage.querySelector('[data-coincident-slot]');
  if (coincidentSlot) {
    coincidentSlot.innerHTML = renderCoincidentStrip(state.ideas, state.selectedIdeaId, false);
  }

  for (const idea of state.ideas) {
    const marker = plane.querySelector(`[data-marker-id="${idea.id}"]`);
    const pos = positions.get(idea.id);
    if (!marker || !pos) continue;

    const quadrant = getQuadrantMeta(idea.feasibility, idea.impact);
    const total = getTotalScore(idea.feasibility, idea.impact);
    const isModified = idea.feasibility !== idea.originalFeasibility || idea.impact !== idea.originalImpact;
    const isSelected = idea.id === state.selectedIdeaId;

    marker.style.left = `${pos.baseX}%`;
    marker.style.bottom = `${pos.baseY}%`;
    marker.style.setProperty('--ox', `${pos.offsetX}px`);
    marker.style.setProperty('--oy', `${pos.offsetY}px`);

    marker.className = `mnode mnode--${quadrant.colorKey} ${isSelected ? 'is-selected' : ''} ${idea.isOriginalFinalSelection ? 'is-trio' : ''} ${isModified ? 'is-modified' : ''}`;
    marker.setAttribute('aria-pressed', isSelected ? 'true' : 'false');

    let simDot = marker.querySelector('.mnode__sim');
    if (isModified && !simDot) {
      simDot = document.createElement('span');
      simDot.className = 'mnode__sim';
      simDot.title = 'Skor Simulasi';
      simDot.setAttribute('aria-hidden', 'true');
      const tip = marker.querySelector('.mtooltip');
      marker.insertBefore(simDot, tip);
    } else if (!isModified && simDot) {
      simDot.remove();
    }

    const tooltip = marker.querySelector('.mtooltip');
    if (tooltip) {
      const placement = idea.impact >= 5 ? 'mtooltip--below' : 'mtooltip--above';
      const align = idea.feasibility <= 1 ? 'mtooltip--left' : idea.feasibility >= 5 ? 'mtooltip--right' : '';
      tooltip.className = `mtooltip ${placement} ${align}`;
      tooltip.innerHTML = `
        <span class="mtooltip__head mono">
          <span>#${String(idea.id).padStart(2, '0')}</span>
          <span>${quadrant.roman} · ${quadrant.name}</span>
        </span>
        <strong class="mtooltip__name">${escapeHtml(idea.name)}</strong>
        <span class="mtooltip__scores mono">
          <span>F: <b>${idea.feasibility}/5</b></span>
          <span>I: <b>${idea.impact}/5</b></span>
          <span>Total: <b>${total}/10</b></span>
        </span>
        ${isModified ? `<span class="mtooltip__sim mono">Simulasi (asli ${idea.originalFeasibility}/${idea.originalImpact})</span>` : ''}
      `;
    }
  }

  return true;
}

/**
 * Sync 3D vs 2D viewport visibility and toolbar buttons cleanly in-place so the
 * WebGL context stays alive and instant across toggles.
 */
function syncMatrixViewModeInPlace(rootEl, state) {
  const stage = rootEl.querySelector('.studio-matrix-stage');
  if (!stage) return false;

  const is3D = state.viewMode === '3d';
  const stage3d = stage.querySelector('[data-stage-3d]');
  const stage2d = stage.querySelector('[data-stage-2d]');
  if (!stage3d || !stage2d) return false;

  stage3d.classList.toggle('is-hidden', !is3D);
  stage2d.classList.toggle('is-hidden', is3D);

  stage.querySelectorAll('[data-action="set-view-mode"]').forEach((btn) => {
    const active = btn.dataset.viewMode === state.viewMode;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
    if (btn.dataset.viewMode === '3d') {
      btn.disabled = state.webglStatus === 'unavailable';
    }
  });

  stage.querySelectorAll('[data-action="camera-preset"]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.preset === state.cameraPreset);
  });

  // Update toolbar right-of-toggle controls cleanly
  const leftBar = stage.querySelector('.studio-toolbar__left');
  const existingCam = leftBar?.querySelector('.camera-controls');
  const existingHint = leftBar?.querySelector('.toolbar-hint');
  if (is3D) {
    if (existingHint) existingHint.remove();
    if (!existingCam && leftBar) {
      leftBar.insertAdjacentHTML('beforeend', `
        <div class="camera-controls" role="group" aria-label="Sudut kamera 3D">
          <button type="button" class="cam-btn ${state.cameraPreset === 'iso' ? 'is-active' : ''}" data-action="camera-preset" data-preset="iso">Isometric</button>
          <button type="button" class="cam-btn ${state.cameraPreset === 'front' ? 'is-active' : ''}" data-action="camera-preset" data-preset="front">Front X/Y</button>
          <button type="button" class="cam-btn ${state.cameraPreset === 'top' ? 'is-active' : ''}" data-action="camera-preset" data-preset="top">Depth View</button>
        </div>
      `);
    }
  } else {
    if (existingCam) existingCam.remove();
    if (!existingHint && leftBar) {
      leftBar.insertAdjacentHTML('beforeend', '<span class="toolbar-hint">Drag pin antar kuadran untuk simulasi · Klik untuk inspeksi</span>');
    }
  }

  // Show fallback notice if WebGL is unavailable
  const existingFallback = stage.querySelector('.fallback-notice');
  if (state.webglStatus === 'unavailable' && !existingFallback) {
    const toolbar = stage.querySelector('.studio-toolbar');
    toolbar?.insertAdjacentHTML('afterend', `
      <div class="fallback-notice" role="status">
        ${icon('alert', 15)}
        <span>WebGL tidak aktif di perangkat ini — menampilkan <strong>2D Cartesian Matrix</strong> sebagai fallback penuh.</span>
      </div>
    `);
  }

  return true;
}

/**
 * Attach HTML5 drag-and-drop simulation events for the 2D Matrix.
 */
function bindMatrixDragEvents(rootEl, store) {
  let draggedIdeaId = null;

  rootEl.addEventListener('dragstart', (event) => {
    const marker = event.target.closest('[data-marker-id][draggable="true"]');
    if (!marker) return;
    draggedIdeaId = Number(marker.dataset.markerId);
    marker.classList.add('is-dragging');
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(draggedIdeaId));
    }
  });

  rootEl.addEventListener('dragend', () => {
    draggedIdeaId = null;
    rootEl.querySelectorAll('.is-dragging').forEach((el) => el.classList.remove('is-dragging'));
    rootEl.querySelectorAll('.is-drop-target').forEach((el) => el.classList.remove('is-drop-target'));
  });

  rootEl.addEventListener('dragover', (event) => {
    const dropZone = event.target.closest('[data-drop-quadrant]');
    if (!dropZone) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';

    rootEl.querySelectorAll('.is-drop-target').forEach((el) => {
      if (el !== dropZone) el.classList.remove('is-drop-target');
    });
    dropZone.classList.add('is-drop-target');
  });

  rootEl.addEventListener('dragleave', (event) => {
    const dropZone = event.target.closest('[data-drop-quadrant]');
    if (!dropZone) return;
    if (!dropZone.contains(event.relatedTarget)) {
      dropZone.classList.remove('is-drop-target');
    }
  });

  rootEl.addEventListener('drop', (event) => {
    const dropZone = event.target.closest('[data-drop-quadrant]');
    if (!dropZone) return;
    event.preventDefault();
    dropZone.classList.remove('is-drop-target');

    const targetQuadrant = dropZone.dataset.dropQuadrant;
    const transferId = event.dataTransfer ? Number(event.dataTransfer.getData('text/plain')) : null;
    const ideaId = draggedIdeaId || transferId;
    if (!ideaId || !targetQuadrant) return;

    const plane = rootEl.querySelector('.matrix2d-plane');
    let dropCoords = null;
    if (plane) {
      const rect = plane.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const percentX = ((event.clientX - rect.left) / rect.width) * 100;
        const percentY = ((rect.bottom - event.clientY) / rect.height) * 100;
        dropCoords = { percentX, percentY };
      }
    }

    store.moveIdeaToQuadrant(ideaId, targetQuadrant, dropCoords, 'drag');
    draggedIdeaId = null;
  });
}

// --- src/components/IdeaInspector.js ---
/**
 * IdeaInspector — Docked architectural strategy-studio inspector & score simulator.
 * Displays canonical LKPD 5 data, tabular monospace scores, original vs simulated diff,
 * accessible sliders & discrete 1–5 controls, keyboard quadrant movers, and source notes.
 */




// uses shared escapeHtml

function renderScoreStepButtons(axis, currentValue, ideaId) {
  return [1, 2, 3, 4, 5].map((num) => `
    <button
      type="button"
      class="step-num mono ${currentValue === num ? 'is-active' : ''}"
      data-action="set-axis-score"
      data-idea-id="${ideaId}"
      data-axis="${axis}"
      data-value="${num}"
      aria-label="Atur ${axis === 'feasibility' ? 'Feasibility' : 'Impact'} ke ${num}"
    >${num}</button>
  `).join('');
}

function renderIdeaInspector(state) {
  const idea = state.ideas.find((item) => item.id === state.selectedIdeaId) || state.ideas[0];
  const stats = computeSummaryStats(state.ideas);
  const currentQ = getQuadrantMeta(idea.feasibility, idea.impact);
  const origQ = getQuadrantMeta(idea.originalFeasibility, idea.originalImpact);
  const currentTotal = getTotalScore(idea.feasibility, idea.impact);
  const origTotal = getTotalScore(idea.originalFeasibility, idea.originalImpact);
  const currentQuadrantId = getQuadrantId(idea.feasibility, idea.impact);

  const buyerLabel = {
    direct: 'Direct Benefit',
    indirect: 'Internal Control',
    'not-specified': 'Not Specified in LKPD',
  }[idea.buyerBenefitStatus];

  return `
    <aside class="studio-inspector" aria-label="Inspektor Detail Ide" data-inspector-idea-id="${idea.id}">
      <div class="inspector-head">
        <div class="inspector-head__meta mono">
          <span class="inspector-index">IDEA #${String(idea.id).padStart(2, '0')}</span>
          <span class="meta-sep">/</span>
          <span>${escapeHtml(idea.scamper)}</span>
        </div>

        ${idea.isOriginalFinalSelection ? `
          <div class="inspector-selected-flag">
            <span class="q-dot q-dot--mint"></span>
            <span>Selected Concept · <strong>${escapeHtml(idea.conceptName)}</strong></span>
          </div>
        ` : ''}

        <h2 class="inspector-name">${escapeHtml(idea.name)}</h2>
      </div>

      <!-- Tabular Score Bar -->
      <div class="inspector-metrics">
        <div class="im-cell">
          <span class="im-cell__label mono">FEASIBILITY</span>
          <strong class="im-cell__val mono" data-tile="feasibility">${idea.feasibility}<small>/5</small></strong>
        </div>
        <div class="im-cell">
          <span class="im-cell__label mono">IMPACT</span>
          <strong class="im-cell__val mono" data-tile="impact">${idea.impact}<small>/5</small></strong>
        </div>
        <div class="im-cell">
          <span class="im-cell__label mono">TOTAL</span>
          <strong class="im-cell__val mono" data-tile="total">${currentTotal}<small>/10</small></strong>
        </div>
      </div>

      <div class="inspector-quad-strip inspector-quad-strip--${currentQ.colorKey}" data-tile="quadrant-box">
        <span class="q-dot q-dot--${currentQ.colorKey}"></span>
        <strong data-tile="quadrant">Kuadran ${currentQ.roman} · ${currentQ.name}</strong>
        <span class="inspector-sim-state mono ${idea.isModified ? 'is-sim' : ''}" data-inspector-sim-badge>
          ${idea.isModified ? 'SIMULASI' : 'LKPD ASLI'}
        </span>
      </div>

      <!-- Original vs Simulated Diff -->
      <div class="inspector-diff ${idea.isModified ? '' : 'is-hidden'}" data-score-comparison role="status">
        <div class="inspector-diff__row mono">
          <span class="diff-k">ASLI LKPD</span>
          <span>F:${idea.originalFeasibility} · I:${idea.originalImpact} · Total ${origTotal}/10 (${origQ.roman})</span>
        </div>
        <div class="inspector-diff__row inspector-diff__row--sim mono">
          <span class="diff-k">SIMULASI</span>
          <span data-comp-current>F:${idea.feasibility} · I:${idea.impact} · Total ${currentTotal}/10 (${currentQ.roman})</span>
        </div>
      </div>

      <!-- Live Score Simulator -->
      <div class="inspector-sim" aria-labelledby="simulator-heading">
        <div class="inspector-sim__head">
          <h3 id="simulator-heading" class="sub-eyebrow mono">SCORE SIMULATOR</h3>
          <div class="inspector-sim__reset-row">
            <button
              type="button"
              class="text-action-btn"
              data-action="reset-idea"
              data-idea-id="${idea.id}"
              data-btn-reset-idea
              ${idea.isModified ? '' : 'disabled'}
            >${icon('reset', 12)} Reset #${idea.id}</button>
            <button
              type="button"
              class="text-action-btn"
              data-action="reset-all"
              data-btn-reset-all
              ${stats.hasModifications ? '' : 'disabled'}
            >Reset all</button>
          </div>
        </div>

        <div class="sim-control">
          <div class="sim-control__row">
            <label for="feasibility-range">Feasibility <span class="mono muted-inline">(X)</span></label>
            <span class="mono sim-control__val" data-readout="feasibility">${idea.feasibility} / 5</span>
          </div>
          <input
            id="feasibility-range"
            class="studio-range"
            type="range"
            min="1"
            max="5"
            step="1"
            value="${idea.feasibility}"
            data-sim-slider="feasibility"
            data-idea-id="${idea.id}"
            aria-valuetext="${idea.feasibility} dari 5 (${idea.feasibility >= 4 ? 'Tinggi' : 'Rendah'})"
          />
          <div class="step-strip" data-step-row="feasibility">
            ${renderScoreStepButtons('feasibility', idea.feasibility, idea.id)}
          </div>
        </div>

        <div class="sim-control">
          <div class="sim-control__row">
            <label for="impact-range">Impact <span class="mono muted-inline">(Y)</span></label>
            <span class="mono sim-control__val" data-readout="impact">${idea.impact} / 5</span>
          </div>
          <input
            id="impact-range"
            class="studio-range studio-range--emerald"
            type="range"
            min="1"
            max="5"
            step="1"
            value="${idea.impact}"
            data-sim-slider="impact"
            data-idea-id="${idea.id}"
            aria-valuetext="${idea.impact} dari 5 (${idea.impact >= 4 ? 'Tinggi' : 'Rendah'})"
          />
          <div class="step-strip" data-step-row="impact">
            ${renderScoreStepButtons('impact', idea.impact, idea.id)}
          </div>
        </div>

        <div class="qmove-block" role="group" aria-label="Pindah cepat ke kuadran">
          <span class="qmove-block__label mono">MOVE TO QUADRANT (KEYBOARD ALT.)</span>
          <div class="qmove-grid" data-quadrant-mover-grid>
            ${QUADRANT_IDS.map((qId) => {
              const q = QUADRANTS[qId];
              return `
                <button
                  type="button"
                  class="qmove-btn ${currentQuadrantId === qId ? 'is-current' : ''}"
                  data-action="move-to-quadrant"
                  data-idea-id="${idea.id}"
                  data-target-quadrant="${qId}"
                  aria-pressed="${currentQuadrantId === qId ? 'true' : 'false'}"
                >
                  <span class="q-dot q-dot--${q.colorKey}"></span>
                  <span class="mono">${q.roman}</span>
                  <span>${q.name}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Canonical LKPD Rationale & Benefits -->
      <div class="inspector-doc">
        <div class="doc-section">
          <h3 class="sub-eyebrow mono">LKPD RATIONALE</h3>
          <p class="doc-copy">${escapeHtml(idea.rationale)}</p>
          ${idea.scamperNote ? `<p class="doc-note">${escapeHtml(idea.scamperNote)}</p>` : ''}
        </div>

        <div class="doc-section">
          <div class="doc-section__head">
            <h3 class="sub-eyebrow mono">SELLER / ADMIN BENEFIT</h3>
          </div>
          <p class="doc-copy">${escapeHtml(idea.sellerBenefit)}</p>
        </div>

        <div class="doc-section">
          <div class="doc-section__head">
            <h3 class="sub-eyebrow mono">BUYER BENEFIT</h3>
            <span class="doc-tag mono">${buyerLabel}</span>
          </div>
          <p class="doc-copy">${escapeHtml(idea.buyerBenefit)}</p>
        </div>

        ${idea.sourceNote ? `
          <div class="inspector-callout inspector-callout--info">
            <strong>Catatan Sumber:</strong> ${escapeHtml(idea.sourceNote)}
          </div>
        ` : ''}

        ${idea.quadrantDiscrepancyNote ? `
          <div class="inspector-callout inspector-callout--warn">
            <strong>Transparansi Sumber (Ide #10):</strong> ${escapeHtml(idea.quadrantDiscrepancyNote)}
            <div class="inspector-callout__sub mono">Label asli LKPD: ${escapeHtml(idea.originalQuadrantLabel)}</div>
          </div>
        ` : `
          <p class="inspector-origin mono">LKPD TABLE LABEL: ${escapeHtml(idea.originalQuadrantLabel)}</p>
        `}
      </div>
    </aside>
  `;
}

/**
 * In-place DOM updater so dragging range sliders remains 60fps smooth without losing focus.
 */
function updateIdeaInspectorInPlace(rootEl, state) {
  const panel = rootEl.querySelector('[data-inspector-idea-id]');
  if (!panel) return false;

  const idea = state.ideas.find((item) => item.id === state.selectedIdeaId) || state.ideas[0];
  if (Number(panel.dataset.inspectorIdeaId) !== idea.id) return false;

  const stats = computeSummaryStats(state.ideas);
  const currentQ = getQuadrantMeta(idea.feasibility, idea.impact);
  const currentTotal = getTotalScore(idea.feasibility, idea.impact);

  const fTile = panel.querySelector('[data-tile="feasibility"]');
  const iTile = panel.querySelector('[data-tile="impact"]');
  const tTile = panel.querySelector('[data-tile="total"]');
  const qTile = panel.querySelector('[data-tile="quadrant"]');
  const qBox = panel.querySelector('[data-tile="quadrant-box"]');

  if (fTile) fTile.innerHTML = `${idea.feasibility}<small>/5</small>`;
  if (iTile) iTile.innerHTML = `${idea.impact}<small>/5</small>`;
  if (tTile) tTile.innerHTML = `${currentTotal}<small>/10</small>`;
  if (qTile) qTile.textContent = `Kuadran ${currentQ.roman} · ${currentQ.name}`;
  if (qBox) {
    qBox.className = `inspector-quad-strip inspector-quad-strip--${currentQ.colorKey}`;
    const dot = qBox.querySelector('.q-dot');
    if (dot) dot.className = `q-dot q-dot--${currentQ.colorKey}`;
  }

  const simBadge = panel.querySelector('[data-inspector-sim-badge]');
  if (simBadge) {
    simBadge.classList.toggle('is-sim', idea.isModified);
    simBadge.textContent = idea.isModified ? 'SIMULASI' : 'LKPD ASLI';
  }

  const compBox = panel.querySelector('[data-score-comparison]');
  if (compBox) {
    compBox.classList.toggle('is-hidden', !idea.isModified);
    const compCurr = compBox.querySelector('[data-comp-current]');
    if (compCurr) {
      compCurr.textContent = `F:${idea.feasibility} · I:${idea.impact} · Total ${currentTotal}/10 (${currentQ.roman})`;
    }
  }

  const fSlider = panel.querySelector('[data-sim-slider="feasibility"]');
  const iSlider = panel.querySelector('[data-sim-slider="impact"]');
  if (fSlider && Number(fSlider.value) !== idea.feasibility) fSlider.value = String(idea.feasibility);
  if (iSlider && Number(iSlider.value) !== idea.impact) iSlider.value = String(idea.impact);

  const fReadout = panel.querySelector('[data-readout="feasibility"]');
  const iReadout = panel.querySelector('[data-readout="impact"]');
  if (fReadout) fReadout.textContent = `${idea.feasibility} / 5`;
  if (iReadout) iReadout.textContent = `${idea.impact} / 5`;

  panel.querySelectorAll('[data-step-row="feasibility"] .step-num').forEach((btn) => {
    btn.classList.toggle('is-active', Number(btn.dataset.value) === idea.feasibility);
  });
  panel.querySelectorAll('[data-step-row="impact"] .step-num').forEach((btn) => {
    btn.classList.toggle('is-active', Number(btn.dataset.value) === idea.impact);
  });

  panel.querySelectorAll('[data-quadrant-mover-grid] .qmove-btn').forEach((btn) => {
    const active = btn.dataset.targetQuadrant === currentQ.id;
    btn.classList.toggle('is-current', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  const resetOne = panel.querySelector('[data-btn-reset-idea]');
  const resetAll = panel.querySelector('[data-btn-reset-all]');
  if (resetOne) resetOne.disabled = !idea.isModified;
  if (resetAll) resetAll.disabled = !stats.hasModifications;

  return true;
}

// --- src/components/DecisionLenses.js ---
/**
 * DecisionLenses — Four complementary data views derived strictly from the same
 * canonical LKPD Feasibility (1–5) and Impact (1–5) scores:
 *   1. Full Portfolio Matrix
 *   2. Priority Matrix (original 3 selected highlighted, other 7 ghosted)
 *   3. Quadrant Comparison (4 synchronized mini-matrices)
 *   4. Total-Score Ranking (Feasibility + Impact with ties preserved)
 */




// uses shared escapeHtml

const LENS_TABS = [
  { id: 'portfolio', label: 'Full Portfolio', icon: 'grid', desc: 'Seluruh 10 ide pada satu bidang koordinat.' },
  { id: 'priority', label: 'Priority Focus', icon: 'target', desc: 'Menyorot 3 konsep terpilih asli LKPD dengan 7 ide lain sebagai konteks.' },
  { id: 'quadrants', label: 'Quadrant Comparison', icon: 'layers', desc: 'Empat mini-matriks untuk membandingkan isi tiap kuadran secara terpisah.' },
  { id: 'ranking', label: 'Score Ranking', icon: 'bars', desc: 'Peringkat skor total (Feasibility + Impact) dengan nilai seri dipertahankan.' },
];

/**
 * Reusable compact SVG/CSS coordinate plot for Portfolio, Priority Focus, and Quadrant Mini-Matrices.
 */
function renderLensPlot({ ideas, selectedIdeaId, mode = 'portfolio', focusQuadrantId = null }) {
  const positions = computeMarkerPositions(ideas);
  const gridTicks = [1, 2, 3, 4, 5];

  const dotsHtml = ideas.map((idea) => {
    const pos = positions.get(idea.id);
    const q = getQuadrantMeta(idea.feasibility, idea.impact);
    const total = getTotalScore(idea.feasibility, idea.impact);
    const isSelected = idea.id === selectedIdeaId;

    let isGhosted = false;
    if (mode === 'priority') {
      isGhosted = !idea.isOriginalFinalSelection;
    } else if (mode === 'mini' && focusQuadrantId) {
      isGhosted = q.id !== focusQuadrantId;
    }

    const offsetScale = mode === 'mini' ? 0.55 : 0.85;
    const ox = Math.round(pos.offsetX * offsetScale);
    const oy = Math.round(pos.offsetY * offsetScale);

    return `
      <button
        type="button"
        class="lens-node lens-node--${q.colorKey} ${isGhosted ? 'is-ghosted' : ''} ${isSelected ? 'is-selected' : ''} ${idea.isOriginalFinalSelection ? 'is-trio' : ''}"
        style="left: ${pos.baseX}%; bottom: ${pos.baseY}%; --ox: ${ox}px; --oy: ${oy}px;"
        data-action="select-idea"
        data-idea-id="${idea.id}"
        title="#${idea.id} ${escapeHtml(idea.name)} (F:${idea.feasibility}, I:${idea.impact}, Total:${total})"
        aria-label="Pilih Ide ${idea.id}: ${escapeHtml(idea.shortLabel)}, Feasibility ${idea.feasibility}, Impact ${idea.impact}"
      >
        <span class="mono">${idea.id}</span>
        ${mode !== 'mini' && !isGhosted ? `<span class="lens-node__tag">${escapeHtml(idea.conceptName || idea.shortLabel)}</span>` : ''}
      </button>
    `;
  }).join('');

  return `
    <div class="lens-plot ${mode === 'mini' ? 'lens-plot--mini' : ''}" role="img" aria-label="Plot koordinat Feasibility versus Impact">
      <div class="lens-plot__quads" style="--split: ${THRESHOLD_PERCENT}%;">
        <div class="lens-quad ${focusQuadrantId === 'III' ? 'is-active-quad is-amber' : ''}"></div>
        <div class="lens-quad ${focusQuadrantId === 'I' || mode === 'priority' ? 'is-active-quad is-emerald' : ''}"></div>
        <div class="lens-quad ${focusQuadrantId === 'IV' ? 'is-active-quad is-coral' : ''}"></div>
        <div class="lens-quad ${focusQuadrantId === 'II' ? 'is-active-quad is-blue' : ''}"></div>
      </div>

      ${gridTicks.map((t) => `
        <span class="lens-grid-v" style="left: ${scoreToPercentX(t)}%;" aria-hidden="true"></span>
        <span class="lens-grid-h" style="bottom: ${scoreToPercentY(t)}%;" aria-hidden="true"></span>
      `).join('')}

      <span class="lens-threshold-v" style="left: ${THRESHOLD_PERCENT}%;" aria-hidden="true"></span>
      <span class="lens-threshold-h" style="bottom: ${THRESHOLD_PERCENT}%;" aria-hidden="true"></span>

      ${mode !== 'mini' ? `
        <span class="lens-qlabel lens-qlabel--tl">III · Tantangan</span>
        <span class="lens-qlabel lens-qlabel--tr">I · Prioritas Utama</span>
        <span class="lens-qlabel lens-qlabel--bl">IV · Prioritas Rendah</span>
        <span class="lens-qlabel lens-qlabel--br">II · Quick Wins</span>
      ` : ''}

      <div class="lens-nodes-layer">
        ${dotsHtml}
      </div>

      ${mode !== 'mini' ? `
        <div class="lens-axis-x mono" aria-hidden="true">
          ${gridTicks.map((t) => `<span style="left: ${scoreToPercentX(t)}%;">${t}</span>`).join('')}
        </div>
        <div class="lens-axis-y mono" aria-hidden="true">
          ${gridTicks.map((t) => `<span style="bottom: ${scoreToPercentY(t)}%;">${t}</span>`).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function renderPortfolioLens(state) {
  const grouped = groupIdeasByQuadrant(state.ideas);
  return `
    <div class="lens-split">
      <div class="lens-split__visual">
        ${renderLensPlot({ ideas: state.ideas, selectedIdeaId: state.selectedIdeaId, mode: 'portfolio' })}
        <div class="lens-axis-footer mono">
          <span>X: FEASIBILITY (1 → 5)</span>
          <span>THRESHOLD: 3.5</span>
          <span>Y: IMPACT (1 → 5)</span>
        </div>
      </div>

      <div class="lens-split__aside">
        <h3 class="lens-aside-title">Distribusi Portofolio Lengkap</h3>
        <p class="lens-aside-desc">
          Semua 10 ide ditempatkan secara proporsional pada rentang skor 1–5 tanpa skala distorsi.
          Garis putus menandai ambang batas <strong>3.5</strong> (Rendah 1–3 vs Tinggi 4–5).
        </p>

        <div class="lens-breakdown-list">
          ${QUADRANT_IDS.map((qId) => {
            const q = QUADRANTS[qId];
            const items = grouped[qId];
            return `
              <div class="lens-breakdown-row">
                <div class="lens-breakdown-row__top">
                  <span class="q-dot q-dot--${q.colorKey}"></span>
                  <strong>${q.roman} · ${q.name}</strong>
                  <span class="mono lens-breakdown-count">${items.length} ide</span>
                </div>
                <div class="lens-breakdown-ids">
                  ${items.length > 0
                    ? items.map((idea) => `
                        <button
                          type="button"
                          class="inline-id-btn ${idea.id === state.selectedIdeaId ? 'is-selected' : ''}"
                          data-action="select-idea"
                          data-idea-id="${idea.id}"
                        >
                          <span class="mono">#${idea.id}</span> ${escapeHtml(idea.shortLabel)}
                        </button>
                      `).join('')
                    : '<span class="muted-text">Tidak ada ide pada kuadran ini</span>'}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderPriorityLens(state) {
  const trio = state.ideas.filter((i) => i.isOriginalFinalSelection);
  const others = state.ideas.filter((i) => !i.isOriginalFinalSelection);

  return `
    <div class="lens-split">
      <div class="lens-split__visual">
        ${renderLensPlot({ ideas: state.ideas, selectedIdeaId: state.selectedIdeaId, mode: 'priority' })}
        <div class="lens-axis-footer mono">
          <span>HIGHLIGHT: 3 KONSEP ASLI LKPD</span>
          <span>GHOSTED: 7 IDE KONTEKS</span>
        </div>
      </div>

      <div class="lens-split__aside">
        <h3 class="lens-aside-title">Fokus Tiga Ide Prioritas Utama</h3>
        <p class="lens-aside-desc">
          Menampilkan secara kontras mengapa <strong>Ide #1, #2, dan #3</strong> terpilih di sudut kanan atas
          (Feasibility 4–5, Impact 5), sementara 7 ide lain dipertahankan secara samar untuk konteks perbandingan.
        </p>

        <div class="priority-focus-list">
          ${trio.map((idea) => {
            const total = getTotalScore(idea.feasibility, idea.impact);
            return `
              <button
                type="button"
                class="priority-focus-item ${idea.id === state.selectedIdeaId ? 'is-selected' : ''}"
                data-action="select-idea"
                data-idea-id="${idea.id}"
              >
                <div class="priority-focus-item__head">
                  <span class="mono priority-focus-id">#0${idea.id}</span>
                  <strong>${escapeHtml(idea.conceptName)}</strong>
                  <span class="mono priority-focus-score">F:${idea.feasibility} · I:${idea.impact} · ${total}/10</span>
                </div>
                <span class="priority-focus-sub">${escapeHtml(idea.name)}</span>
              </button>
            `;
          }).join('')}
        </div>

        <p class="lens-footnote">
          7 ide konteks lain (${others.map((o) => `#${o.id}`).join(', ')}) tetap dapat diklik langsung pada plot.
        </p>
      </div>
    </div>
  `;
}

function renderQuadrantsLens(state) {
  const grouped = groupIdeasByQuadrant(state.ideas);

  return `
    <div class="mini-matrices-grid">
      ${QUADRANT_IDS.map((qId) => {
        const q = QUADRANTS[qId];
        const items = grouped[qId];
        return `
          <article class="mini-matrix-panel">
            <div class="mini-matrix-panel__head">
              <div class="mini-matrix-title-row">
                <span class="q-dot q-dot--${q.colorKey}"></span>
                <h3>${q.roman} · ${q.name}</h3>
                <span class="mono mini-matrix-count">${items.length}</span>
              </div>
              <p class="mini-matrix-rule mono">${q.shortDesc}</p>
            </div>

            ${renderLensPlot({
              ideas: state.ideas,
              selectedIdeaId: state.selectedIdeaId,
              mode: 'mini',
              focusQuadrantId: qId,
            })}

            <ul class="mini-matrix-list">
              ${items.length > 0
                ? items.map((idea) => `
                    <li>
                      <button
                        type="button"
                        class="mini-list-btn ${idea.id === state.selectedIdeaId ? 'is-selected' : ''}"
                        data-action="select-idea"
                        data-idea-id="${idea.id}"
                      >
                        <span class="mono mini-list-id">#${idea.id}</span>
                        <span class="mini-list-name">${escapeHtml(idea.shortLabel)}</span>
                        <span class="mono mini-list-coord">(${idea.feasibility},${idea.impact})</span>
                      </button>
                    </li>
                  `).join('')
                : '<li class="mini-list-empty">Tidak ada ide pada kuadran ini saat ini.</li>'}
            </ul>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

function renderRankingLens(state) {
  const ranked = computeScoreRanking(state.ideas);

  return `
    <div class="ranking-panel">
      <div class="ranking-panel__header">
        <div>
          <h3 class="lens-aside-title">Peringkat Skor Total (Feasibility + Impact)</h3>
          <p class="lens-aside-desc">
            Tampilan turunan dari penjumlahan dua skor asli LKPD—bukan kriteria penilaian baru.
            Nilai seri (tie) diberi nomor peringkat yang sama secara transparan.
          </p>
        </div>
        <div class="ranking-legend mono">
          <span><i class="bar-swatch bar-swatch--f"></i> Feasibility (maks 5)</span>
          <span><i class="bar-swatch bar-swatch--i"></i> Impact (maks 5)</span>
        </div>
      </div>

      <div class="ranking-rows">
        ${ranked.map(({ idea, total, quadrant, rank, isTied }) => {
          const fWidth = (idea.feasibility / 10) * 100;
          const iWidth = (idea.impact / 10) * 100;
          const isSelected = idea.id === state.selectedIdeaId;

          return `
            <button
              type="button"
              class="ranking-row ${isSelected ? 'is-selected' : ''}"
              data-action="select-idea"
              data-idea-id="${idea.id}"
            >
              <div class="ranking-row__rank mono">
                <span class="rank-num">${String(rank).padStart(2, '0')}</span>
                ${isTied ? '<span class="rank-tie">TIE</span>' : ''}
              </div>

              <div class="ranking-row__meta">
                <div class="ranking-row__title-line">
                  <span class="mono ranking-id">#${idea.id}</span>
                  <strong class="ranking-name">${escapeHtml(idea.name)}</strong>
                  ${idea.isOriginalFinalSelection ? `<span class="trio-inline-tag">${escapeHtml(idea.conceptName)}</span>` : ''}
                  ${idea.isModified ? '<span class="sim-micro-tag">Simulasi</span>' : ''}
                </div>
                <div class="ranking-bar-track" aria-hidden="true">
                  <span class="ranking-bar-seg ranking-bar-seg--f" style="width: ${fWidth}%;"></span>
                  <span class="ranking-bar-seg ranking-bar-seg--i ranking-bar-seg--${quadrant.colorKey}" style="width: ${iWidth}%;"></span>
                </div>
              </div>

              <div class="ranking-row__scores mono">
                <span class="ranking-breakdown">F:${idea.feasibility} + I:${idea.impact}</span>
                <strong class="ranking-total">${total}<small>/10</small></strong>
                <span class="ranking-quad ranking-quad--${quadrant.colorKey}">${quadrant.roman}</span>
              </div>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderDecisionLenses(state) {
  const activeLens = state.activeLens || 'portfolio';
  const activeMeta = LENS_TABS.find((t) => t.id === activeLens) || LENS_TABS[0];

  let bodyHtml = '';
  if (activeLens === 'priority') bodyHtml = renderPriorityLens(state);
  else if (activeLens === 'quadrants') bodyHtml = renderQuadrantsLens(state);
  else if (activeLens === 'ranking') bodyHtml = renderRankingLens(state);
  else bodyHtml = renderPortfolioLens(state);

  return `
    <section id="lenses-section" class="editorial-section" aria-labelledby="lenses-heading">
      <div class="section-head-row">
        <div>
          <span class="section-index mono">02 / DECISION LENSES</span>
          <h2 id="lenses-heading" class="section-heading">Four perspectives on the same LKPD data</h2>
          <p class="section-subcopy">${activeMeta.desc}</p>
        </div>

        <div class="segmented-tabs" role="tablist" aria-label="Pilihan tampilan analisis matriks">
          ${LENS_TABS.map((tab) => `
            <button
              type="button"
              role="tab"
              aria-selected="${activeLens === tab.id ? 'true' : 'false'}"
              class="segmented-tab ${activeLens === tab.id ? 'is-active' : ''}"
              data-action="set-lens"
              data-lens="${tab.id}"
            >
              ${icon(tab.icon, 14)}
              <span>${tab.label}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="lens-stage" data-lens-stage>
        ${bodyHtml}
      </div>
    </section>
  `;
}

// --- src/components/IdeaExplorer.js ---
/**
 * IdeaExplorer — Clean architectural data table of all 10 LKPD ideas.
 * Synchronizes selection with the 3D Space, 2D Matrix, Decision Lenses, and Inspector.
 */




const SCAMPER_OPTIONS = [
  { value: 'all', label: 'All SCAMPER' },
  { value: 'S', label: 'S — Substitute' },
  { value: 'C', label: 'C — Combine' },
  { value: 'M', label: 'M — Modify' },
  { value: 'P', label: 'P — Put to Another Use' },
  { value: 'E', label: 'E — Eliminate' },
  { value: 'R', label: 'R — Reverse' },
  { value: 'NONE', label: 'Not specified in SCAMPER' },
];

// uses shared escapeHtml

function filterIdeas(ideas, filters) {
  const q = (filters.search || '').trim().toLowerCase();
  return ideas.filter((idea) => {
    const qId = getQuadrantId(idea.feasibility, idea.impact);
    if (filters.quadrant !== 'all' && qId !== filters.quadrant) return false;
    if (filters.scamper !== 'all' && idea.scamperCode !== filters.scamper) return false;
    if (q) {
      const hay = `${idea.id} ${idea.name} ${idea.shortLabel} ${idea.conceptName || ''} ${idea.scamper} ${idea.rationale}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderExplorerRows(state) {
  const filtered = filterIdeas(state.ideas, state.filters);
  if (filtered.length === 0) {
    return `
      <div class="explorer-empty">
        <p>Tidak ada ide yang cocok dengan kriteria filter saat ini.</p>
        <button type="button" class="btn btn--outline btn--sm" data-action="clear-filters">
          Tampilkan semua 10 ide
        </button>
      </div>
    `;
  }

  return `
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th scope="col" class="col-num">No</th>
            <th scope="col">Idea Name</th>
            <th scope="col">SCAMPER</th>
            <th scope="col" class="col-score">Feasibility</th>
            <th scope="col" class="col-score">Impact</th>
            <th scope="col" class="col-score">Total</th>
            <th scope="col">Quadrant</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map((idea) => {
            const q = getQuadrantMeta(idea.feasibility, idea.impact);
            const total = getTotalScore(idea.feasibility, idea.impact);
            const isSelected = idea.id === state.selectedIdeaId;

            return `
              <tr
                class="data-row ${isSelected ? 'is-selected' : ''}"
                data-action="select-idea-from-list"
                data-idea-id="${idea.id}"
              >
                <td class="col-num mono">#${String(idea.id).padStart(2, '0')}</td>
                <td>
                  <button
                    type="button"
                    class="row-trigger"
                    data-action="select-idea-from-list"
                    data-idea-id="${idea.id}"
                    aria-pressed="${isSelected ? 'true' : 'false'}"
                  >
                    <span class="row-trigger__title">${escapeHtml(idea.name)}</span>
                    <span class="row-trigger__flags">
                      ${idea.isOriginalFinalSelection ? `<span class="trio-inline-tag">${escapeHtml(idea.conceptName)}</span>` : ''}
                      ${idea.isModified ? `<span class="sim-micro-tag">Simulasi (asli ${idea.originalFeasibility}/${idea.originalImpact})</span>` : ''}
                      ${idea.id === 10 ? `<span class="source-micro-tag">LKPD label: Prioritas Rendah</span>` : ''}
                    </span>
                  </button>
                </td>
                <td class="col-scamper">${escapeHtml(idea.scamper)}</td>
                <td class="col-score mono"><strong>${idea.feasibility}</strong><span class="muted-inline">/5</span></td>
                <td class="col-score mono"><strong>${idea.impact}</strong><span class="muted-inline">/5</span></td>
                <td class="col-score mono"><strong>${total}</strong><span class="muted-inline">/10</span></td>
                <td class="col-quad">
                  <span class="quad-inline">
                    <span class="q-dot q-dot--${q.colorKey}"></span>
                    <span class="mono">${q.roman}</span>
                    <span>${q.name}</span>
                  </span>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderIdeaExplorer(state) {
  const { filters } = state;
  const filteredCount = filterIdeas(state.ideas, filters).length;

  return `
    <section id="explorer-section" class="editorial-section" aria-labelledby="explorer-heading">
      <div class="section-head-row">
        <div>
          <span class="section-index mono">03 / IDEA EXPLORER</span>
          <h2 id="explorer-heading" class="section-heading">Complete ideation registry</h2>
          <p class="section-subcopy">
            Klik baris untuk menyinkronkan node pada 3D Space, 2D Matrix, Decision Lenses, dan Inspector.
          </p>
        </div>
        <span class="mono-quiet" data-explorer-count>SHOWING ${filteredCount} OF ${state.ideas.length} IDEAS</span>
      </div>

      <div class="explorer-toolbar">
        <div class="search-box">
          <span class="search-box__icon">${icon('search', 15)}</span>
          <label for="idea-search-input" class="sr-only">Cari ide berdasarkan nama</label>
          <input
            id="idea-search-input"
            type="search"
            class="studio-input"
            placeholder="Search ideas (e.g. margin, reverse, bundling, API)..."
            value="${escapeHtml(filters.search)}"
            data-filter-input="search"
          />
        </div>

        <div class="filter-tabs" role="group" aria-label="Filter kuadran">
          <button
            type="button"
            class="filter-tab ${filters.quadrant === 'all' ? 'is-active' : ''}"
            data-action="filter-quadrant"
            data-quadrant-value="all"
          >All</button>
          ${QUADRANT_IDS.map((qId) => {
            const q = QUADRANTS[qId];
            return `
              <button
                type="button"
                class="filter-tab ${filters.quadrant === qId ? 'is-active' : ''}"
                data-action="filter-quadrant"
                data-quadrant-value="${qId}"
              ><span class="q-dot q-dot--${q.colorKey}"></span> ${q.roman} · ${q.name}</button>
            `;
          }).join('')}
        </div>

        <div class="select-wrap">
          <label for="scamper-filter-select" class="sr-only">Filter kategori SCAMPER</label>
          <select id="scamper-filter-select" class="studio-select" data-filter-select="scamper">
            ${SCAMPER_OPTIONS.map((opt) => `
              <option value="${opt.value}" ${filters.scamper === opt.value ? 'selected' : ''}>${opt.label}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <div data-explorer-body>
        ${renderExplorerRows(state)}
      </div>
    </section>
  `;
}

function updateExplorerBodyInPlace(rootEl, state) {
  const body = rootEl.querySelector('[data-explorer-body]');
  const countEl = rootEl.querySelector('[data-explorer-count]');
  if (!body) return false;

  const filtered = filterIdeas(state.ideas, state.filters);
  body.innerHTML = renderExplorerRows(state);
  if (countEl) {
    countEl.textContent = `SHOWING ${filtered.length} OF ${state.ideas.length} IDEAS`;
  }

  rootEl.querySelectorAll('[data-action="filter-quadrant"]').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.quadrantValue === state.filters.quadrant);
  });
  const select = rootEl.querySelector('[data-filter-select="scamper"]');
  if (select && select.value !== state.filters.scamper) select.value = state.filters.scamper;
  const searchInput = rootEl.querySelector('[data-filter-input="search"]');
  if (searchInput && document.activeElement !== searchInput && searchInput.value !== state.filters.search) {
    searchInput.value = state.filters.search;
  }

  return true;
}

// --- src/components/FinalSelection.js ---
/**
 * FinalSelection — Editorial architectural showcase of the 3 original LKPD selected concepts.
 * Explicitly preserves the original team decision even while users experiment in the simulator.
 */




// uses shared escapeHtml

function renderFinalSelection(state) {
  const trio = state.ideas.filter((idea) => idea.isOriginalFinalSelection);
  const stats = computeSummaryStats(state.ideas);

  return `
    <section id="final-selection-section" class="editorial-section" aria-labelledby="final-heading">
      <div class="section-head-row">
        <div>
          <span class="section-index mono">04 / THREE SELECTED CONCEPTS</span>
          <h2 id="final-heading" class="section-heading">Original LKPD 5 priority decisions</h2>
          <p class="section-subcopy">
            Tiga gagasan dari Kuadran I (Prioritas Utama) yang dipilih kelompok untuk dikembangkan menjadi konsep prototipe web.
          </p>
        </div>
        ${stats.hasModifications ? `
          <span class="sim-inline-flag" role="note">Pilihan final asli terkunci · Tidak berubah oleh simulasi</span>
        ` : `<span class="mono-quiet">LOCKED TO LKPD CONCLUSION</span>`}
      </div>

      <div class="concepts-columns">
        ${trio.map((idea, idx) => {
          const origTotal = getTotalScore(idea.originalFeasibility, idea.originalImpact);
          const simTotal = getTotalScore(idea.feasibility, idea.impact);
          const simQ = getQuadrantMeta(idea.feasibility, idea.impact);
          const isSelected = idea.id === state.selectedIdeaId;

          return `
            <article class="concept-col ${isSelected ? 'is-selected' : ''}">
              <div class="concept-col__top mono">
                <span class="concept-num">0${idx + 1} / IDEA #0${idea.id}</span>
                <span class="concept-score">F:${idea.originalFeasibility} · I:${idea.originalImpact} · ${origTotal}/10</span>
              </div>

              <h3 class="concept-col__title">${escapeHtml(idea.conceptName)}</h3>
              <p class="concept-col__orig">${escapeHtml(idea.name)}</p>

              <div class="concept-col__meta mono">
                <span>${escapeHtml(idea.scamper)}</span>
                <span>·</span>
                <span class="concept-col__quad">I · Prioritas Utama</span>
              </div>

              <p class="concept-col__body">${escapeHtml(idea.rationale)}</p>

              <div class="concept-col__impact">
                <span class="mono sub-eyebrow">MANFAAT PENJUAL / ADMIN</span>
                <p>${escapeHtml(idea.sellerBenefit)}</p>
              </div>

              ${idea.isModified ? `
                <div class="concept-col__sim mono">
                  Simulasi aktif: F:${idea.feasibility}, I:${idea.impact} (${simTotal}/10 · Kuadran ${simQ.roman})
                </div>
              ` : ''}

              <button
                type="button"
                class="concept-inspect-link"
                data-action="select-idea-from-list"
                data-idea-id="${idea.id}"
              >
                Inspect in studio ${icon('arrowRight', 14)}
              </button>
            </article>
          `;
        }).join('')}
      </div>

      <div class="conclusion-band">
        <div class="conclusion-band__lead">
          <span class="sub-eyebrow mono">TEAM RATIONALE (LKPD 5 SECTION D)</span>
          <h3>Mengapa tiga konsep ini terpilih?</h3>
          <p class="conclusion-reflection">${escapeHtml(FINAL_SELECTION_SUMMARY.scamperReflection)}</p>
        </div>

        <div class="conclusion-band__points">
          ${FINAL_SELECTION_SUMMARY.reasoning.map((r, i) => `
            <div class="conclusion-point">
              <span class="mono conclusion-point__idx">0${i + 1}</span>
              <div>
                <strong>${escapeHtml(r.label)}</strong>
                <p>${escapeHtml(r.text)}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

// --- src/components/CriticalAnalysis.js ---
/**
 * CriticalAnalysis — Numbered architectural editorial list (not a wall of pastel cards).
 * Explicitly separates canonical LKPD statements from technical & UX recommendations.
 */


// uses shared escapeHtml

function renderCriticalAnalysis() {
  return `
    <section id="analysis-section" class="editorial-section" aria-labelledby="analysis-heading">
      <div class="section-head-row">
        <div>
          <span class="section-index mono">05 / CRITICAL IMPLEMENTATION ANALYSIS</span>
          <h2 id="analysis-heading" class="section-heading">LKPD facts versus engineering considerations</h2>
          <p class="section-subcopy">
            Pemisahan tegas antara pernyataan sumber LKPD 3–5 dan pertimbangan teknis/validasi sebelum membangun prototipe.
          </p>
        </div>
        <div class="source-legend mono">
          <span class="src-badge src-badge--lkpd">LKPD SOURCE</span>
          <span class="src-badge src-badge--rec">IMPLEMENTATION REC</span>
        </div>
      </div>

      <ol class="analysis-list">
        ${CRITICAL_ANALYSIS_ITEMS.map((item, idx) => `
          <li class="analysis-item">
            <div class="analysis-item__head">
              <span class="analysis-item__num mono">0${idx + 1}</span>
              <div>
                <span class="src-badge ${item.category === 'lkpd-fact' ? 'src-badge--lkpd' : 'src-badge--rec'} mono">
                  ${escapeHtml(item.categoryLabel)}
                </span>
                <h3 class="analysis-item__title">${escapeHtml(item.title)}</h3>
              </div>
            </div>

            <div class="analysis-item__columns">
              <div class="analysis-col">
                <span class="sub-eyebrow mono">LKPD STATEMENT</span>
                <p>${escapeHtml(item.lkpdStatement)}</p>
              </div>
              <div class="analysis-col analysis-col--rec">
                <span class="sub-eyebrow mono">IMPLEMENTATION CONSIDERATION</span>
                <p>${escapeHtml(item.recommendation)}</p>
              </div>
            </div>
          </li>
        `).join('')}
      </ol>
    </section>
  `;
}

// --- src/components/PresentationMode.js ---
/**
 * PresentationMode — Cinematic, high-contrast, projector-ready full-screen deck.
 * Hides editing sliders, defaults to exact original LKPD 5 data, provides clear
 * section navigation (keyboard arrows + Escape), large readable matrix, and Print/PDF.
 */





const SLIDES = [
  { id: 0, code: '01', title: 'Context & Summary' },
  { id: 1, code: '02', title: 'Decision Matrix' },
  { id: 2, code: '03', title: 'Selected Concepts' },
  { id: 3, code: '04', title: 'Critical Analysis' },
];

// uses shared escapeHtml

function getOriginalIdeasView() {
  return INITIAL_IDEAS.map((item) => ({
    ...item,
    feasibility: item.originalFeasibility,
    impact: item.originalImpact,
    isModified: false,
  }));
}

function renderSlideBody(state) {
  const { slide, useSimulatedData, focusedIdeaId } = state.presentation;
  const activeIdeas = useSimulatedData ? state.ideas : getOriginalIdeasView();
  const stats = computeSummaryStats(activeIdeas);

  if (slide === 0) {
    return `
      <div class="pres-slide pres-slide--intro">
        <div class="pres-intro-main">
          <span class="mono-tag">${LKPD_META.documentTitle} · ${LKPD_META.className}</span>
          <h2 class="pres-display">Ten ideas.<br/>One clear direction.</h2>
          <p class="pres-lead">
            Prioritisasi fitur Unique Selling Point (USP) e-commerce menggunakan teknik brainstorming SCAMPER
            dan Matriks Feasibility vs Impact (skala 1–5).
          </p>

          <div class="pres-pov">
            <span class="sub-eyebrow mono">USER PERSONA &amp; POV (LKPD 4)</span>
            <p class="pres-pov__quote">${escapeHtml(LKPD_META.persona.pov)}</p>
            <p class="pres-pov__hmw"><strong>How Might We:</strong> ${escapeHtml(LKPD_META.persona.hmw)}</p>
          </div>
        </div>

        <div class="pres-intro-side">
          <div class="pres-stat-stack">
            <div class="pres-stat-item"><strong class="mono">${String(stats.totalIdeas).padStart(2, '0')}</strong><span>Ide SCAMPER</span></div>
            <div class="pres-stat-item"><strong class="mono">0${stats.priorityCount}</strong><span>Prioritas Utama (F ≥ 4, I ≥ 4)</span></div>
            <div class="pres-stat-item"><strong class="mono">${stats.averageTotalFormatted}/10</strong><span>Rata-Rata Skor Total</span></div>
            <div class="pres-stat-item"><strong class="mono">04</strong><span>Kuadran Keputusan</span></div>
          </div>
          <p class="pres-credit mono">TIM ${LKPD_META.className}: ${LKPD_META.teamMembers.join(' · ')}</p>
        </div>
      </div>
    `;
  }

  if (slide === 1) {
    const focused = activeIdeas.find((i) => i.id === focusedIdeaId) || activeIdeas[0];
    const q = getQuadrantMeta(focused.feasibility, focused.impact);
    const total = getTotalScore(focused.feasibility, focused.impact);

    return `
      <div class="pres-slide pres-slide--matrix">
        <div class="pres-matrix-canvas">
          ${renderMatrixCanvas({
            ideas: activeIdeas,
            selectedIdeaId: focused.id,
            readOnly: true,
            compact: true,
          })}
        </div>

        <aside class="pres-callout" aria-label="Detail ide terpilih pada presentasi">
          <div class="pres-callout__top mono">
            <span>IDEA #${String(focused.id).padStart(2, '0')}</span>
            <span>${escapeHtml(focused.scamper)}</span>
          </div>
          <h3 class="pres-callout__title">${escapeHtml(focused.name)}</h3>

          <div class="pres-callout__scores mono">
            <span>F: <strong>${focused.feasibility}/5</strong></span>
            <span>I: <strong>${focused.impact}/5</strong></span>
            <span>TOTAL: <strong>${total}/10</strong></span>
          </div>

          <div class="pres-callout__quad">
            <span class="q-dot q-dot--${q.colorKey}"></span>
            <strong>Kuadran ${q.roman} · ${q.name}</strong>
          </div>

          <p class="pres-callout__copy"><strong>Konsep:</strong> ${escapeHtml(focused.rationale)}</p>
          <p class="pres-callout__copy"><strong>Penjual:</strong> ${escapeHtml(focused.sellerBenefit)}</p>
          <p class="pres-callout__copy"><strong>Pembeli:</strong> ${escapeHtml(focused.buyerBenefit)}</p>
          ${focused.quadrantDiscrepancyNote ? `<p class="pres-callout__warn">${escapeHtml(focused.quadrantDiscrepancyNote)}</p>` : ''}
          <p class="pres-callout__hint mono">Klik pin mana saja di matriks untuk mengganti sorotan.</p>
        </aside>
      </div>
    `;
  }

  if (slide === 2) {
    const trio = getOriginalIdeasView().filter((i) => i.isOriginalFinalSelection);
    return `
      <div class="pres-slide pres-slide--trio">
        <div class="pres-head">
          <span class="mono-tag">ORIGINAL LKPD 5 SELECTION · QUADRANT I</span>
          <h2>Three Selected Product Concepts</h2>
        </div>

        <div class="pres-trio-cols">
          ${trio.map((idea, idx) => `
            <article class="pres-trio-col">
              <div class="pres-trio-col__top mono">
                <span>0${idx + 1} / IDEA #0${idea.id}</span>
                <span>F:${idea.originalFeasibility} · I:${idea.originalImpact} · ${idea.originalFeasibility + idea.originalImpact}/10</span>
              </div>
              <h3>${escapeHtml(idea.conceptName)}</h3>
              <p class="pres-trio-col__sub">${escapeHtml(idea.name)}</p>
              <p class="pres-trio-col__desc">${escapeHtml(idea.rationale)}</p>
              <p class="pres-trio-col__benefit">${escapeHtml(idea.sellerBenefit)}</p>
            </article>
          `).join('')}
        </div>

        <div class="pres-reasons">
          ${FINAL_SELECTION_SUMMARY.reasoning.map((r, i) => `
            <div>
              <span class="mono">0${i + 1} · ${escapeHtml(r.label)}</span>
              <p>${escapeHtml(r.text)}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `
    <div class="pres-slide pres-slide--analysis">
      <div class="pres-head">
        <span class="mono-tag">CRITICAL IMPLEMENTATION CONSIDERATIONS</span>
        <h2>LKPD Facts &amp; Prototype Readiness</h2>
      </div>

      <ol class="pres-analysis-list">
        ${CRITICAL_ANALYSIS_ITEMS.map((item, idx) => `
          <li>
            <span class="mono pres-a-num">0${idx + 1}</span>
            <div class="pres-a-body">
              <div class="pres-a-head">
                <strong>${escapeHtml(item.title)}</strong>
                <span class="src-badge ${item.category === 'lkpd-fact' ? 'src-badge--lkpd' : 'src-badge--rec'} mono">${escapeHtml(item.categoryLabel)}</span>
              </div>
              <p><b>LKPD:</b> ${escapeHtml(item.lkpdStatement)}</p>
              <p><b>Implementasi:</b> ${escapeHtml(item.recommendation)}</p>
            </div>
          </li>
        `).join('')}
      </ol>
    </div>
  `;
}

function renderPresentationMode(state) {
  if (!state.presentation.open) return '';

  const { slide, useSimulatedData } = state.presentation;
  const stats = computeSummaryStats(state.ideas);

  return `
    <div class="pres-overlay" role="dialog" aria-modal="true" aria-label="Mode Presentasi IdeaQuest">
      <header class="pres-topbar">
        <div class="pres-topbar__left">
          <strong class="pres-brand">IdeaQuest / Presentation</strong>
          <span class="mono pres-source-tag">
            ${useSimulatedData ? 'SIMULATION VIEW' : 'ORIGINAL LKPD 5 DATA'}
          </span>
          ${stats.hasModifications ? `
            <button type="button" class="btn btn--ghost btn--sm" data-action="toggle-presentation-data">
              ${useSimulatedData ? 'Switch to Original LKPD' : 'Show Simulation'}
            </button>
          ` : ''}
        </div>

        <nav class="pres-tabs" role="tablist" aria-label="Slide presentasi">
          ${SLIDES.map((s) => `
            <button
              type="button"
              role="tab"
              aria-selected="${slide === s.id ? 'true' : 'false'}"
              class="pres-tab ${slide === s.id ? 'is-active' : ''}"
              data-action="presentation-slide"
              data-slide="${s.id}"
            >
              <span class="mono">${s.code}</span> ${s.title}
            </button>
          `).join('')}
        </nav>

        <div class="pres-topbar__right">
          <button type="button" class="btn btn--outline btn--sm" data-action="print-summary">
            ${icon('printer', 14)} Print / PDF
          </button>
          <button type="button" class="btn btn--primary btn--sm" data-action="close-presentation">
            ${icon('close', 14)} Exit
          </button>
        </div>
      </header>

      <div class="pres-stage">
        ${renderSlideBody(state)}
      </div>

      <footer class="pres-footer">
        <button
          type="button"
          class="btn btn--outline btn--sm"
          data-action="presentation-prev"
          ${slide === 0 ? 'disabled' : ''}
        >
          ${icon('arrowLeft', 14)} Previous
        </button>

        <span class="mono pres-counter">SLIDE ${slide + 1} / ${SLIDES.length} · ARROW KEYS ← / → · ESC TO EXIT</span>

        <button
          type="button"
          class="btn btn--primary btn--sm"
          data-action="presentation-next"
          ${slide === SLIDES.length - 1 ? 'disabled' : ''}
        >
          Next ${icon('arrowRight', 14)}
        </button>
      </footer>
    </div>
  `;
}

// --- src/components/ExportControls.js ---
/**
 * ExportControls — Clean architectural export and local-session disclosure bar.
 */



function renderExportControls(state) {
  const stats = computeSummaryStats(state.ideas);

  return `
    <section class="export-strip" aria-label="Ekspor data dan kontrol sesi">
      <div class="export-strip__copy">
        <span class="section-index mono">06 / EXPORT &amp; PRESENTATION</span>
        <h2 class="export-strip__title">Siap dipresentasikan &amp; diekspor</h2>
        <p class="export-strip__note">
          Perubahan simulasi hanya tersimpan secara <strong>lokal di sesi browser ini</strong> (tanpa backend/sinkronisasi cloud)
          dan tidak mengubah data kanonis LKPD 5.
        </p>
      </div>

      <div class="export-strip__actions">
        <button type="button" class="btn btn--primary" data-action="open-presentation">
          ${icon('play', 15)} Presentation Mode
        </button>
        <button type="button" class="btn btn--outline" data-action="export-csv">
          ${icon('download', 15)} Export CSV
        </button>
        <button type="button" class="btn btn--outline" data-action="print-summary">
          ${icon('printer', 15)} Print / Save PDF
        </button>
        <button
          type="button"
          class="btn btn--subtle"
          data-action="reset-all"
          ${stats.hasModifications ? '' : 'disabled'}
        >
          ${icon('reset', 15)} Reset All Scores
        </button>
      </div>
    </section>
  `;
}

// --- src/components/IdeaQuestPage.js ---
/**
 * IdeaQuestPage — Top-level studio orchestrator.
 * Mounts all sections, initializes & synchronizes the Three.js 3D Idea Space
 * cleanly alongside the 2D Matrix, Decision Lenses, Idea Explorer, Inspector,
 * Final Concepts, Critical Analysis, Presentation Mode, and CSV Export.
 */













function triggerCsvDownload(ideas) {
  const csv = buildCsvContent(ideas);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ideaquest-lkpd5-matrix.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function mountIdeaQuestPage(appRoot, store) {
  appRoot.innerHTML = `
    <div id="hero-root"></div>
    <main class="studio-main">
      <div id="stats-root"></div>

      <section id="matrix-section" class="studio-centerpiece" aria-label="Ruang Keputusan Matriks 3D dan 2D">
        <div class="section-head-row section-head-row--compact">
          <div>
            <span class="section-index mono">01 / INTERACTIVE IDEA SPACE</span>
            <h2 class="section-heading">Feasibility vs Impact Matrix</h2>
          </div>
          <span class="mono-quiet">HIGH: 4–5 · LOW: 1–3 · THRESHOLD: 3.5</span>
        </div>

        <div class="studio-split">
          <div id="matrix-root" class="studio-split__primary"></div>
          <div id="inspector-root" class="studio-split__aside"></div>
        </div>
      </section>

      <div id="lenses-root"></div>
      <div id="explorer-root"></div>
      <div id="final-root"></div>
      <div id="analysis-root"></div>
      <div id="export-root"></div>
    </main>

    <footer class="studio-footer">
      <div class="studio-footer__inner">
        <span><strong>IdeaQuest</strong> · LKPD 5 Ideation (Unique Selling Point) · 11 PPLG 3</span>
        <span class="mono">Local browser session only · Original LKPD scores preserved</span>
      </div>
    </footer>

    <div id="toast-root" class="toast-host" aria-live="polite"></div>
    <div id="presentation-root"></div>
  `;

  const roots = {
    hero: appRoot.querySelector('#hero-root'),
    stats: appRoot.querySelector('#stats-root'),
    matrix: appRoot.querySelector('#matrix-root'),
    inspector: appRoot.querySelector('#inspector-root'),
    lenses: appRoot.querySelector('#lenses-root'),
    explorer: appRoot.querySelector('#explorer-root'),
    final: appRoot.querySelector('#final-root'),
    analysis: appRoot.querySelector('#analysis-root'),
    exportBar: appRoot.querySelector('#export-root'),
    toast: appRoot.querySelector('#toast-root'),
    presentation: appRoot.querySelector('#presentation-root'),
  };

  const liveRegion = document.getElementById('live-region');
  let threeController = null;
  let threeInitStarted = false;

  function announce(message) {
    if (!liveRegion || !message) return;
    liveRegion.textContent = '';
    requestAnimationFrame(() => {
      liveRegion.textContent = message;
    });
  }

  function renderToast(state) {
    if (!state.notice) {
      roots.toast.innerHTML = '';
      return;
    }
    roots.toast.innerHTML = `
      <div class="studio-toast studio-toast--${state.notice.tone}" role="status">
        <span>${state.notice.text}</span>
      </div>
    `;
    announce(state.notice.text);
  }

  async function ensureThreeSceneMounted() {
    if (threeInitStarted || threeController) return;
    const stage3d = roots.matrix.querySelector('[data-stage-3d]');
    if (!stage3d) return;

    threeInitStarted = true;
    const ctrl = await mountIdeaSpace3D(stage3d, store.getState(), {
      onSelectIdea: (ideaId) => {
        store.selectIdea(ideaId);
      },
      onReady: () => {
        store.setWebglStatus('ready');
      },
      onWebglUnavailable: () => {
        store.setWebglStatus('unavailable');
      },
    });

    if (ctrl) {
      threeController = ctrl;
      threeController.update(store.getState());
    }
  }

  function renderAll(state, changeType = 'all') {
    if (changeType === 'notice') {
      renderToast(state);
      return;
    }

    if (changeType === 'camera') {
      if (threeController) threeController.setCameraPreset(state.cameraPreset);
      syncMatrixViewModeInPlace(roots.matrix, state);
      return;
    }

    if (changeType === 'viewMode') {
      syncMatrixViewModeInPlace(roots.matrix, state);
      if (state.viewMode === '3d') {
        ensureThreeSceneMounted();
      }
      return;
    }

    if (changeType === 'lens') {
      roots.lenses.innerHTML = renderDecisionLenses(state);
      return;
    }

    if (changeType === 'presentation') {
      roots.presentation.innerHTML = renderPresentationMode(state);
      document.body.classList.toggle('is-presentation-open', state.presentation.open);
      return;
    }

    if (changeType === 'filters') {
      if (!updateExplorerBodyInPlace(roots.explorer, state)) {
        roots.explorer.innerHTML = renderIdeaExplorer(state);
      }
      return;
    }

    if (changeType === 'scores') {
      roots.hero.innerHTML = renderOverviewHero(state);
      roots.stats.innerHTML = renderSummaryStats(state);
      updatePriorityMatrixInPlace(roots.matrix, state);
      if (threeController) threeController.update(state);
      if (!updateIdeaInspectorInPlace(roots.inspector, state)) {
        roots.inspector.innerHTML = renderIdeaInspector(state);
      }
      roots.lenses.innerHTML = renderDecisionLenses(state);
      if (!updateExplorerBodyInPlace(roots.explorer, state)) {
        roots.explorer.innerHTML = renderIdeaExplorer(state);
      }
      roots.final.innerHTML = renderFinalSelection(state);
      roots.exportBar.innerHTML = renderExportControls(state);
      if (state.presentation.open) {
        roots.presentation.innerHTML = renderPresentationMode(state);
      }
      return;
    }

    if (changeType === 'selection') {
      updatePriorityMatrixInPlace(roots.matrix, state);
      if (threeController) threeController.update(state);
      roots.inspector.innerHTML = renderIdeaInspector(state);
      roots.lenses.innerHTML = renderDecisionLenses(state);
      if (!updateExplorerBodyInPlace(roots.explorer, state)) {
        roots.explorer.innerHTML = renderIdeaExplorer(state);
      }
      roots.final.innerHTML = renderFinalSelection(state);
      return;
    }

    // Initial mount
    roots.hero.innerHTML = renderOverviewHero(state);
    roots.stats.innerHTML = renderSummaryStats(state);
    roots.matrix.innerHTML = renderPriorityMatrix(state);
    roots.inspector.innerHTML = renderIdeaInspector(state);
    roots.lenses.innerHTML = renderDecisionLenses(state);
    roots.explorer.innerHTML = renderIdeaExplorer(state);
    roots.final.innerHTML = renderFinalSelection(state);
    roots.analysis.innerHTML = renderCriticalAnalysis();
    roots.exportBar.innerHTML = renderExportControls(state);
    roots.presentation.innerHTML = renderPresentationMode(state);
    renderToast(state);

    if (state.viewMode === '3d') {
      ensureThreeSceneMounted();
    }
  }

  bindMatrixDragEvents(roots.matrix, store);

  // Unified click delegation
  appRoot.addEventListener('click', (event) => {
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;

    const action = actionEl.dataset.action;
    const state = store.getState();

    switch (action) {
      case 'select-idea': {
        store.selectIdea(actionEl.dataset.ideaId);
        break;
      }
      case 'select-idea-from-list': {
        store.selectIdea(actionEl.dataset.ideaId);
        const matrixEl = document.getElementById('matrix-section');
        if (matrixEl) {
          matrixEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        break;
      }
      case 'set-view-mode': {
        store.setViewMode(actionEl.dataset.viewMode);
        break;
      }
      case 'camera-preset': {
        store.setCameraPreset(actionEl.dataset.preset);
        break;
      }
      case 'set-lens': {
        store.setActiveLens(actionEl.dataset.lens);
        break;
      }
      case 'set-axis-score': {
        const id = Number(actionEl.dataset.ideaId);
        const axis = actionEl.dataset.axis;
        const val = Number(actionEl.dataset.value);
        const idea = state.ideas.find((i) => i.id === id);
        if (!idea) break;
        store.updateScore(
          id,
          axis === 'feasibility' ? val : idea.feasibility,
          axis === 'impact' ? val : idea.impact,
          'slider'
        );
        break;
      }
      case 'move-to-quadrant': {
        store.moveIdeaToQuadrant(actionEl.dataset.ideaId, actionEl.dataset.targetQuadrant, null, 'quadrant-button');
        break;
      }
      case 'reset-idea': {
        store.resetIdea(actionEl.dataset.ideaId);
        break;
      }
      case 'reset-all': {
        store.resetAll();
        break;
      }
      case 'filter-quadrant': {
        store.setFilter({ quadrant: actionEl.dataset.quadrantValue });
        break;
      }
      case 'clear-filters': {
        store.setFilter({ quadrant: 'all', scamper: 'all', search: '' });
        break;
      }
      case 'export-csv': {
        triggerCsvDownload(state.ideas);
        store.notify('CSV "ideaquest-lkpd5-matrix.csv" berhasil diunduh.', 'success');
        break;
      }
      case 'print-summary': {
        window.print();
        break;
      }
      case 'open-presentation': {
        store.openPresentation(0);
        break;
      }
      case 'close-presentation': {
        store.closePresentation();
        break;
      }
      case 'presentation-slide': {
        store.setPresentationSlide(Number(actionEl.dataset.slide));
        break;
      }
      case 'presentation-prev': {
        store.setPresentationSlide(state.presentation.slide - 1);
        break;
      }
      case 'presentation-next': {
        store.setPresentationSlide(state.presentation.slide + 1);
        break;
      }
      case 'presentation-select-idea': {
        store.setPresentationFocusIdea(actionEl.dataset.ideaId);
        break;
      }
      case 'toggle-presentation-data': {
        store.togglePresentationDataSource(!state.presentation.useSimulatedData);
        break;
      }
      default:
        break;
    }
  });

  // Live range slider & search input delegation
  appRoot.addEventListener('input', (event) => {
    const target = event.target;
    if (target.matches('[data-sim-slider]')) {
      const axis = target.dataset.simSlider;
      const id = Number(target.dataset.ideaId);
      const val = Number(target.value);
      const idea = store.getState().ideas.find((i) => i.id === id);
      if (!idea) return;
      store.updateScore(
        id,
        axis === 'feasibility' ? val : idea.feasibility,
        axis === 'impact' ? val : idea.impact,
        'slider'
      );
      return;
    }

    if (target.matches('[data-filter-input="search"]')) {
      store.setFilter({ search: target.value });
    }
  });

  appRoot.addEventListener('change', (event) => {
    const target = event.target;
    if (target.matches('[data-filter-select="scamper"]')) {
      store.setFilter({ scamper: target.value });
    }
  });

  // Global keyboard shortcuts for Presentation Mode
  document.addEventListener('keydown', (event) => {
    const state = store.getState();
    if (!state.presentation.open) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      store.closePresentation();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      store.setPresentationSlide(state.presentation.slide + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      store.setPresentationSlide(state.presentation.slide - 1);
    }
  });

  // Clean up Three.js WebGL resources on page unload
  window.addEventListener('beforeunload', () => {
    if (threeController) {
      threeController.dispose();
      threeController = null;
    }
  });

  store.subscribe((nextState, changeType) => {
    renderAll(nextState, changeType);
  });

  renderAll(store.getState(), 'all');
}

// --- src/main.js ---
const appRoot = document.getElementById('app');
if (appRoot) {
  const store = createIdeaQuestStore();
  mountIdeaQuestPage(appRoot, store);
}

