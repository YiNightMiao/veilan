import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Cpu, FileText, Folder, Terminal } from "lucide-react";
import markUrl from "@/assets/veilan-mark.jpg";
import { useI18n } from "@/components/lang";
import { cn } from "@/lib/cn";

const APPS = ["notes", "files", "term", "system"] as const;
type AppId = (typeof APPS)[number];

type Win = { x: number; y: number; z: number; open: boolean };
type Layout = { wins: Record<AppId, Win>; veil: boolean; focus: AppId };

const ICONS = { notes: FileText, files: Folder, term: Terminal, system: Cpu };
const SIZE: Record<AppId, { w: string; h: string }> = {
  notes: { w: "42%", h: "58%" },
  files: { w: "40%", h: "50%" },
  term: { w: "52%", h: "46%" },
  system: { w: "34%", h: "56%" },
};

const INITIAL: Layout = {
  veil: true,
  focus: "notes",
  wins: {
    notes: { x: 6, y: 18, z: 2, open: true },
    files: { x: 52, y: 26, z: 1, open: true },
    term: { x: 18, y: 24, z: 0, open: false },
    system: { x: 58, y: 18, z: 0, open: false },
  },
};

const STORE = "veilan-desktop-layout";

function isLayout(value: unknown): value is Layout {
  if (!value || typeof value !== "object") return false;
  const v = value as { wins?: unknown; veil?: unknown; focus?: unknown };
  if (typeof v.veil !== "boolean") return false;
  if (!APPS.includes(v.focus as AppId)) return false;
  if (!v.wins || typeof v.wins !== "object") return false;
  for (const id of APPS) {
    const win = (v.wins as Record<string, unknown>)[id];
    if (!win || typeof win !== "object") return false;
    const row = win as Record<string, unknown>;
    if (
      typeof row.x !== "number" ||
      typeof row.y !== "number" ||
      typeof row.z !== "number" ||
      typeof row.open !== "boolean"
    ) {
      return false;
    }
  }
  return true;
}

