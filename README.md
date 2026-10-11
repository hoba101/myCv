# Ehab — Portfolio

Neo-brutalist portfolio built with **Next.js 16** (App Router, Turbopack, React
Compiler), **React 19** and **Tailwind CSS v4**, with a built-in content
dashboard.

## Quick start

```bash
npm install
cp .env.example .env.local     # then set DASHBOARD_PASSWORD
npm run dev
```

Open <http://localhost:3000>.

## Dashboard

Edit projects, skills, services and social links at **`/dashboard`**.

Sign in with the `DASHBOARD_PASSWORD` you set in `.env.local`. Everything you
save is written straight to **`content/site.json`** and appears on the site
immediately — no rebuild, no restart.

- Add, edit, delete and reorder any section.
- Social links have an **active** toggle: switch one off to hide it from the
  footer without deleting it.
- Project images are optimised by Next.js. If you add an image from a new
  host, allow it in `next.config.ts` under `images.remotePatterns`.

`content/site.json` is the source of truth — back it up. Editing it by hand
works too; the dashboard simply writes to the same file.

## How it fits together

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Assembles the single page from `content/site.json` |
| `app/lib/content.ts` | Reads/writes content (atomic writes, `connection()` so edits are never stale) |
| `app/lib/auth.ts` | HMAC-signed, expiring session cookie |
| `app/actions/` | Server Actions — every one re-checks auth |
| `app/dashboard/` | Auth-gated admin UI |
| `proxy.ts` | Blocks `/dashboard` **before** any route renders |
| `content/site.json` | All editable content |
| `app/physics/` | Dimensional-analysis section (`/physics`) |

### Why `proxy.ts` exists

Checking auth in the dashboard layout is not sufficient. Those pages call
`connection()` so content is always fresh, and React then streams the page
render concurrently with the layout — which flushed the entire dashboard HTML
into the response body for unauthenticated visitors. `proxy.ts` runs first, so
the route is never rendered for an anonymous request.

## Hosting

Content is stored on the **local filesystem**, so this app needs a long-running
Node server — a VPS, Railway, Fly.io, or a Docker container.

It will **not** work on serverless platforms where the filesystem is read-only
or ephemeral (including Vercel's serverless tier): edits would silently vanish
between invocations. If you need serverless hosting, swap the storage in
`app/lib/content.ts` for a database or hosted KV.

## Scripts

```bash
npm run dev     # start dev server
npm run build   # production build
npm run start   # serve production build
npm run lint    # eslint
```

## Notes

- `scroll-behavior: smooth` is set on `<html>`. Next.js asks for
  `data-scroll-behavior="smooth"` to keep smooth scrolling during route
  transitions.
- Scroll-reveal animations are gated behind `@media (scripting: enabled)` so
  the server-rendered HTML stays visible, indexable and usable without JS.
- `.env.local` is gitignored. `.env.example` is committed.