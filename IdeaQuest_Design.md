# IdeaQuest — Design & Implementation Brief
**LKPD 5 · Ideation (Unique Selling Point) · Feasibility vs Impact**

## 1. Product intent

Build **IdeaQuest**, a playful, polished, interactive web experience for presenting and exploring the team's LKPD 5 ideation results. It must serve two purposes:

1. **Team workspace:** inspect ideas, understand scoring, simulate score changes, and discuss prioritization.
2. **Presentation mode:** communicate the team's reasoning clearly to classmates and the teacher on a large screen.

This is an educational decision-support tool, not a generic task-management dashboard and not a children's game. Make it fun through visual personality, 3D clay-style illustrations, motion, and tactile interactions while keeping the matrix, numbers, labels, and reasoning academically clear.

## 2. Source of truth and content constraints

Use the supplied file `LKPD_5_Ideation_USP.md` as the source of truth. Preserve the source's terminology, idea names, scores, and stated reasoning. Do not invent additional ideation results or silently change the scores.

The LKPD requires:
- At least 10 ideas generated through SCAMPER.
- Scoring each idea on Feasibility and Impact from 1–5.
- Plotting ideas in a four-quadrant Feasibility vs Impact matrix.
- Selecting three ideas in **Prioritas Utama** (high Feasibility, high Impact).
- Developing the three selected ideas into product concepts.

### 2.1 The ten ideas and original scores

| No. | Idea | SCAMPER | Feasibility | Impact | Total | Original quadrant |
|---:|---|---|---:|---:|---:|---|
| 1 | Kalkulator Margin Otomatis & Peringatan Batas Aman (Margin Alert) | S — Substitute | 5 | 5 | 10 | Prioritas Utama |
| 2 | Kalkulator Reverse Margin (Target Laba ke Harga Jual) | R — Reverse | 4 | 5 | 9 | Prioritas Utama |
| 3 | Simulasi Multi-Platform E-Commerce dengan Preset Biaya Admin | C — Combine | 4 | 5 | 9 | Prioritas Utama |
| 4 | Slider Simulasi Harga & Diskon Real-Time | M — Modify | 5 | 3 | 8 | Quick Wins |
| 5 | Sistem Rekomendasi Batas Maksimal Diskon | S — Substitute | 4 | 3 | 7 | Quick Wins |
| 6 | Generator Laporan Rekap Potongan Promo Harian | P — Put to Another Use | 3 | 4 | 7 | Tantangan |
| 7 | Kalkulator Bundling Paket Promo + Cek Margin | C — Combine | 3 | 4 | 7 | Tantangan |
| 8 | Audit Promo Otomatis Pasca-Order | R — Reverse | 2 | 4 | 6 | Tantangan |
| 9 | Template Preset Promo Cepat (1-Click Promo Terpisah) | E — Eliminate | 4 | 2 | 6 | Quick Wins |
| 10 | Integrasi Sinkronisasi API Langsung ke Marketplace | Not specified as a separate SCAMPER row in the scoring table | 1 | 4 | 5 | Prioritas Rendah |

Important: The original scoring table labels idea 10 as **Prioritas Rendah (Feasibility Rendah, Impact Tinggi)**. In the four-quadrant mapping, this corresponds to the low-feasibility/high-impact quadrant, called **Tantangan** in this design. Preserve the original wording in the idea's source data and explain the quadrant naming consistently in the UI; do not pretend the original source used identical labels everywhere.

### 2.2 Original rationale and benefits

Preserve these details in each idea's detail view:

1. **Margin Alert**
   - Seller: Admin langsung tahu laba bersih akurat dan terlindung dari promo yang menggerus margin.
   - Buyer: Promo lebih konsisten tanpa risiko pesanan dibatalkan akibat toko salah pasang harga.
2. **Reverse Margin**
   - Seller: Admin tidak perlu menghitung mundur manual saat mengikuti campaign; sistem menghitung harga jual dan batas maksimal diskon dari target laba.
   - Buyer: Harga produk tampil kompetitif sesuai skema promo yang berlaku.
3. **Multi-Platform Simulator**
   - Seller: Admin tidak perlu membuka banyak tab aplikasi dan mudah membandingkan biaya admin.
   - Buyer: Tidak ada manfaat langsung yang dirinci secara terpisah pada tabel ide; present the source's stated benefit carefully, without inventing one.
