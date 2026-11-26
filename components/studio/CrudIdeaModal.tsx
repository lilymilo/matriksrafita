'use client';

import React, { useEffect, useState } from 'react';
import { SCAMPER_OPTIONS } from '@/lib/data/lkpd-data';
import { validateIdeaInput } from '@/lib/domain/crud';
import { getQuadrantMeta, getScoreLevelMeta, getTotalScore } from '@/lib/domain/matrix-math';
import { useWorkspaceSelector, workspaceActions } from '@/lib/store/useIdeaQuestStore';
import type { CreateOrUpdateIdeaInput, ScamperCode } from '@/types/idea';
import { Icon } from '@/components/ui/Icons';

const DEFAULT_FORM: CreateOrUpdateIdeaInput = {
  name: '',
  shortLabel: '',
  description: '',
  scamperCode: 'S',
  feasibility: 4,
  impact: 4,
  sellerBenefit: '',
  buyerBenefit: '',
  rationale: '',
};

export function CrudIdeaModal() {
  const crudModal = useWorkspaceSelector((s) => s.crudModal);
  const ideas = useWorkspaceSelector((s) => s.ideas);

  const editingIdea =
    crudModal.mode === 'edit' && crudModal.editingId !== null
      ? ideas.find((i) => i.id === crudModal.editingId) ?? null
      : null;

  const [form, setForm] = useState<CreateOrUpdateIdeaInput>(DEFAULT_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateOrUpdateIdeaInput, string>>>({});

  useEffect(() => {
    if (!crudModal.open) return;
    if (editingIdea) {
      setForm({
        name: editingIdea.name,
        shortLabel: editingIdea.shortLabel,
        description: editingIdea.description,
        scamperCode: editingIdea.scamperCode,
        feasibility: editingIdea.feasibility,
        impact: editingIdea.impact,
        sellerBenefit: editingIdea.sellerBenefit,
        buyerBenefit: editingIdea.buyerBenefit,
        rationale: editingIdea.rationale,
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
  }, [crudModal.open, crudModal.mode, editingIdea]);

  useEffect(() => {
    if (!crudModal.open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        workspaceActions.closeCrudModal();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [crudModal.open]);

  if (!crudModal.open) return null;

  const previewQuad = getQuadrantMeta(form.feasibility, form.impact);
  const previewTotal = getTotalScore(form.feasibility, form.impact);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateIdeaInput(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    if (crudModal.mode === 'edit' && editingIdea) {
      workspaceActions.updateIdea(editingIdea.id, form);
    } else {
      workspaceActions.createIdea(form);
    }
  };

  return (
    <div
      className="drawer-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crud-drawer-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) workspaceActions.closeCrudModal();
      }}
    >
      <aside className="drawer-panel drawer-panel--form">
        <div className="drawer-panel__head">
          <div>
            <div className="drawer-panel__meta">
              {crudModal.mode === 'edit' && editingIdea
                ? `Mengedit Ide #${editingIdea.id}`
                : 'Kelola Daftar Ide'}
            </div>
            <h2 id="crud-drawer-title" className="drawer-panel__title">
              {crudModal.mode === 'edit' ? 'Edit Rincian & Skor Ide' : 'Tambah Ide Baru'}
            </h2>
          </div>

          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() => workspaceActions.closeCrudModal()}
            aria-label="Tutup panel form"
          >
            <Icon name="close" size={16} />
            <span>Tutup</span>
          </button>
        </div>

        <form className="drawer-panel__form" onSubmit={handleSubmit} noValidate>
          <div className="drawer-panel__body">
            {editingIdea?.origin === 'lkpd' && (
              <div
                className="callout-box"
                style={{ borderLeftColor: 'var(--accent)', background: 'var(--accent-tint)' }}
              >
                Anda sedang mengedit ide awal LKPD 5. Perubahan langsung terlihat di seluruh tampilan matriks dan dapat dikembalikan ke skor asli kapan saja.
              </div>
            )}

            <div className="form-section-group">
              <div>
                <label htmlFor="idea-name" className="field-label">
                  Nama Ide *
                </label>
                <input
                  id="idea-name"
                  type="text"
                  className="field-input"
                  placeholder="Contoh: Kalkulator Diskon Bertingkat"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="form-grid-2">
                <div>
                  <label htmlFor="idea-short" className="field-label">
                    Nama Pendek di Peta (Opsional)
                  </label>
                  <input
                    id="idea-short"
                    type="text"
                    className="field-input"
                    placeholder="Contoh: Diskon Bertingkat"
                    value={form.shortLabel ?? ''}
                    onChange={(e) => setForm({ ...form, shortLabel: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="idea-scamper" className="field-label">
                    Kategori SCAMPER *
                  </label>
                  <select
                    id="idea-scamper"
                    className="field-select"
                    value={form.scamperCode}
                    onChange={(e) =>
                      setForm({ ...form, scamperCode: e.target.value as ScamperCode })
                    }
                  >
                    {SCAMPER_OPTIONS.map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.scamperCode && <span className="field-error">{errors.scamperCode}</span>}
                </div>
              </div>
            </div>

            <div className="form-section-group">
              <div className="form-grid-2">
                <div>
                  <label htmlFor="idea-feasibility" className="field-label">
                    Skor Kelayakan (1–5) *
                  </label>
                  <select
                    id="idea-feasibility"
                    className="field-select mono"
                    value={form.feasibility}
                    onChange={(e) => setForm({ ...form, feasibility: Number(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5].map((score) => (
                      <option key={score} value={score}>
                        {score} — {getScoreLevelMeta(score).summary}
                      </option>
                    ))}
                  </select>
                  {errors.feasibility && <span className="field-error">{errors.feasibility}</span>}
                </div>

                <div>
                  <label htmlFor="idea-impact" className="field-label">
                    Skor Dampak (1–5) *
                  </label>
                  <select
                    id="idea-impact"
                    className="field-select mono"
                    value={form.impact}
                    onChange={(e) => setForm({ ...form, impact: Number(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5].map((score) => (
                      <option key={score} value={score}>
                        {score} — {getScoreLevelMeta(score).summary}
                      </option>
                    ))}
                  </select>
                  {errors.impact && <span className="field-error">{errors.impact}</span>}
                </div>
              </div>

              <div className="drawer-score-preview">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`q-dot q-dot--${previewQuad.colorKey}`} />
                  <span>
                    Masuk Kuadran: <strong>{previewQuad.roman} · {previewQuad.name}</strong>
                  </span>
                </span>
                <strong className="mono">Total {previewTotal}/10</strong>
              </div>
            </div>

            <div className="form-section-group">
              <div>
                <label htmlFor="idea-desc" className="field-label">
                  Deskripsi Singkat Ide *
                </label>
                <textarea
                  id="idea-desc"
                  className="field-textarea"
                  placeholder="Jelaskan cara kerja singkat ide ini..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                {errors.description && <span className="field-error">{errors.description}</span>}
              </div>

              <div>
                <label htmlFor="idea-rationale" className="field-label">
                  Alasan Pemilihan &amp; Penilaian *
                </label>
                <textarea
                  id="idea-rationale"
                  className="field-textarea"
                  placeholder="Mengapa ide ini mendapat skor kelayakan dan dampak tersebut?"
                  value={form.rationale}
                  onChange={(e) => setForm({ ...form, rationale: e.target.value })}
                />
                {errors.rationale && <span className="field-error">{errors.rationale}</span>}
              </div>

              <div className="form-grid-2">
                <div>
                  <label htmlFor="idea-seller" className="field-label">
                    Manfaat bagi Penjual / Admin *
                  </label>
                  <textarea
                    id="idea-seller"
                    className="field-textarea"
                    placeholder="Manfaat bagi admin atau pemilik toko..."
                    value={form.sellerBenefit}
                    onChange={(e) => setForm({ ...form, sellerBenefit: e.target.value })}
                  />
                  {errors.sellerBenefit && (
                    <span className="field-error">{errors.sellerBenefit}</span>
                  )}
                </div>

                <div>
                  <label htmlFor="idea-buyer" className="field-label">
                    Manfaat bagi Pembeli *
                  </label>
                  <textarea
                    id="idea-buyer"
                    className="field-textarea"
                    placeholder="Manfaat bagi pelanggan..."
                    value={form.buyerBenefit}
                    onChange={(e) => setForm({ ...form, buyerBenefit: e.target.value })}
                  />
                  {errors.buyerBenefit && <span className="field-error">{errors.buyerBenefit}</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="drawer-panel__foot">
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => workspaceActions.closeCrudModal()}
            >
              Batal
            </button>
            <button type="submit" className="btn btn--primary">
              <Icon name="check" size={16} />
              <span>{crudModal.mode === 'edit' ? 'Simpan Perubahan' : 'Tambahkan Ide'}</span>
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
