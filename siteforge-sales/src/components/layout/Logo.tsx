import { Link } from 'react-router-dom';

export function Logo({ compact }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="SiteForge Sales — início">
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#14161a" stroke="#2a2f37" />
        <path d="M9 11.5 16 7l7 4.5v9L16 25l-7-4.5z" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M16 12.2v8.6M12.3 14.4 16 12.2l3.7 2.2" fill="none" stroke="#e9ecef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {!compact && (
        <span className="text-[15px] font-semibold tracking-tight text-fg">
          SiteForge <span className="font-normal text-muted">Sales</span>
        </span>
      )}
      {compact && <span className="text-sm font-semibold text-fg">SiteForge</span>}
    </Link>
  );
}
