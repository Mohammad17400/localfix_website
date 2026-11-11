# LocalFix — Good help, close to home

A complete frontend course project for Mohammad Abdali: a local services marketplace built with JavaScript, React, Tailwind CSS and Motion for React.

## Start on your Mac

1. Extract `LocalFix_Complete_Project.zip`.
2. Open the extracted `localfix` folder in VS Code.
3. Open **Terminal → New Terminal**. Make sure the terminal is inside the folder containing `package.json`.
4. Install Node.js **22.12 or later** (Node 24 also works). Check with `node -v`.
5. Run:

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173). Keep the terminal running. Stop with **Control+C**. To run again later, use `npm run dev`; you do not need to reinstall each time.

For exact locked dependency installation, use `npm ci` instead of `npm install`.

```bash
npm test          # Business-rule tests
npm run build    # Production output in dist/
npm run preview  # Preview the production build
```

The ZIP includes `dist/` as a prebuilt copy, but the editable project is `src/`. Do not double-click `index.html`: use a local web server through the commands above. HashRouter is used so static hosts do not need special fallback rules.

## What's included

- Responsive homepage, service discovery, provider profiles, About and Contact pages.
- Search, category/area filtering, rating/name sorting and saved providers.
- Three-step request form with validation and a review-before-submit screen.
- Customer, provider and administrator dashboards with account switching.
- Pending → Accepted → In Progress → Completed, plus decline and pending cancellation.
- One review per completed request; calculated provider ratings.
- Provider profile editing and service create/edit/archive/reactivation.
- Admin category create/edit/deactivate and provider visibility controls.
- Request history and price snapshots preserved after listing edits or archival.
- Shared React state, arrays of objects and versioned localStorage persistence.
- Motion animations, reduced-motion support, keyboard-accessible native dialogs and clear feedback.
- Bundled Pexels photos, original SVG logo and avatar assets: no image-server dependency at runtime.
- Course documentation, diagrams, wireframes, testing records and presentation outline in `docs/`.

## Presentation walkthrough

1. Click **Get started** → Customer → **Mohammad Abdali**.
2. Open **Find a service**, choose Plumbing, and open **Ahmad Rahimi**.
3. Request **Tap & leak repair**. Use a fictional address in **Shahr-e Naw**, a description of at least 10 characters, and a future Kabul date/time.
4. Submit. The new request appears as Pending.
5. Click your account in the header. Choose Provider → **Ahmad Rahimi**. The header switch returns you to the same request.
6. Click **Accept request**, **Start work**, then **Mark completed**.
7. Switch through the header back to Customer → **Mohammad Abdali**.
8. Leave a review. Refresh: your changes remain.
9. Try Admin → **LocalFix Admin** to manage categories and provider visibility.
10. Use **Restore initial data** in the admin footer to restore the original sample records.

The sample `REQ-1001` is already pending for Ahmad Rahimi, useful for a quick walkthrough.

## How data works

`src/data/seed.js` creates fictional users, categories, providers, services, requests, reviews and favorites. `src/context/AppContext.jsx` is the shared store. `src/utils/model.js` validates changes and returns immutable updates. Every view reads the same arrays, so a status change appears across roles in the current app.

Storage key: `localfix-demo-v1`. Data belongs to the current browser and origin (host + port). Changing the port or browser creates a separate demo. If saved JSON is damaged, the app loads a fresh in-memory demo and asks you to use Reset to replace the stored copy. If storage is unavailable, changes may not survive refresh.

## Important boundaries

This is a **frontend simulation**, not a production marketplace. Demo account switching is not real authentication, UI role checks are not security, and localStorage is editable. Never enter private information or real passwords. No real bookings, payments, emails, SMS, live chat or verification occur. The contact form saves messages in a separate browser array under `localfix-messages`; it does not send email. There is no synchronization between devices or simultaneously open tabs; reload another tab to read the last saved state. Initial dependency installation requires internet; once dependencies are installed, the app and its local assets can run offline via the local dev/preview server.

There is no booking calendar or conflict prevention. The date/time is a preferred visit, accepted manually by the provider. Prices are illustrative and display their basis. Service ratings derive from fictional seed reviews and browser-added reviews.

## Project organization

| Path                         | Purpose                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `src/main.jsx`               | App entry, router, Motion preferences and error boundary                               |
| `src/App.jsx`                | Route definitions                                                                      |
| `src/components/`            | Layouts, cards, forms, modal, notification and shared UI                               |
| `src/pages/`                 | Public pages, request wizard and dashboards                                            |
| `src/context/AppContext.jsx` | Shared state, actions, persistence and toast notifications                             |
| `src/utils/model.js`         | Business rules, validation, derived data and storage handling                          |
| `src/data/seed.js`           | Initial arrays of fictional demo objects                                               |
| `src/styles.css`             | Tailwind import, design tokens, component styles and responsive rules                  |
| `public/assets/`             | Bundled photographs, logo, mark and avatar illustrations                               |
| `tests/model.test.js`        | Node test suite for key business rules                                                 |
| `docs/`                      | Project proposal, models, flows, learning guide, test results and presentation outline |

## Design and technology

React 19 / JavaScript (JSX), Vite 7, React Router 7, Tailwind CSS 4, Motion 12 and Lucide icons. Custom component CSS builds on Tailwind's integration so the design is easy to adjust from a single stylesheet. The visual system uses warm cream, forest green, soft category colors and home/service photography. Main responsive widths are 560, 800 and 1100 pixels.

To change content, edit `src/data/seed.js` and restore initial data as admin. To change colors, edit variables at the top of `src/styles.css`. To add a category at runtime, use the admin workspace. To add a new type of action, implement its validation in `transact` first.

## Team and course submission

- Project: LocalFix — Local Services Marketplace
- Student: Mohammad Abdali
- Team members/responsibilities: **fill in actual team information**
- Instructor approval: **not recorded; obtain actual approval**
- User research: **template supplied; conduct real interviews**
- GitHub repository / design URL / live URL: **add actual links**
- Submission date: **confirm with instructor**

The source and documentation were prepared with AI assistance. Review, adapt and understand the code; disclose assistance when your instructor requests it. No interviews, approvals, team contributions or GitHub history have been fabricated. The presentation file is a detailed slide outline, not a PowerPoint deck.

## Troubleshooting

- **npm command not found:** install Node.js, then reopen Terminal.
- **Unsupported engine:** use Node 22.12+ or Node 24.
- **Port already in use:** Vite prints another port; open that exact URL. Browser storage differs by port.
- **Old content after editing seed data:** switch to admin and restore initial data in the footer.
- **Empty account workspace:** select the correct customer/provider. Requests are scoped to their owner.
- **Provider missing from search:** check the provider, category and service are active.
- **Page not loading from a file:** use `npm run dev` or `npm run preview`, not file://.

## Updated edition — November 10, 2026

- Pexels photos are bundled for the homepage, categories, and provider cards. See `docs/PHOTO_CREDITS.md` for sources. Photos illustrate services; they do not identify or endorse sample providers.
- Original house/check logo in `public/assets/logo-mark.svg` and full wordmark in `localfix-logo.svg`.
- Request service links on cards; one-click customer selection; working service dropdown; clickable progress steps; neighborhood/time chips; inline validation.
- Request IDs work on browsers without `crypto.randomUUID`, including HTTP LAN previews.
- Motion page transitions, photo zoom, card/button hover and focus effects, reduced-motion support.
- Visible demo badges removed. The project remains frontend-only, with sample profiles and local data, for classroom presentation.
