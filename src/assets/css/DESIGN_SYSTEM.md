# Design System Documentation
## Saheb Ansari Blog - Version 2.0

### Overview
This document outlines the comprehensive visual design system implemented for the Saheb Ansari blog. The design system provides a cohesive, modern, and accessible user interface built on a solid foundation of design tokens.

---

## 📐 Design Tokens

### Color Palette

#### Primary Brand Colors (Blue)
- `--color-primary-50` - Lightest (backgrounds, highlights): `#e6f3ff`
- `--color-primary-100`: `#b3dcff`
- `--color-primary-200`: `#80c4ff`
- `--color-primary-300`: `#4dadff`
- `--color-primary-400`: `#1a96ff`
- `--color-primary-500` - **PRIMARY**: `#0078d4`
- `--color-primary-600` - Hover: `#0062b0`
- `--color-primary-700`: `#004b8c`
- `--color-primary-800`: `#003568`
- `--color-primary-900` - Darkest: `#001f44`

#### Secondary Brand Colors (Purple)
- `--color-secondary-500` - **SECONDARY**: `#7a00ea`
- Gradient combinations create visual interest in hero sections and accents

#### Accent Colors
- `--color-accent-coral`: `#ff6b5b` - For calls-to-action, alerts
- `--color-accent-teal`: `#2dd4bf` - For success states, highlights

