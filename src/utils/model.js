// Pure business rules: every action validates ownership and input before returning new arrays.
// UI role checks demonstrate a workflow; they are not security without a backend.
import { createSeed } from "../data/seed.js";
export const STORAGE_KEY = "localfix-demo-v1";
export const statusLabel = {
  pending: "Pending",
  accepted: "Accepted",
  in_progress: "In progress",
  completed: "Completed",
  declined: "Declined",
  cancelled: "Cancelled",
};
export const money = (n) => new Intl.NumberFormat("en-US").format(n) + " AFN";
let idSequence = 0;
export function uid(prefix, cryptoApi = globalThis.crypto) {
  if (typeof cryptoApi?.randomUUID === "function")
    return `${prefix}-${cryptoApi.randomUUID()}`;
  const bytes = new Uint32Array(3);
  if (typeof cryptoApi?.getRandomValues === "function")
    cryptoApi.getRandomValues(bytes);
  else
    for (let i = 0; i < bytes.length; i++)
      bytes[i] = Math.floor(Math.random() * 0xffffffff);
  return `${prefix}-${Date.now().toString(36)}-${(++idSequence).toString(36)}-${Array.from(bytes, (n) => n.toString(36)).join("")}`;
}
export function invariant(test, message) {
  if (!test) throw new Error(message);
}
export function activeService(state, s) {
  return !!(
    s?.isActive &&
    state.providers.find((p) => p.id === s.providerId)?.isActive &&
    state.categories.find((c) => c.id === s.categoryId)?.isActive
  );
}
export function rating(state, id) {
  const r = state.reviews.filter((x) => x.providerId === id);
  return {
    count: r.length,
    value: r.length
      ? (r.reduce((a, x) => a + x.rating, 0) / r.length).toFixed(1)
      : "New",
  };
}
export function providerFor(state, userId) {
  return state.providers.find((p) => p.userId === userId);
}
export function validState(s) {
  if (!s || s.version !== 1) return false;
  const keys = [
    "users",
    "categories",
    "providers",
    "services",
    "requests",
    "reviews",
    "favorites",
  ];
  if (
    !keys.every(
      (k) =>
        Array.isArray(s[k]) &&
        s[k].every(
          (x) => x && typeof x === "object" && typeof x.id === "string",
        ) &&
        new Set(s[k].map((x) => x.id)).size === s[k].length,
    )
  )
    return false;
  return (
    s.users.every(
      (x) =>
        typeof x.name === "string" &&
        ["customer", "provider", "admin"].includes(x.role),
    ) &&
    s.categories.every(
      (x) => typeof x.name === "string" && typeof x.isActive === "boolean",
    ) &&
    s.providers.every(
      (p) =>
        s.users.some((u) => u.id === p.userId) &&
        Array.isArray(p.serviceAreas) &&
        p.serviceAreas.every((x) => typeof x === "string") &&
        typeof p.name === "string" &&
        typeof p.bio === "string",
    ) &&
    s.services.every(
      (x) =>
        s.providers.some((p) => p.id === x.providerId) &&
        s.categories.some((c) => c.id === x.categoryId) &&
        typeof x.title === "string" &&
        Number.isFinite(x.price) &&
        ["fixed", "per hour", "starting from"].includes(x.pricingBasis),
    ) &&
    s.requests.every(
      (x) =>
        s.users.some((u) => u.id === x.customerId) &&
        s.providers.some((p) => p.id === x.providerId) &&
        s.services.some((v) => v.id === x.serviceId) &&
        statusLabel[x.status] &&
        typeof x.serviceSnapshot?.title === "string" &&
        Number.isFinite(x.serviceSnapshot.price) &&
        Array.isArray(x.statusHistory) &&
        typeof x.preferredDate === "string",
    ) &&
    s.reviews.every(
      (r) =>
        s.requests.some(
          (x) =>
            x.id === r.requestId &&
            x.status === "completed" &&
            x.customerId === r.customerId &&
            x.providerId === r.providerId,
        ) &&
        Number.isInteger(r.rating) &&
        r.rating >= 1 &&
        r.rating <= 5,
    ) &&
    new Set(s.reviews.map((r) => r.requestId)).size === s.reviews.length &&
    s.favorites.every(
      (f) =>
        s.users.some((u) => u.id === f.customerId) &&
        s.providers.some((p) => p.id === f.providerId),
    ) &&
    (!s.sessionId || s.users.some((u) => u.id === s.sessionId))
  );
}
export function loadState(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { data: createSeed(), warning: "" };
    const s = JSON.parse(raw);
    if (!validState(s)) throw new Error();
    return { data: s, warning: "" };
  } catch {
    return {
      data: createSeed(),
      warning:
        "Saved data could not be read. Initial data is loaded; use Restore initial data from the admin footer to replace the saved copy.",
    };
  }
}
export function saveState(storage, state) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return "";
  } catch {
    return "Your browser could not save changes. This session still works, but changes may be lost after refresh.";
  }
}
export function transact(state, type, payload = {}, actorId = state.sessionId) {
  const actor = state.users.find((u) => u.id === actorId),
    now = new Date().toISOString();
  if (type === "session") {
    invariant(
      !payload.id || state.users.some((u) => u.id === payload.id),
      "Choose a valid account.",
    );
    return { ...state, sessionId: payload.id };
  }
  invariant(actor, "Choose an account first.");
  const role = (r) =>
    invariant(actor.role === r, `This action requires a ${r} account.`);
  // Snapshot listing details so later service edits do not rewrite history.
  if (type === "request") {
    role("customer");
    const s = state.services.find((s) => s.id === payload.serviceId),
      p = state.providers.find((p) => p.id === s?.providerId);
    invariant(activeService(state, s), "This service is no longer available.");
    invariant(
      payload.problem?.trim().length >= 10,
      "Describe the problem in at least 10 characters.",
    );
    invariant(
      payload.address?.trim().length >= 5,
      "Enter an address of at least 5 characters.",
    );
    invariant(
      p.serviceAreas.includes(payload.area),
      "Choose an area served by this provider.",
    );
    invariant(
      /^\d{4}-\d{2}-\d{2}$/.test(payload.preferredDate || "") &&
        /^\d{2}:\d{2}$/.test(payload.preferredTime || ""),
      "Choose a valid date and time.",
    );
    const appt = new Date(
      `${payload.preferredDate}T${payload.preferredTime}:00+04:30`,
    );
    invariant(
      Number.isFinite(+appt) && +appt > Date.now(),
      "Choose a future appointment time (Kabul time).",
    );
    invariant(
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kabul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(appt) === payload.preferredDate,
      "Choose a valid calendar date.",
    );
    const id = payload.id || uid("REQ");
    invariant(
      !state.requests.some((r) => r.id === id),
      "This request has already been submitted.",
    );
    const r = {
      id,
      customerId: actor.id,
      providerId: p.id,
      serviceId: s.id,
      serviceSnapshot: {
        title: s.title,
        price: s.price,
        pricingBasis: s.pricingBasis,
        providerName: p.name,
      },
      problem: payload.problem.trim(),
      address: payload.address.trim(),
      area: payload.area,
      preferredDate: payload.preferredDate,
      preferredTime: payload.preferredTime,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      statusHistory: [{ status: "pending", at: now, actor: actor.id }],
    };
    return { ...state, requests: [r, ...state.requests] };
  }
  // A small state machine prevents skipped or reversed request statuses.
  if (type === "transition") {
    const r = state.requests.find((r) => r.id === payload.id);
    invariant(r, "Request not found.");
    const provider = providerFor(state, actor.id),
      next = payload.status;
    if (next === "cancelled") {
      role("customer");
      invariant(
        r.customerId === actor.id && r.status === "pending",
        "Only your pending requests can be cancelled.",
      );
    } else {
      role("provider");
      invariant(
        provider?.id === r.providerId,
        "This request belongs to another provider.",
      );
      invariant(
        (
          {
            pending: ["accepted", "declined"],
            accepted: ["in_progress"],
            in_progress: ["completed"],
          }[r.status] || []
        ).includes(next),
        "This status change is not allowed.",
      );
    }
    return {
      ...state,
      requests: state.requests.map((x) =>
        x.id === r.id
          ? {
              ...x,
              status: next,
              updatedAt: now,
              statusHistory: [
                ...x.statusHistory,
                { status: next, at: now, actor: actor.id },
              ],
            }
          : x,
      ),
    };
  }
  if (type === "review") {
    role("customer");
    const r = state.requests.find((r) => r.id === payload.requestId);
    invariant(
      r && r.customerId === actor.id && r.status === "completed",
      "You can review only your completed requests.",
    );
    invariant(
      !state.reviews.some((x) => x.requestId === r.id),
      "You have already reviewed this request.",
    );
    const score = Number(payload.rating);
    invariant(
      Number.isInteger(score) && score >= 1 && score <= 5,
      "Select a rating from 1 to 5.",
    );
    invariant(
      payload.comment?.trim().length >= 10,
      "Write at least 10 characters about your experience.",
    );
    return {
      ...state,
      reviews: [
        ...state.reviews,
        {
          id: uid("review"),
          requestId: r.id,
          providerId: r.providerId,
          customerId: actor.id,
          rating: score,
          comment: payload.comment.trim(),
          createdAt: now,
        },
      ],
    };
  }
  if (type === "favorite") {
    role("customer");
    invariant(
      state.providers.some((p) => p.id === payload.providerId),
      "Provider not found.",
    );
    const old = state.favorites.find(
      (f) => f.providerId === payload.providerId && f.customerId === actor.id,
    );
    return {
      ...state,
      favorites: old
        ? state.favorites.filter((f) => f.id !== old.id)
        : [
            ...state.favorites,
            {
              id: uid("favorite"),
              customerId: actor.id,
              providerId: payload.providerId,
            },
          ],
    };
  }
  if (type === "service") {
    role("provider");
    const p = providerFor(state, actor.id),
      old = state.services.find((x) => x.id === payload.id);
    invariant(p, "Provider profile missing.");
    invariant(
      !old || old.providerId === p.id,
      "You can edit only your own services.",
    );
    invariant(
      payload.title?.trim().length >= 3,
      "Use a title of at least 3 characters.",
    );
    invariant(
      payload.description?.trim().length >= 15,
      "Use a description of at least 15 characters.",
    );
    invariant(
      state.categories.some((c) => c.id === payload.categoryId && c.isActive),
      "Select an active category.",
    );
    invariant(
      payload.price !== "" &&
        Number.isFinite(Number(payload.price)) &&
        Number(payload.price) > 0,
      "Enter a positive price.",
    );
    invariant(
      ["fixed", "per hour", "starting from"].includes(payload.pricingBasis),
      "Choose a pricing basis.",
    );
    const s = {
      id: old?.id || uid("service"),
      providerId: p.id,
      title: payload.title.trim(),
      description: payload.description.trim(),
      categoryId: payload.categoryId,
      price: Number(payload.price),
      pricingBasis: payload.pricingBasis,
      estimatedDuration:
        payload.estimatedDuration?.trim() || "Discuss with provider",
      isActive: payload.isActive !== false,
    };
    return {
      ...state,
      services: old
        ? state.services.map((x) => (x.id === old.id ? s : x))
        : [...state.services, s],
    };
  }
  if (type === "archiveService") {
    role("provider");
    const s = state.services.find((s) => s.id === payload.id);
    invariant(
      s && providerFor(state, actor.id)?.id === s.providerId,
      "Service not found or not yours.",
    );
    return {
      ...state,
      services: state.services.map((x) =>
        x.id === s.id ? { ...x, isActive: false } : x,
      ),
    };
  }
  if (type === "category") {
    role("admin");
    invariant(
      payload.name?.trim().length >= 3,
      "Use a category name of at least 3 characters.",
    );
    invariant(
      !state.categories.some(
        (c) =>
          c.id !== payload.id &&
          c.name.toLowerCase() === payload.name.trim().toLowerCase(),
      ),
      "A category with this name already exists.",
    );
    const old = state.categories.find((c) => c.id === payload.id),
      cat = {
        id: old?.id || uid("category"),
        name: payload.name.trim(),
        description:
          payload.description?.trim() || "Explore local professionals",
        icon: old?.icon || "Wrench",
        color: old?.color || "#dceee9",
        isActive: payload.isActive !== false,
      };
    return {
      ...state,
      categories: old
        ? state.categories.map((c) => (c.id === old.id ? cat : c))
        : [...state.categories, cat],
    };
  }
  if (type === "providerActive") {
    role("admin");
    invariant(
      state.providers.some((p) => p.id === payload.id),
      "Provider not found.",
    );
    return {
      ...state,
      providers: state.providers.map((p) =>
        p.id === payload.id ? { ...p, isActive: !!payload.isActive } : p,
      ),
    };
  }
  if (type === "profile") {
    invariant(
      payload.name?.trim().length >= 2,
      "Enter a name of at least 2 characters.",
    );
    const users = state.users.map((u) =>
      u.id === actor.id
        ? { ...u, name: payload.name.trim(), area: payload.area || u.area }
        : u,
    );
    if (actor.role !== "provider") return { ...state, users };
    invariant(
      payload.bio?.trim().length >= 20,
      "Write a bio of at least 20 characters.",
    );
    invariant(
      Array.isArray(payload.serviceAreas) && payload.serviceAreas.length > 0,
      "Choose at least one service area.",
    );
    invariant(
      Number.isInteger(Number(payload.experienceYears)) &&
        Number(payload.experienceYears) >= 0 &&
        Number(payload.experienceYears) <= 60,
      "Experience must be between 0 and 60 years.",
    );
    return {
      ...state,
      users,
      providers: state.providers.map((p) =>
        p.userId === actor.id
          ? {
              ...p,
              name: payload.name.trim(),
              bio: payload.bio.trim(),
              serviceAreas: payload.serviceAreas,
              experienceYears: Number(payload.experienceYears),
            }
          : p,
      ),
    };
  }
  throw new Error("Unknown action.");
}
