import { useEffect, useRef, useId, cloneElement, isValidElement } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  X,
  Star,
  MapPin,
  Heart,
  Droplets,
  Zap,
  Sparkles,
  WashingMachine,
  Wrench,
  Search,
  Inbox,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { rating, money, activeService, statusLabel } from "../utils/model";
export const iconMap = { Droplets, Zap, Sparkles, WashingMachine, Wrench };
export function CategoryIcon({ category, size = 25 }) {
  const Icon = iconMap[category?.icon] || Wrench;
  return (
    <span className="category-icon" style={{ background: category?.color }}>
      <Icon size={size} />
    </span>
  );
}
export const Arrow = ArrowUpRight;
export function Badge({ status }) {
  return (
    <span className={`badge ${status}`}>{statusLabel[status] || status}</span>
  );
}
export function Empty({
  title = "Nothing here yet",
  text = "Your next step starts with finding a local professional.",
  to = "/services",
  label = "Explore services",
  icon: Icon = Inbox,
}) {
  return (
    <div className="empty">
      <span>
        <Icon size={32} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      {to && (
        <Link className="btn" to={to}>
          {label}
          <ArrowRight size={17} />
        </Link>
      )}
    </div>
  );
}
export function Reveal({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.32 }}
    >
      {children}
    </motion.div>
  );
}
export function Modal({ open, onClose, title, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const el = ref.current;
    el?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      el?.close();
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [open]);
  if (!open) return null;
  return (
    <dialog
      ref={ref}
      className="modal"
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="modal-head">
        <h2>{title}</h2>
        <button
          className="icon-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export function Confirm({ value, onClose, onConfirm }) {
  return (
    <Modal
      open={!!value}
      onClose={onClose}
      title={value?.title || "Are you sure?"}
    >
      <p className="muted">{value?.text}</p>
      <div className="form-actions">
        <button className="btn secondary" onClick={onClose}>
          Keep it
        </button>
        <button
          className="btn"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {value?.label || "Confirm"}
        </button>
      </div>
    </Modal>
  );
}
export function Field({ label, error, children, hint }) {
  const id = useId();
  const input =
    isValidElement(children) &&
    ["input", "select", "textarea"].includes(children.type)
      ? cloneElement(children, {
          id: children.props.id || id,
          "aria-labelledby": id + "-label",
          "aria-describedby":
            [hint ? id + "-hint" : null, error ? id + "-error" : null]
              .filter(Boolean)
              .join(" ") || undefined,
          "aria-invalid": error ? true : children.props["aria-invalid"],
        })
      : children;
  return (
    <label className="field">
      <span id={id + "-label"}>{label}</span>
      {input}
      {hint && <small id={id + "-hint"}>{hint}</small>}
      {error && (
        <small id={id + "-error"} className="error" role="alert">
          {error}
        </small>
      )}
    </label>
  );
}
export function Toast() {
  const { toast, dismissToast } = useApp();
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={`toast ${toast.type}`}
          role={toast.type === "error" ? "alert" : "status"}
        >
          {toast.type === "error" ? <X size={20} /> : <Check size={20} />}
          <span>{toast.message}</span>
          <button aria-label="Dismiss notification" onClick={dismissToast}>
            <X size={17} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export function ProviderCard({ provider }) {
  const { data, user, run } = useApp();
  const location = useLocation();
  const services = data.services.filter(
    (s) => s.providerId === provider.id && activeService(data, s),
  );
  const service = services[0],
    cat = data.categories.find((c) => c.id === service?.categoryId),
    r = rating(data, provider.id),
    saved = data.favorites.some(
      (f) => f.providerId === provider.id && f.customerId === user?.id,
    );
  return (
    <motion.article
      className="provider-card"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="provider-art"
        style={{ background: cat?.color || "#e5ece7" }}
      >
        <img
          className="service-cover"
          src={`assets/photos/${["plumbing", "electrical", "cleaning", "appliance"].includes(cat?.id) ? cat.id : "home"}.jpg`}
          alt={`${cat?.name || "Home service"} inspiration`}
          loading="lazy"
        />
        <img className="provider-avatar-badge" src={provider.photo} alt="" />
        <span className="stock-label">Service inspiration</span>
        <span className="specialty">{cat?.name || "Local professional"}</span>
        {user?.role === "customer" ? (
          <button
            aria-label={saved ? "Remove from favorites" : "Save provider"}
            aria-pressed={saved}
            className={`favorite ${saved ? "saved" : ""}`}
            onClick={() =>
              run(
                "favorite",
                { providerId: provider.id },
                saved ? "Removed from favorites" : "Provider saved",
              )
            }
          >
            <Heart size={18} fill={saved ? "currentColor" : "none"} />
          </button>
        ) : (
          <Link
            className="favorite"
            aria-label="Choose a customer account to save provider"
            to={`/account?return=${encodeURIComponent(location.pathname + location.search)}`}
          >
            <Heart size={18} />
          </Link>
        )}
      </div>
      <div className="provider-body">
        <div className="flex-between">
          <span className="eyebrow small">
            {provider.experienceYears} YEARS EXPERIENCE
          </span>
          <span className="rating">
            <Star size={14} fill="currentColor" />
            {r.value}
            <small>({r.count})</small>
          </span>
        </div>
        <Link to={`/providers/${provider.id}`} className="provider-name">
          {provider.name}
        </Link>
        <p className="area">
          <MapPin size={14} />
          {provider.serviceAreas[0]}
          {provider.serviceAreas.length > 1
            ? ` +${provider.serviceAreas.length - 1} areas`
            : ""}
        </p>
        <div className="provider-bottom">
          <div>
            {service ? (
              <>
                <small>
                  {service.pricingBasis === "starting from"
                    ? "Starting from"
                    : service.pricingBasis === "per hour"
                      ? "Per hour"
                      : "Fixed service"}
                </small>
                <strong>{money(service.price)}</strong>
              </>
            ) : (
              <small>Currently unavailable</small>
            )}
          </div>
          <Link
            className="round-link"
            aria-label={`View ${provider.name}'s profile`}
            to={`/providers/${provider.id}`}
          >
            <ArrowUpRight size={22} />
          </Link>
        </div>
        {service && (
          <Link className="btn full card-request" to={`/request/${service.id}`}>
            Request service
            <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </motion.article>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  text,
  link,
  label = "View all",
}) {
  return (
    <div className="section-title">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {link && (
        <Link className="text-link" to={link}>
          {label}
          <ArrowUpRight size={19} />
        </Link>
      )}
    </div>
  );
}
