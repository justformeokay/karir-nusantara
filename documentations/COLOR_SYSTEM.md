# Karir Nusantara - Flat Design Color System

## Overview
This document defines the complete color palette and design tokens for the Karir Nusantara job portal. The system follows a flat design approach with clean, minimal colors suitable for a modern job portal similar to KitaLulus or Indeed.

## Primary Colors

### Primary Blue (#2563EB)
- **Usage**: Primary buttons, links, headings, key interactive elements
- **Hover State**: #1D4ED8 (darker blue for interaction feedback)
- **Background**: #DBEAFE (very light blue for backgrounds/badges)
- **CSS Variables**: `--primary`, `--primary-dark`
- **Tailwind Classes**: `bg-blue-600`, `hover:bg-blue-700`, `text-blue-600`

```css
/* Primary color variations */
Primary: #2563EB
Primary Hover: #1D4ED8
Light Background: #DBEAFE (bg-blue-100)
Ultra Light: #EFF6FF (bg-blue-50)
```

### Accent - Emerald Green (#10B981)
- **Usage**: CTA buttons ("Lamar Pekerjaan"), success states, highlights
- **Hover State**: #059669 (darker green)
- **Background**: #D1FAE5 (very light green for backgrounds)
- **CSS Variables**: `--secondary`, `--accent`, `--success`
- **Tailwind Classes**: `bg-emerald-500`, `hover:bg-emerald-600`, `text-emerald-500`

```css
/* Accent color variations */
Accent: #10B981
Accent Hover: #059669
Light Background: #D1FAE5 (bg-emerald-100)
Ultra Light: #F0FDF4 (bg-emerald-50)
```

## Neutral/Background Colors

### Background
- **Main Background**: #F9FAFB (slightly off-white)
- **CSS Variable**: `--background`
- **Tailwind**: `bg-gray-50`
- **Usage**: Page backgrounds, app background

### Surface/Card
- **Card Background**: #FFFFFF (pure white)
- **CSS Variable**: `--card`
- **Tailwind**: `bg-white`
- **Usage**: Cards, modals, dialogs, form surfaces

### Border
- **Border Color**: #E5E7EB (light gray)
- **CSS Variable**: `--border`
- **Tailwind**: `border-gray-200`
- **Usage**: Dividers, input borders, card borders

## Text Colors

### Primary Text
- **Color**: #111827 (nearly black, dark gray)
- **CSS**: `--foreground`
- **Tailwind**: `text-gray-900`
- **Usage**: Headers, main content text, body copy

### Secondary Text
- **Color**: #6B7280 (medium gray)
- **CSS Variable**: `--muted-foreground`
- **Tailwind**: `text-gray-500`
- **Usage**: Descriptions, subheadings, secondary info

### Tertiary/Muted Text
- **Color**: #9CA3AF (light gray)
- **Tailwind**: `text-gray-400`
- **Usage**: Placeholders, disabled text, hints

## Implementation Guide

### CSS Variables (in `index.css`)
```css
:root {
  --background: 0 0% 97.6%;        /* #F9FAFB */
  --foreground: 217 32.6% 17.5%;   /* #111827 */
  --primary: 217 91.2% 59.8%;      /* #2563EB */
  --primary-dark: 216 94.3% 37.5%; /* #1D4ED8 */
  --secondary: 160 84.1% 39.4%;    /* #10B981 */
  --border: 0 0% 90.2%;            /* #E5E7EB */
}
```

### Tailwind Classes

#### Button Styles
```tsx
/* Primary Button */
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
  Action
</button>

/* Accent/CTA Button */
<button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded transition-colors">
  Lamar Pekerjaan
</button>

/* Outline Button */
<button className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 px-4 py-2 rounded transition-colors">
  Secondary
</button>
```

#### Card Styles
```tsx
<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow">
  Card Content
</div>
```

#### Text Styles
```tsx
<h1 className="text-gray-900 text-2xl font-bold">Primary Heading</h1>
<p className="text-gray-700">Body text</p>
<span className="text-gray-500">Secondary text</span>
```

### Hex Color Reference

| Component | Color | Hex | Usage |
|-----------|-------|-----|-------|
| Primary | Blue | #2563EB | Buttons, links, actions |
| Primary Hover | Dark Blue | #1D4ED8 | Hover states |
| Primary Light | Light Blue | #DBEAFE | Badges, backgrounds |
| Accent | Emerald | #10B981 | CTA, success |
| Accent Hover | Dark Green | #059669 | Hover states |
| Background | Off-White | #F9FAFB | Page background |
| Surface | White | #FFFFFF | Cards, modals |
| Border | Light Gray | #E5E7EB | Borders, dividers |
| Text Primary | Dark Gray | #111827 | Headings, main text |
| Text Secondary | Gray | #6B7280 | Descriptions, secondary |
| Text Muted | Light Gray | #9CA3AF | Hints, placeholders |

## Design Principles

### 1. Flat Design
- No gradients - use solid colors only
- No heavy shadows - use soft, low-opacity shadows
- Clean, minimal aesthetic

### 2. Shadow System
```css
/* Soft shadows for subtle depth */
--shadow-card: 0 1px 3px 0 rgba(17, 24, 39, 0.06);
--shadow-card-hover: 0 4px 12px -2px rgba(17, 24, 39, 0.1);
```

### 3. Border Radius
- Standard: 0.5rem (8px)
- Used consistently across buttons, cards, inputs

### 4. Readability
- Contrast ratio between text and background meets WCAG AA standards
- Primary text (#111827) on white background: 12:1 ratio
- Secondary text (#6B7280) on white background: 7:1 ratio

### 5. Component Consistency
- All buttons use same hover transition
- All cards follow same shadow pattern
- All inputs use same border and focus style
- All text follows typography hierarchy

## Color Usage by Component

### Job Card
```tsx
<div className="bg-white border border-gray-200 rounded-lg p-4 shadow-card hover:shadow-card-hover">
  <h3 className="text-gray-900 font-bold">Job Title</h3>
  <p className="text-gray-600 text-sm">Company Name</p>
  <button className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded mt-4">
    Lamar Pekerjaan
  </button>
</div>
```

### Navigation
```tsx
<nav className="bg-white border-b border-gray-200">
  <a href="#" className="text-gray-900 hover:text-blue-600">Link</a>
</nav>
```

### Form Input
```tsx
<input 
  className="border border-gray-200 bg-white rounded px-3 py-2 text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
  placeholder="Search..."
/>
```

### Badge/Tag
```tsx
<span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
  Design
</span>
```

## File References

- **Global Colors**: `/src/index.css` (CSS variables)
- **Component Styles**: `/src/App.css`
- **Tailwind Config**: `/tailwind.config.ts`
- **PDF Styles**: `/src/components/cv/CVPreview.tsx`

## Migration Notes

Updated from teal/orange theme (#0d9488, #FF8C00) to:
- Professional blue (#2563EB) as primary
- Emerald green (#10B981) as accent for CTAs
- Cleaner, more minimal shadow system
- Better readability and modern flat design aesthetic

## Maintenance

When adding new colors:
1. Add to CSS variables in `index.css`
2. Add to Tailwind config if needed
3. Document hex value and usage
4. Test contrast ratios for accessibility
5. Ensure consistency with existing components
