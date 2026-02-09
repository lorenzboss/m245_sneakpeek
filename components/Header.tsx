'use client';

interface HeaderProps {
  onAddClick: () => void;
}

export function Header({ onAddClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background border-b-2 border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="w-1/3"></div>
        <h1 className="w-1/3 text-2xl font-bold text-center">SneakPeak</h1>
        <div className="w-1/3 flex justify-end">
          <button
            onClick={onAddClick}
            className="bg-foreground text-background px-4 py-2 rounded-md hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Hinzufügen
          </button>
        </div>
      </div>
    </header>
  );
}
