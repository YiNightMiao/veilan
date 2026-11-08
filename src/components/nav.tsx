import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import markUrl from "@/assets/veilan-mark.jpg";
import { useI18n } from "@/components/lang";
import { cn } from "@/lib/cn";

const LINKS = [
  ["desktop", "desktop"],
  ["principles", "principles"],
  ["release", "release"],
  ["machine", "machine"],
] as const;

export function Nav() {
  const { t, lang, setLang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("topbar", scrolled && "is-scrolled")}>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-5">
        <a href="#top" className="flex min-h-11 items-center gap-2">
          <img src={markUrl} alt="" width={906} height={665} className="h-8 w-auto" />
          <span className="sr-only font-semibold sm:not-sr-only sm:text-base">Veilan</span>
        </a>
        <nav className="ml-auto hidden items-center md:flex" aria-label="Veilan">
          {LINKS.map(([id, key]) => (
            <a key={id} href={`#${id}`} className="nav-link">
              {t.nav[key]}
            </a>
          ))}
        </nav>
        <div className="seg ml-auto md:ml-3" role="group" aria-label="Language">
          <button type="button" aria-pressed={lang === "zh"} onClick={() => setLang("zh")}>
            中文
          </button>
          <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")}>
            EN
          </button>
        </div>
        <button
          type="button"
          className="grid size-11 place-items-center md:hidden"
          aria-expanded={open}
          aria-label={open ? t.nav.close : t.nav.open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="relative size-5">
            <Menu
              className={cn(
                "absolute inset-0 size-5 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
                open ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none",
              )}
            />
            <X
              className={cn(
                "absolute inset-0 size-5 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
                open ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]",
              )}
            />
          </span>
        </button>
      </div>
      {open ? (
        <div className="absolute inset-x-0 top-full border-b border-line bg-bg md:hidden">
          <nav className="mx-auto flex w-full max-w-6xl flex-col px-5 py-2" aria-label="Veilan">
            {LINKS.map(([id, key]) => (
              <a
                key={id}
                href={`#${id}`}
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                {t.nav[key]}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
