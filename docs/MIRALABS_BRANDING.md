# MiraLabs Platform Branding Guide

## Overview
Naveo platform has been rebranded to **MiraLabs Platform**, adopting the design system and visual identity of Mira Labs.

**Last Updated:** November 10, 2024

---

## 🎨 Color Palette

### Primary Colors (MiraLabs Style)
```css
--color-background: #fafafa      /* Light background */
--color-foreground: #1a1a1a      /* Almost black text */
--color-primary: #2d2d2d         /* Dark gray primary */
--color-secondary: #666666       /* Medium gray */
--color-accent: #999999          /* Light gray accent */
--color-border: #e5e5e5          /* Subtle borders */
--color-highlight: #3d3d3d       /* Highlight dark gray */
```

### Supporting Colors
```css
--color-dot-primary: #4a4a4a     /* Dot matrix primary */
--color-dot-secondary: #c0c0c0   /* Dot matrix secondary */
```

### Functional Colors
- **Success:** `#52c41a` (Green)
- **Warning:** `#faad14` (Orange)
- **Error:** `#f5222d` (Red)
- **Info:** `#666666` (Secondary gray)

---

## 🔤 Typography

### Font Families
```css
/* Headings */
--font-heading: 'Sansation', 'Space Grotesk', -apple-system, sans-serif;

/* Body Text */
--font-body: 'Inter', -apple-system, sans-serif;

/* Code/Monospace */
--font-mono: 'IBM Plex Mono', 'Courier New', monospace;
```

### Font Weights & Sizes
- **H1:** 2.5rem (40px), Weight: 700
- **H2:** 2rem (32px), Weight: 600
- **H3:** 1.5rem (24px), Weight: 600
- **H4:** 1.25rem (20px), Weight: 500
- **Body:** 14px, Weight: 400
- **Line Height:** 1.6 (body), 1.2 (headings)
- **Letter Spacing:** -0.01em (body), -0.02em (headings)

---

## 🖼️ Logo Usage

### Logo Variants
- **Light Background:** `/logos/logo_lightbg_svg.svg`
- **Dark Background:** `/logos/logo_darkbg_svg.svg`

### Logo Sizes
```typescript
{
  xs: { width: 80, height: 27 },   // Sidebar collapsed
  sm: { width: 120, height: 40 },  // Sidebar expanded
  md: { width: 180, height: 60 },  // Login page
  lg: { width: 240, height: 80 },  // Marketing pages
}
```

### Usage Guidelines
- Use `variant="dark"` for dark backgrounds (sidebar, footer)
- Use `variant="light"` for light backgrounds (main content, cards)
- Maintain aspect ratio (approx. 3:1)
- Minimum clear space: 16px around logo

---

## 🧩 Component Styling

### Professional Cards
```css
.professional-card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.professional-card:hover {
  border-color: #3d3d3d;
  box-shadow: 0 8px 24px rgba(45, 45, 45, 0.08);
  transform: translateY(-2px);
}
```

### Ant Design Theme
```typescript
const miraLabsTheme = {
  token: {
    colorPrimary: '#2d2d2d',
    colorTextBase: '#1a1a1a',
    colorBgBase: '#fafafa',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  components: {
    Menu: {
      colorItemBg: '#2d2d2d',
      colorItemText: '#e5e5e5',
      colorItemTextSelected: '#ffffff',
      colorItemBgSelected: '#3d3d3d',
    },
    Button: {
      colorPrimary: '#2d2d2d',
      colorPrimaryHover: '#3d3d3d',
    },
  },
};
```

---

## 📱 Responsive Design

### Breakpoints
```typescript
xs: 0-575px    // Mobile
sm: 576-767px  // Small tablets
md: 768-991px  // Tablets
lg: 992-1199px // Desktop
xl: 1200+px    // Large desktop
```

### Grid System
- Use Ant Design `Row` and `Col` components
- Apply responsive `gutter`: `[16, 16]`
- Use `xs={24} sm={12} lg={6}` patterns for cards

---

## 🌍 Multi-Language Support

### Supported Languages
- **English (en)** - Default
- **Spanish (es)**

### i18n Keys Structure
```json
{
  "login": { ... },
  "dashboard": { ... },
  "common": { ... },
  "roles": { ... }
}
```

### Usage
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
// t('dashboard.welcome')
// t('common.buy')
```

---

## 📊 Chart Styling

### Color Schemes
```typescript
// Primary palette for charts
const chartColors = [
  '#2d2d2d',  // Primary dark
  '#52c41a',  // Success green
  '#722ed1',  // Purple
  '#fa8c16',  // Orange
  '#13c2c2',  // Cyan
];
```

### Chart Configuration
- Use smooth curves for line charts
- Apply subtle gradients for area fills
- Inner radius: 0.6 for donut charts
- Outer radius: 0.8 for pie charts
- Font family: 'Sansation' for chart text

---

## ✅ Brand Checklist

- [x] Logo displays correctly in all sizes (xs/sm/md/lg)
- [x] Color palette applied throughout (#2d2d2d, #fafafa, grays)
- [x] Sansation font loaded and used for headings
- [x] Inter font used for body text
- [x] Professional card hover effects working (.professional-card)
- [x] Responsive design on mobile/tablet/desktop (Grid with xs/sm/lg breakpoints)
- [x] Multi-language support functional (EN/ES via i18next)
- [x] MiraLabs branding in all text references
- [x] Email domains updated to @miralabs.com

---

## 📧 Contact Information

- **Support Email:** support@miralabs.com
- **Platform Name:** MiraLabs Platform
- **Tagline:** Institutional Digital Asset Management

---

## 🔄 Migration Notes

### Changed References
- `Naveo` → `MiraLabs Platform`
- `naveo.io` → `miralabs.com`
- `navlabs.com` → `miralabs.com`
- Color scheme: Blue accents → Neutral grays
- Font: Space Grotesk → Sansation (headings)

### Files Updated
- `/frontend/src/App.tsx` - Theme configuration
- `/frontend/src/components/common/MiraLogo.tsx` - Logo component
- `/frontend/src/components/layouts/DashboardLayout.tsx` - Sidebar logo
- `/frontend/src/pages/LoginPage.tsx` - Login branding
- `/frontend/src/locales/*.json` - Translations
- `/frontend/src/index.css` - Global styles
- `/frontend/index.html` - Page title, fonts
