# Responsive Breakpoints Reference Guide

## 📐 Tailwind CSS Breakpoints Applied

```
┌─────────────────────────────────────────────────────────────────┐
│ DEVICE TYPES & SCREEN SIZES                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📱 MOBILE (xs)                  🔌 NO PREFIX (320px+)           │
│  Phones: 320px - 640px          Default mobile styles            │
│  └─ Apply base styles here                                      │
│                                                                  │
│  📱 SMALL TABLET (sm)             🔌 sm: PREFIX (640px+)        │
│  Small tablets: 640px - 768px     Larger phones landscape        │
│  └─ Override with sm: breakpoint                                │
│                                                                  │
│  📱 TABLET (md)                   🔌 md: PREFIX (768px+)        │
│  Tablets: 768px - 1024px          Desktop small screens          │
│  └─ Override with md: breakpoint                                │
│                                                                  │
│  💻 DESKTOP (lg)                  🔌 lg: PREFIX (1024px+)       │
│  Desktop: 1024px - 1280px         Large desktop monitors         │
│  └─ Override with lg: breakpoint                                │
│                                                                  │
│  💻 LARGE DESKTOP (xl)            🔌 xl: PREFIX (1280px+)       │
│  Ultra-wide: 1280px+              4K monitors                    │
│  └─ Override with xl: breakpoint (if used)                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Classes Applied Across All Pages

### 1. PADDING RESPONSIVE PATTERN
```
Mobile (xs):        px-3 py-8
Small (sm):         sm:px-6 sm:py-12
Tablet (md):        md:px-8 md:py-16
Desktop (lg):       lg:px-10 lg:py-20

Example:
<div className="px-3 sm:px-6 md:px-8">
  Content with responsive padding
</div>
```

### 2. TYPOGRAPHY RESPONSIVE PATTERN
```
Mobile:             text-2xl
Small tablet:       sm:text-3xl
Tablet:             md:text-4xl
Desktop:            lg:text-5xl

Example:
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>
```

### 3. GRID RESPONSIVE PATTERN
```
Mobile:             grid-cols-1
Small tablet:       sm:grid-cols-2
Tablet:             md:grid-cols-3
Desktop:            lg:grid-cols-4

Gaps:               gap-4 sm:gap-6 md:gap-8

Example:
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
  {items.map(item => <Card key={item.id} item={item} />)}
</div>
```

### 4. BUTTON RESPONSIVE PATTERN
```
Direction:          flex flex-col sm:flex-row
Width:              w-full sm:w-auto
Padding:            px-3 sm:px-4 py-2 sm:py-3
Gap:                gap-2 sm:gap-3

Example:
<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
  <button className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-3">
    Add Cart
  </button>
</div>
```

### 5. IMAGE RESPONSIVE PATTERN
```
Height:             h-48 sm:h-56 md:h-64
Width:              w-full
Object fit:         object-cover

Example:
<img 
  src={imgUrl} 
  className="w-full h-48 sm:h-56 md:h-64 object-cover"
  alt="Product"
/>
```

### 6. VISIBILITY RESPONSIVE PATTERN
```
Hide on mobile:     hidden md:block
Show only mobile:   md:hidden
Show on desktop:    hidden sm:block

Example:
<div className="md:hidden">Mobile Menu</div>
<div className="hidden md:block">Desktop Menu</div>
```

### 7. BORDER RADIUS RESPONSIVE PATTERN
```
Mobile:             rounded-lg
Small:              sm:rounded-xl
Desktop:            md:rounded-2xl

Example:
<div className="rounded-lg sm:rounded-xl md:rounded-2xl">
  Content
</div>
```

---

## 🔍 Pages & Their Responsive Classes

### Header.jsx
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Logo/Menu | `px-3` | `sm:px-6` | `md:px-8` |
| Icons | `text-base` | `sm:text-lg` | `md:text-xl` |
| Nav items | `hidden` | `sm:block` | `md:flex` |
| Mobile menu | `md:hidden` | - | - |

### Home.jsx (Hero)
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Hero heading | `text-2xl` | `sm:text-4xl` | `md:text-6xl lg:text-7xl` |
| Subtitle | `text-lg` | `sm:text-2xl` | `md:text-3xl lg:text-4xl` |
| Button | `px-6 py-2` | `sm:px-10 sm:py-4` | `md:px-12 md:py-5` |
| Collections | Full stack | `sm:flex` | `md:w-1/2` |

### Cart.jsx
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Container | `px-3` | `sm:px-6` | `md:px-8` |
| Items layout | `flex-col` | `sm:flex-row` | `md:flex-row` |
| Item image | `w-16 h-16` | `sm:w-20 sm:h-20` | `md:w-24 md:h-24` |
| Buttons | `flex-col gap-2` | `sm:flex-row sm:gap-3` | `md:gap-4` |

### WomenSarees.jsx (Products Grid)
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Grid cols | `grid-cols-1` | `sm:grid-cols-2 md:grid-cols-3` | `lg:grid-cols-4` |
| Gap | `gap-4` | `sm:gap-6` | `md:gap-8` |
| Card padding | `p-3` | `sm:p-4` | `md:p-5` |
| Image height | `h-48` | `sm:h-56` | `md:h-64` |

---

## 📱 Common Use Cases & Examples

### Use Case 1: Responsive Heading
```jsx
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
  Welcome
