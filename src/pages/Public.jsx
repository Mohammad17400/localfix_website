import { useState, useMemo } from "react";
import {
  Link,
  useSearchParams,
  useParams,
  useNavigate,
} from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  MapPin,
  Star,
  Check,
  Clock,
  SlidersHorizontal,
  X,
  Heart,
  ShieldCheck,
  MessageCircle,
  ChevronRight,
  House,
  Users,
  ClipboardCheck,
  Wrench,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { AREAS } from "../data/seed";
import { activeService, money, rating } from "../utils/model";
import {
  ProviderCard,
  CategoryIcon,
  SectionTitle,
  Reveal,
  Empty,
  Field,
  Modal,
} from "../components/UI";
export function Home() {
  const { data } = useApp(),
    navigate = useNavigate();
  const [q, setQ] = useState(""),
    [area, setArea] = useState("");
  const providers = data.providers
    .filter((p) =>
      data.services.some(
        (s) => s.providerId === p.id && activeService(data, s),
      ),
    )
    .slice(0, 4);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="pill">
              <span className="live-dot" />
              YOUR NEIGHBORHOOD, CONNECTED
            </span>
            <h1>
              Good help.
              <br />
              Close to <em>home.</em>
            </h1>
            <p>
              From the little fixes to the big clean-ups.{" "}
              <br className="desktop" />
              Find the right local expert for your everyday.
            </p>
            <form
              className="hero-search"
              onSubmit={(e) => {
                e.preventDefault();
                navigate(
                  `/services?q=${encodeURIComponent(q)}&area=${encodeURIComponent(area)}`,
                );
              }}
            >
              <div>
                <Search size={20} />
                <input
                  aria-label="What do you need help with?"
                  placeholder="What do you need help with?"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <div className="location-input">
                <MapPin size={19} />
                <select
                  aria-label="Your area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                >
                  <option value="">All Kabul</option>
                  {AREAS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
              <button className="search-submit" aria-label="Search services">
                <ArrowRight size={23} />
              </button>
            </form>
            <div className="hero-tags">
              <span>Popular:</span>
              {["Plumbing", "Cleaning", "Appliance Repair"].map((c, i) => (
                <Link
                  key={c}
                  to={`/services?category=${["plumbing", "cleaning", "appliance"][i]}`}
                >
                  {c}
                  <ArrowUpRight size={12} />
                </Link>
              ))}
            </div>
            <div className="hero-foot">
              <div className="avatar-stack">
                {[1, 2, 3].map((i) => (
                  <img key={i} src={`assets/avatar-${i}.svg`} alt="" />
                ))}
              </div>
              <div>
                <strong>Local skills. Thoughtful service.</strong>
                <small>Find the right person for your next task.</small>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <img
              className="house-scene"
              src="assets/photos/home.jpg"
              alt="A warm living space with natural textures"
            />
            <motion.div
              className="floating-card request-float"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="round-icon">
                <Check size={23} />
              </span>
              <div>
                <strong>A little help, sorted.</strong>
                <small>Find your next local expert</small>
              </div>
            </motion.div>
            <div className="visual-caption">
              <span className="live-dot" /> BUILT AROUND YOUR NEIGHBORHOOD
            </div>
            <div className="hero-stamp">
              HOME
              <br />
              <span>sweet</span>
              <br />
              HOME
              <Star size={15} />
            </div>
          </div>
        </div>
      </section>
      <section className="trust-strip">
        <div className="container">
          <span>
            <MapPin size={19} />
            Experts in your area
          </span>
          <span>
            <ClipboardCheck size={19} />
            Clear service details
          </span>
          <span>
            <MessageCircle size={19} />
            Requests made simple
          </span>
          <span>
            <Heart size={19} />
            Care for your home
          </span>
        </div>
      </section>
      <section className="section container">
        <SectionTitle
          eyebrow="A LITTLE HELP WITH EVERYTHING"
          title="What can we take off your list?"
          link="/services"
          label="Explore all services"
        />
        <div className="category-grid">
          {data.categories
            .filter((c) => c.isActive)
            .map((c, i) => (
              <Reveal key={c.id}>
                <Link
                  className="category-card"
                  to={`/services?category=${c.id}`}
                >
                  <img
                    className="category-photo"
                    src={`assets/photos/${["plumbing", "electrical", "cleaning", "appliance"].includes(c.id) ? c.id : "home"}.jpg`}
                    alt={`${c.name} service inspiration`}
                    loading="lazy"
                  />
                  <div className="flex-between">
                    <CategoryIcon category={c} />
                    <ArrowUpRight size={22} />
                  </div>
                  <h3>{c.name}</h3>
                  <p>{c.description}</p>
                  <span>
                    {
                      data.services.filter(
                        (s) => s.categoryId === c.id && activeService(data, s),
                      ).length
                    }{" "}
                    local services
                  </span>
                </Link>
              </Reveal>
            ))}
        </div>
      </section>
      <section className="section featured-section">
        <div className="container">
          <SectionTitle
            eyebrow="MEET YOUR LOCAL EXPERTS"
            title="Good people. Great at what they do."
            text="Explore local skills and find the right fit for your task."
            link="/services"
            label="Meet all providers"
          />
          <div className="providers-grid">
            {providers.map((p) => (
              <Reveal key={p.id}>
                <ProviderCard provider={p} />
              </Reveal>
            ))}
          </div>
          <p className="demo-footnote">
            Thoughtful service starts with clear details. Explore a profile to
            learn more.
          </p>
        </div>
      </section>
      <section className="section container">
        <div className="how-grid">
          <div>
            <span className="eyebrow">LESS HASSLE. MORE HOME.</span>
            <h2>
              A helping hand,
              <br />
              in three simple steps.
            </h2>
            <p className="muted">
              No complicated process. Just a clear way to find the help your
              home needs.
            </p>
            <Link className="text-link" to="/about">
              See how it works
              <ArrowUpRight size={19} />
            </Link>
          </div>
          <div className="steps">
            {[
              [
                "01",
                "Find your person",
                "Browse services and compare local professionals in your area.",
              ],
              [
                "02",
                "Tell us what you need",
                "Choose a service and send a request with your preferred time.",
              ],
              [
                "03",
                "Follow the progress",
                "See your request update from accepted to completed.",
              ],
            ].map(([n, t, d]) => (
              <Reveal key={n} className="step">
                <span>{n}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="container cta-wrap">
        <div className="cta">
          <div>
            <span className="eyebrow">YOUR NEXT TASK, TAKEN CARE OF</span>
            <h2>Make room for the things you love.</h2>
            <p>Find a little local help and get back to your day.</p>
          </div>
          <Link className="btn cream" to="/services">
            Find my local expert
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
export function Services() {
  const { data } = useApp();
  const [params, setParams] = useSearchParams(),
    [filterOpen, setFilterOpen] = useState(false);
  const q = params.get("q") || "",
    area = params.get("area") || "",
    category = params.get("category") || "",
    sort = params.get("sort") || "recommended";
  function set(key, val) {
    const p = new URLSearchParams(params);
    if (val) p.set(key, val);
    else p.delete(key);
    setParams(p, { replace: true });
  }
  const list = useMemo(
    () =>
      data.providers
        .filter(
          (p) =>
            p.isActive &&
            (!area || p.serviceAreas.includes(area)) &&
            data.services.some(
              (s) =>
                s.providerId === p.id &&
                activeService(data, s) &&
                (!category || s.categoryId === category) &&
                (p.name + " " + s.title + " " + s.description)
                  .toLowerCase()
                  .includes(q.trim().toLowerCase()),
            ),
        )
        .sort((a, b) =>
          sort === "name"
            ? a.name.localeCompare(b.name)
            : sort === "rating"
              ? Number(
                  rating(data, b.id).value === "New"
                    ? 0
                    : rating(data, b.id).value,
                ) -
                Number(
                  rating(data, a.id).value === "New"
                    ? 0
                    : rating(data, a.id).value,
                )
              : 0,
        ),
    [data, q, area, category, sort],
  );
  const filters = (
    <>
      <div className="filter-title">
        <h3>Refine your search</h3>
        <button onClick={() => setParams({})}>Reset</button>
      </div>
      <Field label="Search">
        <div className="input-icon">
          <Search size={17} />
          <input
            placeholder="Service or provider"
            value={q}
            onChange={(e) => set("q", e.target.value)}
          />
        </div>
      </Field>
      <fieldset className="filter-categories">
        <legend>Service category</legend>
        <button
          className={!category ? "selected" : ""}
          onClick={() => set("category", "")}
        >
          All services
          <span>
            {data.services.filter((s) => activeService(data, s)).length}
          </span>
        </button>
        {data.categories
          .filter((c) => c.isActive)
          .map((c) => (
            <button
              key={c.id}
              className={category === c.id ? "selected" : ""}
              onClick={() => set("category", c.id)}
            >
              <span>
                <CategoryIcon category={c} size={16} />
                {c.name}
              </span>
              <span>
                {
                  data.services.filter(
                    (s) => s.categoryId === c.id && activeService(data, s),
                  ).length
                }
              </span>
            </button>
          ))}
      </fieldset>
      <Field label="Neighborhood">
        <select value={area} onChange={(e) => set("area", e.target.value)}>
          <option value="">All Kabul areas</option>
          {AREAS.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </Field>
      <div className="filter-note">
        <House size={24} />
        <strong>Local knowledge matters.</strong>
        <p>Choose someone who serves your neighborhood.</p>
      </div>
    </>
  );
  return (
    <>
      <div className="page-banner">
        <div className="container">
          <span className="eyebrow">FIND YOUR HELPING HAND</span>
          <h1>
            The right person.
            <br />
            <em>Right around the corner.</em>
          </h1>
          <p>
            Browse local skills, compare services, and make your next request.
          </p>
        </div>
      </div>
      <div className="container discovery">
        <aside className="filters desktop">{filters}</aside>
        <div className="results">
          <div className="results-toolbar">
            <p>
              <strong>{list.length}</strong> local providers{" "}
              <span className="muted">in {area || "Kabul"}</span>
            </p>
            <div>
              <button
                className="btn secondary mobile-filter"
                onClick={() => setFilterOpen(true)}
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
              <select
                aria-label="Sort providers"
                value={sort}
                onChange={(e) => set("sort", e.target.value)}
              >
                <option value="recommended">Featured first</option>
                <option value="rating">Highest rated</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
          </div>
          {(category || area || q) && (
            <div className="filter-chips">
              {[
                [
                  "category",
                  data.categories.find((c) => c.id === category)?.name ||
                    category,
                ],
                ["area", area],
                ["q", q],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <button key={k} onClick={() => set(k, "")}>
                    {v}
                    <X size={13} />
                  </button>
                ))}
            </div>
          )}
          {list.length ? (
            <div className="providers-grid search-grid">
              {list.map((p) => (
                <ProviderCard key={p.id} provider={p} />
              ))}
            </div>
          ) : (
            <Empty
              title="No matches just yet"
              text="Try a different neighborhood or clear a filter to see more providers."
              to={null}
              icon={Search}
            />
          )}
          <p className="demo-footnote">
            Prices show their basis. Discuss additional parts and work before
            your visit.
          </p>
        </div>
      </div>
      <Modal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Find your fit"
      >
        {filters}
        <button className="btn full" onClick={() => setFilterOpen(false)}>
          Show {list.length} providers
        </button>
      </Modal>
    </>
  );
}
export function ProviderDetail() {
  const { id } = useParams();
  const { data, user, run } = useApp();
  const p = data.providers.find((p) => p.id === id);
  if (!p)
    return (
      <div className="container section">
        <Empty
          title="Provider not found"
          text="This profile may no longer exist. Explore the other local experts."
        />
      </div>
    );
  const r = rating(data, id),
    services = data.services.filter(
      (s) => s.providerId === id && activeService(data, s),
    ),
    reviews = data.reviews.filter((r) => r.providerId === id),
    saved = data.favorites.some(
      (f) => f.providerId === id && f.customerId === user?.id,
    );
  return (
    <div className="container section">
      <Link className="breadcrumb" to="/services">
        Services <ChevronRight size={14} /> Provider profile
      </Link>
      <div className="profile-hero">
        <img src={p.photo} alt="Provider illustration" />
        <div>
          <span className="eyebrow">LOCAL PROFESSIONAL</span>
          <h1>{p.name}</h1>
          <div className="profile-meta">
            <span className="rating">
              <Star size={17} fill="currentColor" />
              {r.value} <small>({r.count} reviews)</small>
            </span>
            <span>
              <Wrench size={17} />
              {p.experienceYears} years of experience
            </span>
          </div>
          <p>
            <MapPin size={16} />
            {p.serviceAreas.join(" · ")}
          </p>
        </div>
        {user?.role === "customer" && (
          <button
            className="btn secondary"
            onClick={() =>
              run(
                "favorite",
                { providerId: id },
                saved ? "Removed from favorites" : "Provider saved",
              )
            }
          >
            <Heart size={17} fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save provider"}
          </button>
        )}
      </div>
      <div className="detail-grid">
        <div>
          <section className="panel">
            <h2>A little about me</h2>
            <p className="muted roomy">{p.bio}</p>
            <div className="detail-tags">
              <span>Clear service details</span>
              <span>Local experience</span>
              <span>Careful workmanship</span>
            </div>
          </section>
          <section className="panel">
            <SectionTitle
              title="Services I offer"
              text="Choose the help you need. Prices below are illustrative."
            />
            {services.length ? (
              services.map((s) => (
                <div className="service-row" key={s.id}>
                  <CategoryIcon
                    category={data.categories.find(
                      (c) => c.id === s.categoryId,
                    )}
                  />
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                    <span className="area">
                      <Clock size={14} />
                      {s.estimatedDuration}
                    </span>
                  </div>
                  <div className="service-price">
                    <small>{s.pricingBasis}</small>
                    <strong>{money(s.price)}</strong>
                    <Link className="btn" to={`/request/${s.id}`}>
                      Request service
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <Empty
                title="No services available"
                text="This provider is currently not accepting new requests."
                to={null}
              />
            )}
          </section>
          <section className="panel">
            <SectionTitle
              title="Customer experiences"
              text="Feedback from completed service requests."
            />
            {reviews.map((v) => (
              <div className="review" key={v.id}>
                <div className="flex-between">
                  <strong>
                    {data.users.find((u) => u.id === v.customerId)?.name ||
                      "Customer"}
                  </strong>
                  <span className="stars">
                    {"★".repeat(v.rating)}
                    {"☆".repeat(5 - v.rating)}
                  </span>
                </div>
                <p>{v.comment}</p>
                <small>
                  Completed service ·{" "}
                  {new Date(v.createdAt).toLocaleDateString("en-GB")}
                </small>
              </div>
            ))}
          </section>
        </div>
        <aside>
          <div className="panel sticky-panel">
            <span className="eyebrow">BEFORE YOU REQUEST</span>
            <h3>
              A clear start makes
              <br />a better visit.
            </h3>
            <ul className="check-list">
              <li>
                <Check />
                Describe the task in a few details.
              </li>
              <li>
                <Check />
                Choose an area this provider serves.
              </li>
              <li>
                <Check />
                Pick a preferred date and time.
              </li>
              <li>
                <Check />
                Wait for the provider to accept.
              </li>
            </ul>
            <div className="notice">
              Starting-from prices are estimates. Parts and extra work must be
              discussed with the provider before work begins.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
export function DemoAccess() {
  const { data, user, run } = useApp(),
    navigate = useNavigate(),
    [params] = useSearchParams();
  const [role, setRole] = useState("customer"),
    [selected, setSelected] = useState(
      data.users.find((u) => u.role === "customer")?.id || "",
    );
  let back = params.get("return") || "/dashboard";
  if (
    !back.startsWith("/") ||
    back.startsWith("//") ||
    back.startsWith("/account")
  )
    back = "/dashboard";
  function choose(id) {
    if (run("session", { id }, "Account selected")) navigate(back);
  }
  return (
    <div className="access-page">
      <div className="access-story">
        <span className="eyebrow">ONE MARKETPLACE. THREE PERSPECTIVES.</span>
        <h1>
          See how it
          <br />
          all comes
          <br />
          <em>together.</em>
        </h1>
        <p>
          Create a request as a customer.
          <br />
          Accept it as a provider.
          <br />
          Keep things organized as an admin.
        </p>
        <img src="assets/photos/home.jpg" alt="A welcoming living room" />
      </div>
      <div className="access-form">
        <span className="pill">INTERACTIVE HOME SERVICES</span>
        <h2>Make yourself at home.</h2>
        <p className="muted">
          Choose your profile to manage your services and requests.
        </p>
        <div className="tabs" role="group" aria-label="Choose your role">
          {["customer", "provider", "admin"].map((r) => (
            <button
              key={r}
              className={role === r ? "active" : ""}
              onClick={() => {
                setRole(r);
                setSelected(data.users.find((u) => u.role === r)?.id || "");
              }}
            >
              {r}
            </button>
          ))}
        </div>
        <Field label="Account">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Select a {role}</option>
            {data.users
              .filter((u) => u.role === role)
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                  {user?.id === u.id ? " (current)" : ""}
                </option>
              ))}
          </select>
        </Field>
        <button
          className="btn full"
          disabled={!selected}
          onClick={() => choose(selected)}
        >
          Enter {role} workspace
          <ArrowRight size={18} />
        </button>
        <div className="notice">
          <ShieldCheck size={20} />
          <p>
            Your workspace keeps your requests, favorite providers and service
            details together on this device.
          </p>
        </div>
        <Link className="text-link" to="/services">
          Just browsing? Explore services
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}
export function About() {
  return (
    <>
      <div className="page-banner">
        <div className="container">
          <span className="eyebrow">A MORE HELPFUL NEIGHBORHOOD</span>
          <h1>
            Small tasks.
            <br />
            <em>A big difference.</em>
          </h1>
          <p>LocalFix connects everyday needs with local skills.</p>
        </div>
      </div>
      <div className="container section">
        <div className="how-grid">
          <div>
            <h2>
              Home should feel
              <br />a little easier.
            </h2>
            <p className="lead">
              Our idea is simple: make it easier to discover local
              professionals, understand what they offer, and organize a service
              request in one place.
            </p>
            <p className="muted">
              Find the help you need, share the details, and follow each request
              from the first response to the finishing touch.
            </p>
            <Link className="btn" to="/services">
              Find a service
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <img
            className="about-image"
            src="assets/photos/home.jpg"
            alt="A comfortable home interior"
          />
        </div>
        <div className="three-grid section">
          {[
            [
              Search,
              "Discover",
              "Search by task, category and neighborhood. Read profiles and compare service details.",
            ],
            [
              ClipboardCheck,
              "Request",
              "Describe your task and choose a preferred appointment. Your request starts as Pending.",
            ],
            [
              Check,
              "Follow through",
              "The assigned provider accepts, starts and completes the task. The customer can then review it.",
            ],
          ].map(([Icon, t, d]) => (
            <div className="panel" key={t}>
              <span className="round-icon">
                <Icon />
              </span>
              <h3>{t}</h3>
              <p className="muted">{d}</p>
            </div>
          ))}
        </div>
        <div className="panel">
          <h2>Good service starts with understanding.</h2>
          <p className="muted">
            Clear descriptions, transparent price information and simple request
            tracking make it easier to organize the work your home needs. Choose
            a local professional, tell them about your task, and keep the next
            step in sight.
          </p>
          <Link className="text-link" to="/account">
            Explore all three roles
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </>
  );
}
export function Contact() {
  const { notify } = useApp();
  const [sent, setSent] = useState(false);
  return (
    <div className="container section contact-grid">
      <div>
        <span className="eyebrow">LET’S MAKE THINGS CLEAR</span>
        <h1>
          A question?
          <br />
          <em>We’re all ears.</em>
        </h1>
        <p className="lead">
          Have a question about using LocalFix? Leave a note below.
        </p>
        <div className="panel">
          <h3>Leave a note</h3>
          <p className="muted">
            Save your message with your contact details. This frontend version
            stores it on this device; email delivery is not connected.
          </p>
          <span className="area">
            <MapPin size={17} />
            Kabul, Afghanistan
          </span>
        </div>
      </div>
      <form
        className="panel contact-form"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          if (
            String(f.get("name")).trim().length < 2 ||
            String(f.get("message")).trim().length < 10
          ) {
            notify(
              "Please enter a name and a message of at least 10 characters.",
              "error",
            );
            return;
          }
          try {
            const messages = JSON.parse(
              localStorage.getItem("localfix-messages") || "[]",
            );
            localStorage.setItem(
              "localfix-messages",
              JSON.stringify([
                ...messages,
                {
                  name: String(f.get("name")).trim(),
                  email: String(f.get("email")),
                  message: String(f.get("message")).trim(),
                  createdAt: new Date().toISOString(),
                },
              ]),
            );
          } catch {
            notify(
              "Your message could not be saved. Please try again.",
              "error",
            );
            return;
          }
          setSent(true);
          notify("Message saved on this device.");
          e.currentTarget.reset();
        }}
      >
        <h2>Leave a little note.</h2>
        <Field label="Your name">
          <input name="name" required minLength={2} placeholder="Your name" />
        </Field>
        <Field label="Email address">
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.test"
          />
        </Field>
        <Field label="Message">
          <textarea
            name="message"
            rows={5}
            required
            minLength={10}
            placeholder="How can we help?"
          />
        </Field>
        <button className="btn full">
          Save message
          <ArrowRight size={18} />
        </button>
        {sent && (
          <p role="status" className="success-note">
            Your message is saved on this device. Email delivery is not
            connected.
          </p>
        )}
      </form>
    </div>
  );
}
export function NotFound() {
  return (
    <div className="container section">
      <Empty
        title="This page took a wrong turn."
        text="Let's get you back to finding a little local help."
        to="/"
        label="Back to home"
      />
    </div>
  );
}
