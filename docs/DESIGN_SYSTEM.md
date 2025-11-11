# Naveo Design System

Complete design system documentation for the Naveo tokenized fund management platform.

## Table of Contents

1. [Overview](#overview)
2. [Design Tokens](#design-tokens)
3. [Components](#components)
4. [Responsive Design](#responsive-design)
5. [Internationalization](#internationalization)
6. [Best Practices](#best-practices)

---

## Overview

The Naveo Design System provides a comprehensive set of guidelines, components, and utilities to ensure visual and functional consistency across the platform. Built on top of Ant Design, it extends and customizes the framework to match Naveo's brand identity.

### Core Principles

- **Consistency**: Unified visual language across all portals
- **Accessibility**: WCAG 2.1 AA compliant components
- **Responsiveness**: Mobile-first approach with adaptive layouts
- **Internationalization**: Full support for English and Spanish
- **Performance**: Optimized components with lazy loading

---

## Design Tokens

Design tokens are stored in `/frontend/src/styles/designTokens.ts` and provide a single source of truth for design values.

### Colors

#### Primary Brand Colors
```typescript
colors.primary.main     // #1890ff - Main brand color
colors.primary.light    // #40a9ff - Hover states
colors.primary.dark     // #096dd9 - Active states
colors.primary.lighter  // #e6f7ff - Backgrounds
```

#### Semantic Colors
```typescript
colors.success.main   // #52c41a - Success states
colors.warning.main   // #faad14 - Warning states
colors.error.main     // #ff4d4f - Error states
colors.info.main      // #1890ff - Info states
```

#### Neutral Colors
```typescript
colors.neutral.white        // #ffffff
colors.neutral.black        // #000000
colors.neutral.gray[50]     // #fafafa - Lightest
colors.neutral.gray[900]    // #1f1f1f - Darkest
```

### Typography

```typescript
typography.fontFamily.base      // System fonts
typography.fontFamily.heading   // 'Inter' for headings
typography.fontFamily.mono      // 'Fira Code' for code

typography.fontSize.xs    // 12px
typography.fontSize.sm    // 14px
typography.fontSize.base  // 16px
typography.fontSize.lg    // 18px
// ... up to 5xl (48px)

typography.fontWeight.light     // 300
typography.fontWeight.normal    // 400
typography.fontWeight.medium    // 500
typography.fontWeight.semibold  // 600
typography.fontWeight.bold      // 700
```

### Spacing

```typescript
spacing.xs    // 4px
spacing.sm    // 8px
spacing.md    // 12px
spacing.base  // 16px
spacing.lg    // 24px
spacing.xl    // 32px
// ... up to 4xl (96px)
```

### Border Radius

```typescript
borderRadius.sm    // 2px
borderRadius.base  // 4px
borderRadius.lg    // 8px
borderRadius.xl    // 12px
borderRadius.full  // 9999px (pills)
```

### Shadows

```typescript
shadows.sm    // Subtle shadow for cards
shadows.base  // Default component shadow
shadows.lg    // Elevated elements
shadows.xl    // Modals and popovers
```

---

## Components

### Basic Components

#### StatCard
```tsx
import { StatCard } from '@/components/common';

<StatCard
  title="Total Value"
  value="$124,500"
  icon={<WalletOutlined />}
  color="#4f6bed"
  trend="up"
  trendValue={12.5}
/>
```

#### ResponsiveContainer
```tsx
import { ResponsiveContainer } from '@/components/common';

<ResponsiveContainer noPadding={false}>
  {/* Your content */}
</ResponsiveContainer>
```

### Advanced Components

#### AdvancedDataTable
```tsx
import { AdvancedDataTable } from '@/components/common';

<AdvancedDataTable
  columns={columns}
  dataSource={data}
  searchable
  exportable
  refreshable
  onSearch={(value) => console.log(value)}
  onExport={() => console.log('Export')}
  onRefresh={() => console.log('Refresh')}
/>
```

**Features:**
- Built-in search with local/remote filtering
- CSV export functionality
- Refresh button
- Responsive pagination
- Sortable columns

#### FileUpload
```tsx
import { FileUpload } from '@/components/common';

<FileUpload
  maxSize={10}
  acceptedTypes={['.pdf', '.jpg', '.png']}
  multiple={false}
  onUpload={async (file) => {
    await uploadToServer(file);
  }}
  onRemove={(file) => console.log('Removed', file)}
/>
```

**Features:**
- Drag & drop support
- File size validation
- File type validation
- Progress tracking
- Multi-file support

#### MultiStepForm
```tsx
import { MultiStepForm } from '@/components/common';

const steps = [
  {
    title: 'Personal Info',
    description: 'Enter your details',
    content: <PersonalInfoForm />,
  },
  {
    title: 'Address',
    description: 'Enter your address',
    content: <AddressForm />,
  },
  {
    title: 'Review',
    description: 'Review your info',
    content: <ReviewForm />,
  },
];

<MultiStepForm
  steps={steps}
  onFinish={(values) => console.log(values)}
  onStepChange={(step) => console.log('Step', step)}
/>
```

#### Advanced Cards

##### MetricCard
```tsx
import { MetricCard } from '@/components/common';

<MetricCard
  title="Revenue"
  value="$45,231"
  trend="up"
  trendValue={12.5}
  description="vs last month"
  icon={<DollarOutlined />}
  color="#52c41a"
/>
```

##### InfoCard
```tsx
import { InfoCard } from '@/components/common';

<InfoCard
  icon={<InfoCircleOutlined />}
  title="Getting Started"
  description="Learn how to use the platform"
  actionText="Read More"
  onAction={() => navigate('/docs')}
  badge="New"
  color="#1890ff"
/>
```

##### FeatureCard
```tsx
import { FeatureCard } from '@/components/common';

<FeatureCard
  title="Trading Platform"
  description="Advanced trading with real-time data"
  stats={[
    { label: 'Volume', value: '$2.4M' },
    { label: 'Trades', value: '1,234' },
  ]}
  icon={<TradingOutlined />}
  actionText="Start Trading"
  onAction={() => navigate('/trade')}
/>
```

##### ActionCard
```tsx
import { ActionCard } from '@/components/common';

<ActionCard
  title="Create New Fund"
  subtitle="Start a new investment fund"
  actionText="Create"
  onAction={() => setModalOpen(true)}
  icon={<PlusOutlined />}
/>
```

---

## Responsive Design

### Breakpoints

```typescript
BREAKPOINTS = {
  xs: 480,   // Mobile portrait
  sm: 576,   // Mobile landscape
  md: 768,   // Tablet
  lg: 992,   // Desktop
  xl: 1200,  // Large desktop
  xxl: 1600, // Extra large desktop
}
```

### Usage

#### Using Grid.useBreakpoint (Ant Design)
```tsx
import { Grid } from 'antd';

const { useBreakpoint } = Grid;

const MyComponent = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <div style={{ padding: isMobile ? 12 : 24 }}>
      {/* Content */}
    </div>
  );
};
```

#### Using Media Queries
```tsx
import { mediaQueries } from '@/styles/responsive';

const styles = `
  .container {
    padding: 24px;
  }

  ${mediaQueries.md} {
    .container {
      padding: 12px;
    }
  }
`;
```

### Responsive Patterns

#### Adaptive Grid
```tsx
<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} md={8} lg={6}>
    <Card>Content</Card>
  </Col>
  {/* More columns */}
</Row>
```

#### Responsive Table
```tsx
<Table
  columns={columns}
  dataSource={data}
  scroll={{ x: 'max-content' }} // Horizontal scroll on small screens
  pagination={{ pageSize: screens.xs ? 5 : 10 }}
/>
```

#### Conditional Rendering
```tsx
{isMobile ? (
  <Drawer>Mobile Menu</Drawer>
) : (
  <Sider>Desktop Sidebar</Sider>
)}
```

---

## Internationalization

### Setup

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return <h1>{t('common.welcome')}</h1>;
};
```

### Translation Files

Located in `/frontend/src/locales/`:
- `en.json` - English translations
- `es.json` - Spanish translations

### Key Structure

```json
{
  "common": {
    "actions": "Actions",
    "save": "Save",
    "cancel": "Cancel"
  },
  "investor": {
    "dashboard": {
      "title": "Dashboard",
      "totalValue": "Total Value"
    }
  }
}
```

### Best Practices

1. **Use namespaces**: Organize translations by feature
```tsx
t('investor.dashboard.title')  // ✅ Good
t('dashboardTitle')            // ❌ Bad
```

2. **Variable interpolation**:
```tsx
t('common.welcome', { name: 'John' })
// Translation: "Welcome, {{name}}!"
```

3. **Pluralization**:
```tsx
t('common.items', { count: 5 })
// en: "5 items"
// es: "5 elementos"
```

---

## Best Practices

### Component Development

#### 1. Use TypeScript
```tsx
interface MyComponentProps {
  title: string;
  count: number;
  onAction?: () => void;
}

export const MyComponent = ({ title, count, onAction }: MyComponentProps) => {
  // Implementation
};
```

#### 2. Export Types
```tsx
export type { MyComponentProps };
```

#### 3. Use Design Tokens
```tsx
import { colors, spacing } from '@/styles/designTokens';

const styles = {
  container: {
    backgroundColor: colors.primary.main,
    padding: spacing.lg,
  },
};
```

#### 4. Responsive by Default
```tsx
<Row gutter={[16, 16]}>
  <Col xs={24} md={12} lg={8}>
    {/* Always specify breakpoints */}
  </Col>
</Row>
```

#### 5. Accessible Components
```tsx
<Button
  aria-label="Close modal"
  onClick={handleClose}
>
  <CloseOutlined />
</Button>
```

### Performance

#### 1. Lazy Load Routes
```tsx
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

#### 2. Memoize Expensive Calculations
```tsx
const filteredData = useMemo(() =>
  data.filter(item => item.active),
  [data]
);
```

#### 3. Use Callbacks
```tsx
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

### Testing

#### 1. Unit Tests
```tsx
describe('StatCard', () => {
  it('renders title correctly', () => {
    render(<StatCard title="Test" value="123" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

#### 2. Accessibility Tests
```tsx
it('is accessible', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Resources

### Internal
- [Component Library](/frontend/src/components/common/)
- [Design Tokens](/frontend/src/styles/designTokens.ts)
- [Responsive Utilities](/frontend/src/styles/responsive.ts)

### External
- [Ant Design Documentation](https://ant.design/)
- [React i18next](https://react.i18next.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## Support

For questions or contributions:
- Open an issue on GitHub
- Contact the frontend team
- Check existing documentation

**Last Updated**: November 2024
**Version**: 1.0.0
