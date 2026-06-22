// icons.jsx — SVG icon set for Kosh Kuse V1
// All icons take size + color (default 20 / currentColor).

const I = ({ size = 20, color = 'currentColor', stroke = 1.6 }) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
  stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round',
});

const IconPaw = (p) => (
  <svg {...I(p)}>
    <ellipse cx="6.5" cy="9" rx="1.7" ry="2.2" fill={p.color || 'currentColor'} stroke="none"/>
    <ellipse cx="10.5" cy="6.5" rx="1.7" ry="2.2" fill={p.color || 'currentColor'} stroke="none"/>
    <ellipse cx="14.5" cy="6.5" rx="1.7" ry="2.2" fill={p.color || 'currentColor'} stroke="none"/>
    <ellipse cx="18.5" cy="9" rx="1.7" ry="2.2" fill={p.color || 'currentColor'} stroke="none"/>
    <path d="M9 13c-1.5 1-3 2.2-3 4.5C6 19 7.5 20 9.5 20c.9 0 1.7-.3 2.5-.6.8.3 1.6.6 2.5.6 2 0 3.5-1 3.5-2.5 0-2.3-1.5-3.5-3-4.5-1-.6-1.5-1.5-3-1.5s-2 .9-3 1.5z" fill={p.color || 'currentColor'} stroke="none"/>
  </svg>
);

const IconHome = (p) => (
  <svg {...I(p)}>
    <path d="M4 11.5l8-7 8 7V20a1 1 0 01-1 1h-4v-7h-6v7H5a1 1 0 01-1-1v-8.5z"/>
  </svg>
);

const IconChat = (p) => (
  <svg {...I(p)}>
    <path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H9l-4 4v-4H6a2 2 0 01-2-2V5z"/>
  </svg>
);

const IconSettings = (p) => (
  <svg {...I(p)}>
    <circle cx="12" cy="12" r="3"/>
    <path d="M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.5-2.3 1a7 7 0 00-2.1-1.2L14 3h-4l-.5 2.6a7 7 0 00-2.1 1.2l-2.3-1-2 3.5 2 1.5A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.3-1a7 7 0 002.1 1.2L10 21h4l.5-2.6a7 7 0 002.1-1.2l2.3 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2z"/>
  </svg>
);

const IconCat = (p) => (
  <svg {...I(p)}>
    <path d="M5 5l2.5 4M19 5l-2.5 4"/>
    <path d="M12 8c-4 0-7 3-7 6.5C5 18 8 20 12 20s7-2 7-5.5C19 11 16 8 12 8z"/>
    <circle cx="9.5" cy="14" r="0.7" fill={p.color || 'currentColor'} stroke="none"/>
    <circle cx="14.5" cy="14" r="0.7" fill={p.color || 'currentColor'} stroke="none"/>
    <path d="M11.2 16.5c.5.4 1.1.4 1.6 0"/>
  </svg>
);

const IconBell = (p) => (
  <svg {...I(p)}>
    <path d="M6 9a6 6 0 0112 0v3l2 3H4l2-3V9z"/>
    <path d="M10 18a2 2 0 004 0"/>
  </svg>
);

const IconQuestion = (p) => (
  <svg {...I(p)}>
    <circle cx="12" cy="12" r="9"/>
    <path d="M9.5 9.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5M12 17v.01"/>
  </svg>
);

const IconChevron = (p) => (
  <svg {...I(p)}>
    <path d="M9 6l6 6-6 6"/>
  </svg>
);

const IconArrow = (p) => (
  <svg {...I(p)}>
    <path d="M5 12h14M13 6l6 6-6 6"/>
  </svg>
);

const IconBack = (p) => (
  <svg {...I(p)}>
    <path d="M19 12H5M11 18l-6-6 6-6"/>
  </svg>
);

const IconClose = (p) => (
  <svg {...I(p)}>
    <path d="M6 6l12 12M6 18L18 6"/>
  </svg>
);

const IconSparkle = (p) => (
  <svg {...I(p)}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" fill={p.color || 'currentColor'} stroke="none"/>
    <path d="M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8L16.5 18.5l1.8-.7L19 16z" fill={p.color || 'currentColor'} stroke="none"/>
  </svg>
);

const IconHeart = (p) => (
  <svg {...I(p)}>
    <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.7A4 4 0 0119 10c0 5.5-7 10-7 10z"/>
  </svg>
);

const IconBook = (p) => (
  <svg {...I(p)}>
    <path d="M4 4h6a3 3 0 013 3v13a2 2 0 00-2-2H4V4zM20 4h-6a3 3 0 00-3 3v13a2 2 0 012-2h7V4z"/>
  </svg>
);

const IconScale = (p) => (
  <svg {...I(p)}>
    <path d="M12 4v17M5 21h14"/>
    <path d="M5 9l-2 5a4 4 0 008 0l-2-5M19 9l-2 5a4 4 0 008 0l-2-5"/>
  </svg>
);

const IconActivity = (p) => (
  <svg {...I(p)}>
    <path d="M3 12h4l3-8 4 16 3-8h4"/>
  </svg>
);

const IconShield = (p) => (
  <svg {...I(p)}>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);

const IconUser = (p) => (
  <svg {...I(p)}>
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1"/>
  </svg>
);

const IconHeadset = (p) => (
  <svg {...I(p)}>
    <path d="M4 13v-1a8 8 0 0116 0v1"/>
    <path d="M3 15a2 2 0 012-2h2v6H5a2 2 0 01-2-2v-2zM21 15a2 2 0 00-2-2h-2v6h2a2 2 0 002-2v-2z"/>
    <path d="M19 19a4 4 0 01-4 4h-2"/>
  </svg>
);

const IconSend = (p) => (
  <svg {...I(p)}>
    <path d="M12 19V5M5 12l7-7 7 7"/>
  </svg>
);

const IconEdit = (p) => (
  <svg {...I(p)}>
    <path d="M4 20h4l10-10-4-4L4 16v4z"/>
    <path d="M14 6l4 4"/>
  </svg>
);

const IconCheck = (p) => (
  <svg {...I(p)}>
    <path d="M5 13l4 4L19 7"/>
  </svg>
);

const IconCalendar = (p) => (
  <svg {...I(p)}>
    <rect x="3" y="5" width="18" height="16" rx="2"/>
    <path d="M3 10h18M8 3v4M16 3v4"/>
  </svg>
);

const IconDrop = (p) => (
  <svg {...I(p)}>
    <path d="M12 3s7 7 7 12a7 7 0 01-14 0c0-5 7-12 7-12z"/>
  </svg>
);

const IconPlay = (p) => (
  <svg {...I(p)}>
    <path d="M7 4l13 8-13 8V4z" fill={p.color || 'currentColor'} stroke="none"/>
  </svg>
);

const IconGift = (p) => (
  <svg {...I(p)}>
    <rect x="3" y="8" width="18" height="13" rx="1"/>
    <path d="M3 12h18M12 8v13M8 8a3 3 0 010-6c2 0 4 6 4 6s2-6 4-6a3 3 0 010 6"/>
  </svg>
);

Object.assign(window, {
  IconPaw, IconHome, IconChat, IconSettings, IconCat, IconBell, IconQuestion,
  IconChevron, IconArrow, IconBack, IconClose, IconSparkle, IconHeart, IconBook,
  IconScale, IconActivity, IconShield, IconUser, IconHeadset, IconSend, IconEdit,
  IconCheck, IconCalendar, IconDrop, IconPlay, IconGift,
});
