# Search and social previews

The canonical URL, page title, description and preview image are configured in `src/data/site.ts`. Portfolio content stays in `src/data/resume.ts`; the Vite SEO plugin uses it to generate the initial readable HTML, JSON-LD profile, `portfolio.md` and `llms.txt` on each build. React replaces the initial HTML with the interactive portfolio. Visitors without JavaScript still receive a readable portfolio.

The build includes `robots.txt`, a sitemap for the single public page, Open Graph and Twitter metadata, and a 1200 × 630 JPEG preview at `/social/portfolio-preview.jpg`. Keep the social image compact (preferably below 300 KB), preserve its proportions, and update the image URL when replacing the artwork. Its MIME type and dimensions are configured alongside the URL in `src/data/site.ts`. The original PNG remains at `/social/og-image.png`.

After deploying:

1. Confirm the main URL returns HTTP 200 without login or deployment protection. Check `/social/portfolio-preview.jpg`, `/robots.txt`, `/sitemap.xml`, `/portfolio.md` and `/llms.txt`.
2. Add the site to Google Search Console, verify ownership and submit `/sitemap.xml`. Use URL Inspection to request indexing and inspect the rendered page.
3. Add the site to Bing Webmaster Tools and submit the sitemap. Bing indexing helps discovery through Bing and supported AI search experiences.
4. Test the published URL with the Facebook Sharing Debugger and LinkedIn Post Inspector. Social services may cache older previews; refresh their caches and share the link again.
5. Link the portfolio from your GitHub and LinkedIn profiles. Keep project and experience claims accurate and up to date.

`llms.txt` is an optional readable index; it is not a ranking signal or a guarantee that an AI service will use the site. Crawlers are allowed by `robots.txt`, but the host must also allow their requests. Search visibility, AI citations and first-place rankings are never guaranteed by metadata or sitemap submission.

Official references: [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [Google ProfilePage documentation](https://developers.google.com/search/docs/appearance/structured-data/profile-page), [Open Graph protocol](https://ogp.me/), [Bing sitemap guidance](https://blogs.bing.com/webmaster/2025/7/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search/).
