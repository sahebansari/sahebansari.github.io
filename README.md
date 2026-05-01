# Your Personal Blog - Modern Static Site

A lightweight, fast, and modern personal blogging website built with **HTML5**, **Tailwind CSS**, and **vanilla JavaScript**. Optimized for **GitHub Pages** deployment and designed for maximum performance.

## ✨ Features

- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- 🌙 **Dark Mode Toggle** - Automatic theme switching with local storage persistence
- ⚡ **Lightning Fast** - Minimal dependencies, pure HTML/CSS/JS
- 🎨 **Modern Design** - Clean, minimalist aesthetic with smooth animations
- 📝 **Easy Content Management** - Simple HTML structure for adding blog posts
- 🔍 **SEO Optimized** - Semantic HTML, meta tags, Open Graph support
- 🚀 **GitHub Pages Ready** - Deploy directly from your repository
- 💯 **Accessible** - WCAG compliant with semantic markup
- 🎯 **No Build Process** - Works directly with Tailwind CDN (or use build process if needed)

## 📁 Project Structure

```
.
├── index.html                 # Home page with blog post list
├── about.html                 # About/Author page
├── assets/
│   ├── css/
│   │   └── style.css         # Custom Tailwind utilities
│   ├── js/
│   │   ├── theme.js          # Dark mode toggle functionality
│   │   └── posts.js          # Blog post loading and management
│   └── images/               # Place your images here
├── posts/
│   ├── post-1.html           # Sample blog post 1
│   ├── post-2.html           # Sample blog post 2
│   ├── post-3.html           # Sample blog post 3
│   └── post-4.html           # Sample blog post 4
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

## 🚀 Quick Start

### 1. Clone or Download the Repository

```bash
git clone https://github.com/yourusername/sahebansari.com.git
cd sahebansari.com
```

### 2. Open Locally (No Installation Required!)

Since this is a static site, you can:

- **Option A**: Double-click `index.html` to open in your browser
- **Option B**: Use a local server:
  ```bash
  # Python 3
  python -m http.server 8000
  
  # Python 2
  python -m SimpleHTTPServer 8000
  
  # Node.js
  npx http-server
  
  # PHP
  php -S localhost:8000
  ```

Then open `http://localhost:8000` in your browser.

### 3. Customize Your Content

Edit the following files to personalize your blog:

#### `index.html`
- Change "YourBlog" to your blog name
- Update the hero section text
- Modify social links in the footer

#### `about.html`
- Update your bio and introduction
- Add/modify your skills
- Update social media links
- Change the profile avatar initials

#### `assets/js/posts.js`
- Modify the `blogPosts` array to match your posts
- Update post titles, dates, descriptions, and categories

#### `assets/css/style.css`
- Add custom styles or override Tailwind utilities
- Customize colors, fonts, or animations

### 4. Add New Blog Posts

To add a new blog post:

1. **Create a new HTML file** in the `posts/` folder (e.g., `posts/post-5.html`)
2. **Use an existing post as a template** (e.g., copy `posts/post-1.html`)
3. **Update the content** (title, date, body, images, etc.)
4. **Add the post to `assets/js/posts.js`**:

```javascript
{
    id: 'post-5',
    title: 'Your Post Title',
    date: '2026-04-20',
    readTime: '7 min read',
    category: 'Category',
    description: 'Short description for the post',
    excerpt: 'Longer excerpt shown on the home page...',
    image: 'https://your-image-url.com/image.jpg'
}
```

## 🎨 Customization Guide

### Colors and Theme

The site uses Tailwind CSS with a blue-purple gradient theme. To customize:

1. **Update colors in `index.html` and `about.html`**:
   ```html
   <!-- Change from blue to green -->
   <div class="bg-green-600"> <!-- Instead of bg-blue-600 -->
   ```

2. **Modify the Tailwind config** in HTML `<head>`:
   ```html
   <script>
       tailwind.config = {
           darkMode: 'class',
           theme: {
               extend: {
                   colors: {
                       'primary': '#your-color',
                   }
               }
           }
       }
   </script>
   ```

### Fonts

Default fonts: Georgia (serif) for headings, system fonts for body. To change:

```html
<!-- In tailwind config -->
fontFamily: {
    'serif': ['Your Font', 'serif'],
}
```

### Social Links

