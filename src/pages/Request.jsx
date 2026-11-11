import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  CalendarDays,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { activeService, money, uid } from "../utils/model";
import { localDate } from "../data/seed";
import { Field, Empty, CategoryIcon } from "../components/UI";
export default function Request() {
  const { id } = useParams(),
    { data, user, run, notify, toast } = useApp(),
    navigate = useNavigate();
  const service = data.services.find((s) => s.id === id),
    provider = data.providers.find((p) => p.id === service?.providerId);
  const [step, setStep] = useState(0),
    [form, setForm] = useState({
      problem: "",
      area: "",
      address: "",
      preferredDate: localDate(1),
      preferredTime: "10:00",
    }),
    [errors, setErrors] = useState({});
  const sending = useRef(false),
    requestId = useRef(null);
  if (!requestId.current) requestId.current = uid("REQ");
  useEffect(() => {
    requestId.current = uid("REQ");
    sending.current = false;
    setStep(0);
    setErrors({});
    setForm((f) => ({ ...f, area: "" }));
  }, [id]);
  if (!service || !activeService(data, service))
    return (
      <div className="container section">
        <Empty
          title="This service isn't available"
          text="Please choose an active service from another provider."
        />
      </div>
    );
  if (user?.role !== "customer")
    return (
      <div className="container narrow section">
        <span className="eyebrow">LET'S GET YOUR REQUEST STARTED</span>
        <h1>Who is this service for?</h1>
        <p className="lead">
          Select your customer profile to request {service.title.toLowerCase()}{" "}
          from {provider.name}.
        </p>
        <div className="account-choices">
          {data.users
            .filter((u) => u.role === "customer")
            .map((u) => (
              <button
                key={u.id}
                className="account-choice"
                onClick={() =>
                  run("session", { id: u.id }, "Customer profile selected")
                }
              >
                <span className="avatar-letter">{u.name.charAt(0)}</span>
                <span>
                  <strong>Continue as {u.name}</strong>
                  <small>{u.area}</small>
                </span>
                <ArrowRight size={20} />
              </button>
            ))}
        </div>
        <Link className="text-link" to="/services">
          Back to services
        </Link>
      </div>
    );
  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };
  function validate(s) {
    const e = {};
    if (s === 0 && form.problem.trim().length < 10)
      e.problem = "Please describe the problem in at least 10 characters.";
    if (s === 1) {
      if (!provider.serviceAreas.includes(form.area))
        e.area = "Choose an area this provider serves.";
      if (form.address.trim().length < 5)
        e.address = "Enter an address of at least 5 characters.";
      if (
        !form.preferredDate ||
        !form.preferredTime ||
        !Number.isFinite(
          new Date(
            `${form.preferredDate}T${form.preferredTime}:00+04:30`,
          ).getTime(),
        ) ||
        new Date(`${form.preferredDate}T${form.preferredTime}:00+04:30`) <=
          new Date()
      )
        e.preferredDate = "Choose a future appointment in Kabul time.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  function submit() {
    if (sending.current) return;
    sending.current = true;
    if (
      run(
        "request",
        { ...form, id: requestId.current, serviceId: id },
        "Your request is in! Waiting for the provider to respond.",
      )
    )
      navigate(`/dashboard/requests/${requestId.current}`);
    else {
      sending.current = false;
      setErrors({
        submit:
          "Please check the request details and the message below, then try again.",
      });
    }
  }
  return (
    <div className="container section">
      <Link to={`/providers/${provider.id}`} className="breadcrumb">
        <ArrowLeft size={15} />
        Back to provider
      </Link>
      <div className="booking-heading">
        <span className="eyebrow">LET'S GET IT SORTED</span>
        <h1>A little help starts here.</h1>
        <p className="muted">
          Tell {provider.name.split(" ")[0]} what you need. All appointment
          times are in Kabul time.
        </p>
      </div>
      <div className="booking-grid">
        <div className="panel">
          <ol className="stepper">
            {["Your task", "Where & when", "Review"].map((s, i) => (
              <li key={s} className={i <= step ? "active" : ""}>
                <button
                  type="button"
                  aria-current={i === step ? "step" : undefined}
                  onClick={() => {
                    if (i <= step) setStep(i);
                    else if (validate(step)) setStep(step + 1);
                  }}
                >
                  <span>{i < step ? <Check size={15} /> : i + 1}</span>
                  {s}
                </button>
              </li>
            ))}
          </ol>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18 }}
            >
              {step === 0 ? (
                <>
                  <h2>What needs a helping hand?</h2>
                  <p className="muted">
                    A few details will help your provider understand the job.
                  </p>
                  <Field label="Selected service">
                    <select
                      value={id}
                      onChange={(e) => navigate(`/request/${e.target.value}`)}
                    >
                      {data.services
                        .filter((s) => activeService(data, s))
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title} —{" "}
                            {
                              data.providers.find((p) => p.id === s.providerId)
                                ?.name
                            }
                          </option>
                        ))}
                    </select>
                  </Field>
                  <Field
                    label="Describe the problem"
                    error={errors.problem}
                    hint="Include the issue, the room, and anything your provider should know."
                  >
                    <textarea
                      aria-invalid={!!errors.problem}
                      aria-describedby={
                        errors.problem ? "problem-error" : undefined
                      }
                      rows={6}
                      value={form.problem}
                      onChange={(e) => set("problem", e.target.value)}
                      placeholder="For example: The kitchen tap is leaking around the base..."
                    />
                  </Field>
                  {errors.problem && (
                    <span id="problem-error" className="sr-only">
                      {errors.problem}
                    </span>
                  )}
                </>
              ) : step === 1 ? (
                <>
                  <h2>Where should we lend a hand?</h2>
                  <p className="muted">
                    Your preferred time is confirmed when the provider accepts.
                  </p>
                  <div
                    className="quick-options"
                    role="group"
                    aria-label="Choose a service area"
                  >
                    {provider.serviceAreas.map((a) => (
                      <button
                        type="button"
                        className={form.area === a ? "selected" : ""}
                        aria-pressed={form.area === a}
                        key={a}
                        onClick={() => set("area", a)}
                      >
                        <MapPin size={14} />
                        {a}
                      </button>
                    ))}
                  </div>
                  <Field label="Service area" error={errors.area}>
                    <select
                      aria-invalid={!!errors.area}
                      value={form.area}
                      onChange={(e) => set("area", e.target.value)}
                    >
                      <option value="">Choose your neighborhood</option>
                      {provider.serviceAreas.map((a) => (
                        <option key={a}>{a}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Service address" error={errors.address}>
                    <input
                      aria-invalid={!!errors.address}
                      value={form.address}
                      onChange={(e) => set("address", e.target.value)}
                      placeholder="House number, street and nearby landmark"
                    />
                  </Field>
                  <div className="two-grid">
                    <Field label="Preferred date" error={errors.preferredDate}>
                      <input
                        type="date"
                        min={localDate()}
                        value={form.preferredDate}
                        onInput={(e) =>
                          set("preferredDate", e.currentTarget.value)
                        }
                        onChange={(e) => set("preferredDate", e.target.value)}
                      />
                    </Field>
                    <Field label="Preferred time (Kabul)">
                      <input
                        type="time"
                        value={form.preferredTime}
                        onInput={(e) =>
                          set("preferredTime", e.currentTarget.value)
                        }
                        onChange={(e) => set("preferredTime", e.target.value)}
                      />
                    </Field>
                  </div>
                  <p className="muted small-text">
                    Or choose a convenient time:
                  </p>
                  <div
                    className="quick-options"
                    role="group"
                    aria-label="Preferred appointment time"
                  >
                    {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map(
                      (t) => (
                        <button
                          type="button"
                          key={t}
                          aria-pressed={form.preferredTime === t}
                          className={form.preferredTime === t ? "selected" : ""}
                          onClick={() => set("preferredTime", t)}
                        >
                          <Clock size={14} />
                          {t}
                        </button>
                      ),
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h2>Everything looking good?</h2>
                  <p className="muted">
                    Check your request before sending it to the provider.
                  </p>
                  <dl className="summary-list">
                    <div>
                      <dt>Service</dt>
                      <dd>{service.title}</dd>
                    </div>
                    <div>
                      <dt>Provider</dt>
                      <dd>{provider.name}</dd>
                    </div>
                    <div>
                      <dt>Your task</dt>
                      <dd>{form.problem}</dd>
                    </div>
                    <div>
                      <dt>Location</dt>
                      <dd>
                        {form.address}, {form.area}
                      </dd>
                    </div>
                    <div>
                      <dt>Preferred visit</dt>
                      <dd>
                        {form.preferredDate} at {form.preferredTime} (Kabul)
                      </dd>
                    </div>
                    <div>
                      <dt>Service price</dt>
                      <dd>
                        {money(service.price)} · {service.pricingBasis}
                      </dd>
                    </div>
                  </dl>
                  <div className="notice">
                    Your preferred time is confirmed when the provider accepts.
                    No payment is required to create a request.
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
          {errors.submit && (
            <div className="error-notice" role="alert">
              {toast?.type === "error" ? toast.message : errors.submit}
            </div>
          )}
          <div className="form-actions">
            {step > 0 && (
              <button
                className="btn secondary"
                onClick={() => setStep((s) => s - 1)}
              >
                <ArrowLeft size={17} />
                Back
              </button>
            )}
            <button
              className="btn"
              onClick={() => {
                if (step === 2) submit();
                else if (validate(step)) setStep((s) => s + 1);
              }}
            >
              {step === 2 ? "Submit request" : "Continue"}
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
        <aside>
          <div className="panel booking-aside">
            <img src={provider.photo} alt="Provider profile illustration" />
            <h3>{provider.name}</h3>
            <p className="area">
              <MapPin size={15} />
              {provider.serviceAreas[0]}
            </p>
            <hr />
            <CategoryIcon
              category={data.categories.find(
                (c) => c.id === service.categoryId,
              )}
            />
            <h3>{service.title}</h3>
            <small className="muted">{service.pricingBasis}</small>
            <strong className="big-price">{money(service.price)}</strong>
            <p className="muted small-text">
              {service.pricingBasis === "starting from"
                ? "An estimate. Parts and extra work are discussed before the visit."
                : "Service price. Additional work is agreed separately."}
            </p>
            <span className="area">
              <Clock size={15} />
              {service.estimatedDuration}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
