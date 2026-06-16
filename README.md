# Firoz Miya — Portfolio

A personal portfolio site focused on Linux / Red Hat Enterprise Linux system
administration — built with **Next.js 16 (App Router)**, **TypeScript**, and
**Tailwind CSS v4**, ready to deploy on **Vercel**.

- Dark, terminal-inspired UI with Red Hat-red accents
- Content (profile, experience, certifications, skills, projects, **home
  labs**) is driven entirely by JSON files in `/data` — no CMS needed
- A dedicated **Labs** section/route for RHCSA-style home-lab write-ups,
  with category filtering and individual pages per lab
- A working **contact form** backed by a hand-written SMTP client built on
  Node's `node:net` / `node:tls` — no nodemailer, no paid email API
- RHCSA (EX200) listed as an **in-progress** certification, ready to flip to
  "completed" once you pass

---

## 1. Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # run the production build locally
npm run lint    # ESLint
```

---

## 2. Project structure

```
app/
  layout.tsx          Root layout, metadata, Navbar + Footer
  page.tsx            Homepage (assembles all sections)
  globals.css         Design tokens, fonts, base styles (Tailwind v4 @theme)
  labs/
    page.tsx          /labs — full lab listing with category filters
    [slug]/page.tsx   /labs/<slug> — individual lab write-up
  api/contact/route.ts  Contact form endpoint (custom SMTP client)
  sitemap.ts, robots.ts SEO files

components/           UI sections (Hero, About, Skills, Experience, ...)
components/ui/        Small shared building blocks (TerminalWindow, etc.)

data/                 <-- EDIT THESE to update site content
  profile.json        Name, role, contact details, summary, stats
  experience.json     Work history timeline
  certifications.json Certifications (incl. RHCSA "in-progress")
  skills.json         Skill groups (Linux/RHEL group is featured)
  projects.json       Key career projects
  labs.json           Home-lab write-ups — see section 3 below

lib/
  content.ts          Typed accessors for the /data JSON files
  types.ts            Shared TypeScript types
  smtp.ts             Hand-written SMTP client (node:net / node:tls)