</h1>
```
- Mobile 320px: 30px font
- Tablet 768px: 48px font
- Desktop 1024px: 64px font

### Use Case 2: Responsive Card Grid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
  {items.map(item => (
    <Card key={item.id} />
  ))}
</div>
```
- Mobile: 1 column
- Tablet: 2-3 columns
- Desktop: 4 columns

### Use Case 3: Responsive Navigation
```jsx
<nav className="hidden md:flex gap-4 md:gap-6">
  {/* Desktop navigation */}
</nav>
<div className="md:hidden">
  {/* Mobile hamburger menu */}
</div>
```
- Mobile: Show hamburger
- Desktop: Show full nav

### Use Case 4: Responsive Form
```jsx
<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
  <input className="w-full sm:flex-1" />
  <button className="w-full sm:w-auto">
    Submit
  </button>
</div>
```
- Mobile: Stack vertically, full width
- Desktop: Side by side

### Use Case 5: Responsive Image Container
```jsx
<div className="w-full h-48 sm:h-56 md:h-64 lg:h-72">
  <img 
    src={src} 
    className="w-full h-full object-cover rounded-lg"
  />
</div>
```
- Mobile: 48px height
- Tablet: 56-64px height
- Desktop: 72px+ height

---

## 🎯 Quick Reference: Copy-Paste Patterns

### Pattern 1: Container with Responsive Padding
```jsx
<div className="px-3 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
  {/* Content */}
</div>
```

### Pattern 2: Responsive Text
```jsx
<p className="text-sm sm:text-base md:text-lg font-medium">
  Description
</p>
```

### Pattern 3: Responsive Button Group
```jsx
<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
  <button className="flex-1 px-3 sm:px-4 py-2 sm:py-3">
    Primary
  </button>
  <button className="flex-1 px-3 sm:px-4 py-2 sm:py-3">
    Secondary
  </button>
</div>
```

### Pattern 4: Responsive Grid
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
  {/* Cards */}
</div>
```

### Pattern 5: Mobile Menu
```jsx
<nav className="hidden md:flex">
  {/* Desktop nav */}
</nav>
<div className="md:hidden">
  {/* Mobile hamburger menu */}
</div>
```

---

## ⚡ Performance Tips

1. **Mobile-First**: Start with mobile styles (no prefix), then add sm:, md:, lg:
2. **Avoid Nesting**: Don't use sm:sm:, just use the breakpoint once
3. **Use Consistent Patterns**: Use same pattern across similar components
4. **Test All Sizes**: Always test at 320px, 640px, 768px, 1024px, 1280px

---

## 🔗 All Breakpoints in Your App

### Applied to:
- ✅ Header (mobile menu)
- ✅ Home page (hero, collections, trending)
- ✅ All product pages (cards, images, text)
- ✅ Cart page (layout, items, summary)
- ✅ All category pages (grid, padding, text)
- ✅ Footer (columns, text size)

### Result:
✅ Perfect experience on all devices from 320px to 1920px+

---

## 📱 Test Your App

### On Browser DevTools:
1. Press F12
2. Click mobile icon (top-left)
3. Select device preset:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1024px+)

### On Real Device:
1. Get your computer IP: `ipconfig`
2. On phone: `http://YOUR_IP:5174`
3. Resize browser to see breakpoints

---

## ✅ Verification Checklist

- ✅ Mobile (320px): Single column, stacked
- ✅ Tablet (768px): Two-three columns
- ✅ Desktop (1024px): Full layout, 4 columns
- ✅ Text scaling: Readable on all sizes
- ✅ Images: Proper heights on all screens
- ✅ Buttons: Full-width on mobile, auto on desktop
- ✅ Navigation: Hamburger on mobile, full on desktop
- ✅ No horizontal scroll: Verified on all sizes

---

## 🎉 You're All Set!

Your Royal Threads app is now fully responsive using these Tailwind CSS breakpoints. All pages adapt beautifully from mobile phones to large desktop monitors!

**Happy coding! 🚀**
