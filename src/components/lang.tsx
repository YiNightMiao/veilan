import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { copy, type Copy, type Lang } from "@/lib/copy";

type LangContextValue = {
  lang: Lang;
  t: Copy;
  setLang: (lang: Lang) => void;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("zh");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("veilan-lang");
      if (saved === "en" || saved === "zh") setLang(saved);
    } catch {
      /* Continue with an in-memory preference when storage is blocked. */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem("veilan-lang", lang);
    } catch {
      /* Persistence is optional. */
    }
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang, ready]);

  return (
    <LangContext.Provider value={{ lang, t: copy[lang], setLang }}>{children}</LangContext.Provider>
  );
}

export function useI18n() {
  const value = useContext(LangContext);
  if (!value) throw new Error("useI18n outside LangProvider");
  return value;
}
