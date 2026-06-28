import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// ─── Capture beforeinstallprompt BEFORE React mounts ────────────────────────
// Chrome fires this event very early — often before any useEffect can attach a
// listener. We stash it on window so the usePwaInstall hook can pick it up
// regardless of when it first runs.
declare global {
  interface Window {
    __pwaInstallEvent: Event | null;
  }
}
window.__pwaInstallEvent = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  window.__pwaInstallEvent = e;
  // Re-dispatch a custom event so already-mounted hooks can react immediately
  window.dispatchEvent(new CustomEvent("pwa-prompt-ready"));
});
// ────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById("root")!).render(<App />);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .catch(() => {});
  });
}
