'use client';

import { ReactNode } from 'react';

interface SubModuleOrbitalBubbleProps {
  children: ReactNode;
  color?: string;
  onClick?: () => void;
}

export default function SubModuleOrbitalBubble({
  children,
  color = '#3B82F6',
  onClick,
}: SubModuleOrbitalBubbleProps) {
  return (
    <button
      onClick={onClick}
      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xs font-medium transition-transform hover:scale-110"
      style={{ backgroundColor: color }}
    >
      {children}
    </button>
  );
}
