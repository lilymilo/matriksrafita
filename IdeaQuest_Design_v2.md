# IdeaQuest — Visual Redesign & Build Direction v2
**Purpose:** Replace the current template-like dashboard with a distinctive, professional, interactive 3D data experience for LKPD 5.

## 1. Honest critique of the current result

The current screenshot is readable in broad structure, but it feels like a generic AI-generated dashboard rather than a designed product:
- Too many rounded cards, pills, badges, and soft gradient backgrounds.
- Excessive pastel color blocks make the page look childish and visually flat.
- Typography and labels are too small, especially in the matrix and idea table.
- The main matrix is cramped; markers and labels compete and overlap.
- The long page repeats the same card treatment, so sections have no distinct visual rhythm.
- The stickman illustration is decorative and disconnected from the actual data.
- The “3D” direction is not expressed through a real interactive 3D scene.
- The most important story—why these ten ideas land where they do and why three were selected—is not immediately obvious.

Do not simply recolor or add more shadows to the existing layout. Recompose the experience.

## 2. Product concept

**IdeaQuest should feel like an interactive strategy studio**, not a school worksheet converted into cards.

The visual metaphor: a team is exploring a 3D idea space. The ten ideas are objects/markers in that space. Users can inspect, compare, and simulate their positions. The teacher should understand the decision logic within seconds.

Two modes:
1. **Explore mode:** interactive data exploration, filters, scoring simulation, idea inspector.
2. **Presentation mode:** cinematic, clean, large typography, clear matrix and selected decisions.

## 3. Visual direction — professional, not childish

### Art direction
- Premium editorial / creative-tech aesthetic.
- Strong typographic hierarchy, generous whitespace, disciplined grid.
- Mostly neutral base: warm white or very light cool grey, deep ink/navy text.
- One strong primary accent (electric violet or cobalt) and restrained semantic colors for quadrants.
- Avoid rainbow gradients, excessive glassmorphism, excessive rounded cards, and random decorative blobs.
- Use square-ish geometry and moderate radii (8–16px), not every element as a pill.
- Use thin rules, precise alignment, quiet labels, and intentional whitespace.

### Typography
- Prefer **Geist Sans** or **Inter** for UI and **Geist Mono** for scores/coordinates.
- If already installed locally, reuse. Otherwise use a reliable web font only if the project permits; keep a system fallback.
- Headings: bold, tight, editorial.
- Body: comfortably readable, 15–17px desktop; do not shrink text to fit.
- Data labels: 12–14px minimum where possible.
- Scores and coordinates should use tabular numerals / monospace.
- Avoid mixing multiple unrelated font families.

### Color system
Use a disciplined palette:
- Background: `#F5F6F8` or warm-neutral equivalent.
- Main text: `#151923`.
- Secondary text: `#626B78`.
- Primary accent: electric violet or cobalt, used sparingly.
- Prioritas Utama: controlled green.
- Quick Wins: blue.
- Tantangan: amber.
- Prioritas Rendah: muted coral.
Semantic colors must be paired with quadrant labels and icons; never rely on color alone.

## 4. Three.js — meaningful 3D, not decoration

Use **Three.js** for a real, interactive 3D scene that contributes to understanding the ideas.

### Main 3D experience
Create an interactive 3D “Idea Space” as a hero/overview experience:
- A clean 3D coordinate plane with X = Feasibility and Y = Impact.
- Use the Z axis only for visual depth / slight separation of overlapping markers; do not imply a third score.
- Ten idea nodes positioned from the original Feasibility and Impact scores.
- Distinct but restrained materials for quadrant categories.
- Subtle lighting, shadows, ambient occlusion-like styling if performant, and polished material response.
- Orbit controls: gentle rotate and zoom; default camera should present the matrix clearly.
- Hover: highlight a node and show a tooltip with idea number, name, Feasibility, Impact, total.
- Click: select a node and synchronize the inspector/list.
- Selected three ideas should have a subtle outline or halo, not an oversized badge.
- Add small coordinate grid, axis titles, and quadrant plane labels.
- Use deterministic tiny Z offsets only to separate coincident points. The original X/Y scores remain exact and visible.
- Include a 2D toggle because a teacher may prefer a conventional matrix and because accessibility/performance matters.
- Respect `prefers-reduced-motion`; provide a static fallback if WebGL is unavailable.

