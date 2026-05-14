import { useState, useEffect, useRef, useCallback } from 'react';

// Walk-session step counter used by WalkScreen.
// Counts incremental steps from the start of a session (not all-day total).
// Uses the native StepCounter service when on Android, DeviceMotion on web.

function getNativePlugin() {
  try {
    const cap = window.Capacitor;
    if (cap?.isNativePlatform?.() && cap?.Plugins?.StepCounter) {
      return cap.Plugins.StepCounter;
    }
  } catch {}
  return null;
}

export function useStepCounter(enabled = true) {
  const [steps, setSteps] = useState(0);
  const [supported, setSupported] = useState(null);
  const [permission, setPermission] = useState('unknown');

  // ── Native path (Android foreground service) ─────────────────────────────
  const nativeBaseRef = useRef(null); // baseline at session start
  const isNativeRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const plugin = getNativePlugin();
    if (!plugin) return;

    isNativeRef.current = true;
    setSupported(true);
    setPermission('granted');
    let cancelled = false;

    const poll = async () => {
      if (cancelled) return;
      try {
        const { steps: todayTotal } = await plugin.getTodaySteps();
        const total = Number(todayTotal) || 0;
        if (nativeBaseRef.current === null) {
          nativeBaseRef.current = total; // record baseline at session start
        }
        if (!cancelled) setSteps(Math.max(0, total - nativeBaseRef.current));
      } catch {}
    };

    plugin.startService().catch(() => {});
    poll();
    const id = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [enabled]);

  // ── Web / DeviceMotion fallback ───────────────────────────────────────────
  const smoothed = useRef(9.8);
  const lastPeak = useRef(false);
  const lastStepTime = useRef(0);
  const stepsRef = useRef(0);
  const isAttachedRef = useRef(false);
  const lastEmitRef = useRef(0);
  const staleHeartbeatRef = useRef(0);
  const skipSpikeUntilRef = useRef(0);

  const handleMotion = useCallback((e) => {
    const a = e.accelerationIncludingGravity;
    if (!a || a.x == null) return;
    const mag = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    if (!Number.isFinite(mag)) return;
    if (mag > 35) { skipSpikeUntilRef.current = Date.now() + 300; return; }
    if (Date.now() < skipSpikeUntilRef.current) return;
    smoothed.current = smoothed.current * 0.85 + mag * 0.15;
    const signal = mag - smoothed.current;
    const now = Date.now();
    const isHigh = signal > 2.2;
    if (isHigh && !lastPeak.current && now - lastStepTime.current > 280) {
      stepsRef.current += 1;
      if (now - lastEmitRef.current > 450) {
        setSteps(stepsRef.current);
        lastEmitRef.current = now;
      }
      lastStepTime.current = now;
      staleHeartbeatRef.current = now;
    }
    lastPeak.current = isHigh;
  }, []);

  const attachListener = useCallback(() => {
    if (typeof window === 'undefined' || isAttachedRef.current) return;
    window.addEventListener('devicemotion', handleMotion);
    isAttachedRef.current = true;
  }, [handleMotion]);

  const detachListener = useCallback(() => {
    if (typeof window === 'undefined' || !isAttachedRef.current) return;
    window.removeEventListener('devicemotion', handleMotion);
    isAttachedRef.current = false;
  }, [handleMotion]);

  useEffect(() => {
    if (isNativeRef.current) return;
    if (!enabled) { detachListener(); return; }
    if (typeof window === 'undefined' || !window.DeviceMotionEvent) {
      setSupported(false); return;
    }
    setSupported(true);
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      setPermission((prev) => (prev === 'granted' ? prev : 'prompt'));
    } else {
      setPermission('granted');
      attachListener();
    }
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && permission === 'granted' && enabled) attachListener();
      else detachListener();
    };
    // Recover listener after webview stalls (30 s of silence)
    const heartbeat = setInterval(() => {
      if (!enabled || permission !== 'granted') return;
      const staleMs = Date.now() - Math.max(staleHeartbeatRef.current, lastStepTime.current || 0);
      if (document.visibilityState === 'visible' && staleMs > 30_000) {
        detachListener();
        attachListener();
      }
    }, 15_000);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      clearInterval(heartbeat);
      document.removeEventListener('visibilitychange', handleVisibility);
      detachListener();
    };
  }, [attachListener, detachListener, enabled, permission]);

  const requestPermission = useCallback(async () => {
    if (isNativeRef.current) return;
    if (typeof window === 'undefined' || !window.DeviceMotionEvent) { setPermission('denied'); return; }
    if (typeof DeviceMotionEvent.requestPermission !== 'function') {
      setPermission('granted'); attachListener(); return;
    }
    try {
      const result = await DeviceMotionEvent.requestPermission();
      setPermission(result);
      if (result === 'granted') attachListener();
    } catch { setPermission('denied'); }
  }, [attachListener]);

  const reset = useCallback(() => {
    if (isNativeRef.current) {
      // Reset session baseline so steps count from zero again
      nativeBaseRef.current = null;
      setSteps(0);
      return;
    }
    stepsRef.current = 0;
    lastPeak.current = false;
    lastStepTime.current = 0;
    smoothed.current = 9.8;
    lastEmitRef.current = 0;
    staleHeartbeatRef.current = Date.now();
    skipSpikeUntilRef.current = 0;
    setSteps(0);
  }, []);

  return { steps, supported, permission, requestPermission, reset };
}
