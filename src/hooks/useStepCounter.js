import { useState, useEffect, useRef, useCallback } from 'react';

export function useStepCounter(enabled = true) {
  const [steps, setSteps] = useState(0);
  const [supported, setSupported] = useState(null); // null = unknown, true/false
  const [permission, setPermission] = useState('unknown'); // 'unknown' | 'granted' | 'denied'

  const smoothed = useRef(9.8);   // start near gravity magnitude
  const lastPeak = useRef(false);
  const lastStepTime = useRef(0);
  const stepsRef = useRef(0);

  const handleMotion = useCallback((e) => {
    const a = e.accelerationIncludingGravity;
    if (!a || a.x == null) return;

    const mag = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);

    // Low-pass filter → tracks gravity / slow baseline
    smoothed.current = smoothed.current * 0.85 + mag * 0.15;

    // High-pass signal = raw - baseline (removes gravity, keeps step impact)
    const signal = mag - smoothed.current;

    const now = Date.now();
    const isHigh = signal > 2.2;          // threshold — tweak if under/over counting
    const minInterval = 280;              // fastest realistic cadence ~214 steps/min

    // Rising edge detection
    if (isHigh && !lastPeak.current && now - lastStepTime.current > minInterval) {
      stepsRef.current += 1;
      setSteps(stepsRef.current);
      lastStepTime.current = now;
    }
    lastPeak.current = isHigh;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    if (!window.DeviceMotionEvent) {
      setSupported(false);
      return;
    }
    setSupported(true);

    // iOS 13+ needs explicit permission prompt
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      setPermission('prompt');
    } else {
      // Android Chrome — permission implicit
      setPermission('granted');
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [enabled, handleMotion]);

  // Called from UI when user taps "Allow"
  const requestPermission = useCallback(async () => {
    if (typeof DeviceMotionEvent.requestPermission !== 'function') return;
    try {
      const result = await DeviceMotionEvent.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        window.addEventListener('devicemotion', handleMotion);
      }
    } catch {
      setPermission('denied');
    }
  }, [handleMotion]);

  const reset = useCallback(() => {
    stepsRef.current = 0;
    setSteps(0);
  }, []);

  return { steps, supported, permission, requestPermission, reset };
}
