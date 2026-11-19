import { company } from '../data/site.js';

const STAR = 'M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z';

function Stars({ value }) {
  const pct = `${(value / 5) * 100}%`;
  const row = (
    <svg viewBox="0 0 120 24" width="100" height="20" aria-hidden focusable={false}>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={STAR} transform={`translate(${i * 24} 0)`} />
      ))}
    </svg>
  );
  return (
    <span className="stars" aria-hidden>
      <span className="stars__base">{row}</span>
      <span className="stars__fill" style={{ width: pct }}>
        {row}
      </span>
    </span>
  );
}

/** Avaliação pública no Google (4,6 de 5 · 25 avaliações). */
export default function Rating({ variant = 'card', href }) {
  const { display, value, count, source } = company.rating;
  const label = `Avaliação ${display} de 5 com base em ${count} avaliações no ${source}`;

  if (variant === 'inline') {
    return (
      <span className="rating-inline" aria-label={label}>
        <Stars value={value} />
        <span aria-hidden>
          <strong>{display}</strong> · {count} avaliações no {source}
        </span>
      </span>
    );
  }

  return (
    <div className="rating-card">
      <p className="rating-card__score" aria-label={label}>
        <span className="rating-card__value" aria-hidden>
          {display}
        </span>
        <span className="rating-card__meta" aria-hidden>
          <Stars value={value} />
          <span>de 5 · {count} avaliações no {source}</span>
        </span>
      </p>
      {href && (
        <a className="rating-card__link" href={href} target="_blank" rel="noopener noreferrer">
          Ver avaliações no Google<span className="sr-only"> (abre em nova aba)</span>
        </a>
      )}
    </div>
  );
}
