import { useEffect } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Layers3,
  Minus,
  MousePointer2,
  Sparkles,
} from "lucide-react";
import { Desktop } from "@/components/desktop";
import { LangProvider, useI18n } from "@/components/lang";
import { Machine } from "@/components/machine";
import { Brand, Nav } from "@/components/nav";

export function Home() {
  return (
    <LangProvider>
      <Page />
    </LangProvider>
  );
}

function Page() {
  const { t, lang } = useI18n();
  const zh = lang === "zh";
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    const elements = document.querySelectorAll(
      ".section-heading, .feature-card, .scope-layout, .release-top, .release-body, #machine > div, .closing-section h2",
    );
    elements.forEach((element, index) => {
      element.classList.add("reveal-ready");
      (element as HTMLElement).style.transitionDelay = `${(index % 2) * 80}ms`;
      observer.observe(element);
    });
    return () => {
      observer.disconnect();
      elements.forEach((element) => element.classList.remove("reveal-ready"));
    };
  }, []);
  return (
    <div id="top">
      <Nav />
      <main id="content">
        <section className="hero">
          <div className="hero-copy rise">
            <a className="release-pill" href="#release">
              <span />
              Veil 2026.11 <span className="pill-divider" />
              {zh ? "公开预览现已开启" : "Public preview is here"}
              <ArrowUpRight size={12} />
            </a>
            <p className="eyebrow hero-eyebrow">MEET VEILAN OS</p>
            <h1>
              {zh ? (
                <>
                  让灵感，<span>自在发生。</span>
                </>
              ) : (
                <>
                  A little less noise.<span>A lot more you.</span>
                </>
              )}
            </h1>
            <p className="hero-lead">
              {zh ? (
                <>
                  一个轻盈、专注、恰到好处的桌面。
                  <br />
                  让系统退后一步，让你喜欢的事走到前面。
                </>
              ) : (
                <>
                  A lighter, calmer place to do your thing.
                  <br />
                  An operating system that gives you room to think.
                </>
              )}
            </p>
            <div className="hero-actions">
              <a href="/demo" className="btn btn-ink">
                {zh ? "进入在线体验" : "Explore the live demo"}
                <ArrowUpRight size={17} />
              </a>
              <a href="#principles" className="text-link">
                {zh ? "认识 Veilan" : "Discover Veilan"}
                <ArrowDown size={15} />
              </a>
            </div>
            <p className="hero-note">
              {zh
                ? "无需安装 · 浏览器内体验 · 为专注而生"
                : "No installation. Just your browser. All your focus."}
            </p>
          </div>
          <div className="hero-device rise rise-2" id="desktop">
            <div className="device-rim">
              <Desktop />
            </div>
            <div className="device-foot" />
          </div>
          <div className="desktop-caption">
            <span className="live-dot" />
            {zh
              ? "不止是看看。点击程序坞，打开你的第一个窗口。"
              : "More than a picture. Pick an app in the dock and make yourself at home."}
            <a href="/demo">
              {zh ? "全屏体验" : "Full experience"}
              <ArrowUpRight size={13} />
            </a>
          </div>
        </section>
        <section id="principles" className="section section-mist">
          <div className="content-width">
            <div className="section-heading">
              <p className="eyebrow">LESS, BUT BETTER</p>
              <h2>
                {zh ? (
                  <>
                    少一点打扰。
                    <br />
                    <span>多一点心流。</span>
                  </>
                ) : (
                  <>
                    Less in your way.
                    <br />
                    <span>More in your flow.</span>
                  </>
                )}
              </h2>
              <p>
                {zh
                  ? "好的系统，不必时刻提醒你它的存在。"
                  : "The best system doesn't keep reminding you it's there."}
              </p>
            </div>
            <div className="feature-grid">
              <article className="feature-card feature-veil">
                <div className="feature-visual veil-visual" aria-hidden="true">
                  <div className="mini-window mini-back">
                    <i />
                    <i />
                    <i />
                    <div />
                  </div>
                  <div className="mini-window mini-front">
                    <i />
                    <i />
                    <i />
                    <div />
                    <div />
                  </div>
                  <span className="visual-cursor">
                    <MousePointer2 size={24} fill="currentColor" />
                  </span>
                </div>
                <div className="feature-copy">
                  <Layers3 size={20} />
                  <h3>{zh ? "薄纱，让焦点更清晰。" : "Veil. Focus, naturally."}</h3>
                  <p>{t.principles.items[2].body}</p>
                  <span className="feature-tag">VEIL FOCUS</span>
                </div>
              </article>
              <article className="feature-card">
                <div className="feature-visual notice-visual" aria-hidden="true">
                  <div className="mini-notice">
                    <span className="mini-notice-icon">
                      <Sparkles size={22} />
                    </span>
                    <div>
                      <strong>{zh ? "一切已就绪" : "You're all set"}</strong>
                      <span>
                        {zh ? "剩下的时间，留给自己。" : "The rest of this moment is yours."}
                      </span>
                    </div>
                    <span className="mini-notice-time">{zh ? "现在" : "now"}</span>
                  </div>
                  <span className="notice-timer">
                    8s <span />
                  </span>
                </div>
                <div className="feature-copy">
                  <Sparkles size={20} />
                  <h3>{zh ? "消息来了，也会轻轻离开。" : "A notice. Not an interruption."}</h3>
                  <p>{t.principles.items[1].body}</p>
                  <span className="feature-tag">QUIET BY DESIGN</span>
                </div>
              </article>
              <article className="feature-card feature-wide">
                <div className="feature-copy">
                  <MousePointer2 size={20} />
                  <h3>{zh ? "上次的样子，刚刚好。" : "Right where you left it."}</h3>
                  <p>{t.principles.items[0].body}</p>
                  <span className="feature-tag">YOUR SPACE, REMEMBERED</span>
                </div>
                <div className="feature-visual memory-visual" aria-hidden="true">
                  <div className="memory-outline" />
                  <div className="mini-window memory-window">
                    <i />
                    <i />
                    <i />
                    <div />
                    <div />
                  </div>
                  <span className="memory-coordinate">
                    x: 128 &nbsp; y: 96 <Check size={12} />
                  </span>
                </div>
              </article>
            </div>
          </div>
        </section>
        <section className="section scope-section">
          <div className="content-width scope-layout">
            <div>
              <p className="eyebrow">AN HONEST PREVIEW</p>
              <h2>
                {zh ? (
                  <>
                    新的开始。
                    <br />
                    <span>也坦诚每一步。</span>
                  </>
                ) : (
                  <>
                    A fresh start.
                    <br />
                    <span>Nothing to hide.</span>
                  </>
                )}
              </h2>
              <p className="section-lead">{t.scope.lead}</p>
              <a className="text-link" href="/demo">
                {zh ? "亲手试一试" : "Make yourself at home"}
                <ArrowRight size={16} />
              </a>
            </div>
            <div className="scope-lists">
              <ScopeList title={t.scope.has} items={t.scope.hasItems} kind="has" />
              <ScopeList title={t.scope.hasNot} items={t.scope.hasNotItems} kind="not" />
            </div>
          </div>
        </section>
        <section id="release" className="section release-section">
          <div className="content-width">
            <div className="release-top">
              <div>
                <p className="eyebrow">THE NEXT CHAPTER</p>
                <h2>
                  Veil <span>2026.11</span>
                </h2>
                <p>{t.release.title}</p>
              </div>
              <a href="#machine" className="btn btn-white">
                {t.release.cta}
                <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="release-body">
              <dl className="release-specs">
                {t.release.specs.map((row) => (
                  <div key={row.k}>
                    <dt>{row.k}</dt>
                    <dd>{row.v}</dd>
                  </div>
                ))}
              </dl>
              <ol className="release-timeline">
                {t.release.timeline.map((item) => (
                  <li key={item.date} className={item.now ? "is-current" : ""}>
                    <span className="timeline-dot" />
                    <div>
                      <time>{item.date}</time>
                      <h3>
                        {item.title}
                        {item.now && <span>{t.release.now}</span>}
                      </h3>
                      <p>{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
        <Machine />
        <section className="closing-section">
          <p className="eyebrow">YOUR NEXT DESKTOP</p>
          <h2>{zh ? "给自己，一点新的空间。" : "A little room for what's next."}</h2>
          <a href="/demo" className="btn btn-ink">
            {zh ? "你好，Veilan。" : "Hello, Veilan."}
            <ArrowUpRight size={17} />
          </a>
          <p>{zh ? "只是一个新标签页的距离。" : "Just a new tab away."}</p>
        </section>
      </main>
      <footer className="site-footer content-width">
        <a href="#top" aria-label="Veilan OS">
          <Brand />
        </a>
        <div>
          <p>{t.footer.rights}</p>
          <p>{t.footer.note}</p>
        </div>
        <a href="https://github.com/YiNightMiao/veilan" target="_blank" rel="noreferrer">
          GitHub
          <ArrowUpRight size={13} />
        </a>
      </footer>
    </div>
  );
}

function ScopeList({
  title,
  items,
  kind,
}: {
  title: string;
  items: string[];
  kind: "has" | "not";
}) {
  const Icon = kind === "has" ? Check : Minus;
  return (
    <div>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <Icon size={16} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
