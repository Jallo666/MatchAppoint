import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface Props {
  children: ReactNode;
  title?: string;
  rightAction?: ReactNode;
  leftAction?: ReactNode;
}

export function AppLayout({ children, title, rightAction, leftAction }: Props) {
  return (
    <div className="flex flex-col h-svh">
      {/* Top bar */}
      <header className="bg-court-green text-white px-4 py-3 flex items-center justify-between flex-shrink-0 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          {leftAction}
          {title ? (
            <span className="font-semibold text-base truncate">{title}</span>
          ) : (
            <span className="font-bold text-lg tracking-wide">
              🎾 MatchAppoint
            </span>
          )}
        </div>
        {rightAction && <div className="flex-shrink-0">{rightAction}</div>}
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