4. **Live Slider**
   - Seller: Mempercepat simulasi coba-coba skema promo tanpa mengetik ulang angka berkali-kali.
   - Buyer: Tidak digunakan secara langsung oleh pembeli.
5. **Maximum Discount Recommendation**
   - Seller: Memberikan batas aman promo berdasarkan target margin minimal 35%.
   - Buyer: Promo lebih konsisten tanpa risiko pesanan dibatalkan akibat toko salah pasang harga.
6. **Daily Promo Report**
   - Seller: Menghemat waktu admin saat rekap selisih omzet kotor dan pendapatan bersih di akhir shift.
   - Buyer: Tidak relevan langsung karena berupa laporan keuangan internal cabang.
7. **Bundle Calculator**
   - Seller: Tidak perlu membuat paket hemat tanpa menghitung laba bersih; bundling dan pengecekan margin digabung.
   - Buyer: Mendapat pilihan paket bundling yang lebih hemat dibanding beli satuan.
8. **Post-Order Promo Audit**
   - Seller: Memudahkan evaluasi promo dan mendeteksi orderan yang marginnya bocor.
   - Buyer: No direct buyer benefit is stated in the source.
9. **Quick Promo Presets**
   - Seller: Mengurangi input berulang komponen biaya admin dan layanan dengan preset biaya tiap platform yang tersimpan otomatis.
   - Buyer: Aktivasi promo lebih cepat sehingga pembeli segera menikmati diskon.
10. **Marketplace API Integration**
    - Seller: Intended to synchronize marketplace data directly; the source scores feasibility 1 and impact 4.
    - Buyer: The source does not give a separate buyer benefit for this row. Do not invent one.

### 2.3 Three selected ideas

The original selected ideas are:
- **SmartMargin Guard** — concept name used in the LKPD conclusion for idea 1: automatic margin calculator with safe-limit alert. Score 5/5, total 10.
- **ReversePrice Planner** — concept name used in the LKPD conclusion for idea 2: reverse margin calculation from target profit to selling price. Score 4/5, total 9.
- **Simulasi Multi-Platform** — idea 3: compare marketplace admin deductions / presets in one view. Score 4/5, total 9.

The LKPD conclusion says the team selected these because they directly address Kak Zahira's problem of calculating net margin quickly and protecting a 35%–50% profit margin, while being technically realistic for a Grade 11 PPLG team to prototype as a simple web application. It notes that direct marketplace API integration is more difficult because it depends on third-party access.

The LKPD identifies Margin Alert and ReversePrice Planner as especially likely to attract users because branch admins need instant safe/danger indicators while processing orders.

## 3. Matrix model and quadrant logic

The main visualization must resemble the user's supplied Cartesian-style quadrant reference:

- A central vertical axis and central horizontal axis.
- Four clearly separated quadrants.
- Coordinate-like positioning, grid lines, axis labels, and visible quadrant labels.
- Points/markers represent ideas; selecting a marker opens its details.
- Do not use a plain four-card grid as a substitute for the matrix.

For this LKPD:
- **X axis:** Feasibility / Kelayakan — low on the left, high on the right.
- **Y axis:** Impact / Dampak — low at the bottom, high at the top.
- Use original scores on a 1–5 scale. Do not convert them to negative and positive SWOT values.
- For quadrant classification, use a clear threshold between 3 and 4:
  - High = 4–5.
  - Low = 1–3.

Quadrants:
1. **I — PRIORITAS UTAMA:** high Feasibility + high Impact.
2. **II — QUICK WINS:** high Feasibility + low Impact.
3. **III — TANTANGAN / CHALLENGE:** low Feasibility + high Impact.
4. **IV — PRIORITAS RENDAH / LOW PRIORITY:** low Feasibility + low Impact.

Note: the source's table calls the low-feasibility/high-impact ideas 6–8 “Tantangan” and calls idea 10 “Prioritas Rendah (Feasibility Rendah, Impact Tinggi)”. The coordinate logic places idea 10 in quadrant III despite that source label. Preserve this discrepancy transparently: use the quadrant's logical label “Tantangan / Feasibility rendah, Impact tinggi” on the plot, and show the source's original label in idea 10's detail panel with a small note that its score coordinates map to quadrant III. Do not silently misplot it.

### Initial coordinates (Feasibility, Impact)

