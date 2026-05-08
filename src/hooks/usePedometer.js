import { useState, useEffect, useRef, useCallback } from 'react';
import { Capacitor, registerPlugin } from '@capacitor/core';

const DAY_KEY = () => 'stride:steps:' + new Date().toISOString().slice(0, 10);
const loadSaved = () => { try { return parseInt(localStorage.getItem(DAY_KEY()) || '0', 10); } catch { return 0; } };
const persist   = (n) => { try { localStorage.setItem(DAY_KEY(), String(n)); } catch {} };

const StepCounter = registerPlugin('StepCounter');

export function usePedometer(enabled = true) {
  const [steps, setSteps] = useState(loadSaved);
  const [supported, setSupported] = useState(null);
  const [permission, setPermission] = useState('unknown');

  const stepsRef         = useRef(steps);
  stepsRef.current       = steps;
  const baseRef          = useRef(loadSaved());
  const sensorCountRef   = useRef(0);
  const dayRef           = useRef(DAY_KEY());
  const motionHandlerRef = useRef(null);
  const cleanupRef       = useRef(() => {});

  useEffect(() => { persist(steps); }, [steps]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      const today = DAY_KEY();
      if (today !== dayRef.current) {
        dayRef.current       = today;
        baseRef.current      = 0;
        sensorCountRef.current = 0;
        setSteps(0);
        persist(0);
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    async function init() {
      const isAndroid = Capacitor.getPlatform() === 'android';
      const isIOS     = Capacitor.getPlatform() === 'ios';

      if (isAndroid) {
        try {
          await StepCounter.startService();
          setSupported(true);
          setPermission('granted');

          const syncNow = async () => {
            const { steps: nativeSteps } = await StepCounter.getTodaySteps();
            if (nativeSteps >= 0) {
              setSteps(nativeSteps);
              persist(nativeSteps);
            }
          };

          await syncNow();
          const interval = setInterval(syncNow, 10_000);
          const onVisible = () => { if (document.visibilityState === 'visible') syncNow(); };
          document.addEventListener('visibilitychange', onVisible);

          cleanupRef.current = () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', onVisible);
          };
          return;
        } catch (e) {
          console.warn('StepCounter native plugin unavailable, falling back:', e);
        }
      }

      if (isIOS) {
        try {
          const { Pedometer } = await import('@capacitor-community/pedometer');
          const { available } = await Pedometer.isAvailable();
          if (!available) throw new Error('unavailable');

          setSupported(true);
          setPermission('granted');

          const syncFromPedometer = async () => {
            const start = new Date(); start.setHours(0, 0, 0, 0);
            const { numberOfSteps } = await Pedometer.queryData({
              startDate: start.toISOString(),
              endDate: new Date().toISOString(),
            });
            if (numberOfSteps > stepsRef.current) {
              setSteps(numberOfSteps);
              persist(numberOfSteps);
            }
          };

          await syncFromPedometer();
          await Pedometer.startUpdates();
          const handle = await Pedometer.addListener('update', async () => { await syncFromPedometer(); });
          cleanupRef.current = () => { handle?.remove(); };
          return;
        } catch { /* fall through */ }
      }

      if (!window.DeviceMotionEvent) { setSupported(false); return; }
      setSupported(true);

      const smoothed = { v: 9.8 };
      let lastPeak = false;
      let lastTime = 0;

      const onMotion = (e) => {
        const a = e.accelerationIncludingGravity;
        if (!a || a.x == null) return;
        const mag = Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2);
        smoothed.v = smoothed.v * 0.85 + mag * 0.15;
        const signal = mag - smoothed.v;
        const now = Date.now();
        const isHigh = signal > 2.2;
        if (isHigh && !lastPeak && now - lastTime > 280) {
          sensorCountRef.current += 1;
          setSteps(baseRef.current + sensorCountRef.current);
          lastTime = now;
        }
        lastPeak = isHigh;
      };

      motionHandlerRef.current = onMotion;

      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        setPermission('prompt');
      } else {
        setPermission('granted');
        window.addEventListener('devicemotion', onMotion);
        cleanupRef.current = () => window.removeEventListener('devicemotion', onMotion);
      }
    }

    init();
    return () => cleanupRef.current();
  }, [enabled]);

  const requestPermission = useCallback(async () => {
    if (typeof DeviceMotionEvent.requestPermission !== 'function') return;
    try {
      const result = await DeviceMotionEvent.requestPermission();
      setPermission(result);
      if (result === 'granted' && motionHandlerRef.current) {
        window.addEventListener('devicemotion', motionHandlerRef.current);
        cleanupRef.current = () => window.removeEventListener('devicemotion', motionHandlerRef.current);
      }
    } catch { setPermission('denied'); }
  }, []);

  const reset = useCallback(() => {
    baseRef.current        = 0;
    sensorCountRef.current = 0;
    setSteps(0);
    persist(0);
  }, []);

  return { steps, supported, permission, requestPermission, reset };
}
