# System models, sitemap and user flows

Mermaid blocks render in many Markdown viewers, including GitHub. `use-cases.puml` supplies standard UML use-case notation. IDs are conceptual keys in arrays; there is no database server.

## Conceptual ERD

```mermaid
erDiagram
 USER ||--o| PROVIDER : has
 PROVIDER ||--o{ SERVICE : offers
 CATEGORY ||--o{ SERVICE : groups
 USER ||--o{ REQUEST : submits
 PROVIDER ||--o{ REQUEST : receives
 SERVICE ||--o{ REQUEST : selected_for
 REQUEST ||--o| REVIEW : receives
 USER ||--o{ FAVORITE : saves
 PROVIDER ||--o{ FAVORITE : saved_in
 USER {
  string id PK
  string name
  string email
  string role
  string area
 }
 PROVIDER {
  string id PK
  string userId FK
  string name
  string bio
  number experienceYears
  array serviceAreas
  boolean isActive
 }
 CATEGORY {
  string id PK
  string name
  string description
  boolean isActive
 }
 SERVICE {
  string id PK
  string providerId FK
  string categoryId FK
  string title
  number price
  string pricingBasis
  boolean isActive
 }
 REQUEST {
  string id PK
  string customerId FK
  string providerId FK
  string serviceId FK
  object serviceSnapshot
  string problem
  string address
  string area
  string preferredDate
  string preferredTime
  string status
  array statusHistory
 }
 REVIEW {
  string id PK
  string requestId FK
  string customerId FK
  string providerId FK
  number rating
  string comment
 }
 FAVORITE {
  string id PK
  string customerId FK
  string providerId FK
 }
```

Reviews also reference a customer and provider; these must match their completed request. The request service snapshot preserves title/price/provider-name history. Status history objects contain status, at and actor fields. Favorites are unique by customer/provider pair. A review is unique by request ID.

## Sitemap

| Public                                               | Customer workspace                       | Provider workspace                       | Admin workspace                          |
| ---------------------------------------------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| Home `/`                                             | Overview `/dashboard`                    | Overview `/dashboard`                    | Overview `/dashboard`                    |
| Services `/services`                                 | My requests `/dashboard/requests`        | Incoming requests `/dashboard/requests`  | All requests `/dashboard/requests`       |
| Provider `/providers/:id`                            | Request detail `/dashboard/requests/:id` | Request detail `/dashboard/requests/:id` | Request detail `/dashboard/requests/:id` |
| Request `/request/:id` (customer selection required) | Saved providers `/dashboard/favorites`   | My services `/dashboard/services`        | Providers `/dashboard/providers`         |
| Demo access `/demo-access`                           | Profile `/dashboard/profile`             | Profile `/dashboard/profile`             | Categories `/dashboard/categories`       |
| About `/about`, Contact `/contact`                   |                                          |                                          |                                          |

Routes are encoded after `#` for static hosting. Workspace navigation is determined by the current demo user's role.

## Request submission flow

```mermaid
flowchart TD
 A[Browse and filter] --> B[Select provider and service]
 B --> C{Customer selected?}
 C -->|No| D[Choose demo customer]
 D --> E[Return to selected service]
 C -->|Yes| F[Describe task]
 E --> F
 F --> G{Description valid?}
 G -->|No| F
 G -->|Yes| H[Enter area, address and time]
 H --> I{Valid served area and future time?}
 I -->|No| H
 I -->|Yes| J[Review summary]
 J --> K{Service still active?}
 K -->|No| L[Show error and choose another service]
 K -->|Yes| M[Create one Pending request]
 M --> N[Show request details]
```

## Request lifecycle

```mermaid
stateDiagram-v2
 [*] --> Pending
 Pending --> Accepted: Assigned provider accepts
 Pending --> Declined: Assigned provider declines
 Pending --> Cancelled: Owning customer cancels
 Accepted --> InProgress: Provider starts work
 InProgress --> Completed: Provider completes work
 Completed --> [*]
 Declined --> [*]
 Cancelled --> [*]
```

## Review flow

```mermaid
flowchart TD
 A[Open request] --> B{Owned and completed?}
 B -->|No| C[Review unavailable]
 B -->|Yes| D{Already reviewed?}
 D -->|Yes| E[Show existing review]
 D -->|No| F[Enter rating and comment]
 F --> G{Valid rating and comment?}
 G -->|No| F
 G -->|Yes| H[Save review and update derived rating]
```

## Service management / visibility flow

```mermaid
flowchart TD
 A[Provider opens My Services] --> B{Create or edit?}
 B --> C[Enter listing details]
 C --> D{Valid and owned?}
 D -->|No| C
 D -->|Yes| E[Save listing]
 E --> F{Provider, category and service active?}
 F -->|Yes| G[Visible in discovery]
 F -->|No| H[Hidden from discovery]
 I[Admin changes provider or category visibility] --> F
 J[Provider confirms archive] --> H
 H --> K[Existing requests remain readable]
```

## Important use case descriptions

**UC-01 Request service:** Actor Customer. Preconditions: selected customer and active service. Main flow: find service, describe task, choose served area/future time, review, submit. Alternate flows: choose demo account first; correct invalid fields; active state changes before submission. Postcondition: one Pending request with immutable service snapshot.

**UC-02 Update request:** Actor Assigned Provider. Precondition: request is assigned to current provider and current status permits the action. Main flow: open request, accept/decline or advance accepted work, see timestamped history. Postcondition: valid new status visible to customer. Alternate: action rejected for other providers or terminal requests.

**UC-03 Review service:** Actor Owning Customer. Preconditions: Completed and no previous review. Main flow: rate 1–5, add comment, submit. Postcondition: one review; aggregate rating recalculated. Alternate: duplicate or ineligible submission rejected.

**UC-04 Manage listings:** Actor Provider. Main flow: create/edit own listing or confirm archive. Postcondition: discovery reflects active state; historical requests retain their original service information.

**UC-05 Moderate visibility:** Actor Administrator. Main flow: add/edit category or confirm provider/category deactivation. Postcondition: inactive offerings cannot receive new requests; old records remain.
