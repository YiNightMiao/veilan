import { Check, Minus } from "lucide-react";
import lockupUrl from "@/assets/veilan-lockup.jpg";
import { Desktop } from "@/components/desktop";
import { LangProvider, useI18n } from "@/components/lang";
import { Machine } from "@/components/machine";
import { Nav } from "@/components/nav";

export function Home() {
  return (
    <LangProvider>
      <Page />
    </LangProvider>
  );
}

function Page() {
  const { t } = useI18n();
  return (
    <div id="top">
      <Nav />
      <main id="content">
        <section className="pb-8 pt-10 md:pb-12 md:pt-16">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-5 md:grid-cols-[14rem_minmax(0,1fr)]">
            <img
              src={lockupUrl}
              alt={t.hero.logoAlt}
              width={1424}
              height={1262}
              className="rise w-40 md:w-full"
            />
            <div>
              <p className="rise rise-2 text-sm font-medium text-veil-ink">{t.hero.kicker}</p>
              <h1 className="rise rise-3 mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl">
                {t.hero.title}
              </h1>
              <p className="rise rise-4 mt-4 max-w-xl text-lg leading-relaxed text-muted">{t.hero.lead}</p>
              <div className="rise rise-5 mt-6 flex flex-wrap gap-3">
                <a href="#desktop" className="btn btn-ink">
                  {t.hero.try}
                </a>
                <a href="#release" className="btn btn-ghost">
                  {t.hero.release}
                </a>
              </div>
              <p className="rise rise-5 mt-4 text-sm text-muted">{t.hero.note}</p>
            </div>
          </div>
        </section>

        <section id="desktop" className="pb-20 md:pb-28">
          <div className="mx-auto w-full max-w-6xl px-5">
            <h2 className="mb-6 text-3xl font-semibold tracking-tight md:text-4xl">{t.desktop.heading}</h2>
            <Desktop />
          </div>
        </section>

        <section id="principles" className="bg-mist py-20 md:py-28">
          <div className="mx-auto w-full max-w-6xl px-5">
            <p className="text-sm font-medium text-veil-ink">{t.principles.kicker}</p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">{t.principles.title}</h2>
            <ol className="mt-10 border-b border-line">
              {t.principles.items.map((item, index) => (
                <li key={item.title} className="grid grid-cols-[auto_minmax(0,1fr)] gap-5 border-t border-line py-8">
                  <span className="pt-1 text-2xl font-semibold tabular-nums text-veil-ink">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="mt-2 max-w-prose leading-relaxed text-muted">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto w-full max-w-6xl px-5">
            <p className="text-sm font-medium text-veil-ink">{t.scope.kicker}</p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">{t.scope.title}</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-muted">{t.scope.lead}</p>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <ScopeList title={t.scope.has} items={t.scope.hasItems} kind="has" />
              <ScopeList title={t.scope.hasNot} items={t.scope.hasNotItems} kind="not" />
            </div>
          </div>
        </section>

        <section id="release" className="on-night bg-night py-20 text-fog md:py-28">
          <div className="mx-auto grid w-full max-w-6xl gap-14 px-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <p className="text-sm font-medium text-veil">{t.release.kicker}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-fog md:text-4xl">{t.release.title}</h2>
              <p className="mt-4 max-w-md leading-relaxed text-haze">{t.release.lead}</p>
              <dl className="mt-8">
                {t.release.specs.map((row) => (
                  <div key={row.k} className="flex items-baseline justify-between gap-4 border-b border-night-line py-3 text-sm">
                    <dt className="text-haze">{row.k}</dt>
                    <dd className="text-right">{row.v}</dd>
                  </div>
                ))}
              </dl>
              <a href="#machine" className="btn btn-veil mt-8">
                {t.release.cta}
              </a>
            </div>
            <ol>
              {t.release.timeline.map((item, index) => (
                <li key={item.date} className="relative pb-8 pl-8 last:pb-0">
                  {index < t.release.timeline.length - 1 ? (
                    <span className="absolute bottom-0 left-[5px] top-3 w-px bg-haze" aria-hidden />
                  ) : null}
                  <span
                    className={
                      item.now
                        ? "absolute left-0 top-1.5 size-3 rounded-full bg-veil"
                        : "absolute left-0 top-1.5 size-3 rounded-full bg-haze"
                    }
                    aria-hidden
                  />
                  <div className="flex flex-wrap items-baseline gap-3">
                    <p className="tabular-nums text-sm text-haze">{item.date}</p>
                    <h3 className="text-lg font-semibold text-fog">{item.title}</h3>
                    {item.now ? (
                      <span className="rounded-full bg-veil px-2 py-0.5 text-xs font-semibold text-ink">{t.release.now}</span>
                    ) : null}
                  </div>
                  <p className="mt-1 max-w-md text-sm leading-relaxed text-haze">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Machine />
      </main>
      <footer className="border-t border-line pb-28 pt-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-end sm:justify-between">
          <img src={lockupUrl} alt={t.hero.logoAlt} width={1424} height={1262} className="w-32" />
          <div className="text-sm text-muted">
            <p>{t.footer.rights}</p>
            <p className="mt-1">{t.footer.note}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ScopeList({ title, items, kind }: { title: string; items: string[]; kind: "has" | "not" }) {
  const Icon = kind === "has" ? Check : Minus;
  return (
    <div>
      <h3 className="text-sm font-semibold tracking-wide text-muted">{title}</h3>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-base leading-relaxed">
            <Icon className={kind === "has" ? "mt-1 size-4 shrink-0 text-veil-ink" : "mt-1 size-4 shrink-0 text-muted"} aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
