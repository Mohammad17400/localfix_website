# Final presentation outline — 10 to 15 minutes

This is a slide outline and speaker guide, not a PPTX file. Replace placeholders with actual research, team contributions and instructor-approved scope.

1. **Title and team (30 sec):** LocalFix, Local Services Marketplace. Add real team member names.
2. **Problem and users (1 min):** Explain the problem hypothesis and customer/provider/admin perspectives. Distinguish assumptions from actual research.
3. **Research (1 min):** Show actual interview questions and findings once completed. Do not present fictional profiles/reviews as research evidence.
4. **Scope and requirements (1 min):** Frontend only, Kabul, four initial categories, arrays/localStorage. Explain one FR and one measurable NFR.
5. **Use cases and ERD (1.5 min):** Show actors, service-request relationship, review uniqueness and service snapshots. Explain why an ERD is useful even for arrays.
6. **Sitemap and flows (1 min):** Public pages and role workspaces. Show the status lifecycle and one validation decision.
7. **UI/UX (1 min):** Responsive cards, clear request form, accessible feedback, restrained motion and reduced-motion support.
8. **Live demo (3–4 min):** Customer requests Ahmad Rahimi's plumbing service → provider accepts/starts/completes → customer reviews → refresh preserves changes. Optionally show admin provider deactivation.
9. **Testing and challenges (1 min):** Explain automated state tests and browser checks. Discuss the distinction between in-memory state and browser persistence. Show actual test results.
10. **Teamwork, limitations and next steps (1 min):** State actual contributions; acknowledge AI help if requested. No backend, real auth, payments or cross-device sync. Summarize lessons learned and what a production version would need.

## Likely questions

- Why React? Reusable components and shared state simplify a changing UI.
- Where is the data? JavaScript arrays, serialized to localStorage for browser persistence.
- Is switching roles secure login? No. It is explicitly a demonstration.
- Why not just delete services? Archival preserves request references/history.
- How do reviews work? Only an owned completed request can receive one review.
- How do you avoid invalid status changes? A centralized transition rule validates actor, ownership and current status.
- What happens after refresh? Data reloads from the same browser/origin if storage is available.
- Does it work offline? After installing dependencies, the local application and bundled assets can run offline through a local server.
