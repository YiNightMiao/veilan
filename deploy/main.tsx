import { createRoot } from "react-dom/client";
import { Desktop } from "../src/components/desktop";
import { Home } from "../src/components/home";
import { LangProvider } from "../src/components/lang";
import "../src/styles.css";

// A client-only entry keeps this local demo deployable behind Caddy without
// introducing a Node service, a database, or the hosted-preview auth scaffold.
const demo = window.location.pathname.replace(/\/$/, "") === "/demo";
if (demo) document.title = "Veilan OS — 在线体验";
createRoot(document.getElementById("root")!).render(
  demo ? (
    <LangProvider>
      <main className="demo-page">
        <Desktop immersive />
      </main>
    </LangProvider>
  ) : (
    <Home />
  ),
);
