# VIP Magical Physio

This Netlify site uses the clinic website supplied in VIP Magical Physio V52.1.1. Its public pages are built with React and Vite, and the owner workspace is available at `/admin`. The previous static source remains in the repository for reference but is not published.

## Verify the deploy

Use Node.js 24 and the pnpm version pinned in `package.json`. Run `pnpm install --frozen-lockfile`, `pnpm typecheck`, and `pnpm test`. Netlify builds the site from `netlify.toml`, serves the static pages separately from `/api/*`, and applies the database migration before deployment. Use a Deploy Preview and fictitious information to test an enquiry, check that it appears in the owner workspace, and verify contact details and the ZIP’s draft policies before publishing.

## Owner workspace

The workspace uses Netlify Identity. An invited user must have the server-managed `owner` or `admin` role in the site's Identity settings. The same role is checked by the API, not just by the UI. No public sign-up page is provided. Owner records are stored in a separate `vip_physio` schema in Netlify Database. The migration creates empty records tables and does not import old leads, browser data, or any external records.

The website accepts administrative requests only, not medical records or payments. A reference means a request was saved; it does not confirm an appointment. The dashboard records payments and expenses for administration but does not process charges.
