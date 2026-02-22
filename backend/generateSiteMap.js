export const generateSiteMap = () => {
  const baseUrl = process.env.FRONTEND_URL;

  if (!baseUrl) {
    throw new Error("FRONTEND_URL is not defined in environment variables");
  }

  const now = new Date().toISOString();

  const pages = [
    { path: "", priority: "1.0" },        // homepage
    { path: "/login", priority: "0.8" },
    { path: "/signup", priority: "0.8" },
  ];

  const urls = pages
    .map(
      ({ path, priority }) => `
    <url>
      <loc>${baseUrl}${path}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${priority}</priority>
    </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};