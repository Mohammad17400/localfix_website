# Design and code guide

## Design system

- Warm cream background `#faf9f5`; ink `#203d36`; primary green `#126b5e`.
- Soft blue, yellow, lilac and terracotta category backgrounds.
- Sans-serif interface, serif italic accents in large headlines.
- Rounded cards, generous spacing and illustrated local-service profiles.
- Motion reveals, hover feedback and animated request steps; reduced-motion preference respected.
- Original SVG assets generated specifically for this project; Lucide icons from the installed package.
- Wireframe references are in `wireframes.svg`. These are supplied with the final build as study/design references and do not claim a prior instructor approval.

## Key JavaScript ideas to explain

**Arrays and objects:** each user, service or request is an object; all objects of a kind live in one array. IDs connect objects rather than copying all details everywhere.

**filter:** discovery combines category/area/search conditions; dashboards filter requests by the selected customer or assigned provider.

**find:** detail pages locate one record by its ID.

**map:** components render cards; state actions replace one matching object with a new object while keeping other records unchanged.

**reduce:** provider rating calculates the sum of review scores, then divides by the number of reviews.

**Immutable updates:** `transact` returns a new state object rather than mutating the existing arrays. This makes React updates predictable and business-rule tests straightforward.

**React Context/state:** AppProvider owns the shared data. Pages call `run(type, payload)` instead of storing separate copies of requests in each dashboard. A ref also tracks the most recent committed state so rapid sequential actions validate against current data.

**localStorage:** data is serialized using JSON.stringify and loaded with JSON.parse. A version/shape check protects ordinary load failures. This is persistence, not security. The same-origin restriction means another browser/port gets different data.

**Service snapshot:** request creation copies the selected service title and price into the request. Editing the listing later does not rewrite the historical request.

**Motion:** Reveal uses motion.div for section entrances; provider cards use whileHover; the wizard uses AnimatePresence to transition between steps. MotionConfig applies reduced-motion preference.

**Tailwind:** Vite loads the Tailwind plugin; styles.css imports Tailwind. The project uses custom CSS classes and tokens for the visual system rather than placing all styling inline. Tailwind utilities remain available for extensions.

## Where to change things

- Demo names/services/prices: `src/data/seed.js`; reset saved demo data afterward.
- Business rules: `src/utils/model.js`.
- Role switch, data persistence and toast messages: `src/context/AppContext.jsx`.
- Layout/navigation: `src/components/Layout.jsx`.
- Shared cards, fields and dialogs: `src/components/UI.jsx`.
- Colors/layout/responsive design: `src/styles.css`.
- Routes: `src/App.jsx`.

## Improving beyond this scope

A production version would require an authenticated backend, server-side authorization/validation, database constraints, secure deployment, actual provider onboarding, booking conflict handling, privacy controls and messaging/payment integrations. None of those are claimed by this frontend.
