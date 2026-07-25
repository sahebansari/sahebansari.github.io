const path = require("path");
const { generateOgImages } = require("./scripts/generate-og.js");

module.exports = function(eleventyConfig) {
  // Generate social share images (1200x630 PNG) into the output dir before each
  // build. Incremental (mtime-based) during --serve/--watch so rebuilds stay fast.
  eleventyConfig.on("eleventy.before", ({ dir } = {}) => {
    const outputDir = (dir && dir.output) || "_site";
    const outDir = path.resolve(__dirname, outputDir, "assets/images/og");
    // Incremental is always safe: a cleaned (empty) output forces full regen,
    // and a changed post or generator script invalidates the affected images.
    const { written, skipped } = generateOgImages(outDir, { incremental: true });
    console.log(`[og] ${written} image(s) generated, ${skipped} up-to-date`);
  });

  // Copy assets to output
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy("src/humans.txt");
  eleventyConfig.addPassthroughCopy("src/manifest.json");
  eleventyConfig.addPassthroughCopy("src/browserconfig.xml");
  
  // Add Nunjucks filters
  eleventyConfig.addNunjucksFilter("dateFilter", (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  });

  eleventyConfig.addNunjucksFilter("htmlDateString", (date) => {
    return new Date(date).toISOString().split('T')[0];
  });

  // Strip HTML tags filter
  eleventyConfig.addNunjucksFilter("stripHtml", (str) => {
    if (!str) return '';
    return str.replace(/<[^>]*>/g, '');
  });

  // Truncate filter for ellipsifying long text
  eleventyConfig.addNunjucksFilter("truncate", (str, length = 50) => {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length).trim() + '...';
  });

  eleventyConfig.addNunjucksFilter("absoluteUrl", (url) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return `https://sahebansari.com${url.startsWith('/') ? '' : '/'}${url}`;
  });

  eleventyConfig.addNunjucksFilter("json", (value) => {
    return JSON.stringify(value, null, 2);
  });

  // URL encode filter for social sharing
  eleventyConfig.addNunjucksFilter("urlencode", (str) => {
    if (!str) return '';
    return encodeURIComponent(str);
  });
  eleventyConfig.addCollection("posts", function(collection) {
    return collection
      .getFilteredByGlob("src/posts/**/*.md")
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date)); // descending: newest first
  });

  eleventyConfig.addCollection("sitemap", function(collection) {
    return collection
      .getAll()
      .filter((item) => {
        if (!item.url) return false;
        const url = item.url;
        // Exclude XML, TXT feeds, asset paths, special files
        if (url.endsWith(".xml") || url.endsWith(".txt")) return false;
        if (url.startsWith("/assets/") || url.startsWith("/css/") || url.startsWith("/js/") || url.includes("/images/")) return false;
        if (url === "/humans.txt" || url === "/robots.txt" || url === "/manifest.json" || url === "/browserconfig.xml") return false;
        return true;
      });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts"
    },
    templateFormats: ["njk", "html", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    passthroughFileCopy: true
  };
};
