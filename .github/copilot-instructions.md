<!-- This file provides workspace-specific custom instructions to Copilot -->

## Project Overview

This is a modern personal blogging website built with HTML5, Tailwind CSS, and vanilla JavaScript. It's optimized for GitHub Pages hosting and requires no build process.

## Technical Stack

- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript
- **Hosting**: GitHub Pages
- **No Backend**: Pure static site
- **No Build Process**: Works directly with Tailwind CDN

## Key Features

- Dark mode toggle with persistence
- Responsive mobile-first design
- Blog post management system
- SEO-optimized with meta tags
- Social sharing capabilities
- Accessibility focused (WCAG)

## File Structure

- `index.html` - Home page with blog listings
- `about.html` - Author/about page
- `posts/` - Individual blog post HTML files
- `assets/css/style.css` - Custom Tailwind utilities
- `assets/js/theme.js` - Dark mode functionality
- `assets/js/posts.js` - Blog post data and loading
- `README.md` - Comprehensive documentation

## Customization Guidelines

### Adding Blog Posts
1. Create new HTML in `posts/post-N.html`
2. Use existing post as template
3. Add entry to blogPosts array in `assets/js/posts.js`

### Updating Content
- Edit `index.html` for home page
- Edit `about.html` for author page
- Update footer links in both files
- Modify social links as needed

### Styling
- Use Tailwind utility classes in HTML
- Add custom styles to `assets/css/style.css`
- Dark mode: use `dark:` prefix for dark mode classes

## Deployment Instructions

1. Push to GitHub repository
2. Enable Pages in repository settings
3. Select `main` branch as source
4. Site deployed at `https://username.github.io/sahebansari.com`

## Performance Considerations

- Tailwind CDN for minimal initial setup
- Can be optimized with build process later
- Lazy loading for images
- No external JavaScript dependencies beyond Tailwind
- Fast load times under 1-2 seconds

## Development

No local development server required, but optional:
- `python -m http.server 8000`
- `npx http-server`
- Direct file opening in browser

## Important Notes

- All content is static HTML/CSS/JS
- No database or backend required
- Theme preference stored in localStorage
- Blog posts managed via JSON array in posts.js