- Idea 1: (5,5)
- Idea 2: (4,5)
- Idea 3: (4,5)
- Idea 4: (5,3)
- Idea 5: (4,3)
- Idea 6: (3,4)
- Idea 7: (3,4)
- Idea 8: (2,4)
- Idea 9: (4,2)
- Idea 10: (1,4)

Since several ideas share coordinates, avoid hiding overlapping markers. Use small deterministic visual offsets/jitter around the true coordinate while retaining the exact score in labels/tooltips. Alternatively cluster coincident points with a count and let the user expand/select the individual ideas. Never alter the stored score to create visual separation.

## 4. Visual direction

### Style
**3D Claymorphism + playful editorial dashboard.**

The experience should feel:
- Fun, inviting, optimistic, and creative.
- Modern and polished enough for a school presentation.
- Friendly rather than childish.
- Data-first: the matrix and reasoning remain the visual focus.

### Palette
Use a warm off-white / cream base with restrained pastel quadrant colors:
- Primary lavender / violet for brand and controls.
- Mint green for Prioritas Utama.
- Soft blue for Quick Wins.
- Warm amber / peach for Tantangan.
- Soft coral / rose for Prioritas Rendah.
- Charcoal / deep purple for readable text.

Ensure strong text contrast. Do not rely on color alone: include quadrant number, title, and a short description.

### Typography
Use a clean contemporary sans-serif such as Plus Jakarta Sans, Inter, or a locally available equivalent. Large expressive display heading; compact, legible data labels.

### Illustration and 3D
- Original simple stickman mascot(s), rendered in a soft clay / 3D toy aesthetic.
- Small 3D visual metaphors: lightbulb, calculator, shield, price tag, marketplace storefronts, coins.
- Use illustrations to support navigation and explain ideas, not to obstruct the matrix.
- Prefer lightweight CSS/SVG or locally available assets; do not make remote image loading a runtime dependency.
- If generating image assets, keep them decorative and ensure the app remains usable without them.

### Motion
- Gentle floating/bobbing mascot animation.
- Smooth marker movement when scores change.
- Subtle hover lift and press feedback.
- Respect `prefers-reduced-motion`.
- Avoid continuous distracting animation and excessive parallax.

## 5. Information architecture

### A. Overview / hero
- Brand: IdeaQuest.
- Headline: “From Ideas to Impact.”
- Short description: “Sepuluh ide. Empat kuadran. Tiga prioritas utama.”
- Small friendly stickman illustration.
- Summary metrics: 10 ideas, 3 initial priority ideas, average total score 7.8/10, 4 quadrants.
- Average score must be computed from current data, not hardcoded.

### B. Interactive Priority Matrix (primary feature)
- Large coordinate-style 2×2 plot with visible grid.
- Axis titles and direction labels.
- All ten ideas plotted from exact initial scores.
- Each marker has a readable short ID/label.
- Hover/focus tooltip: idea name, Feasibility, Impact, total.
- Click marker to open the Idea Inspector.
- Support drag-and-drop between quadrants as a team simulation. A drag action must update scores to a valid representative point in the target quadrant, and the UI must explain that it is a simulation. Never silently change scores.
- Keyboard-accessible alternative: select an idea and use controls to change its score / quadrant.
- On small screens, maintain legibility: allow horizontal plot scrolling or a carefully responsive matrix; do not squash labels.

### C. Idea Inspector
When an idea is selected, show:
- Full idea name and idea number.
- SCAMPER category where supplied.
- Original score and current simulated score, clearly distinguished if edited.
- Feasibility, Impact, and total.
- Current quadrant.
- Original rationale.
- Seller benefit and buyer benefit as stated in source.
- A warning/notes area for missing or indirect buyer benefit rather than invented content.

### D. Score simulator
- Two accessible range controls, Feasibility 1–5 and Impact 1–5.
- Live update of marker position, quadrant, total, quadrant counts, and summary.
- Reset one idea to original score.
- Reset all ideas to original LKPD scores.
- Clearly mark modified scores as “Simulasi” and retain original values for comparison.

### E. All ideas
- A compact list/table of all ten ideas.
- Search/filter by quadrant or SCAMPER category if useful.
- Selecting an item selects its marker and opens details.

### F. Final selection
- Dedicated view highlighting the original three selected ideas.
- Explain why the team selected them, using the LKPD conclusion.
- Keep original selected trio clearly distinguished from any simulated changes to scores. Do not automatically replace the LKPD's original final selection when users experiment.

