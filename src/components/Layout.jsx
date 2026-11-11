import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ArrowUpRight,
  ArrowRight,
  MapPin,
  RotateCcw,
  House,
  Wrench,
  Heart,
  ClipboardList,
  UserRound,
  LayoutDashboard,
  Tags,
  Users,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Confirm, Toast } from "./UI";
export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="LocalFix home">
      <span>
        <img src="assets/logo-mark.svg" alt="" />
      </span>
      localfix<span className="logo-dot">.</span>
    </Link>
  );
}
export function Layout() {
  const { user, warning, reset, run } = useApp();
  const [menu, setMenu] = useState(false),
    [confirm, setConfirm] = useState(null);
  const loc = useLocation();
  useEffect(() => {
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [loc.pathname]);
  return (
    <>
      <div className="demo-bar">
        <div className="container flex-between">
          <span>
            <span className="live-dot" />A little local help goes a long way.
          </span>
          <span className="demo-label">
            HOME SERVICES <span>•</span> Kabul, Afghanistan
          </span>
        </div>
      </div>
      <header className="header">
        <div className="container header-inner">
          <Logo />
          <nav
            className={menu ? "nav open" : "nav"}
            aria-label="Main navigation"
          >
            <NavLink to="/services">Find a service</NavLink>
            <NavLink to="/about">How it works</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            {user && <NavLink to="/dashboard">My dashboard</NavLink>}
          </nav>
          <div className="header-actions">
            <Link
              className="account-link"
              to={`/account?return=${encodeURIComponent(loc.pathname + loc.search)}`}
            >
              {user ? (
                <>
                  <span className="mini-avatar">{user.name.charAt(0)}</span>
                  <span>
                    {user.name.split(" ")[0]}
                    <small>{user.role}</small>
                  </span>
                  <ChevronDown size={14} />
                </>
              ) : (
                <>
                  Get started
                  <ArrowUpRight size={17} />
                </>
              )}
            </Link>
            <button
              className="icon-btn mobile-toggle"
              aria-label="Toggle navigation"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      {warning && (
        <div className="storage-warning" role="alert">
          {warning}
        </div>
      )}
      <main id="main-content" tabIndex={-1}>
        <motion.div
          key={loc.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.23 }}
        >
          <Outlet />
        </motion.div>
      </main>
      <footer>
        <div className="container">
          <div className="footer-top">
            <div>
              <Logo />
              <p>
                Good help. Real connections.
                <br />A happier home, one task at a time.
              </p>
              <span className="area">
                <MapPin size={15} />
                Made for Kabul
              </span>
            </div>
            <div>
              <h4>Explore</h4>
              <Link to="/services">Find services</Link>
              <Link to="/about">How it works</Link>
              <Link to="/contact">Get in touch</Link>
            </div>
            <div>
              <h4>Your workspace</h4>
              <Link to="/account">Switch account</Link>
              <Link to="/dashboard">Open dashboard</Link>
              {user?.role === "admin" && (
                <button
                  className="footer-button"
                  onClick={() =>
                    setConfirm({
                      title: "Restore initial data?",
                      text: "This removes your saved requests, reviews and edits in this browser and restores the sample data.",
                      label: "Restore data",
                    })
                  }
                >
                  <RotateCcw size={13} />
                  Restore initial data
                </button>
              )}
            </div>
            <div className="footer-note">
              <span className="eyebrow">GOOD HELP, CLOSE TO HOME</span>
              <p>
                A simpler way to find local skills, organize your requests, and
                care for the place you call home.
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} LocalFix. Good help, close to home.
            </span>
            <span>Local people. Everyday solutions.</span>
          </div>
        </div>
      </footer>
      <Confirm
        value={confirm}
        onClose={() => setConfirm(null)}
        onConfirm={reset}
      />
      <Toast />
    </>
  );
}
export function DashboardLayout({ children, title, subtitle }) {
  const { user, run } = useApp();
  if (!user)
    return (
      <div className="container narrow section">
        <h1>Your workspace awaits.</h1>
        <p className="lead">
          Choose an account to manage requests and explore the dashboards.
        </p>
        <Link className="btn" to="/account?return=/dashboard">
          Choose an account
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  const menus = {
    customer: [
      ["/dashboard", "Overview", LayoutDashboard],
      ["/dashboard/requests", "My requests", ClipboardList],
      ["/dashboard/favorites", "Saved providers", Heart],
      ["/dashboard/profile", "My profile", UserRound],
    ],
    provider: [
      ["/dashboard", "Overview", LayoutDashboard],
      ["/dashboard/requests", "Incoming requests", ClipboardList],
      ["/dashboard/services", "My services", Wrench],
      ["/dashboard/profile", "My profile", UserRound],
    ],
    admin: [
      ["/dashboard", "Overview", LayoutDashboard],
      ["/dashboard/requests", "All requests", ClipboardList],
      ["/dashboard/providers", "Providers", Users],
      ["/dashboard/categories", "Categories", Tags],
    ],
  };
  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <span className="eyebrow">{user.role} WORKSPACE</span>
        <div className="sidebar-person">
          <span className="avatar-letter">{user.name.charAt(0)}</span>
          <div>
            <strong>{user.name}</strong>
            <small>Account</small>
          </div>
        </div>
        <nav aria-label="Dashboard">
          {menus[user.role].map(([to, label, Icon]) => (
            <NavLink key={to} to={to} end={to === "/dashboard"}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <p>Explore the other side.</p>
          <Link to="/account?return=/dashboard">
            Switch account
            <ArrowUpRight size={17} />
          </Link>
          <button
            onClick={() => run("session", { id: null }, "Account signed out")}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
      <div className="dashboard-main">
        <div className="dashboard-heading">
          <span className="eyebrow">YOUR LOCALFIX</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
