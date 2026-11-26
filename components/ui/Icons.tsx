import React from 'react';

export type IconName =
  | 'grid'
  | 'cube'
  | 'stairs'
  | 'meters'
  | 'cards'
  | 'board'
  | 'ranking'
  | 'plus'
  | 'edit'
  | 'trash'
  | 'reset'
  | 'download'
  | 'play'
  | 'printer'
  | 'search'
  | 'close'
  | 'arrowRight'
  | 'arrowLeft'
  | 'arrowDownRight'
  | 'shield'
  | 'gauge'
  | 'alert'
  | 'check'
  | 'grip'
  | 'menu'
  | 'home'
  | 'list'
  | 'star'
  | 'fileText'
  | 'panelRight';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 16, className }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className,
  };

  switch (name) {
    case 'grid':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="1.5" />
          <line x1="12" y1="3" x2="12" y2="21" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
      );
    case 'cube':
      return (
        <svg {...common}>
          <path d="M12 2.5 20.5 7.2v9.6L12 21.5 3.5 16.8V7.2L12 2.5Z" />
          <path d="M12 21.5V12" />
          <path d="M20.5 7.2 12 12 3.5 7.2" />
        </svg>
      );
    case 'stairs':
      return (
        <svg {...common}>
          <path d="M3 20h18" />
          <path d="M5 20v-4h5v-4h5V7h5v13" />
        </svg>
      );
    case 'meters':
      return (
        <svg {...common}>
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="15" y2="12" />
          <line x1="4" y1="17" x2="18" y2="17" />
          <circle cx="17" cy="7" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="15" cy="17" r="2" />
        </svg>
      );
    case 'cards':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="8" height="8" rx="1" />
          <rect x="13" y="3" width="8" height="8" rx="1" />
          <rect x="3" y="13" width="8" height="8" rx="1" />
          <rect x="13" y="13" width="8" height="8" rx="1" />
        </svg>
      );
    case 'board':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="5" height="16" rx="1" />
          <rect x="9.5" y="4" width="5" height="11" rx="1" />
          <rect x="16" y="4" width="5" height="14" rx="1" />
        </svg>
      );
    case 'ranking':
      return (
        <svg {...common}>
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="18" y2="12" />
          <line x1="8" y1="18" x2="14" y2="18" />
          <path d="M3.5 6h1" />
          <path d="M3.5 12h1" />
          <path d="M3.5 18h1" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...common}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
    case 'edit':
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
        </svg>
      );
    case 'trash':
      return (
        <svg {...common}>
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      );
    case 'reset':
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <polyline points="3 3 3 8 8 8" />
        </svg>
      );
    case 'download':
      return (
        <svg {...common}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      );
    case 'play':
      return (
        <svg {...common}>
          <polygon points="6 4 20 12 6 20 6 4" />
        </svg>
      );
    case 'printer':
      return (
        <svg {...common}>
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
      );
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <line x1="20" y1="20" x2="16.2" y2="16.2" />
        </svg>
      );
    case 'close':
      return (
        <svg {...common}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );
    case 'arrowRight':
      return (
        <svg {...common}>
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="13 6 19 12 13 18" />
        </svg>
      );
    case 'arrowLeft':
      return (
        <svg {...common}>
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="11 18 5 12 11 6" />
        </svg>
      );
    case 'arrowDownRight':
      return (
        <svg {...common}>
          <line x1="7" y1="7" x2="17" y2="17" />
          <polyline points="17 8 17 17 8 17" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        </svg>
      );
    case 'gauge':
      return (
        <svg {...common}>
          <path d="M12 15.5 16 10" />
          <path d="M3.5 18a9 9 0 1 1 17 0" />
          <circle cx="12" cy="16" r="1.5" />
        </svg>
      );
    case 'alert':
      return (
        <svg {...common}>
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case 'grip':
      return (
        <svg {...common}>
          <circle cx="9" cy="6" r="1" />
          <circle cx="15" cy="6" r="1" />
          <circle cx="9" cy="12" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="9" cy="18" r="1" />
          <circle cx="15" cy="18" r="1" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...common}>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      );
    case 'home':
      return (
        <svg {...common}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V20h14V9.5" />
        </svg>
      );
    case 'list':
      return (
        <svg {...common}>
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <circle cx="4" cy="6" r="1" />
          <circle cx="4" cy="12" r="1" />
          <circle cx="4" cy="18" r="1" />
        </svg>
      );
    case 'star':
      return (
        <svg {...common}>
          <polygon points="12 2.5 14.9 8.6 21.5 9.5 16.7 14.1 17.9 20.6 12 17.4 6.1 20.6 7.3 14.1 2.5 9.5 9.1 8.6 12 2.5" />
        </svg>
      );
    case 'fileText':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="14" y2="17" />
        </svg>
      );
    case 'panelRight':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="1.5" />
          <line x1="15" y1="3" x2="15" y2="21" />
        </svg>
      );
  }
}
