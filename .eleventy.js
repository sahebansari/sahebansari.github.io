module.exports = function(eleventyConfig) {
  // Copy assets to output
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  
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

  // Create a collection for all posts
  eleventyConfig.addCollection("posts", function(collection) {
    return collection
      .getFilteredByGlob("src/posts/**/*.md")
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  eleventyConfig.addCollection("sitemap", function(collection) {
    return collection
      .getAll()
      .filter((item) => item.url && !item.url.endsWith(".xml") && !item.url.endsWith(".txt"));
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
