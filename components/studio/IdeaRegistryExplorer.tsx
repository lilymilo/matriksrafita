'use client';

import React, { useMemo } from 'react';
import { QUADRANTS, QUADRANT_IDS, SCAMPER_OPTIONS } from '@/lib/data/lkpd-data';
import {
  filterAndSortIdeas,
  getQuadrantMeta,
  getTotalScore,
} from '@/lib/domain/matrix-math';
import { useWorkspaceSelector, workspaceActions } from '@/lib/store/useIdeaQuestStore';
import type { QuadrantId, ScamperCode, SortField } from '@/types/idea';
import { Icon } from '@/components/ui/Icons';

export function IdeaRegistryExplorer() {
  const ideas = useWorkspaceSelector((s) => s.ideas);
  const filters = useWorkspaceSelector((s) => s.filters);
  const selectedIdeaId = useWorkspaceSelector((s) => s.selectedIdeaId);
  const hiddenCount = useWorkspaceSelector((s) => s.payload.hiddenLkpdIds.length);

  const filteredIdeas = useMemo(() => filterAndSortIdeas(ideas, filters), [ideas, filters]);

  const hasActiveFilter =
    filters.search.trim().length > 0 ||
    filters.quadrant !== 'all' ||
    filters.scamper !== 'all' ||
    filters.sortBy !== 'idAsc';

  return (
    <section
      id="semua-ide"
      className="editorial-section"
      aria-labelledby="registry-heading"
    >
      <div className="section-header">
        <div>
          <p className="section-kicker">Daftar &amp; Pengelolaan Ide</p>
          <h2 id="registry-heading" className="section-title">
            Semua Ide ({filteredIdeas.length})
          </h2>
          <p className="section-lead">
            Bandingkan seluruh ide secara ringkas. Klik salah satu ide untuk membaca detail lengkap, atau gunakan tombol Edit dan Hapus.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {hiddenCount > 0 && (
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => workspaceActions.restoreLkpdData(true)}
            >
              <Icon name="reset" size={16} />
              <span>Pulihkan {hiddenCount} Ide Awal</span>
            </button>
          )}
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => workspaceActions.openCreateModal()}
          >
            <Icon name="plus" size={16} />
            <span>Tambah Ide</span>
          </button>
        </div>
      </div>

      <div className="explorer-controls">
        <div>
          <label htmlFor="explorer-search" className="sr-only">
            Cari ide
          </label>
          <input
            id="explorer-search"
            type="search"
            className="field-input"
            placeholder="Cari nama ide atau kata kunci..."
            value={filters.search}
            onChange={(e) => workspaceActions.setFilters({ search: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="explorer-quadrant" className="sr-only">
            Saring berdasarkan Kuadran
          </label>
          <select
            id="explorer-quadrant"
            className="field-select"
            value={filters.quadrant}
            onChange={(e) =>
              workspaceActions.setFilters({
                quadrant: e.target.value as 'all' | QuadrantId,
              })
            }
          >
            <option value="all">Semua Kuadran</option>
            {QUADRANT_IDS.map((qId) => (
              <option key={qId} value={qId}>
                Kuadran {QUADRANTS[qId].roman} — {QUADRANTS[qId].name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="explorer-scamper" className="sr-only">
            Saring berdasarkan Kategori SCAMPER
          </label>
          <select
            id="explorer-scamper"
            className="field-select"
            value={filters.scamper}
            onChange={(e) =>
              workspaceActions.setFilters({
                scamper: e.target.value as 'all' | ScamperCode,
              })
            }
          >
            <option value="all">Semua Kategori SCAMPER</option>
            {SCAMPER_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.short}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="explorer-sort" className="sr-only">
            Urutkan daftar ide
          </label>
          <select
            id="explorer-sort"
            className="field-select"
            value={filters.sortBy}
            onChange={(e) =>
              workspaceActions.setFilters({
                sortBy: e.target.value as SortField,
              })
            }
          >
            <option value="idAsc">Urutan Nomor (#1 → Akhir)</option>
            <option value="totalDesc">Total Skor Tertinggi</option>
            <option value="totalAsc">Total Skor Terendah</option>
            <option value="feasibilityDesc">Kelayakan Tertinggi</option>
            <option value="impactDesc">Dampak Tertinggi</option>
            <option value="nameAsc">Nama Ide (A → Z)</option>
          </select>
        </div>
      </div>

      {hasActiveFilter && (
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() => workspaceActions.resetFilters()}
          >
            <Icon name="reset" size={15} />
            <span>Tampilkan Semua Ide</span>
          </button>
        </div>
      )}

      {filteredIdeas.length === 0 ? (
        <div className="stage-panel" style={{ padding: '44px 24px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 18px', fontSize: '1rem', color: 'var(--ink-secondary)' }}>
            Tidak ada ide yang cocok dengan pencarian atau filter yang dipilih.
          </p>
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => workspaceActions.resetFilters()}
          >
            Reset Pencarian &amp; Filter
          </button>
        </div>
      ) : (
        <>
          {/* Desktop & Tablet Table */}
          <div className="table-scroll desktop-table-wrap">
            <table className="editorial-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Ide &amp; Ringkasan</th>
                  <th>Kelayakan</th>
                  <th>Dampak</th>
                  <th>Total</th>
                  <th>Kuadran</th>
                  <th>Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {filteredIdeas.map((idea) => {
                  const q = getQuadrantMeta(idea.feasibility, idea.impact);
                  const total = getTotalScore(idea.feasibility, idea.impact);
                  const isSelected = idea.id === selectedIdeaId;

                  return (
                    <tr
                      key={idea.id}
                      className={`${isSelected ? 'is-selected' : ''} ${
                        idea.isOriginalFinalSelection ? 'is-trio-row' : ''
                      }`}
                      onClick={() => workspaceActions.selectIdea(idea.id, true)}
                    >
                      <td className="mono table-id-cell">#{idea.id}</td>
                      <td>
                        <div className="table-idea-head">
                          <strong className="table-idea-name">{idea.name}</strong>
                          {idea.isOriginalFinalSelection && idea.conceptName && (
                            <span className="trio-badge">
                              <Icon name="star" size={13} />
                              <span>Ide Terpilih · {idea.conceptName}</span>
                            </span>
                          )}
                        </div>
                        <p className="table-idea-desc">{idea.description}</p>
                        {(idea.isModified || idea.origin === 'custom' || idea.id === 10) && (
                          <div className="table-idea-meta">
                            {idea.origin === 'custom' && (
                              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                                Ide tambahan
                              </span>
                            )}
                            {idea.isModified && (
                              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                                Skor diubah (asli: Kelayakan {idea.originalFeasibility}, Dampak {idea.originalImpact})
                              </span>
                            )}
                            {idea.id === 10 && (
                              <span className="text-peach" style={{ fontWeight: 600 }}>
                                Catatan LKPD: tertulis &ldquo;Prioritas Rendah&rdquo; di tabel dokumen
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="mono table-score-cell">
                        <strong>{idea.feasibility}</strong>
                        <span>/5</span>
                      </td>
                      <td className="mono table-score-cell">
                        <strong className="text-mint">{idea.impact}</strong>
                        <span>/5</span>
                      </td>
                      <td className="mono table-score-cell">
                        <strong>{total}</strong>
                        <span>/10</span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <span className="quad-inline-badge">
                          <span className={`q-dot q-dot--${q.colorKey}`} />
                          <span>{q.name}</span>
                        </span>
                      </td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        <div className="table-actions-group">
                          <button
                            type="button"
                            className="btn btn--outline btn--sm"
                            onClick={() => workspaceActions.openEditModal(idea.id)}
                          >
                            <Icon name="edit" size={15} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn--danger-outline btn--sm"
                            onClick={() => workspaceActions.requestDeleteIdea(idea.id)}
                          >
                            <Icon name="trash" size={15} />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Card List (replaces squeezed desktop table on phones) */}
          <div className="mobile-idea-list">
            {filteredIdeas.map((idea) => {
              const q = getQuadrantMeta(idea.feasibility, idea.impact);
              const total = getTotalScore(idea.feasibility, idea.impact);
              const isSelected = idea.id === selectedIdeaId;

              return (
                <article
                  key={idea.id}
                  className={`mobile-idea-card ${isSelected ? 'is-selected' : ''} ${
                    idea.isOriginalFinalSelection ? 'is-trio-card' : ''
                  }`}
                >
                  <div
                    className="mobile-idea-card__clickable"
                    onClick={() => workspaceActions.selectIdea(idea.id, true)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        workspaceActions.selectIdea(idea.id, true);
                      }
                    }}
                  >
                    <div className="mobile-idea-card__top">
                      <span className="mono" style={{ fontWeight: 700, color: 'var(--ink-secondary)' }}>
                        Ide #{idea.id}
                      </span>
                      <span className="quad-inline-badge">
                        <span className={`q-dot q-dot--${q.colorKey}`} />
                        <span>{q.name}</span>
                      </span>
                    </div>

                    {idea.isOriginalFinalSelection && idea.conceptName && (
                      <div style={{ marginBottom: '8px' }}>
                        <span className="trio-badge">
                          <Icon name="star" size={13} />
                          <span>Ide Terpilih · {idea.conceptName}</span>
                        </span>
                      </div>
                    )}

                    <h3 className="mobile-idea-card__title">{idea.name}</h3>
                    <p className="mobile-idea-card__desc">{idea.description}</p>

                    <div className="mobile-idea-card__scores">
                      <div>
                        <span className="mobile-score-label">Kelayakan</span>
                        <strong className="mono">{idea.feasibility}/5</strong>
                      </div>
                      <div>
                        <span className="mobile-score-label">Dampak</span>
                        <strong className="mono text-mint">{idea.impact}/5</strong>
                      </div>
                      <div>
                        <span className="mobile-score-label">Total</span>
                        <strong className="mono">{total}/10</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mobile-idea-card__actions">
                    <button
                      type="button"
                      className="btn btn--outline btn--sm"
                      onClick={() => workspaceActions.selectIdea(idea.id, true)}
                    >
                      <span>Detail</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn--outline btn--sm"
                      onClick={() => workspaceActions.openEditModal(idea.id)}
                    >
                      <Icon name="edit" size={15} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn--danger-outline btn--sm"
                      onClick={() => workspaceActions.requestDeleteIdea(idea.id)}
                    >
                      <Icon name="trash" size={15} />
                      <span>Hapus</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
