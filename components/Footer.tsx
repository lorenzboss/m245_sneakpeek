import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="container mx-auto px-8 py-6">
        <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row">
          <p className="text-sm text-slate-600">© 2026 SneakPeak</p>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="https://github.com/leandroaebi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 transition-colors hover:text-slate-900"
            >
              leandroaebi
            </Link>
            <span className="text-slate-300">|</span>
            <Link
              href="https://github.com/lorenzboss"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 transition-colors hover:text-slate-900"
            >
              lorenzboss
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
