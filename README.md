# Saheb Ansari - Author of TerraPDF

Personal technical blog for [sahebansari.com](https://sahebansari.com), built with Eleventy, Nunjucks layouts, Markdown posts, and a custom Fluent 2-inspired design system. The site highlights Saheb Ansari as the author of [TerraPDF](https://terrapdf.com/), a zero-dependency C# PDF generation library.

## Features

- Eleventy 3 static site generation
- Markdown-based blog posts
- Nunjucks layouts and includes
- Custom responsive CSS with light and dark themes
- SEO metadata, Open Graph, Twitter cards, and JSON-LD structured data
- Sitemap, robots.txt, manifest, humans.txt, and browserconfig support
- Contact page with Formspree integration
- GitHub Pages custom domain support

## Project Structure

```text
.
|-- .eleventy.js                 # Eleventy configuration, filters, and collections
|-- package.json                 # npm scripts and dependencies
|-- src/
|   |-- index.njk                # Home page
|   |-- pages/                   # About, blog, contact, privacy, copyright
|   |-- posts/                   # Markdown blog posts
|   |-- _includes/
|   |   |-- layouts/             # Base and post layouts
|   |   `-- post-card.njk        # Reusable post card component
|   |-- _data/
|   |   `-- site.json            # Site-level data
|   |-- assets/
|   |   |-- css/                 # Design tokens and page styles
|   |   |-- js/                  # Theme toggle script
|   |   `-- images/              # Logo and favicon assets
|   |-- robots.njk               # Generates /robots.txt
|   |-- sitemap.njk              # Generates /sitemap.xml
|   |-- manifest.json
|   |-- browserconfig.xml
|   |-- humans.txt
|   `-- CNAME
`-- _site/                       # Generated output, created by Eleventy
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run start
```

Build the static site:

```bash
npm run build
```

On Windows PowerShell, if script execution blocks `npm`, use:

```bash
npm.cmd run build
```

## Content Workflow

Add a new post by creating a Markdown file in `src/posts/` with front matter like:

```yaml
---
layout: post
category: Programming
title: "Your Post Title"
author: Saheb Ansari
authorRole: Software Engineer
date: 2026-05-29
image: "https://example.com/image.jpg"
readingTime: "6 min read"
excerpt: "Short summary for cards, metadata, and social previews."
---
```

Posts are collected in `.eleventy.js`, sorted newest first, and rendered through `src/_includes/layouts/post.njk`.

## Design System

The styling is split across:

- `src/assets/css/fluent2-tokens.css` for tokens, base styles, components, forms, utilities, accessibility, and dark mode.
- `src/assets/css/style.css` for page-specific layouts such as the homepage hero, TerraPDF promo, post cards, articles, blog listing, about page, contact page, and footer.

Theme preference is handled by `src/assets/js/theme.js` and stored in `localStorage`.

## SEO and Metadata

The base layout includes:

- Canonical URLs
- Meta descriptions and keywords
- Open Graph tags
- Twitter card tags
- Person, WebPage, WebSite, and BlogPosting JSON-LD
- Google Analytics support via `src/_data/site.json`

Generated SEO files:

- `/sitemap.xml` from `src/sitemap.njk`
- `/robots.txt` from `src/robots.njk`
- `/manifest.json`
- `/humans.txt`
- `/browserconfig.xml`

## Deployment

The site builds to `_site/`, which can be deployed to GitHub Pages or any static host. The repository includes `src/CNAME` for the custom domain.

## Useful Scripts

```bash
npm run start   # Start Eleventy dev server
npm run build   # Clean and build _site
npm run watch   # Watch source files
npm run clean   # Remove _site
```
