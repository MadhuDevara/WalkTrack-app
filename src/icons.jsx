const Icon = ({ children, size = 20, color = 'currentColor', strokeWidth = 1.6, fill = 'none', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);

export const IconHome = (p) => <Icon {...p}><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></Icon>;
export const IconChart = (p) => <Icon {...p}><path d="M4 20V8"/><path d="M10 20V4"/><path d="M16 20v-9"/><path d="M22 20H2"/></Icon>;
export const IconScale = (p) => <Icon {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 14a4 4 0 018 0"/><path d="M12 14V8"/></Icon>;
export const IconTrophy = (p) => <Icon {...p}><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 01-10 0V4z"/><path d="M17 5h3v3a3 3 0 01-3 3"/><path d="M7 5H4v3a3 3 0 003 3"/></Icon>;
export const IconUsers = (p) => <Icon {...p}><circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0112 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 20h5a4 4 0 00-5-3.9"/></Icon>;
export const IconUser = (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></Icon>;
export const IconPlay = (p) => <Icon {...p} fill="currentColor" strokeWidth="0"><path d="M7 5l12 7-12 7V5z"/></Icon>;
export const IconPause = (p) => <Icon {...p} fill="currentColor" strokeWidth="0"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></Icon>;
export const IconFlame = (p) => <Icon {...p}><path d="M12 3c1 4 5 5 5 10a5 5 0 01-10 0c0-2 1-3 1-5 2 1 3 2 4-5z"/></Icon>;
export const IconHeart = (p) => <Icon {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z"/></Icon>;
export const IconMoon = (p) => <Icon {...p}><path d="M21 13A9 9 0 1111 3a7 7 0 0010 10z"/></Icon>;
export const IconDroplet = (p) => <Icon {...p}><path d="M12 3l5 7a6 6 0 11-10 0l5-7z"/></Icon>;
export const IconArrowRight = (p) => <Icon {...p}><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></Icon>;
export const IconArrowLeft = (p) => <Icon {...p}><path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/></Icon>;
export const IconArrowUp = (p) => <Icon {...p}><path d="M12 19V5"/><path d="M6 11l6-6 6 6"/></Icon>;
export const IconArrowDown = (p) => <Icon {...p}><path d="M12 5v14"/><path d="M6 13l6 6 6-6"/></Icon>;
export const IconSettings = (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3h0a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8 1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></Icon>;
export const IconBell = (p) => <Icon {...p}><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9z"/><path d="M10 21a2 2 0 004 0"/></Icon>;
export const IconCheck = (p) => <Icon {...p}><path d="M4 12l5 5L20 6"/></Icon>;
export const IconX = (p) => <Icon {...p}><path d="M6 6l12 12"/><path d="M18 6L6 18"/></Icon>;
export const IconPlus = (p) => <Icon {...p}><path d="M12 5v14"/><path d="M5 12h14"/></Icon>;
export const IconMore = (p) => <Icon {...p}><circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/></Icon>;
export const IconLock = (p) => <Icon {...p}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></Icon>;
export const IconStar = (p) => <Icon {...p}><path d="M12 3l2.7 5.6 6.3.8-4.6 4.3 1.2 6.3-5.6-3-5.6 3 1.2-6.3L3 9.4l6.3-.8L12 3z"/></Icon>;
export const IconMap = (p) => <Icon {...p}><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14"/><path d="M15 6v14"/></Icon>;
export const IconBolt = (p) => <Icon {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="currentColor"/></Icon>;
export const IconClock = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>;
export const IconCalendar = (p) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/></Icon>;
export const IconFootprint = (p) => <Icon {...p}>
  <path d="M9 4c1.5 0 2.5 1.5 2.5 4S10 12 8.5 12 6 10.5 6 8s1-4 3-4z"/>
  <ellipse cx="6" cy="15.5" rx="1.5" ry="1.2"/>
  <ellipse cx="9" cy="17" rx="1.3" ry="1.1"/>
  <ellipse cx="11" cy="19" rx="1.2" ry="1"/>
  <path d="M16 8c1.2 0 2 1.2 2 3.2S17.2 14.5 16 14.5 14 13.2 14 11.2 14.8 8 16 8z"/>
</Icon>;
export const IconLeaf = (p) => <Icon {...p}><path d="M5 21c0-9 5-15 16-15 0 11-6 15-13 15-3 0-3-2-3-2z"/><path d="M5 21c5-5 8-8 14-12"/></Icon>;
export const IconCrown = (p) => <Icon {...p}><path d="M3 18h18l-1.5-9-4.5 4-3-6-3 6-4.5-4L3 18z"/><path d="M3 21h18"/></Icon>;
export const IconFire = IconFlame;
export const IconShield = (p) => <Icon {...p}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z"/></Icon>;