export function Desktop() {
  const { t } = useI18n();
  const [layout, setLayout] = useState<Layout>(INITIAL);
  const [ready, setReady] = useState(false);
  const [compact, setCompact] = useState(false);
  const [notice, setNotice] = useState(true);
  const [now, setNow] = useState<string>("\u2013\u2013:\u2013\u2013");
  const frameRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef(layout);
  const compactRef = useRef(compact);
  layoutRef.current = layout;
  compactRef.current = compact;

  useEffect(() => {
    const raw = localStorage.getItem(STORE);
    if (raw) {
      try {
        const parsed: unknown = JSON.parse(raw);
        if (isLayout(parsed)) setLayout(parsed);
      } catch {
        /* keep the default desk */
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORE, JSON.stringify(layout));
  }, [layout, ready]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(false), 8000);
    return () => window.clearTimeout(id);
  }, [notice]);

  useEffect(() => {
    const tick = () =>
      setNow(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);

  function focus(id: AppId) {
    setLayout((prev) => {
      const z = Math.max(...APPS.map((key) => prev.wins[key].z)) + 1;
      return { ...prev, focus: id, wins: { ...prev.wins, [id]: { ...prev.wins[id], z, open: true } } };
    });
  }

  function close(id: AppId) {
    setLayout((prev) => {
      const wins = { ...prev.wins, [id]: { ...prev.wins[id], open: false } };
      const nextFocus = prev.focus === id ? (APPS.find((key) => wins[key].open) ?? prev.focus) : prev.focus;
      return { ...prev, wins, focus: nextFocus };
    });
  }

  function openFromDock(id: AppId) {
    const current = layoutRef.current;
    if (!current.wins[id].open) {
      focus(id);
      return;
    }
    if (current.focus !== id) {
      focus(id);
      return;
    }
    close(id);
  }

  function startDrag(event: PointerEvent<HTMLDivElement>, id: AppId) {
    if (compactRef.current) return;
    if ((event.target as HTMLElement).closest("button")) return;
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const orig = layoutRef.current.wins[id];
    const z = Math.max(...APPS.map((key) => layoutRef.current.wins[key].z)) + 1;
    setLayout((prev) => ({
      ...prev,
      focus: id,
      wins: { ...prev.wins, [id]: { ...prev.wins[id], z, open: true } },
    }));
    const startX = event.clientX;
    const startY = event.clientY;
    const move = (ev: globalThis.PointerEvent) => {
      const dx = ((ev.clientX - startX) / rect.width) * 100;
      const dy = ((ev.clientY - startY) / rect.height) * 100;
      setLayout((prev) => ({
        ...prev,
        wins: {
          ...prev.wins,
          [id]: {
            ...prev.wins[id],
            x: Math.min(70, Math.max(1, orig.x + dx)),
            y: Math.min(58, Math.max(16, orig.y + dy)),
            z,
            open: true,
          },
        },
      }));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  const shown = layout.wins[layout.focus].open
    ? layout.focus
    : (APPS.find((id) => layout.wins[id].open) ?? null);
  const anyOpen = APPS.some((id) => layout.wins[id].open);

  return (
    <figure>
      <div className="rounded-xl bg-night p-1.5 sm:p-2">
        <div
          ref={frameRef}
          className={cn("stage", compact && "is-compact", !notice && "notice-gone")}
          role="application"
          aria-label={t.desktop.aria}
        >
          <div className="wallpaper-rule" />
          <div className="wallpaper-sun" />
          <div className="menu-bar">
            <img src={markUrl} alt="" width={906} height={665} className="h-6 w-auto" />
            <span className="os-name text-sm font-semibold">Veilan</span>
            <button
              type="button"
              className={cn("veil-switch ml-auto", layout.veil && "is-on")}
              aria-pressed={layout.veil}
              onClick={() => setLayout((prev) => ({ ...prev, veil: !prev.veil }))}
            >
              {t.desktop.veil}
            </button>
            <time className="tabular-nums text-sm text-muted" dateTime={now}>
              {now}
            </time>
          </div>

          {notice ? (
            <div className="notice" role="status">
              <div className="flex items-start gap-3 px-3 py-2">
                <span className="pt-0.5 text-xs font-semibold text-veil-ink">{t.desktop.noticeKicker}</span>
                <p className="min-w-0 flex-1 text-sm leading-snug">{t.desktop.notice}</p>
                <button type="button" className="min-h-11 shrink-0 text-sm font-semibold text-veil-ink" onClick={() => setNotice(false)}>
                  {t.desktop.dismiss}
                </button>
              </div>
              <div className="notice-life" />
            </div>
          ) : null}

          {APPS.map((id) => {
            const win = layout.wins[id];
            if (!win.open) return null;
            if (compact && id !== shown) return null;
            const veiled = layout.veil && id !== layout.focus;
            const Icon = ICONS[id];
            return (
              <section
                key={id}
                className={cn("win", compact && "is-fill", veiled && "is-veiled")}
                style={
                  compact
                    ? { zIndex: win.z }
                    : { left: `${win.x}%`, top: `${win.y}%`, width: SIZE[id].w, height: SIZE[id].h, zIndex: win.z }
                }
                onPointerDown={() => focus(id)}
                aria-label={t.desktop.apps[id]}
              >
                <div className="win-title" onPointerDown={(event) => startDrag(event, id)}>
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="size-4 text-veil-ink" aria-hidden />
                    {t.desktop.apps[id]}
                  </span>
                  <button type="button" className="put-away" aria-label={t.desktop.close} onClick={() => close(id)}>
                    <span />
                  </button>
                </div>
                <div className="min-h-0 flex-1 overflow-auto p-3 text-sm leading-relaxed">
                  <WindowBody id={id} veil={layout.veil} />
                </div>
              </section>
            );
          })}

          {!anyOpen ? <p className="empty-desk text-sm">{t.desktop.empty}</p> : null}

          <div className="dock" role="toolbar" aria-label={t.desktop.aria}>
            {APPS.map((id) => {
              const Icon = ICONS[id];
              const open = layout.wins[id].open;
              return (
                <button
                  key={id}
                  type="button"
                  className={cn("dock-btn", open && "is-open", layout.focus === id && open && "is-on")}
                  aria-pressed={open}
                  aria-label={t.desktop.apps[id]}
                  onClick={() => openFromDock(id)}
                >
                  <Icon className="size-5" aria-hidden />
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <figcaption className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{t.desktop.caption}</figcaption>
    </figure>
  );
}

function WindowBody({ id, veil }: { id: AppId; veil: boolean }) {
  const { t } = useI18n();
  if (id === "notes") {
    return (
      <>
        <p className="text-xs text-muted">{t.desktop.noteDate}</p>
        <p className="mt-2 whitespace-pre-line">{t.desktop.noteBody}</p>
      </>
    );
  }
  if (id === "files") {
    return (
      <div>
        {t.desktop.files.map((group) => (
          <div key={group.group} className="mb-3">
            <p className="text-xs text-muted">{group.group}</p>
            <ul>
              {group.items.map((item) => (
                <li key={item} className="mt-1 flex items-center gap-2">
                  <Folder className="size-4 shrink-0 text-veil-ink" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
  if (id === "term") {
    return (
      <div className="font-mono text-sm leading-relaxed">
        {t.desktop.term.map((line) => (
          <p key={line} className={line.startsWith("$") ? "text-veil-ink" : "text-ink"}>
            {line}
          </p>
        ))}
      </div>
    );
  }
  const rows = [
    [t.desktop.sys.channel, t.desktop.sys.channelV],
    [t.desktop.sys.memory, t.desktop.sys.memoryV],
    [t.desktop.sys.veil, veil ? t.desktop.sys.veilOn : t.desktop.sys.veilOff],
    [t.desktop.sys.display, t.desktop.sys.displayV],
  ];
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="text-muted">{label}</dt>
          <dd className="tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
