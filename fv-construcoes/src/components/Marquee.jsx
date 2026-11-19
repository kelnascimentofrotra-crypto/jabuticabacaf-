import '../styles/marquee.css';

/** Faixa contínua com as linhas do letreiro da loja. Puramente visual. */
export default function Marquee({ items }) {
  const group = (
    <div className="marquee__group">
      {items.map((item) => (
        <span key={item} className="marquee__item">
          {item}
          <span className="marquee__sep">/</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee__track">
        {group}
        {group}
        {group}
        {group}
      </div>
    </div>
  );
}
