import type { PerformanceSnapshot } from '@/types/idea';

type TelemetryListener = () => void;

class PerformanceTelemetryEngine {
  private snapshot: PerformanceSnapshot = {
    initialPageLoadMs: null,
    threeInitMs: null,
    lastCrudDurationMs: null,
    lastCrudOperation: null,
    lastScoreChangeMs: null,
    frameTimeMs: null,
    fps: null,
    reactRenderCount: 0,
    lastReactCommitMs: null,
    maxReactCommitMs: null,
    longTaskCount: 0,
    maxLongTaskMs: null,
    lcpMs: null,
    inpMs: null,
    clsScore: null,
    jsBundleBytes: null,
    jsResourceCount: null,
    lowPerfMode: false,
  };

  private listeners = new Set<TelemetryListener>();
  private initialized = false;
  private observers: PerformanceObserver[] = [];
  private rafId: number | null = null;
  private samplerActive = false;
  private cleanupInteractionFallback: (() => void) | null = null;

  getSnapshot = (): PerformanceSnapshot => this.snapshot;

  subscribe = (listener: TelemetryListener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private emit() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  private patch(partial: Partial<PerformanceSnapshot>) {
    this.snapshot = {
      ...this.snapshot,
      ...partial,
    };
    this.emit();
  }

  initBrowserObservers() {
    if (this.initialized || typeof window === 'undefined' || typeof performance === 'undefined') {
      return;
    }
    this.initialized = true;

    const readNavigationAndResources = () => {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries.length > 0) {
        const nav = navEntries[0];
        const loadMs =
          nav.loadEventEnd > 0
            ? nav.loadEventEnd - nav.startTime
            : nav.domContentLoadedEventEnd > 0
              ? nav.domContentLoadedEventEnd - nav.startTime
              : null;
        if (loadMs !== null && loadMs > 0) {
          this.patch({ initialPageLoadMs: Number(loadMs.toFixed(2)) });
        }
      }
      this.refreshBundleMetrics();
    };

    if (document.readyState === 'complete') {
      setTimeout(readNavigationAndResources, 60);
    } else {
      window.addEventListener('load', () => setTimeout(readNavigationAndResources, 60), { once: true });
    }

    let eventTimingSupported = false;

    if (typeof PerformanceObserver !== 'undefined') {
      const supported = PerformanceObserver.supportedEntryTypes || [];

      if (supported.includes('largest-contentful-paint')) {
        try {
          const lcpObs = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const last = entries[entries.length - 1];
            if (last) {
              this.patch({ lcpMs: Number(last.startTime.toFixed(2)) });
            }
          });
          lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });
          this.observers.push(lcpObs);
        } catch {
          // Ignore
        }
      }

      if (supported.includes('layout-shift')) {
        try {
          let clsTotal = 0;
          const clsObs = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const shift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
              if (!shift.hadRecentInput && typeof shift.value === 'number') {
                clsTotal += shift.value;
              }
            }
            this.patch({ clsScore: Number(clsTotal.toFixed(4)) });
          });
          clsObs.observe({ type: 'layout-shift', buffered: true });
          this.observers.push(clsObs);
        } catch {
          // Ignore
        }
      }

      if (supported.includes('longtask')) {
        try {
          const longObs = new PerformanceObserver((list) => {
            let count = this.snapshot.longTaskCount;
            let maxMs = this.snapshot.maxLongTaskMs ?? 0;
            for (const entry of list.getEntries()) {
              count += 1;
              if (entry.duration > maxMs) {
                maxMs = entry.duration;
              }
            }
            this.patch({
              longTaskCount: count,
              maxLongTaskMs: Number(maxMs.toFixed(2)),
            });
          });
          longObs.observe({ type: 'longtask', buffered: true });
          this.observers.push(longObs);
        } catch {
          // Ignore
        }
      }

      if (supported.includes('event')) {
        try {
          const inpObs = new PerformanceObserver((list) => {
            let worst = this.snapshot.inpMs ?? 0;
            let updated = false;
            for (const entry of list.getEntries()) {
              const evt = entry as PerformanceEntry & { interactionId?: number };
              if ((evt.interactionId && evt.interactionId > 0) || entry.entryType === 'event') {
                if (entry.duration > worst) {
                  worst = entry.duration;
                  updated = true;
                }
              }
            }
            if (updated) {
              this.patch({ inpMs: Number(worst.toFixed(2)) });
            }
          });
          inpObs.observe({
            type: 'event',
            buffered: true,
            durationThreshold: 16,
          } as PerformanceObserverInit);
          this.observers.push(inpObs);
          eventTimingSupported = true;
        } catch {
          eventTimingSupported = false;
        }
      }

      if (supported.includes('resource')) {
        try {
          const resObs = new PerformanceObserver(() => {
            this.refreshBundleMetrics();
          });
          resObs.observe({ type: 'resource', buffered: false });
          this.observers.push(resObs);
        } catch {
          // Ignore
        }
      }
    }

    // Standard RAF next-paint latency measurement on browsers without Event Timing API (e.g. Firefox)
    if (!eventTimingSupported) {
      const measureInteractionPaint = () => {
        const start = performance.now();
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            const elapsed = Number((performance.now() - start).toFixed(2));
            const prevWorst = this.snapshot.inpMs ?? 0;
            if (elapsed > prevWorst) {
              this.patch({ inpMs: elapsed });
            }
          });
        });
      };
      window.addEventListener('click', measureInteractionPaint, { passive: true });
      window.addEventListener('keydown', measureInteractionPaint, { passive: true });
      this.cleanupInteractionFallback = () => {
        window.removeEventListener('click', measureInteractionPaint);
        window.removeEventListener('keydown', measureInteractionPaint);
      };
    }

    this.startFrameMonitor();
  }

  refreshBundleMetrics() {
    if (typeof performance === 'undefined') return;
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    let totalBytes = 0;
    let jsCount = 0;

    for (const r of resources) {
      const isJs =
        r.initiatorType === 'script' ||
        /\.m?js(\?|$)/i.test(r.name) ||
        r.name.includes('/_next/static/chunks/');
      if (!isJs) continue;

      const size =
        r.encodedBodySize > 0
          ? r.encodedBodySize
          : r.transferSize > 0
            ? r.transferSize
            : r.decodedBodySize > 0
              ? r.decodedBodySize
              : 0;
      if (size > 0) {
        totalBytes += size;
        jsCount += 1;
      }
    }

    if (jsCount > 0) {
      this.patch({
        jsBundleBytes: totalBytes,
        jsResourceCount: jsCount,
      });
    }
  }

  startFrameMonitor() {
    if (this.samplerActive || typeof window === 'undefined') return;
    this.samplerActive = true;
    const hasNativeLongTask =
      typeof PerformanceObserver !== 'undefined' &&
      (PerformanceObserver.supportedEntryTypes || []).includes('longtask');

    let lastTime = performance.now();
    let windowStart = lastTime;
    let frameCount = 0;
    let frameDurationAccum = 0;

    const tick = (now: number) => {
      if (!this.samplerActive) return;

      if (document.visibilityState === 'visible') {
        const dt = now - lastTime;
        if (dt > 0 && dt < 300) {
          frameCount += 1;
          frameDurationAccum += dt;

          // If native longtask API is absent, detect main-thread frame stalls > 50ms
          if (!hasNativeLongTask && dt > 50) {
            const nextCount = this.snapshot.longTaskCount + 1;
            const prevMax = this.snapshot.maxLongTaskMs ?? 0;
            this.snapshot = {
              ...this.snapshot,
              longTaskCount: nextCount,
              maxLongTaskMs: Number(Math.max(prevMax, dt).toFixed(2)),
            };
          }
        }

        const elapsed = now - windowStart;
        if (elapsed >= 650 && frameCount > 0) {
          const fps = Math.round((frameCount * 1000) / elapsed);
          const avgFrameMs = frameDurationAccum / frameCount;
          this.patch({
            fps: Math.min(240, Math.max(1, fps)),
            frameTimeMs: Number(avgFrameMs.toFixed(2)),
          });
          windowStart = now;
          frameCount = 0;
          frameDurationAccum = 0;
        }
      } else {
        windowStart = now;
        frameCount = 0;
        frameDurationAccum = 0;
      }

      lastTime = now;
      this.rafId = window.requestAnimationFrame(tick);
    };

    this.rafId = window.requestAnimationFrame(tick);
  }

  recordThreeInit(durationMs: number) {
    this.refreshBundleMetrics();
    this.patch({
      threeInitMs: Number(durationMs.toFixed(2)),
    });
  }

  /**
   * Measures end-to-end CRUD duration from start of state mutation through React DOM paint.
   */
  recordCrudAfterPaint(operationLabel: string, startMs: number) {
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(() => {
        const totalMs = performance.now() - startMs;
        this.patch({
          lastCrudOperation: operationLabel,
          lastCrudDurationMs: Number(totalMs.toFixed(2)),
        });
      });
    } else {
      this.patch({
        lastCrudOperation: operationLabel,
        lastCrudDurationMs: Number((performance.now() - startMs).toFixed(2)),
      });
    }
  }

  /**
   * Measures end-to-end Score Change duration through next visual frame paint.
   */
  recordScoreChangeAfterPaint(startMs: number) {
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(() => {
        const totalMs = performance.now() - startMs;
        this.patch({
          lastScoreChangeMs: Number(totalMs.toFixed(2)),
        });
      });
    } else {
      this.patch({
        lastScoreChangeMs: Number((performance.now() - startMs).toFixed(2)),
      });
    }
  }

  recordCommitDuration(durationMs: number) {
    const rounded = Number(Math.max(0.05, durationMs).toFixed(2));
    const prevMax = this.snapshot.maxReactCommitMs ?? 0;
    this.snapshot = {
      ...this.snapshot,
      reactRenderCount: this.snapshot.reactRenderCount + 1,
      lastReactCommitMs: rounded,
      maxReactCommitMs: Math.max(prevMax, rounded),
    };
  }

  recordReactRender = (
    _id: string,
    _phase: 'mount' | 'update' | 'nested-update',
    actualDuration: number,
  ) => {
    this.recordCommitDuration(actualDuration);
  };

  setLowPerfMode(enabled: boolean) {
    this.patch({ lowPerfMode: enabled });
  }

  dispose() {
    this.samplerActive = false;
    if (this.rafId !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.cleanupInteractionFallback?.();
    this.cleanupInteractionFallback = null;
    for (const obs of this.observers) {
      obs.disconnect();
    }
    this.observers = [];
  }
}

export const telemetry = new PerformanceTelemetryEngine();
