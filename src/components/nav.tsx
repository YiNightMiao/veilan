import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useI18n } from "@/components/lang";

export function Brand() {
  return (
    <span className="brand">
      <img src="/favicon.svg" width="30" height="30" alt="" />
      <span>
        veilan<span className="brand-os">OS</span>
      </span>
    </span>
  );
}

export function Nav() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const links = [
    ["desktop", t.nav.desktop],
    ["principles", t.nav.principles],
    ["release", t.nav.release],
  ];
  return (
    <header className="topbar">
      <div className="nav-inner">
        <a href="#top" aria-label="Veilan OS">
          <Brand />
        </a>
        <nav className={`nav-links ${open ? "nav-open" : ""}`} aria-label="Veilan">
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="language-toggle"
            onClick={() => setLang(lang === "zh" ? "en" : "zh")}
            aria-label={lang === "zh" ? "Switch to English" : "切换到中文"}
          >
            {lang === "zh" ? "EN" : "中"}
          </button>
          <a className="btn btn-small btn-ink" href="/demo">
            {lang === "zh" ? "体验 Veilan" : "Try Veilan"}
            <ArrowUpRight size={14} />
          </a>
          <button
            className="mobile-menu"
            aria-label={open ? t.nav.close : t.nav.open}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  );
}
