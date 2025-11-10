import { ReactNode, CSSProperties } from 'react';
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

export interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  noPadding?: boolean;
}

/**
 * Responsive container that applies appropriate padding based on screen size
 * Uses Ant Design's Grid.useBreakpoint for responsive behavior
 */
export const ResponsiveContainer = ({
  children,
  className,
  style,
  noPadding = false,
}: ResponsiveContainerProps) => {
  const screens = useBreakpoint();

  // Determine padding based on screen size
  const getPadding = () => {
    if (noPadding) return 0;
    if (screens.xs) return 12;
    if (screens.sm) return 16;
    if (screens.md) return 20;
    return 24;
  };

  const containerStyle: CSSProperties = {
    padding: getPadding(),
    width: '100%',
    minHeight: '100vh',
    ...style,
  };

  return (
    <div className={className} style={containerStyle}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;
