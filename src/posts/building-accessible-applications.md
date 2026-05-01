---
layout: post
category: Accessibility
title: Web accessibility ensures that websites are usable by everyone
author: Saheb Ansari
authorRole: Technical Architect
date: 2026-04-13
readingTime: 7 min read
image: "https://picsum.photos/1200/400?random=3"
excerpt: "Web accessibility ensures websites are usable by everyone, including people with disabilities. Building accessible applications benefits all users and is often a legal requirement."
---

Web accessibility ensures that websites are usable by everyone, including people with disabilities. Building accessible web applications benefits all users and is often a legal requirement.

## Why Accessibility Matters

- **Inclusivity:** Ensures all users can access your content
- **Legal Compliance:** WCAG guidelines are often mandatory
- **SEO Benefits:** Accessible websites rank better
- **Better UX:** Accessibility improvements benefit all users
- **Business Impact:** Reach a larger audience

## Web Content Accessibility Guidelines (WCAG)

WCAG has four principles:

### 1. Perceivable

Content must be perceivable by all users:

```html
<!-- Always include alt text for images -->
<img src="image.jpg" alt="Descriptive text about the image">

<!-- Provide captions for videos -->
<video>
    <source src="video.mp4">
    <track kind="captions" src="captions.vtt">
</video>

<!-- Ensure sufficient color contrast -->
<!-- Use tools to check contrast ratios -->
```

### 2. Operable

Users must be able to navigate your website:

```html
<!-- Use semantic HTML for better navigation -->
<nav>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
    </ul>
</nav>

<!-- Make interactive elements keyboard accessible -->
<button onclick="handleClick()">Click me</button>

<!-- Provide skip links -->
<a href="#main-content" class="skip-link">Skip to main content</a>
```

### 3. Understandable

Content must be understandable:

```html
<!-- Use clear, simple language -->
<!-- Avoid jargon where possible -->

<!-- Use proper heading hierarchy -->
<h1>Main Title</h1>
<h2>Section Subtitle</h2>
<p>Content...</p>

<!-- Use lists for related items -->
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
</ul>

<!-- Label form inputs clearly -->
<label for="email">Email Address:</label>
<input type="email" id="email" name="email">
```

### 4. Robust

Your website must work with assistive technologies:

```html
<!-- Use semantic HTML5 elements -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<article>...</article>
<aside>...</aside>
<footer>...</footer>

<!-- Use ARIA attributes when semantic HTML isn't enough -->
<div role="alert" aria-live="polite">
    Important message for screen readers
</div>

<!-- Provide proper landmarks -->
<main id="main-content">
    <!-- Your main content -->
</main>
```

## Best Practices for Accessibility

### 1. Use Semantic HTML

```html
<!-- Good -->
<button onclick="toggleMenu()">Toggle Menu</button>

<!-- Avoid -->
<div onclick="toggleMenu()">Toggle Menu</div>
```

### 2. Color and Contrast

- Never rely solely on color to convey information
- Ensure at least 4.5:1 contrast ratio for normal text
- Use tools like WebAIM Contrast Checker

### 3. Keyboard Navigation

```css
/* Ensure focus states are visible */
:focus {
    outline: 2px solid var(--fluent-color-brand-primary);
    outline-offset: 2px;
}

/* Provide hover states too */
button:hover {
    background-color: var(--fluent-color-brand-secondary);
}
```

### 4. ARIA Attributes

```html
<!-- Provide names for interactive elements -->
<button aria-label="Close menu">×</button>

<!-- Indicate dynamic content updates -->
<div aria-live="polite" aria-label="Notifications">
    <!-- Content updates here -->
</div>

<!-- Describe complex widgets -->
<div role="tablist">
    <button role="tab" aria-selected="true" aria-controls="panel-1">Tab 1</button>
    <div id="panel-1" role="tabpanel">Content 1</div>
</div>
```

### 5. Testing for Accessibility

Essential tools:
- **WAVE:** Visual feedback on accessibility issues
- **Axe DevTools:** Comprehensive accessibility testing
- **Lighthouse:** Built-in accessibility audit
- **Screen Readers:** NVDA (Windows), JAWS, VoiceOver (Mac)
- **Keyboard Navigation:** Tab through your site

## Common Accessibility Mistakes to Avoid

- ❌ Using `<div>` for buttons (use `<button>`)
- ❌ Missing alt text on images
- ❌ Poor color contrast
- ❌ Keyboard traps
- ❌ Auto-playing media
- ❌ Not testing with real assistive technologies
- ❌ Using images of text
- ❌ Missing form labels

## Accessibility Checklist

- [ ] Use semantic HTML elements
- [ ] Add alt text to all images
- [ ] Ensure keyboard navigation works
- [ ] Check color contrast ratios
- [ ] Test with screen readers
- [ ] Provide focus indicators
- [ ] Use ARIA when needed
- [ ] Test with real users with disabilities
- [ ] Make videos captioned
- [ ] Avoid time-based content

## Conclusion

Building accessible web applications is not just a technical requirement—it's about respecting and including all users. Start by using semantic HTML, then add ARIA attributes and test with real assistive technologies. Remember that accessibility is an ongoing process, not a one-time task.

Make your websites inclusive and welcoming for everyone!
