# Saheb Ansari Blog - Eleventy Setup Guide

Welcome to your new Eleventy-powered blog! This guide will help you understand the structure and how to work with it.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Your site will be available at `http://localhost:8080`

### Production Build

```bash
npm run build
```

Output goes to the `_site` folder.

## 📁 Project Structure

```
sahebansari.com/
├── src/                          # Source directory
│   ├── _includes/
│   │   └── layouts/              # Reusable layouts (master pages)
│   │       ├── base.njk          # Base layout for all pages
│   │       └── post.njk          # Layout for blog posts (extends base)
│   ├── assets/                   # Static assets (CSS, JS, images)
│   │   ├── css/
│   │   │   ├── fluent2-tokens.css
│   │   │   └── style.css
│   │   ├── js/
│   │   │   ├── theme.js
│   │   │   └── posts.js
│   │   └── images/
│   ├── posts/                    # Blog posts (Markdown files)
│   │   ├── getting-started-with-fluent-2.md
│   │   ├── web-performance-optimization.md
│   │   ├── building-accessible-applications.md
│   │   └── static-site-generators-comparison.md
│   ├── pages/                    # Standalone pages
│   │   └── about.njk
│   └── index.njk                 # Homepage
├── _site/                        # Generated site (output folder)
├── .eleventy.js                  # Eleventy configuration
├── .eleventyignore               # Files to ignore
├── package.json                  # npm configuration
└── README.md                     # Main documentation
```

## 🎨 Layout System (Master & Child Pages)

### Master Layout: `base.njk`

The base layout contains:
- Navigation (with active link detection)
- Common head meta tags
- Theme toggle button
- Footer with links
- Script includes

All pages inherit from this layout.

### Child Layouts

#### Post Layout: `post.njk`

Extends the base layout and adds:
- Article header with gradient background
- Featured image section
- Article content area
- Share buttons
- Back to posts link

**Usage:**

Create a markdown file in `src/posts/`:

```markdown
---
layout: post
title: "My Blog Post"
category: "Web Development"
author: "Your Name"
date: 2026-04-20
image: "https://example.com/image.jpg"
readingTime: "5 min read"
---

# My Blog Post Content

Your content in Markdown...
```

#### Page Layout: `base.njk`

Regular pages (like About) use the base layout directly:

```nunjucks
---
layout: base
title: "About - Saheb Ansari"
pageType: about
---

<!-- Your page content here -->
```

## ✍️ Creating New Content

### Create a New Blog Post

1. Create a new file in `src/posts/` with a descriptive name:
   ```bash
   src/posts/my-awesome-post.md
   ```

2. Add frontmatter with metadata:
   ```markdown
   ---
   layout: post
   title: "My Awesome Post"
   category: "Web Development"
   author: "Your Name"
   date: 2026-04-20
   image: "https://example.com/image.jpg"
   readingTime: "5 min read"
   ---
   ```

3. Write your content in Markdown:
   ```markdown
   # Introduction

   Your content here...

   ## Section Title

   More content...

   ### Code Example

   \`\`\`javascript
   console.log("Hello, World!");
   \`\`\`
   ```

4. The post will automatically:
   - Use the `post.njk` layout
   - Appear on the homepage
   - Be sorted by date (newest first)
   - Have proper URL: `/posts/my-awesome-post/`

### Create a New Page

1. Create a file in `src/pages/`:
   ```bash
   src/pages/my-page.njk
   ```

2. Add layout and content:
   ```nunjucks
   ---
   layout: base
   title: "My Page - Saheb Ansari"
   ---

   <main class="fluent-posts-section">
       <div class="fluent-container">
           <h1>My Page Title</h1>
           <!-- Your content -->
       </div>
   </main>
   ```

3. Access at: `/pages/my-page/`

## 🏷️ Frontmatter Variables

### Post Frontmatter

