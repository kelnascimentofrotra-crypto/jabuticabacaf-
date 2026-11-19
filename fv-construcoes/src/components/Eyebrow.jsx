/** Rótulo de seção: texto curto em caixa alta com fio laranja. */
export default function Eyebrow({ children, className = '', ...rest }) {
  return (
    <p className={`eyebrow ${className}`} {...rest}>
      <span className="eyebrow__rule" aria-hidden />
      {children}
    </p>
  );
}