### G. Critical analysis
Show critical implementation considerations grounded in the LKPD:
- Net margin calculation must account for HPP, admin fees, service fees, and discounts.
- Marketplace fee presets need to be updateable because fees may change; this is an implementation consideration, not an explicit scored requirement.
- Treat the 35%–50% margin target as the team's stated context; do not present it as a universal marketplace rule.
- Direct marketplace API integration is a high-risk dependency for a simple student prototype.
- Validate the usefulness of instant safe/danger indicators for admins.
Clearly distinguish LKPD statements from design/technical recommendations.

### H. Presentation mode
- Full-screen / distraction-reduced view.
- Large matrix and readable labels.
- Show original data and the three selected ideas.
- Hide editing controls or make them secondary.
- Provide next/previous section navigation if feasible.
- Include print-friendly styles or a “Print / Save PDF” action.

### I. Export
- Export matrix scores to CSV.
- Optional print summary.
- Clearly state that edits are local unless a backend is explicitly implemented.

## 6. Functional requirements

1. All ten source ideas and original scores must be present.
2. Matrix position must derive from current Feasibility and Impact scores.
3. Quadrant classification must derive from the stated 4–5 / 1–3 threshold.
4. Total score must be calculated as Feasibility + Impact.
5. Selecting an idea must synchronize matrix marker, list, and inspector.
6. Score edits must update all dependent UI immediately.
7. Original scores must be restorable.
8. Original three selected ideas must remain identifiable regardless of score simulations.
9. Drag-and-drop must have an accessible alternative.
10. CSV export must contain idea number, full name, SCAMPER, original scores, current scores, total, and current quadrant.
11. Responsive behavior must work on mobile, tablet, and desktop.
12. Presentation mode must be usable without editing controls.

## 7. Technical implementation guidance

First inspect the existing project before changing anything:
- Identify framework, package manager, current scripts, folder structure, and existing design system.
- Read the relevant README and any `AGENTS.md` or project-specific instructions.
- Reuse the existing stack and conventions.
- Do not replace the framework, rewrite unrelated files, or install packages without explaining why and asking for approval.
- Do not add unnecessary dependencies. Prefer native CSS, SVG, and framework-native state.
- Keep data separate from presentation components.
- Use semantic HTML, accessible labels, keyboard support, and responsive CSS.
- Ensure no console errors, broken controls, or placeholder buttons.
- Run the project's existing lint/typecheck/build commands where available and report results honestly.
- Do not claim tests passed unless actually run.

If no project exists yet, create a minimal implementation using the stack already configured in the workspace; ask before introducing a new framework or installing dependencies.

## 8. Suggested component architecture

Adapt names to the existing framework:
- `IdeaQuestPage`
- `OverviewHero`
- `SummaryStats`
- `PriorityMatrix`
- `MatrixQuadrant`
- `IdeaMarker`
- `IdeaInspector`
- `ScoreSimulator`
- `IdeaExplorer`
- `FinalSelection`
- `CriticalAnalysis`
- `PresentationMode`
- `ExportControls`

Keep the ten ideas and their original data in one canonical data module.

## 9. Acceptance checklist

- [ ] The matrix visually resembles the user's Cartesian quadrant reference, not four disconnected cards.
- [ ] X axis is Feasibility (low → high); Y axis is Impact (low → high).
- [ ] All ten ideas appear at their correct initial scores.
- [ ] Coincident points are selectable and do not disappear behind each other.
- [ ] Four quadrant labels and descriptions are clear.
- [ ] Idea detail shows source-based reasoning and benefits without invented facts.
- [ ] Score sliders update marker, total, and quadrant live.
- [ ] Simulation edits are visually distinguished from original LKPD scores.
- [ ] Reset restores exact original data.
- [ ] Original final three ideas remain highlighted.
- [ ] Critical analysis distinguishes source facts from implementation recommendations.
- [ ] Presentation mode is clear on a projector / laptop.
- [ ] Mobile layout remains usable.
- [ ] CSV export works.
- [ ] No dead buttons, fake collaboration, or claims of cloud sync without a backend.

## 10. Final design principle

**Make the decision-making process visible.** A teacher should be able to understand what the ten ideas are, how they were scored, why they occupy their quadrants, and why the team selected the final three—without needing a separate verbal explanation.
