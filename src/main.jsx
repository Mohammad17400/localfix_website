import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { AppProvider } from "./context/AppContext";
import App from "./App";
import "./styles.css";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    if (this.state.error)
      return (
        <div style={{ padding: "4rem", fontFamily: "sans-serif" }}>
          <h1>Let's get you back home.</h1>
          <p>
            Something unexpected happened. Reload the app or reset its saved
            data.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem("localfix-demo-v1");
              window.location.href = window.location.pathname;
            }}
          >
            Reset data and reload
          </button>
        </div>
      );
    return this.props.children;
  }
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <MotionConfig reducedMotion="user">
          <AppProvider>
            <App />
          </AppProvider>
        </MotionConfig>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