#### Neutral Gray Scale (12-step)
Full range from `--color-gray-50` (#fafafa) to `--color-gray-950` (#0a0a0a) for backgrounds, text, borders.

#### Semantic Colors
- **Success**: Green palette for confirmations
- **Warning**: Amber palette for cautions
- **Error**: Red palette for errors
- **Info**: Blue palette for informational messages

### Typography

#### Font Families
- **Primary**: 'Inter' (sans-serif) - Modern, highly readable
- **Display**: 'Playfair Display' (serif) - Elegant headings
- **Monospace**: 'JetBrains Mono' - Code blocks

#### Type Scale (using 4px baseline grid)
- `--font-size-xs` (12px) - Fine print, labels
- `--font-size-sm` (14px) - Secondary text
- `--font-size-base` (16px) - **Body text**
- `--font-size-lg` (18px) - Large body, small headings
- `--font-size-xl` (20px)
- `--font-size-2xl` (24px)
- `--font-size-3xl` (30px)
- `--font-size-4xl` (36px)
- `--font-size-5xl` (48px) - **Hero titles**
- `--font-size-6xl` (60px)
- `--font-size-7xl` (72px)

#### Font Weights
- `--font-weight-regular` (400) - Body
- `--font-weight-medium` (500)
- `--font-weight-semibold` (600) - Buttons, nav
- `--font-weight-bold` (700) - **Headings**
- `--font-weight-extrabold` (800) - Hero titles

#### Line Heights
- `--line-height-normal` (1.5) - Body text
- `--line-height-tight` (1.25) - Headings
- `--line-height-relaxed` (1.625) - Reading content
- `--line-height-snug` (1.375) - Card content

### Spacing Scale (4px baseline)
- `--space-0` to `--space-32`
- Base unit: 4px (0.25rem)
- Multiples: 8px, 12px, 16px, 20px, 24px, 32px, 48px, 64px, 80px, 96px, 128px

### Border Radius
- `--radius-sm` (4px)
- `--radius-md` (8px) - **Standard**
- `--radius-lg` (12px) - Cards, modals
- `--radius-xl` (16px)
- `--radius-2xl` (24px)
- `--radius-full` (9999px) - Avatars, pills

### Shadows
- `--shadow-xs` - Subtle elevation
- `--shadow-sm` - Cards, buttons hover
- `--shadow-md` - Elevated elements
- `--shadow-lg` - Hover states
- `--shadow-xl` - Modal dialogs, dropdowns
- `--shadow-2xl` - Prominent elements

### Transitions
- `--transition-fast` (150ms) - Micro-interactions
- `--transition-normal` (250ms) - **Default**
- `--transition-slow` (350ms) - Page transitions
- `--transition-bounce` (500ms) - Attention-grabbing effects

### Z-Index Scale
- `--z-dropdown` (100)
- `--z-sticky` (200) - **Navbar**
- `--z-fixed` (300)
- `--z-modal-backdrop` (400)
- `--z-modal` (500)
- `--z-popover` (600)
- `--z-tooltip` (700)

---

## 🧩 Components

### Navigation Bar
- Sticky positioning with backdrop blur
- Gradient text logo
- Active link indicator (gradient underline)
- Theme toggle button with sun/moon icons
- Mobile-responsive with smaller font sizes

**Implementation:** `<nav class="navbar">`

### Hero Section
- Full-width gradient background (subtle primary/secondary blend)
- Centered content container
- Large title with gradient text effect + shimmer animation
- Subtitle with relaxed line-height
- Call-to-action buttons

**Implementation:** `<section class="hero">`

### Buttons
Base class: `.btn`

**Variants:**
- `.btn--primary` - Gradient background, white text, shadow
- `.btn--secondary` - Gray background, dark text, border
- `.btn--ghost` - Transparent, colored text

**Sizes:**
- `.btn--sm` - Small
- (default) - Medium
- `.btn--btn--lg` - Large

**States:**
- Hover: Lift + shadow increase (primary only)
- Focus: 2px outline in primary color
- Active: Slight scale reduction

### Post Cards
**Structure:**
```html
<a href="..." class="post-card">
  <div class="post-card-image-wrapper">
    <img class="post-card-image" ...>
  </div>
  <div class="post-card-content">
    <div class="post-card-header">
      <span class="post-card-tag">Category</span>
      <h3 class="post-card-title">Title</h3>
    </div>
    <p class="post-card-excerpt">Excerpt...</p>
    <div class="post-card-footer">
      <span class="post-card-date">Date</span>
      <span class="post-card-readtime">Time</span>
    </div>
  </div>
</a>
```

**Features:**
- Hover lift animation (6px translateY)
- Top gradient bar reveals on hover
- Image zoom effect (1.05 scale)
- Consistent 4:3 aspect ratio for images
- Flex column layout for content

### Article/Post Page
**Header:**
- Gradient background (subtle)
- Category badge
- Large title
- Author avatar + name + role
- Publication date + reading time

**Content:**
- Max-width 720px for readability
- Styled headings with gradient underline
- Blockquotes with left border + background
- Tables with alternating row styles
- Code blocks with dark theme
- Inline code styling

**Share Buttons:**
- Color-coded social buttons (Twitter blue, LinkedIn blue, Facebook blue)
- SVG icons included
- Hover lift effect

### Footer
- Dark background (#0a0a0a)
- 5-column grid layout (responsive to 2-col, then 1-col)
- Logo section with brand name
- Navigation, Recent Posts, Social, Contact sections
- Copyright + disclaimer divider

### Progress Indicators
- **Scroll Progress**: Fixed top bar with gradient fill
- **Pagination Status**: Text + horizontal track showing load progress
- Smooth animations

---

## 🎨 Dark Mode

Dark mode inverts colors intelligently:
- Primary colors become lighter (more saturated)
- Grays are inverted (light→dark, dark→light)
- Surface colors introduced for depth
- Text colors inverted for contrast

**Activation:** Toggle button in navbar, persists in localStorage, respects system preference.

---

## ♿ Accessibility Features

- **Skip Link**: First focusable element, navigates to main content
- **Focus Visible**: 2px solid outline with offset
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **High Contrast**: Adjusted colors for `prefers-contrast: high`
- **Semantic HTML**: Proper heading hierarchy, landmarks
- **ARIA Labels**: Navigation, buttons, progress bars
- **Color Contrast**: All text meets WCAG AA standards

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px - Single column layouts, compact UI
- **Tablet**: 640px - 768px - 2-column grids
- **Desktop**: > 768px - Multi-column layouts, full features
- **Wide**: > 1024px - 4-column post grids

---

## 🚀 Performance Optimizations

- **System Font Stack**: Fallback for Inter
- **Lazy Loading**: Images with `loading="lazy"` attribute
- **Preconnect**: Google Fonts preconnect hints
- **Gradient Text**: CSS gradients instead of images
- **Hardware Acceleration**: Animations use transform/opacity

---

## 📦 File Structure

```
src/
├── assets/
│   ├── css/
│   │   ├── fluent2-tokens.css    ← Design system tokens
│   │   └── style.css              ← Component styles & utilities
│   └── js/
│       └── theme.js               ← Dark mode toggle
├── _includes/
│   └── layouts/
│       ├── base.njk               ← Main template
│       └── post.njk               ← Article template
├── pages/
│   ├── blog.njk                   ← Blog listing
│   ├── about.njk                  ← About page
│   └── ... (legal pages)
└── _includes/
    └── post-card.njk              ← Reusable post card
```

---

## 🎯 Usage Guidelines

### Adding New Pages
1. Create `.njk` file in `src/pages/` or appropriate location
2. Use `layout: base` frontmatter
3. Set `title`, `description`, `pageType`
4. Use semantic HTML with utility classes from design system

### Styling New Components
1. Use CSS custom properties (var(--*))
2. Follow naming conventions: `component-name`, `component--modifier`, `component__element`
3. Add hover, focus, and active states
4. Test in both light and dark modes
5. Ensure mobile responsiveness

### Adding Blog Posts
- Frontmatter: `title`, `date`, `category`, `excerpt`, `readingTime`, `image` (optional)
- Content in Markdown (converted to HTML)
- Post cards automatically render with new design

---

## 🔄 Migration from Old System

### Mapping Old Classes → New

| Old Class | New Class |
|-----------|-----------|
| `fluent-body` | `fluent-body` (kept for transition) |
| `fluent-nav` | `navbar` |
| `fluent-hero` | `hero` |
| `fluent-button` | `btn` + `btn--primary/secondary` |
| `fluent-post-card` | `post-card` |
| `fluent-section` | `section` |
| `fluent-footer` | `footer` |
| `fluent-container` | `container` |

### Removed Redundancies
- Hardcoded color values → Use tokens
- Inline styles → External CSS
- Multiple heading styles → Unified typography scale
- Inconsistent spacing → Standardized spacing scale

---

## 🐛 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note:** Uses CSS features like `color-mix()` which requires modern browsers. Consider fallbacks for older browsers if needed.

---

## 📚 Resources

- **Fluent 2 Inspiration**: https://fluent2.microsoft.design/
- **Google Fonts**: https://fonts.google.com/
- **Color Mix**: https://developer.mozilla.org/en-US/docs/Web/CSS/color-mix

---

## 🎉 Conclusion

This design system provides a solid foundation for a modern, accessible, and maintainable website. All components are built with consistency, scalability, and user experience in mind.

**Version**: 2.0
**Last Updated**: May 2026
**Maintained By**: Saheb Ansari