### 3D visual quality
- The scene should look like a designed data sculpture / product visualization, not a game.
- Avoid cartoonish toy-like shapes, emoji objects, excessive bloom, neon overload, and spinning objects.
- Use refined spheres, rounded geometric markers, thin grid lines, soft shadows, and controlled lighting.
- Camera movement should be smooth and restrained.
- The 3D scene must load quickly and not block access to the matrix or content.

### Technical approach
- Inspect existing dependencies first.
- Prefer native Three.js if no 3D framework exists.
- If React is used, @react-three/fiber is optional, not mandatory.
- Add dependencies only when necessary. If installing `three` or helpers, explain the package and why in the execution summary.
- Clean up render loops, event listeners, and WebGL resources correctly.
- Use responsive canvas sizing and device-pixel-ratio limits for mobile.
- Do not use Three.js for every card or section. Keep the rest of the site fast and semantic HTML/CSS.

## 5. Recompose the page — fewer, stronger sections

### Section A — Cinematic hero / Idea Space
- Compact navigation, not a large floating capsule.
- Strong title: **“Ten ideas. One clear direction.”**
- One concise explanation of the LKPD exercise.
- 3D scene takes meaningful space (not a tiny illustration in a card).
- A slim summary strip: 10 ideas, 3 original selected ideas, average score, 4 quadrants.
- Primary action: “Explore the matrix”.
- Secondary action: “Presentation mode”.

### Section B — Main decision matrix
This is the core of the product and should occupy the strongest visual area.
- Large, clear matrix with generous plot area.
- X-axis Feasibility (1–5); Y-axis Impact (1–5).
- Use a real coordinate system/grid, quadrant separators and clear axis direction.
- Use exact scores from LKPD.
- Make overlapping coordinates selectable. For ideas 2 and 3, show a clustered/stacked marker or small deterministic Z offset in 3D and a clear selection list in 2D.
- A segmented toggle switches between **3D Space** and **2D Matrix**.
- Keep the selected idea inspector beside the matrix on desktop and below it on mobile.
- Do not let tooltips cover the axes or other data.

### Section C — Matrix views / decision lenses
Do not invent new scores. Build multiple views from the same two original dimensions:
1. **Full portfolio matrix:** all ten ideas.
2. **Priority matrix:** focus/highlight only the original three selected ideas, with other ideas ghosted in the background for context.
3. **Quadrant comparison:** four small, consistent mini-matrices showing which ideas belong to each quadrant. Each uses the same Feasibility/Impact logic and exact scores.
4. **Score ranking:** a clean horizontal bar/list ranking by total score (Feasibility + Impact), with ties preserved. This is a derived view, not another scoring system.
These are alternate visual lenses over the same LKPD data, not new evaluation criteria.

### Section D — Idea explorer
- Use a clean table or compact editorial list, not a grid of ten rounded cards.
- Show number, idea name, SCAMPER, Feasibility, Impact, total, quadrant.
- Filters: quadrant and SCAMPER.
- Search by idea name.
- Clicking a row selects the idea and synchronizes the matrix/inspector.
- Ensure table is readable on phone (horizontal scroll or responsive row layout).

### Section E — Three selected concepts
Present the original selected three:
- SmartMargin Guard
- ReversePrice Planner
- Simulasi Multi-Platform
Explain the selection based on the LKPD conclusion: relevance to Kak Zahira's problem, quick net-margin calculation, protection of the stated 35%–50% margin context, and feasibility for a student web prototype.
Do not auto-change the original selection when users simulate scores.

### Section F — Critical implementation considerations
Use a clear editorial layout with numbered points, not a wall of pastel cards:
- Components of net-margin calculation (HPP, admin fee, service fee, discount).
- Marketplace fee presets must be maintainable as fees change.
- 35%–50% is the team's stated context, not a universal rule.
- Direct marketplace API integration has high dependency risk for a student prototype.
- Validate whether instant safe/danger indicators help admins make decisions.
Clearly label which points come from LKPD and which are implementation recommendations.

### Section G — Presentation / export
- Presentation mode should hide editing controls and focus on the story.
- Large matrix and labels suitable for projector.
- Provide clear section navigation.
- Print / Save PDF and CSV export.
- State that simulation changes are local unless a backend is explicitly implemented.

## 6. Matrix logic and source data — do not alter

Use the ten idea names, SCAMPER labels, original scores, rationale, and selected trio from the existing `IdeaQuest_Design.md` and the original LKPD source. Preserve exact terminology and do not fabricate facts.

