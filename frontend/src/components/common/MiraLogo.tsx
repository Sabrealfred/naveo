interface MiraLogoProps {
  variant?: 'light' | 'dark';
  tone?: 'default' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function MiraLogo({
  variant = 'light',
  tone = 'default',
  size = 'md',
  className = '',
}: MiraLogoProps) {
  const sizeConfig = {
    xs: { width: 80, height: 27 },
    sm: { width: 120, height: 40 },
    md: { width: 180, height: 60 },
    lg: { width: 240, height: 80 },
  };

  const config = sizeConfig[size];

  // Use SVG for better quality and scalability
  const logoSrc = variant === 'light'
    ? '/logos/logo_lightbg_svg.svg'
    : '/logos/logo_darkbg_svg.svg';

  if (tone === 'gradient') {
    return (
      <div
        className={className}
        style={{
          width: config.width,
          height: config.height,
          background: 'linear-gradient(115deg, #4C82FB 0%, #7BD8FF 48%, #FFFFFF 100%)',
          WebkitMaskImage: `url(${logoSrc})`,
          maskImage: `url(${logoSrc})`,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      />
    );
  }

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
