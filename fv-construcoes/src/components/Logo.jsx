const BASE = import.meta.env.BASE_URL;

/** Logotipo original da FV (oval recortado do arquivo enviado, sem alterações de desenho). */
export default function Logo({ className = '', withText = false }) {
  return (
    <span className={`logo ${className}`}>
      <picture>
        <source type="image/webp" srcSet={`${BASE}img/logo-fv.webp`} />
        <img src={`${BASE}img/logo-fv.png`} alt="FV Construções e Serviços" width="341" height="227" decoding="async" />
      </picture>
      {withText && (
        <span className="logo__text" aria-hidden>
          <strong>FV Construções</strong>
          <span>e Serviços</span>
        </span>
      )}
    </span>
  );
}
