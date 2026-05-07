import { useMemo } from 'react';

export const THEMES = {
  dark: {
    bg: '#0F1B14',
    surface: '#16241B',
    surfaceAlt: '#1F2F25',
    border: 'rgba(168, 213, 162, 0.12)',
    borderStrong: 'rgba(168, 213, 162, 0.22)',
    text: '#F2EFE6',
    textDim: '#A8B2A4',
    textMuted: '#6E7A6B',
    accent: '#34D399',
    accentSoft: 'rgba(52, 211, 153, 0.14)',
    accentDim: '#1F8A5B',
    warm: '#E8C26B',
    warmSoft: 'rgba(232, 194, 107, 0.14)',
    rose: '#E8967A',
    danger: '#E87A7A',
    chart: '#34D399',
  },
  light: {
    bg: '#F5F1EA',
    surface: '#FFFCF6',
    surfaceAlt: '#EFEADD',
    border: 'rgba(31, 60, 41, 0.10)',
    borderStrong: 'rgba(31, 60, 41, 0.20)',
    text: '#1C2418',
    textDim: '#5A6356',
    textMuted: '#8A9285',
    accent: '#1F8A5B',
    accentSoft: 'rgba(31, 138, 91, 0.12)',
    accentDim: '#34D399',
    warm: '#B98E3C',
    warmSoft: 'rgba(185, 142, 60, 0.14)',
    rose: '#C26A4F',
    danger: '#B5483F',
    chart: '#1F8A5B',
  },
};

export function hexToRgba(hex, a) {
  const h = hex.replace('#', '');
  const n = h.length === 3
    ? h.split('').map(c => c + c).join('')
    : h;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export function useTheme(dark, paletteOverride) {
  return useMemo(() => {
    const base = dark ? THEMES.dark : THEMES.light;
    if (!paletteOverride) return base;
    const [bg, accent, text] = paletteOverride;
    return {
      ...base,
      bg, accent, text,
      accentSoft: hexToRgba(accent, 0.14),
      accentDim: accent,
      chart: accent,
    };
  }, [dark, paletteOverride && paletteOverride.join(',')]);
}

export const TYPE = {
  display: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 500, letterSpacing: '-0.02em' },
  serif: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 400 },
  sans: { fontFamily: '"Inter Tight", system-ui, sans-serif' },
  mono: { fontFamily: '"JetBrains Mono", ui-monospace, monospace' },
};