```markdown
---
layout: post              # Use 'post' layout
title: "Post Title"       # (Required) Post title
category: "Category"      # (Optional) Category tag
author: "Author Name"     # (Optional) Author name
date: 2026-04-20         # (Required) Post date (affects sorting)
image: "url"             # (Optional) Featured image URL
readingTime: "5 min"     # (Optional) Estimated reading time
excerpt: "Summary"       # (Optional) Summary for listing
---
```

### Page Frontmatter

```nunjucks
---
layout: base             # Use 'base' layout
title: "Page Title"      # (Required) Page title
pageType: "type"         # (Optional) For active nav links
description: "Meta"      # (Optional) Meta description
---
```

## 🎯 Available Filters

### dateFilter

Formats dates for display:

```nunjucks
{{ post.date | dateFilter }}
<!-- Output: April 20, 2026 -->
```

### htmlDateString

Formats dates for HTML date attributes:

```nunjucks
<time datetime="{{ post.date | htmlDateString }}">
```

## 🔄 Collections

### Posts Collection

The `posts` collection automatically includes all `.md` files in `src/posts/`:

```nunjucks
{% for post in collections.posts %}
    <h3>{{ post.data.title }}</h3>
    <time>{{ post.date | dateFilter }}</time>
{% endfor %}
```

Posts are sorted by date (newest first).

## 📦 Deployment

### GitHub Pages

1. Push to GitHub
2. Enable Pages in repository settings
3. Select main branch as source
4. Site builds automatically

### Netlify

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `_site`
4. Auto-deploys on push

### Traditional Hosting

```bash
npm run build
# Upload _site/ folder contents to your server
```

## 🔧 Customization

### Change Site Title/Branding

Edit `src/_includes/layouts/base.njk`:
- Update navigation brand
- Modify footer text
- Change social links

### Customize Styling

- Keep using Fluent 2 CSS tokens
- Edit `assets/css/style.css` for custom styles
- Add new utility classes as needed

### Add New Filters

Edit `.eleventy.js`:

```javascript
eleventyConfig.addNunjucksFilter("myFilter", (value) => {
  return value.toUpperCase();
});
```

Use in templates:

```nunjucks
{{ text | myFilter }}
```

## 📋 Managing Assets

### Copied Automatically

Everything in `src/assets/` is copied to `_site/assets/`:

```
src/assets/css/style.css  →  _site/assets/css/style.css
src/assets/js/theme.js    →  _site/assets/js/theme.js
```

### URL Paths

In templates, reference assets without `src/`:

```nunjucks
<link rel="stylesheet" href="/assets/css/style.css">
<script src="/assets/js/theme.js"></script>
```

## 🆚 Master vs Child Pages Explained

### Master Page (`base.njk`)

- Contains common structure (nav, footer)
- Used by all pages
- Define Nunjucks blocks for content areas
- Passed to child layouts via `layout` frontmatter

### Child Pages

- Extend the master layout
- Override/fill specific sections
- Inherit navigation, footer, styling
- Example: `post.njk` extends `base.njk`

### Layout Chain

```
base.njk (master)
    ↓ (extended by)
post.njk (child)
    ↓ (used by)
my-post.md (content)
```

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf _site/
npm run build
```

### Assets Not Loading

- Verify files are in `src/assets/`
- Check paths in templates (use `/assets/...`)
- Run `npm start` to test locally

### Posts Not Appearing

- Ensure file is in `src/posts/` with `.md` extension
- Check frontmatter syntax (YAML)
- Verify `layout: post` in frontmatter

## 📚 Resources

- [Eleventy Documentation](https://www.11ty.dev/)
- [Nunjucks Template Syntax](https://mozilla.github.io/nunjucks/templating.html)
- [Markdown Guide](https://www.markdownguide.org/)
- [Fluent 2 Design System](https://fluent2.microsoft.design/)

## 🎉 You're Ready!

Your Eleventy blog is set up with:
- ✅ Master/child page templating system
- ✅ Automatic post collection
- ✅ Fluent 2 design system
- ✅ Dark mode toggle
- ✅ GitHub Pages compatible

Start creating amazing content! 🚀