Update social media links in:
- `index.html` (footer)
- `about.html` (footer and profile card)

Replace placeholder URLs with your actual social profiles.

## 🌙 Dark Mode

Dark mode is automatically applied based on system preference and includes a toggle button in the navigation. It's controlled by:

- `assets/js/theme.js` - Manages theme switching
- `dark:` classes in HTML - Tailwind dark mode classes

## 🚀 Deploying to GitHub Pages

### Step 1: Create a GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit: Personal blog"
git branch -M main
git remote add origin https://github.com/yourusername/sahebansari.com.git
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository settings
2. Navigate to **Pages** (in the left sidebar)
3. Under **Build and deployment**:
   - Select **Source**: `Deploy from a branch`
   - Select **Branch**: `main` and `/root`
4. Click **Save**
5. Wait for the deployment (usually takes 1-2 minutes)
6. Your site will be available at: `https://yourusername.github.io/sahebansari.com`

### Step 3: Custom Domain (Optional)

To use a custom domain:

1. Update **Custom domain** in GitHub Pages settings
2. Add CNAME record to your domain provider:
   - Name: `@` or `www`
   - Value: `yourusername.github.io`
3. Update your blog URL in the meta tags and social sharing links

## 📊 SEO Optimization

The blog includes:

- **Meta tags** for search engines
- **Open Graph tags** for social sharing
- **Twitter Card tags** for Twitter/X
- **Structured semantic HTML**
- **Fast load times** (improves rankings)
- **Mobile-friendly design** (responsive)

To optimize further:

1. Update meta descriptions in each page
2. Add high-quality keywords in content
3. Use descriptive alt text for images
4. Create an `sitemap.xml` for search engines
5. Add analytics (Google Analytics, Fathom, etc.)

## 📈 Adding Analytics

### Google Analytics

Add this to your `<head>` (in all HTML files):

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
</script>
```

Replace `G-XXXXXXXXXX` with your Google Analytics ID.

### Alternative: Fathom Analytics

```html
<script src="https://cdn.usefathom.com/script.js" data-site="YOUR_SITE_ID" defer></script>
```

## 🔧 Build Process (Optional)

If you want to use a build process for Tailwind CSS:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then update `tailwind.config.js` and build CSS:

```bash
npx tailwindcss -i assets/css/input.css -o assets/css/style.css --watch
```

## 📝 Writing Guide

### Post Structure

Each post should include:

1. **Header** - Title, date, author, read time
2. **Featured Image** - Eye-catching cover image
3. **Content** - Main article body
4. **Sections** - H2 and H3 headings for organization
5. **Code Examples** - Syntax-highlighted code blocks
6. **Share Buttons** - Social sharing links
7. **Back Link** - Return to home page

### Markdown-to-HTML Alternative

If you prefer writing in Markdown, you can:

1. Use a Markdown editor
2. Convert to HTML with a tool like [Pandoc](https://pandoc.org/)
3. Paste the HTML into your post file

## 🎯 Performance Tips

- **Compress images** - Use [TinyPNG](https://tinypng.com/) or similar
- **Lazy load images** - Use `loading="lazy"` attribute
- **Minimize external requests** - Combine CSS and JS files
- **Use a CDN** - Serve images from a fast CDN
- **Monitor metrics** - Use Google PageSpeed Insights

## 🐛 Troubleshooting

### Dark mode not working
- Check browser console for errors
- Ensure `theme.js` is loaded correctly
- Clear browser cache and reload

### Posts not showing
- Verify post IDs in `posts.js` match file names
- Check file paths in HTML
- Open browser console for errors

### Images not loading
- Check image URLs in `posts.js`
- Verify image links are accessible
- Use correct relative paths

### GitHub Pages not updating
- Wait 1-2 minutes for deployment
- Hard refresh your browser (Ctrl+Shift+R)
- Check deployment status in GitHub Actions

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)
- [GitHub Pages Guide](https://pages.github.com/)
- [Web.dev](https://web.dev/) - Performance tips
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 📄 License

This project is open source and available under the MIT License. Feel free to use, modify, and distribute it.

## 💬 Support

Have questions? Here are some ways to get help:

- Check this README thoroughly
- Review the HTML comments in the code
- Check browser developer console for errors
- Visit [GitHub Discussions](https://github.com)

---

**Built with ❤️ for the web.**

Happy blogging! 🚀
