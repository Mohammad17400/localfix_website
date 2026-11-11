import { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  Clock,
  Check,
  CalendarDays,
  MapPin,
  Star,
  ClipboardList,
  Users,
  Wrench,
  Heart,
  Search,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { providerFor, statusLabel, money } from "../utils/model";
import { DashboardLayout } from "../components/Layout";
import {
  Badge,
  Empty,
  Modal,
  Field,
  ProviderCard,
  Confirm,
} from "../components/UI";
export function ownRequests(data, user) {
  if (!user) return [];
  if (user.role === "admin") return data.requests;
  return data.requests.filter((r) =>
    user.role === "customer"
      ? r.customerId === user.id
      : r.providerId === providerFor(data, user.id)?.id,
  );
}
export function RequestCard({ request: r }) {
  const { data, user } = useApp();
  const name =
    user?.role === "provider"
      ? data.users.find((u) => u.id === r.customerId)?.name
      : r.serviceSnapshot.providerName;
  return (
    <Link className="request-card" to={`/dashboard/requests/${r.id}`}>
      <div className="request-icon">
        <Wrench size={22} />
      </div>
      <div className="request-main">
        <div className="flex-between">
          <span className="request-id">
            {r.id.startsWith("REQ-DEMO")
              ? "SERVICE REQUEST"
              : r.id.slice(0, 16).toUpperCase()}
          </span>
          <Badge status={r.status} />
        </div>
        <h3>{r.serviceSnapshot.title}</h3>
        <p>
          {name} <span>·</span> {r.area}
        </p>
        <div className="request-date">
          <CalendarDays size={14} />
          {r.preferredDate}
          <Clock size={14} />
          {r.preferredTime} Kabul
          <ArrowUpRight size={18} />
        </div>
      </div>
    </Link>
  );
}
export function Overview() {
  const { data, user } = useApp();
  const req = ownRequests(data, user),
    pending = req.filter((r) => r.status === "pending").length,
    active = req.filter((r) =>
      ["accepted", "in_progress"].includes(r.status),
    ).length,
    done = req.filter((r) => r.status === "completed").length;
  return (
    <DashboardLayout
      title={`Hello${user ? ", " + user.name.split(" ")[0] : ""}.`}
      subtitle="A little overview of your local world."
    >
      {user && (
        <>
          <div className="dashboard-welcome">
            <div>
              <span className="eyebrow">
                {user.role === "customer"
                  ? "A HAPPIER HOME STARTS HERE"
                  : "YOUR DAY, A LITTLE MORE ORGANIZED"}
              </span>
              <h2>
                {user.role === "customer"
                  ? "What can we help with today?"
                  : user.role === "provider"
                    ? "Great service starts with a clear plan."
                    : "Keep your neighborhood connected."}
              </h2>
              <p>
                {user.role === "customer"
                  ? "Find the right professional for the next thing on your list."
                  : "Manage your requests and keep every step up to date."}
              </p>
              <Link
                className="btn"
                to={
                  user.role === "customer" ? "/services" : "/dashboard/requests"
                }
              >
                {user.role === "customer"
                  ? "Explore services"
                  : "View requests"}
                <ArrowUpRight size={17} />
              </Link>
            </div>
            <HouseIllustration />
          </div>
          <div className="stats-grid">
            {[
              [ClipboardList, "All requests", req.length],
              [Clock, "Pending", pending],
              [Wrench, "In progress / accepted", active],
              [Check, "Completed", done],
            ].map(([Icon, t, n]) => (
              <div className="stat" key={t}>
                <span>
                  <Icon size={20} />
                </span>
                <strong>{n}</strong>
                <small>{t}</small>
              </div>
            ))}
          </div>
          <div className="section-title">
            <div>
              <h2>Recent requests</h2>
              <p>Your latest tasks, all in one place.</p>
            </div>
            <Link className="text-link" to="/dashboard/requests">
              View all
              <ArrowUpRight size={17} />
            </Link>
          </div>
          {req.length ? (
            <div className="request-grid">
              {req.slice(0, 4).map((r) => (
                <RequestCard key={r.id} request={r} />
              ))}
            </div>
          ) : (
            <Empty />
          )}
          <div className="notice">
            Keep your requests up to date. Accepted appointments appear here,
            and completed services can be reviewed from their request details.
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
function HouseIllustration() {
  return <img className="dashboard-house" src="assets/home-scene.svg" alt="" />;
}
export function Requests() {
  const { data, user } = useApp();
  const [status, setStatus] = useState("all"),
    [q, setQ] = useState("");
  const all = ownRequests(data, user),
    req = all.filter(
      (r) =>
        (status === "all" || r.status === status) &&
        (
          r.serviceSnapshot.title +
          " " +
          r.id +
          " " +
          r.serviceSnapshot.providerName
        )
          .toLowerCase()
          .includes(q.toLowerCase()),
    );
  return (
    <DashboardLayout
      title={
        user?.role === "provider"
          ? "Incoming requests"
          : user?.role === "admin"
            ? "All requests"
            : "My requests"
      }
      subtitle="From the first request to the finishing touch."
    >
      <div className="panel request-filters">
        <div className="tabs scroll-tabs">
          {[
            "all",
            "pending",
            "accepted",
            "in_progress",
            "completed",
            "declined",
            "cancelled",
          ].map((s) => (
            <button
              key={s}
              className={status === s ? "active" : ""}
              onClick={() => setStatus(s)}
            >
              {s === "all" ? "All" : statusLabel[s]}
              <span>
                {all.filter((r) => s === "all" || r.status === s).length}
              </span>
            </button>
          ))}
        </div>
        <div className="input-icon">
          <Search size={18} />
          <input
            aria-label="Search requests"
            placeholder="Search service, provider or request ID"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>
      {req.length ? (
        <div className="request-grid">
          {req.map((r) => (
            <RequestCard key={r.id} request={r} />
          ))}
        </div>
      ) : (
        <Empty
          title="No requests here yet"
          text="Try another status or search term."
          to={user?.role === "customer" ? "/services" : null}
        />
      )}
    </DashboardLayout>
  );
}
export function RequestDetail() {
  const { id } = useParams(),
    { data, user, run } = useApp();
  const [reviewOpen, setReviewOpen] = useState(false),
    [score, setScore] = useState(5),
    [confirm, setConfirm] = useState(null);
  const r = ownRequests(data, user).find((x) => x.id === id),
    existing = data.reviews.find((v) => v.requestId === id);
  if (!r)
    return (
      <DashboardLayout title="Request details" subtitle="">
        <Empty
          title="Request not available"
          text="Choose the customer or assigned provider account to see this request."
          to="/account?return=/dashboard/requests"
          label="Switch account"
        />
      </DashboardLayout>
    );
  const provider = data.providers.find((p) => p.id === r.providerId),
    customer = data.users.find((u) => u.id === r.customerId);
  function transition(status) {
    if (["declined", "cancelled"].includes(status))
      setConfirm({
        title: `${status === "declined" ? "Decline" : "Cancel"} this request?`,
        text: "This closes the request. You can create a new request later if needed.",
        label: status === "declined" ? "Decline request" : "Cancel request",
        status,
      });
    else
      run(
        "transition",
        { id, status },
        `Request ${statusLabel[status].toLowerCase()}.`,
      );
  }
  return (
    <DashboardLayout
      title="Request details"
      subtitle="Every detail. Every step."
    >
      <Link className="breadcrumb" to="/dashboard/requests">
        All requests
        <ChevronRight size={15} />
        {r.id.replace("REQ-DEMO", "REQ").slice(0, 20)}
      </Link>
      <div className="request-detail-grid">
        <section className="panel">
          <div className="flex-between">
            <span className="eyebrow">SERVICE REQUEST</span>
            <Badge status={r.status} />
          </div>
          <h2>{r.serviceSnapshot.title}</h2>
          <p className="muted">Request ID: {r.id.replace("REQ-DEMO", "REQ")}</p>
          <div className="request-people">
            <img src={provider.photo} alt="" />
            <div>
              <small>Provider</small>
              <Link to={`/providers/${provider.id}`}>
                {r.serviceSnapshot.providerName}
              </Link>
            </div>
            <div>
              <small>Customer</small>
              <strong>{customer.name}</strong>
            </div>
          </div>
          <dl className="summary-list">
            <div>
              <dt>The task</dt>
              <dd>{r.problem}</dd>
            </div>
            <div>
              <dt>Service address</dt>
              <dd>
                {r.address}, {r.area}
              </dd>
            </div>
            <div>
              <dt>Preferred visit</dt>
              <dd>
                {r.preferredDate} at {r.preferredTime} (Kabul)
              </dd>
            </div>
            <div>
              <dt>Price at request</dt>
              <dd>
                {money(r.serviceSnapshot.price)} ·{" "}
                {r.serviceSnapshot.pricingBasis}
              </dd>
            </div>
          </dl>
          <div className="form-actions left">
            {user.role === "customer" && r.status === "pending" && (
              <button
                className="btn secondary"
                onClick={() => transition("cancelled")}
              >
                Cancel request
              </button>
            )}
            {user.role === "provider" && r.status === "pending" && (
              <>
                <button className="btn" onClick={() => transition("accepted")}>
                  Accept request
                  <Check size={17} />
                </button>
                <button
                  className="btn secondary"
                  onClick={() => transition("declined")}
                >
                  Decline
                </button>
              </>
            )}
            {user.role === "provider" && r.status === "accepted" && (
              <button className="btn" onClick={() => transition("in_progress")}>
                Start work
                <Wrench size={17} />
              </button>
            )}
            {user.role === "provider" && r.status === "in_progress" && (
              <button className="btn" onClick={() => transition("completed")}>
                Mark completed
                <Check size={17} />
              </button>
            )}
            {user.role === "customer" &&
              r.status === "completed" &&
              !existing && (
                <button className="btn" onClick={() => setReviewOpen(true)}>
                  Leave a review
                  <Star size={17} />
                </button>
              )}
          </div>
          {existing && (
            <div className="review-box">
              <span className="stars">{"★".repeat(existing.rating)}</span>
              <strong>Your service review</strong>
              <p>{existing.comment}</p>
            </div>
          )}
          <div className="notice">
            Keep this request for your records. Status updates and appointment
            details are shown in the journey alongside it.
          </div>
        </section>
        <aside className="panel timeline">
          <h3>Request journey</h3>
          <p className="muted">A clear view of what happens next.</p>
          {r.statusHistory.map((h, i) => (
            <div key={i} className="timeline-item">
              <span>
                <Check size={14} />
              </span>
              <div>
                <strong>{statusLabel[h.status]}</strong>
                <p>
                  {new Date(h.at).toLocaleString("en-GB", {
                    timeZone: "Asia/Kabul",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <small>
                  {data.users.find((u) => u.id === h.actor)?.name || "User"}
                </small>
              </div>
            </div>
          ))}
          {r.status === "pending" && (
            <div className="notice">Waiting for the provider to respond.</div>
          )}
        </aside>
      </div>
      <Modal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title="How did it go?"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (
              run(
                "review",
                {
                  requestId: id,
                  rating: score,
                  comment: new FormData(e.currentTarget).get("comment"),
                },
                "Thanks! Your review has been added.",
              )
            )
              setReviewOpen(false);
          }}
        >
          <p className="muted">Tell us about your experience.</p>
          <Field label="Rating">
            <select
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((v) => (
                <option key={v} value={v}>
                  {v} {v === 1 ? "star" : "stars"}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Your experience">
            <textarea
              name="comment"
              required
              minLength={10}
              rows={4}
              placeholder="What went well?"
            />
          </Field>
          <button className="btn full">
            Submit review
            <ArrowRight size={17} />
          </button>
        </form>
      </Modal>
      <Confirm
        value={confirm}
        onClose={() => setConfirm(null)}
        onConfirm={() =>
          run("transition", { id, status: confirm.status }, "Request updated.")
        }
      />
    </DashboardLayout>
  );
}
export function Favorites() {
  const { data, user } = useApp();
  const ids = data.favorites
      .filter((f) => f.customerId === user?.id)
      .map((f) => f.providerId),
    list = data.providers.filter((p) => ids.includes(p.id));
  return (
    <DashboardLayout
      title="Saved for later"
      subtitle="Keep your favorite local people close."
    >
      {user?.role === "customer" ? (
        list.length ? (
          <div className="providers-grid search-grid">
            {list.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        ) : (
          <Empty
            title="Your shortlist starts here"
            text="Tap the heart on a provider card to save them for another day."
            icon={Heart}
          />
        )
      ) : (
        <Empty
          title="Customer workspace"
          text="Choose a customer account to manage favorites."
          to="/account"
          label="Switch account"
        />
      )}
    </DashboardLayout>
  );
}
