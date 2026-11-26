'use client';

import React, { useEffect, useState } from 'react';
import { useWorkspaceSelector, workspaceActions } from '@/lib/store/useIdeaQuestStore';
import { Icon } from '@/components/ui/Icons';

export function DeleteConfirmDialog() {
  const deleteDialog = useWorkspaceSelector((s) => s.deleteDialog);
  const ideas = useWorkspaceSelector((s) => s.ideas);
  const [unlockLkpd, setUnlockLkpd] = useState(false);

  const targetIdea =
    deleteDialog.targetId !== null
      ? ideas.find((item) => item.id === deleteDialog.targetId) ?? null
      : null;

  useEffect(() => {
    setUnlockLkpd(false);
  }, [deleteDialog.open, deleteDialog.targetId]);

  if (!deleteDialog.open || !targetIdea) return null;

  const isLkpdSeed = targetIdea.origin === 'lkpd';

  return (
    <div
      className="modal-backdrop"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) workspaceActions.closeDeleteDialog();
      }}
    >
      <div className="modal-sheet modal-sheet--sm">
        <div className="modal-sheet__head">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Icon name={isLkpdSeed ? 'shield' : 'alert'} size={20} />
            <h2 id="delete-dialog-title" style={{ margin: 0, fontSize: '1.2rem' }}>
              {isLkpdSeed ? 'Data Awal LKPD 5 Dilindungi' : 'Konfirmasi Hapus Ide'}
            </h2>
          </div>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => workspaceActions.closeDeleteDialog()}
            aria-label="Tutup"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="modal-sheet__body">
          <p style={{ margin: 0, fontSize: '1rem' }}>
            Ide yang dipilih: <strong>#{targetIdea.id} — {targetIdea.name}</strong>
          </p>

          {isLkpdSeed ? (
            <>
              <div className="callout-box">
                Ide ini termasuk 10 data awal LKPD 5 sehingga tidak dihapus permanen. Anda hanya dapat menyembunyikannya sementara dari tampilan simulasi dan memulihkannya kembali kapan saja.
              </div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontSize: '0.94rem',
                  lineHeight: 1.5,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={unlockLkpd}
                  onChange={(e) => setUnlockLkpd(e.target.checked)}
                  style={{ marginTop: '4px', width: '16px', height: '16px' }}
                />
                <span>
                  Ya, saya ingin menyembunyikan ide awal LKPD ini sementara dari tampilan simulasi.
                </span>
              </label>
            </>
          ) : (
            <p style={{ margin: 0, color: 'var(--ink-secondary)', fontSize: '0.96rem', lineHeight: 1.6 }}>
              Ide tambahan ini akan dihapus dari penyimpanan browser lokal. 10 data awal LKPD 5 tetap aman.
            </p>
          )}
        </div>

        <div className="modal-sheet__foot">
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => workspaceActions.closeDeleteDialog()}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn btn--danger"
            disabled={isLkpdSeed && !unlockLkpd}
            onClick={() => workspaceActions.confirmDeleteIdea(targetIdea.id, unlockLkpd)}
          >
            <Icon name="trash" size={15} />
            <span>{isLkpdSeed ? 'Sembunyikan Sementara' : 'Hapus Ide'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
