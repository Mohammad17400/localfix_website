# Validation record

Date: 10 November 2026. Environment: Node 24.22.1, npm 11.9.0, Vite build, Chrome preview. This is a real execution record for the supplied application, not a claim about untested devices.

## Automated tests

Command: `npm test` — **14 tests passed, 0 failed**.

| Test                                                               | Result |
| ------------------------------------------------------------------ | ------ |
| Seed references and review relationships                           | Pass   |
| Create → accept → start → complete → review journey                | Pass   |
| Duplicate request submission rejected                              | Pass   |
| Request fields, service reference, area and future-time validation | Pass   |
| Provider ownership and status-transition rules                     | Pass   |
| Customer ownership and pending-only cancellation                   | Pass   |
| Review ownership, completion, range and duplicate rules            | Pass   |
| Archive preserves history and blocks new requests                  | Pass   |
| Provider/category deactivation preserves requests                  | Pass   |
| Listing editing preserves historical price and ownership           | Pass   |
| Favorites toggle independently for each customer                   | Pass   |
| Storage serialization/deserialization round trip                   | Pass   |
| Malformed JSON and failed storage writes recover                   | Pass   |
| Profile validation and provider-name update                        | Pass   |

## Browser checks actually performed

| Check                                              | Actual result                                                                                | Status |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------ |
| Desktop homepage                                   | Rendered hero, navigation, search and local SVG assets                                       | Pass   |
| Customer role selection → Plumbing → Ahmad profile | Correct profile and service shown                                                            | Pass   |
| Empty task description                             | Specific validation message; cannot advance                                                  | Pass   |
| Valid three-step request                           | Created a single Pending request with submitted details                                      | Pass   |
| Header role switch preserves request route         | Assigned provider opened the same new request                                                | Pass   |
| Accept → Start work → Mark completed               | Status and timestamped timeline updated                                                      | Pass   |
| Customer review                                    | One review displayed; review action removed afterward                                        | Pass   |
| Browser refresh                                    | Completed status and new review remained                                                     | Pass   |
| Admin category creation                            | Painting category added                                                                      | Pass   |
| Provider deactivation                              | Ahmad disappeared from search; zero-result state displayed                                   | Pass   |
| Provider service creation                          | Kitchen drain inspection added at 750 AFN                                                    | Pass   |
| Provider service editing                           | Updated price to 800 AFN                                                                     | Pass   |
| Provider archive confirmation                      | Listing changed to Archived                                                                  | Pass   |
| Mobile home / dashboard                            | Inspected at 375px iframe width; document width equaled scroll width (360px after scrollbar) | Pass   |
| Tablet discovery                                   | Inspected at 768px iframe width; document width equaled scroll width (753px after scrollbar) | Pass   |
| Mobile menu and dashboard navigation               | Menu opened and navigated to dashboard; tab strip scrolls within its row                     | Pass   |
| Tablet filter dialog / Escape                      | Dialog rendered; Escape interaction exercised                                                | Pass   |
| Reset and reload                                   | Returned to signed-out homepage, 4 original categories and 12 providers                      | Pass   |

## Build

`npm run build` completed successfully and emitted `dist/`. Final build and test output are included in `build-output.txt` and `test-output.txt`.

## Issues found and fixed

- Field hints/errors were included in accessible names: added explicit label and description IDs.
- Skip-link fragment conflicted with hash routing: changed it to focus the main landmark without route navigation.
- Responsive paragraph lost spacing when a desktop line break was hidden: preserved whitespace.
- Added strict calendar-date validation to the pure request action.
- Improved demo avatar variety using local illustration assets.

## Checks still to do before classroom submission

- Test on your own Mac and phone (Safari and another browser).
- Complete a full screen-reader and keyboard-only accessibility audit.
- Measure performance on your intended device/network; no measured speed guarantee is claimed.
- Try contact form, favorites and all profile variants manually; some of these are covered by model tests but not all browser paths were exercised.
- Confirm that your instructor accepts the frontend-only scope; add actual research, team details and repository/design links.
- Rehearse the presentation with the real team.

No real provider, email or payment service was contacted during testing. Test records were reset; the source ZIP contains only clean seed data, not browser QA data.

## Updated edition verification — November 10, 2026

- 16 automated business-rule tests pass, including crypto compatibility and unique request IDs.
- Production Vite build succeeds.
- Browser: request link → customer selection → change selected service → validation → area and time selection → review → submission.
- Edited preferred date (November 15) is stored correctly and survives refresh.
- Switch to assigned provider and accept request: status changes to Accepted.
- Desktop homepage/logo/photos visually reviewed; mobile 390px service cards and tablet 768px request layout inspected.
- Added locally bundled photos, logo, page transitions and hover/focus effects. Visible demo labels removed; README retains frontend limitations.

No live provider dispatch, backend authentication, or payment processing is claimed. Browser QA creates local test records only; these are not part of the packaged seed data.
