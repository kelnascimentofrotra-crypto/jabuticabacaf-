import { ArrowRight, WhatsApp } from './Icon.jsx';

/**
 * Botão-link padrão do site.
 * variant: 'primary' (laranja) | 'ghost' (contorno) | 'light' (branco)
 * icon: 'arrow' | 'whatsapp' | null
 * external: abre em nova aba com rel seguro.
 */
export default function Button({
  href,
  children,
  variant = 'primary',
  icon = 'arrow',
  external = false,
  size,
  className = '',
  ...rest
}) {
  const classes = ['btn', `btn--${variant}`, size && `btn--${size}`, className].filter(Boolean).join(' ');
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <a href={href} className={classes} {...externalProps} {...rest}>
      {icon === 'whatsapp' && <WhatsApp className="btn__lead" width={18} height={18} />}
      <span className="btn__label">{children}</span>
      {icon === 'arrow' && <ArrowRight className="btn__icon" width={18} height={18} />}
      {external && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  );
}
