import test from "node:test";
import assert from "node:assert/strict";
import { createSeed, localDate } from "../src/data/seed.js";
import {
  uid,
  transact,
  validState,
  activeService,
  loadState,
  saveState,
  STORAGE_KEY,
} from "../src/utils/model.js";
const seed = () => ({ ...createSeed(), sessionId: "customer-1" });
const payload = () => ({
  id: "REQ-TEST",
  serviceId: "service-1",
  problem: "My kitchen tap is leaking constantly.",
  address: "12 Fictional Lane",
  area: "Shahr-e Naw",
  preferredDate: localDate(2),
  preferredTime: "10:00",
});
test("seed has consistent references and ratings", () =>
  assert.equal(validState(seed()), true));
test("request journey creates one request, completes and reviews it", () => {
  let s = seed();
  s = transact(s, "request", payload());
  assert.equal(s.requests[0].status, "pending");
  for (const status of ["accepted", "in_progress", "completed"])
    s = transact(s, "transition", { id: "REQ-TEST", status }, "user-1");
  s = transact(s, "review", {
    requestId: "REQ-TEST",
    rating: 5,
    comment: "A clear and careful demonstration.",
  });
  assert.equal(s.requests[0].statusHistory.length, 4);
  assert.equal(s.reviews.at(-1).rating, 5);
  assert.equal(validState(s), true);
});
test("duplicate submission does not add a second request", () => {
  const s = transact(seed(), "request", payload());
  assert.throws(() => transact(s, "request", payload()), /already/);
});
test("request input and future-time validation", () => {
  for (const change of [
    { problem: "  " },
    { address: "x" },
    { area: "Unknown" },
    { preferredDate: localDate(-1) },
    { serviceId: "missing" },
  ])
    assert.throws(() =>
      transact(seed(), "request", { ...payload(), ...change }),
    );
});
test("only assigned provider can act and cannot skip statuses", () => {
  const s = transact(seed(), "request", payload());
  assert.throws(
    () =>
      transact(
        s,
        "transition",
        { id: "REQ-TEST", status: "accepted" },
        "user-2",
      ),
    /another provider/,
  );
  assert.throws(
    () =>
      transact(
        s,
        "transition",
        { id: "REQ-TEST", status: "completed" },
        "user-1",
      ),
    /not allowed/,
  );
  assert.throws(
    () =>
      transact(
        s,
        "transition",
        { id: "REQ-TEST", status: "accepted" },
        "admin-1",
      ),
    /provider/,
  );
});
test("customer cancellation is restricted by ownership and status", () => {
  let s = transact(seed(), "request", payload());
  assert.throws(() =>
    transact(
      s,
      "transition",
      { id: "REQ-TEST", status: "cancelled" },
      "customer-2",
    ),
  );
  s = transact(s, "transition", { id: "REQ-TEST", status: "cancelled" });
  assert.equal(s.requests[0].status, "cancelled");
  assert.throws(() =>
    transact(s, "transition", { id: "REQ-TEST", status: "accepted" }, "user-1"),
  );
});
test("review ownership, completion, range and duplicate validation", () => {
  const s = seed();
  assert.throws(() =>
    transact(s, "review", {
      requestId: "REQ-DEMO-01",
      rating: 5,
      comment: "A long enough review",
    }),
  );
  assert.throws(
    () =>
      transact(s, "review", {
        requestId: "seed-1-0",
        rating: 5,
        comment: "A long enough review",
      }),
    /already/,
  );
  let t = transact(s, "request", payload());
  for (const status of ["accepted", "in_progress", "completed"])
    t = transact(t, "transition", { id: "REQ-TEST", status }, "user-1");
  for (const rating of [0, 6, 2.5])
    assert.throws(() =>
      transact(t, "review", {
        requestId: "REQ-TEST",
        rating,
        comment: "A long enough review",
      }),
    );
  assert.throws(() =>
    transact(
      t,
      "review",
      { requestId: "REQ-TEST", rating: 4, comment: "A long enough review" },
      "customer-2",
    ),
  );
});
test("archive keeps history and blocks new requests", () => {
  let s = seed();
  const title = s.requests[0].serviceSnapshot.title;
  s = transact(s, "archiveService", { id: "service-1" }, "user-1");
  assert.equal(s.requests[0].serviceSnapshot.title, title);
  assert.equal(activeService(s, s.services[0]), false);
  assert.throws(() => transact(s, "request", payload()), /no longer available/);
});
test("deactivating provider or category hides services without destroying requests", () => {
  let s = transact(
    seed(),
    "providerActive",
    { id: "provider-1", isActive: false },
    "admin-1",
  );
  assert.equal(activeService(s, s.services[0]), false);
  assert.equal(s.requests.length, 25);
  s = transact(
    seed(),
    "category",
    { ...seed().categories[0], isActive: false },
    "admin-1",
  );
  assert.equal(activeService(s, s.services[0]), false);
});
test("service editing preserves historical prices and ownership", () => {
  let s = seed();
  assert.throws(() =>
    transact(s, "service", { ...s.services[0], price: 10 }, "user-2"),
  );
  s = transact(s, "service", { ...s.services[0], price: 999 }, "user-1");
  assert.equal(s.services[0].price, 999);
  assert.equal(s.requests[0].serviceSnapshot.price, 650);
});
test("favorites toggle and stay scoped to customer", () => {
  let s = transact(seed(), "favorite", { providerId: "provider-1" });
  assert.equal(s.favorites.length, 1);
  s = transact(s, "favorite", { providerId: "provider-1" }, "customer-2");
  assert.equal(s.favorites.length, 2);
  s = transact(s, "favorite", { providerId: "provider-1" });
  assert.equal(s.favorites[0].customerId, "customer-2");
});
test("valid data round trips through storage", () => {
  const box = new Map(),
    storage = { getItem: (k) => box.get(k), setItem: (k, v) => box.set(k, v) };
  const s = seed();
  assert.equal(saveState(storage, s), "");
  assert.deepEqual(loadState(storage).data, s);
});
test("malformed data and unavailable storage recover without crashing", () => {
  for (const raw of ["{", "{}", "null"]) {
    const result = loadState({ getItem: () => raw });
    assert.equal(validState(result.data), true);
    assert.ok(result.warning);
  }
  assert.ok(
    saveState(
      {
        setItem: () => {
          throw new Error("quota");
        },
      },
      seed(),
    ),
  );
});
test("profile validation and editing updates provider display", () => {
  let s = seed();
  assert.throws(() =>
    transact(
      s,
      "profile",
      {
        name: "Test",
        bio: "A sufficiently detailed profile.",
        serviceAreas: [],
        experienceYears: 3,
      },
      "user-1",
    ),
  );
  s = transact(
    s,
    "profile",
    {
      name: "Demo Expert",
      bio: "A sufficiently detailed profile.",
      serviceAreas: ["Taimani"],
      experienceYears: 4,
    },
    "user-1",
  );
  assert.equal(s.providers[0].name, "Demo Expert");
  assert.equal(s.users.find((u) => u.id === "user-1").name, "Demo Expert");
});

// Request creation must also work on HTTP LAN previews without randomUUID.
test("request IDs work without crypto and remain unique", () => {
  const ids = Array.from({ length: 100 }, () => uid("REQ", null));
  assert.equal(new Set(ids).size, 100);
  assert.ok(ids.every((id) => id.startsWith("REQ-")));
});
test("request IDs accept browsers with getRandomValues but no randomUUID", () => {
  assert.match(
    uid("REQ", { getRandomValues: (values) => values.fill(42) }),
    /^REQ-/,
  );
});
