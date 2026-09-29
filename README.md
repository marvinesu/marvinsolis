# Marvin Solis Marketing Agency Website

Professional Node.js/Express website for `marvinsolis.com`, built in the same Hostinger-friendly style as the Gabis Locksmith Services site.

## Stack

- Node.js 18+
- Express
- Static HTML, CSS, and JavaScript
- JSON-backed lead capture endpoint at `/api/contact`

## File Structure

- `server.js` - Express server, static hosting, and contact form endpoint
- `public/index.html` - complete marketing agency website
- `public/css/style.css` - responsive agency design
- `public/js/main.js` - popup, mobile menu, smooth scroll, animations, and form submission
- `public/images/agency-hero.png` - hero image asset
- `public/sitemap.xml` - sitemap for search engines
- `public/robots.txt` - crawler rules
- `public/llms.txt` - AI crawler/business summary
- `data/` - default lead storage folder

## Install and Run

```bash
npm install
npm start
```

Open `http://localhost:3000`.

For development with auto-restart:

```bash
npm run dev
```

## Environment Variables

Copy `.env.example` to your Hostinger Node.js app environment.

```bash
SITE_URL=https://marvinsolis.com
GA_MEASUREMENT_ID=
LEADS_FILE_PATH=./data/leads.json
```

`LEADS_FILE_PATH` controls where contact form submissions are saved. Use a writable path on Hostinger.

## Hostinger Deployment

1. Create a Node.js app in Hostinger for `marvinsolis.com`.
2. Set Node.js to version 18 or newer.
3. Connect the GitHub repository or upload the files.
4. Set the application startup file to `server.js`.
5. Run `npm install`.
6. Start command: `npm start`.
7. Add environment variables from `.env.example`.
8. Point the domain to the Node.js app and enable SSL.
9. Test:
   - `https://marvinsolis.com/`
   - `https://marvinsolis.com/robots.txt`
   - `https://marvinsolis.com/sitemap.xml`
   - Contact form submission

## SEO Included

- Meta title and description
- Keyword targeting
- Open Graph and Twitter image tags
- LocalBusiness and ProfessionalService schema
- `robots.txt`
- `sitemap.xml`
- `llms.txt`
- Internal anchor navigation for services, results, blog, and contact

## Final Pre-Launch Checklist

- Replace case study placeholders with real client results.
- Replace testimonials or add verified customer quotes if available.
- Confirm WhatsApp and email links.
- Test the contact form and verify leads are saved.
- Add analytics if needed.
- Check desktop, tablet, and mobile layouts.
- Verify SSL, sitemap, robots, Open Graph preview, and schema markup.

## Cloudflare Deployment

Production deployments are handled by Cloudflare Workers Builds. Every push to
the `main` branch runs `npm run build` and `npx wrangler deploy`. The static site
is served from `public/`, while the contact endpoint runs in `worker/index.js`
and stores submissions in the `marvinsolis-leads` D1 database.

The legacy Express server remains available for local or Hostinger rollback
until the DNS cutover to Cloudflare is complete.
