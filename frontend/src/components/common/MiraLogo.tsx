interface MiraLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MiraLogo({ variant = 'light', size = 'md', className = '' }: MiraLogoProps) {
  const sizeConfig = {
    sm: { width: 120, height: 40 },
    md: { width: 180, height: 60 },
    lg: { width: 240, height: 80 },
  };

  const config = sizeConfig[size];

  // Use SVG for better quality and scalability
  const logoSrc = variant === 'light'
    ? '/logos/logo_lightbg_svg.svg'
    : '/logos/logo_darkbg_svg.svg';

  return (
    <img
      src={logoSrc}
      alt="MIRA LABS Logo"
      width={config.width}
      height={config.height}
      className={className}
      style={{ width: config.width, height: 'auto' }}
    />
  );
}
