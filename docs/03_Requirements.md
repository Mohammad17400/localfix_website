# LocalFix requirements and traceability

All functional requirements below are for a browser simulation. Dates/times use Kabul local time. Role and ownership checks demonstrate business rules, not secure authorization.

| ID    | Requirement / acceptance criterion                                                                                                                    | Priority | Implementation                  | Validation                              |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------- | --------------------------------------- |
| FR-01 | A visitor can view active service providers; inactive service/category/provider combinations are excluded.                                            | Must     | Public Services; activeService  | Tests 8–9; browser deactivation check   |
| FR-02 | Search term, category and area filters combine; clear/reset restores the full active set.                                                             | Must     | Services                        | Browser filter check                    |
| FR-03 | Provider detail shows bio, area, experience, available services, price basis and reviews.                                                             | Must     | ProviderDetail                  | Browser profile inspection              |
| FR-04 | Demo role/account selection opens the corresponding workspace and can return to a selected service/request.                                           | Must     | DemoAccess, Context             | Browser end-to-end flow                 |
| FR-05 | A customer creates a Pending request with description, served area, address and future preferred time. Invalid or duplicate submissions are rejected. | Must     | Request, transact(request)      | Tests 2–4; browser form validation      |
| FR-06 | Customers see their own requests; providers see only assigned requests; admin can inspect all.                                                        | Must     | ownRequests; transact           | Tests 5–6                               |
| FR-07 | Assigned provider accepts/declines Pending work, starts Accepted work and completes In Progress work. Other transitions are blocked.                  | Must     | transact(transition)            | Tests 2,5; browser full flow            |
| FR-08 | Owning customer can cancel only Pending work.                                                                                                         | Must     | transact(transition)            | Test 6                                  |
| FR-09 | A customer adds one 1–5 review to their own completed request; ratings/counts are derived.                                                            | Must     | RequestDetail; transact(review) | Test 7; browser review                  |
| FR-10 | Customer can add/remove a provider from a personal favorite list.                                                                                     | Should   | ProviderCard; Favorites         | Test 11                                 |
| FR-11 | Provider creates, edits, archives and reactivates own services. Existing requests keep historical title and price.                                    | Must     | MyServices; serviceSnapshot     | Tests 8,10; browser create/edit/archive |
| FR-12 | Admin creates/edits/deactivates categories; duplicate names rejected.                                                                                 | Must     | Categories                      | Browser create; model rule              |
| FR-13 | Admin activates/deactivates providers; existing requests remain.                                                                                      | Must     | Providers                       | Test 9; browser deactivation            |
| FR-14 | Customer/provider edits profile; provider must retain at least one service area.                                                                      | Should   | Profile                         | Test 14                                 |
| FR-15 | Successful mutations persist in localStorage; reset restores seeds after confirmation.                                                                | Must     | AppContext; storage helpers     | Tests 12–13; browser reload/reset       |
| FR-16 | Contact form validates and explicitly confirms that no email was sent.                                                                                | Should   | Contact                         | Manual checklist                        |

| ID     | Non-functional requirement | Acceptance criterion                                                                                                                             |
| ------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| NFR-01 | Responsive layout          | Home, discovery and dashboard usable at 375/768/desktop widths; no page-wide horizontal overflow.                                                |
| NFR-02 | Feedback                   | Invalid core submissions show specific messages; actions show success/error notices.                                                             |
| NFR-03 | Accessibility              | Labeled forms, visible focus, semantic navigation, keyboard-operable dialogs, color-independent status text.                                     |
| NFR-04 | Reduced motion             | MotionConfig follows user preferences; CSS minimizes animation under reduced motion.                                                             |
| NFR-05 | Resilience                 | Malformed storage loads a fresh in-memory demo with a notice; failed writes warn instead of crashing.                                            |
| NFR-06 | Maintainability            | Shared state, pure business rules and reusable UI components; no backend or real credentials.                                                    |
| NFR-07 | Local assets               | No remote image/API dependency for normal app use after installation.                                                                            |
| NFR-08 | Performance/build          | Production build succeeds; no app-origin console errors during the tested core flow. Performance on real target devices still needs measurement. |

## Eight course phases

1. Problem identification → proposal draft and scope.
2. Gathering → real interview template, findings to be supplied by the team.
3. Analysis → numbered requirements and UML use cases.
4. Modeling → conceptual ERD for related arrays.
5. Structure/flows → sitemap and decision-based flows.
6. UI/UX → wireframe references and design tokens; implementation was created in this session, so these exports are supplied as layout references, not claimed as evidence of an earlier design review.
7. Development/testing → source, build, test suite and browser results.
8. Presentation → outline and demonstration script.