```

---

## 3. Adding a new home lab (the main thing you'll edit)

Every lab is one object in **`data/labs.json`**. To add a new lab, copy an
existing entry and edit the fields — no code changes needed. A new entry
automatically:

- Appears in `/labs` (and in "Featured" on the homepage if it's recent)
- Gets its own page at `/labs/<slug>`
- Is included in `sitemap.xml`
- Shows up in the category filter (new categories are picked up automatically)

### Schema

```jsonc
{
  "slug": "unique-url-friendly-id",       // becomes /labs/unique-url-friendly-id
  "title": "Lab title",
  "category": "Security",                 // any string — used for filtering
  "status": "completed",                  // "completed" | "in-progress" | "planned"
  "date": "2026-06",                      // "YYYY-MM" — used for sorting & display
  "summary": "1-2 sentence summary shown on cards.",

  "environment": [
    "RHEL 9.4 (minimal install)",
    "VirtualBox — 2 vCPU / 2 GB RAM"
  ],

  "objectives": [
    "What you set out to do — shown as a numbered list."
  ],

  "steps": [
    {
      "title": "Step heading",
      "description": "What you did and why, including anything that went wrong.",
      "commands": [                       // optional — renders as a copyable code block
        "dnf install -y httpd",
        "systemctl enable --now httpd"
      ]
    }
  ],

  "outcomes": [
    "What you learned / verified — shown with checkmarks."
  ],

  "tags": ["selinux", "rhcsa"],            // short mono chips
  "links": {}                              // optional: { "github": "https://..." }
}
```

Just append a new object to the array in `data/labs.json` — order doesn't
matter, the site sorts by `date` (newest first) automatically.

---

## 4. Updating the rest of the content

| File | What it controls |
| --- | --- |
| `data/profile.json` | Name, role/title, location, contact info, hero headline, "stats" row |
| `data/experience.json` | Work history timeline (most recent first) |
| `data/certifications.json` | Certification cards. The entry with `id: "rhcsa"` is shown in the highlighted "in progress" card — once you pass, set `"status": "completed"`, add a `credentialUrl`, and it'll automatically render like the other completed certs |
| `data/skills.json` | Skill groups. The group with `"featured": true` (Linux & Red Hat) is shown prominently |
| `data/projects.json` | "Key projects" cards |

### Profile photo

The About section currently shows a placeholder initials avatar
(`profile.initials` in `data/profile.json`). To use a real photo:

1. Add your image to `public/`, e.g. `public/avatar.jpg`
2. In `components/About.tsx`, replace the initials `<div>` with a Next.js
   `<Image>` component pointing at `/avatar.jpg`

---

## 5. Contact form — SMTP setup (free, via Gmail)

The `/api/contact` route implements SMTP **from scratch** using Node's
built-in `net`/`tls` modules (see `lib/smtp.ts`) — there's no nodemailer and
no third-party email API to pay for. It supports both STARTTLS (port 587)
and implicit TLS (port 465), so it works with most SMTP providers, but the
easiest free option is **Gmail with an App Password**.

### One-time Gmail setup

1. Enable 2-Step Verification on the sending Gmail account:
   <https://myaccount.google.com/security>
2. Create an App Password: <https://myaccount.google.com/apppasswords>
   (choose "Mail" / "Other", name it e.g. "Portfolio Contact Form")
3. Copy the 16-character app password — you'll use this as `SMTP_PASS`,
   **not** your normal Gmail password.

### Environment variables

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false        # false = STARTTLS on 587, true = implicit TLS on 465
SMTP_USER=youraddress@gmail.com
SMTP_PASS=your16charapppassword
CONTACT_TO_EMAIL=youraddress@gmail.com   # optional — defaults to SMTP_USER
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

Then test locally:

```bash
npm run dev
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"you@example.com","message":"Hello!"}'
```

A successful response is `{"ok":true}`, and the email should land in
`CONTACT_TO_EMAIL` within a few seconds.

### Notes & limits

- Gmail's sending limit is ~500 messages/day on a personal account — far
  more than a portfolio contact form needs.
- The route includes a hidden honeypot field and a soft in-memory rate
  limit (5 messages/IP/hour per warm serverless instance) to discourage
  spam, with no database required.
- The route uses `export const runtime = "nodejs"` because `node:net` /
  `node:tls` aren't available on the Edge runtime — Vercel's Node.js
  serverless functions support outbound TLS connections on any port, so
  this works out of the box.

---

## 6. Deploying to Vercel

1. Push this project to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
   (Vercel auto-detects Next.js — no build settings to change).
3. Before the first deploy (or after, under **Project Settings → Environment
   Variables**), add:
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`,
     `CONTACT_TO_EMAIL`
   - `NEXT_PUBLIC_SITE_URL` — set this to your final Vercel URL (or custom
     domain), e.g. `https://firoz-miya.vercel.app`. This is used for the
     sitemap and Open Graph tags.
4. Deploy. Every push to your default branch redeploys automatically.

To use a custom domain, add it under **Project Settings → Domains** and
update `NEXT_PUBLIC_SITE_URL` to match.

---

## 7. Design system quick reference

All design tokens live in `app/globals.css` under `:root` / `@theme inline`:

- `--accent` (`#ee0000`) — Red Hat red, used for highlights, links, buttons
- `--bg`, `--surface`, `--border` — dark surface scale
- `--green` / `--amber` — status colors (completed / in-progress)
- Fonts: **Space Grotesk** (headings), **Inter** (body), **JetBrains Mono**
  (labels, code, terminal UI) — all self-hosted via `@fontsource`, no
  external font requests.

Reusable building blocks are in `components/ui/`: `TerminalWindow`,
`CommandBlock`, `StatusBadge`, `SectionHeading`, `Reveal` (scroll animation).