Initial scores:

| No. | Idea | Feasibility | Impact | Total |
|---:|---|---:|---:|---:|
| 1 | Kalkulator Margin Otomatis & Peringatan Batas Aman (Margin Alert) | 5 | 5 | 10 |
| 2 | Kalkulator Reverse Margin (Target Laba ke Harga Jual) | 4 | 5 | 9 |
| 3 | Simulasi Multi-Platform E-Commerce dengan Preset Biaya Admin | 4 | 5 | 9 |
| 4 | Slider Simulasi Harga & Diskon Real-Time | 5 | 3 | 8 |
| 5 | Sistem Rekomendasi Batas Maksimal Diskon | 4 | 3 | 7 |
| 6 | Generator Laporan Rekap Potongan Promo Harian | 3 | 4 | 7 |
| 7 | Kalkulator Bundling Paket Promo + Cek Margin | 3 | 4 | 7 |
| 8 | Audit Promo Otomatis Pasca-Order | 2 | 4 | 6 |
| 9 | Template Preset Promo Cepat (1-Click Promo Terpisah) | 4 | 2 | 6 |
| 10 | Integrasi Sinkronisasi API Langsung ke Marketplace | 1 | 4 | 5 |

Quadrants:
- I Prioritas Utama: Feasibility 4–5, Impact 4–5.
- II Quick Wins: Feasibility 4–5, Impact 1–3.
- III Tantangan: Feasibility 1–3, Impact 4–5.
- IV Prioritas Rendah: Feasibility 1–3, Impact 1–3.

Important source discrepancy: idea 10 is labelled “Prioritas Rendah” in one LKPD table even though its coordinates (1,4) map mathematically to quadrant III (low Feasibility, high Impact). Preserve the source label as a note in its inspector, but plot it in quadrant III according to its scores. Do not silently “fix” the source.

Threshold: High = 4–5; Low = 1–3. Total = Feasibility + Impact. Do not convert the values to negative/positive SWOT coordinates.

## 7. Interaction requirements

- Select any node from 3D scene, 2D matrix, or idea table.
- All views remain synchronized.
- Sliders change only simulated/current scores; original LKPD scores remain visible.
- Clearly mark modified ideas as “Simulasi”.
- Reset one idea and reset all ideas.
- Filters/search work.
- 3D/2D toggle works.
- Presentation mode works.
- CSV includes original and simulated/current scores, SCAMPER, total, and current quadrant.
- Keyboard alternative for all 3D interactions.
- WebGL fallback must be functional, not an empty canvas.

## 8. Responsive and performance standards

- Desktop: wide, editorial layout with matrix and inspector side by side.
- Tablet: stack thoughtfully; keep plot legible.
- Mobile: no tiny matrix, no overflowing canvas, no clipped inspector, no horizontal page overflow.
- Lazy-load 3D scene if appropriate.
- Cap pixel ratio on mobile.
- Avoid expensive postprocessing unless demonstrably needed.
- Ensure text remains accessible when WebGL is disabled.

## 9. Implementation workflow for the coding agent

1. Read this document and the existing `IdeaQuest_Design.md`.
2. Inspect project structure, framework, package manager, current page, styles, assets, and instructions (`AGENTS.md`, README).
3. Identify exactly why the current implementation looks generic and list the files to change.
4. Implement the redesign in the existing project; do not rebuild unrelated parts.
5. Add Three.js only if not already available and genuinely needed for the scene.
6. Use the existing source data as canonical data; avoid duplicating hardcoded versions across components.
7. Run lint, typecheck, and build where available.
8. Test all interactions and responsive breakpoints.
9. Report files changed, packages added, tests run, and known limitations.

Do not stop after producing a plan. Execute the redesign.

## 10. Definition of done

The result is accepted only if:
- It no longer resembles the current generic pastel card dashboard.
- Typography is deliberate, legible, and consistent.
- The 3D scene is real Three.js/WebGL and directly visualizes the idea space.
- The 2D matrix remains available and accurate.
- Multiple matrix/data views provide useful ways to understand the same LKPD scores.
- All ten ideas and original scores are correct.
- The three original selected concepts are clear and justified.
- No new scoring criteria or unsupported facts are invented.
- Mobile, desktop, and presentation mode are polished.
- All controls work and checks are reported honestly.
