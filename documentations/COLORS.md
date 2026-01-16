# Quick Color Reference - Karir Nusantara

## 🎨 Color Palette

### Primary Colors
| Color | Hex | Use Case |
|-------|-----|----------|
| Primary Blue | **#2563EB** | Buttons, links, navigation, headings |
| Primary Hover | **#1D4ED8** | Hover state for primary elements |
| Primary Light | **#DBEAFE** | Light backgrounds, badges, tags |

### Accent Colors
| Color | Hex | Use Case |
|-------|-----|----------|
| Emerald Green | **#10B981** | CTA buttons, success states, "Lamar Pekerjaan" |
| Emerald Hover | **#059669** | Hover state for accent elements |
| Emerald Light | **#D1FAE5** | Light backgrounds for accent elements |

### Neutral Colors
| Color | Hex | Use Case |
|-------|-----|----------|
| Background | **#F9FAFB** | Page background |
| Surface | **#FFFFFF** | Cards, modals, forms |
| Border | **#E5E7EB** | Borders, dividers, input borders |

### Text Colors
| Color | Hex | Use Case |
|-------|-----|----------|
| Primary Text | **#111827** | Headers, main content |
| Secondary Text | **#6B7280** | Descriptions, secondary info |
| Muted Text | **#9CA3AF** | Placeholders, hints, disabled |

---

## 🔧 How to Use

### Tailwind Classes (Recommended)
```tsx
// Buttons
<button className="bg-blue-600 hover:bg-blue-700 text-white">Primary</button>
<button className="bg-emerald-500 hover:bg-emerald-600 text-white">CTA</button>

// Text
<h1 className="text-gray-900 font-bold">Heading</h1>
<p className="text-gray-700">Body text</p>

// Cards
<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-card">Card</div>
```

### CSS Variables
```css
.element {
  background: hsl(var(--primary));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
}
```

### Direct Hex Values
```css
.button {
  background-color: #2563EB;
}
.button:hover {
  background-color: #1D4ED8;
}
```

---

## 📱 Common Components

### Primary Button
```tsx
<button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
  Action
</button>
```

### CTA Button (Lamar Pekerjaan)
```tsx
<button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded transition-colors">
  Lamar Pekerjaan
</button>
```

### Job Card
```tsx
<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow">
  <h3 className="text-gray-900 font-bold">Job Title</h3>
  <p className="text-gray-600">Company Name</p>
  <p className="text-gray-500 text-sm mt-2">Description</p>
</div>
```

### Badge/Tag
```tsx
<span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
  Technology
</span>
```

### Form Input
```tsx
<input
  className="border border-gray-200 bg-white rounded px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-colors"
  placeholder="Search jobs..."
/>
```

---

## ✅ Design Principles

- **Flat Design**: No gradients, solid colors only
- **Soft Shadows**: Subtle depth, not heavy shadows
- **Minimal**: Clean, professional appearance
- **Accessible**: WCAG AA/AAA contrast compliance
- **Consistent**: Same styling across all pages

---

## 📁 Configuration Files

- **CSS Variables**: `/src/index.css`
- **Component Styles**: `/src/App.css`
- **Tailwind Config**: `/tailwind.config.ts`
- **Full Documentation**: `/COLOR_SYSTEM.md`
- **Implementation Summary**: `/UPDATE_SUMMARY.md`

---

## 🔍 Color Codes

```
Primary Blue:     #2563EB (rgb: 37, 99, 235)
Primary Hover:    #1D4ED8 (rgb: 29, 78, 216)
Emerald Green:    #10B981 (rgb: 16, 185, 129)
Emerald Hover:    #059669 (rgb: 5, 150, 105)

Background:       #F9FAFB (rgb: 249, 250, 251)
Surface:          #FFFFFF (rgb: 255, 255, 255)
Border:           #E5E7EB (rgb: 229, 231, 235)

Text Primary:     #111827 (rgb: 17, 24, 39)
Text Secondary:   #6B7280 (rgb: 107, 114, 128)
Text Muted:       #9CA3AF (rgb: 156, 163, 175)
```

---

## 🎯 Quick Tips

1. **Always use `transition-colors`** for interactive elements
2. **Use `shadow-card` class** for consistent card styling
3. **Prefer Tailwind classes** over direct hex values
4. **Test contrast** when modifying text colors
5. **Maintain consistency** across all components
6. **Reference COLOR_SYSTEM.md** for detailed guidelines

---

Last Updated: January 16, 2026
