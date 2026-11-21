import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ArrowLeft,
  BatteryFull,
  Check,
  ChevronRight,
  FileText,
  Folder,
  HardDrive,
  Maximize2,
  Minus,
  Moon,
  Search,
  Settings2,
  Sparkles,
  Sun,
  Terminal,
  Wifi,
  X,
} from "lucide-react";
import { useI18n } from "@/components/lang";
import { cn } from "@/lib/cn";

const APPS = ["notes", "files", "term", "system"] as const;
type AppId = (typeof APPS)[number];
type Win = { x: number; y: number; z: number; open: boolean; max?: boolean };
type Layout = { wins: Record<AppId, Win>; veil: boolean; focus: AppId };
const ICONS = { notes: FileText, files: Folder, term: Terminal, system: Settings2 };
const SIZE = {
  notes: { w: 44, h: 65 },
  files: { w: 42, h: 58 },
  term: { w: 51, h: 55 },
  system: { w: 41, h: 66 },
};
const INITIAL: Layout = {
  veil: true,
  focus: "notes",
  wins: {
    notes: { x: 12, y: 15, z: 2, open: true },
    files: { x: 49, y: 24, z: 1, open: true },
    term: { x: 24, y: 21, z: 0, open: false },
    system: { x: 39, y: 14, z: 0, open: false },
  },
};
const STORE = "veilan-desktop-layout-v2";

function readSaved<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Private browsing can disable storage. */
  }
}
function isLayout(value: unknown): value is Layout {
  if (!value || typeof value !== "object") return false;
  const v = value as Layout;
  return (
    typeof v.veil === "boolean" &&
    APPS.includes(v.focus) &&
    !!v.wins &&
    APPS.every((id) => {
      const w = v.wins[id];
      return (
        w &&
        Number.isFinite(w.x) &&
        w.x >= 0 &&
        w.x <= 100 - SIZE[id].w &&
        Number.isFinite(w.y) &&
        w.y >= 7 &&
        w.y <= 90 - SIZE[id].h &&
        Number.isFinite(w.z) &&
        typeof w.open === "boolean"
      );
    })
  );
}

export function Desktop({ immersive = false }: { immersive?: boolean }) {
  const { t, lang, setLang } = useI18n();
  const zh = lang === "zh";
  const [layout, setLayout] = useState<Layout>(INITIAL);
  const [ready, setReady] = useState(false);
  const [compact, setCompact] = useState(false);
  const [notice, setNotice] = useState(true);
  const [clock, setClock] = useState("09:41");
  const [wallpaper, setWallpaper] = useState("dawn");
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const dragCleanup = useRef<(() => void) | null>(null);

  useEffect(() => {
    const saved = readSaved<unknown>(STORE, INITIAL);
    if (isLayout(saved)) setLayout(saved);
    const savedNote = readSaved<unknown>("veilan-note", null);
    if (typeof savedNote === "string") setNote(savedNote);
    const savedWallpaper = readSaved<unknown>("veilan-wallpaper", "dawn");
    if (["dawn", "ocean", "dusk"].includes(savedWallpaper as string))
      setWallpaper(savedWallpaper as string);
    setReady(true);
    const observer = new ResizeObserver(([entry]) => setCompact(entry.contentRect.width < 640));
    if (frame.current) observer.observe(frame.current);
    const tick = () =>
      setClock(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const timer = window.setInterval(tick, 15000);
    return () => {
      observer.disconnect();
      clearInterval(timer);
      dragCleanup.current?.();
    };
  }, []);
  useEffect(() => {
    if (ready) save(STORE, layout);
  }, [layout, ready]);
  useEffect(() => {
    if (ready) save("veilan-wallpaper", wallpaper);
  }, [wallpaper, ready]);
  useEffect(() => {
    const syncNote = (event: StorageEvent) => {
      if (event.key !== "veilan-note") return;
      const value = readSaved<unknown>("veilan-note", null);
      if (typeof value === "string" || value === null) setNote(value);
    };
    window.addEventListener("storage", syncNote);
    return () => window.removeEventListener("storage", syncNote);
  }, []);

  function editNote(value: string) {
    setNote(value);
    save("veilan-note", value);
  }
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(false), 8000);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearch((value) => !value);
      }
      if (event.key === "Escape") {
        setSearch(false);
        searchButton.current?.focus();
      }
    };
    // Embedded previews don't take over shortcuts for the rest of the website.
    const target = immersive ? window : frame.current;
    target?.addEventListener("keydown", handler as EventListener);
    return () => target?.removeEventListener("keydown", handler as EventListener);
  }, [immersive]);
  useEffect(() => {
    if (search) searchRef.current?.focus();
  }, [search]);

  function focus(id: AppId) {
    setLayout((prev) => ({
      ...prev,
      focus: id,
      wins: {
        ...prev.wins,
        [id]: {
          ...prev.wins[id],
          z: Math.max(...APPS.map((key) => prev.wins[key].z)) + 1,
          open: true,
        },
      },
    }));
  }
  function close(id: AppId) {
    setLayout((prev) => {
      const wins = { ...prev.wins, [id]: { ...prev.wins[id], open: false } };
      const next = APPS.filter((key) => wins[key].open).sort((a, b) => wins[b].z - wins[a].z)[0];
      return { ...prev, wins, focus: prev.focus === id ? (next ?? id) : prev.focus };
    });
  }
  function maximize(id: AppId) {
    setLayout((prev) => ({
      ...prev,
      wins: { ...prev.wins, [id]: { ...prev.wins[id], max: !prev.wins[id].max } },
    }));
  }
  function startDrag(event: PointerEvent<HTMLDivElement>, id: AppId) {
    if (
      compact ||
      layout.wins[id].max ||
      event.button !== 0 ||
      (event.target as HTMLElement).closest("button")
    )
      return;
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    dragCleanup.current?.();
    const original = layout.wins[id],
      startX = event.clientX,
      startY = event.clientY;
    focus(id);
    const move = (ev: globalThis.PointerEvent) =>
      setLayout((prev) => ({
        ...prev,
        wins: {
          ...prev.wins,
          [id]: {
            ...prev.wins[id],
            x: Math.max(
              0.5,
              Math.min(99.5 - SIZE[id].w, original.x + ((ev.clientX - startX) / rect.width) * 100),
            ),
            y: Math.max(
              8,
              Math.min(89 - SIZE[id].h, original.y + ((ev.clientY - startY) / rect.height) * 100),
            ),
          },
        },
      }));
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      dragCleanup.current = null;
    };
    dragCleanup.current = up;
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }
  function toggleVeil() {
    setLayout((prev) => ({ ...prev, veil: !prev.veil }));
  }
  function dismissSearch() {
    setSearch(false);
    setQuery("");
    searchButton.current?.focus();
  }
  const labels = {
    close: zh ? "关闭" : "Close",
    minimize: zh ? "最小化" : "Minimize",
    maximize: zh ? "切换最大化" : "Toggle maximize",
  };

  return (
    <div
      ref={frame}
      className={cn(
        "stage",
        `wallpaper-${wallpaper}`,
        compact && "is-compact",
        immersive && "stage-immersive",
      )}
      aria-label={t.desktop.aria}
    >
      <div className="wallpaper-wordmark" aria-hidden="true">
        a little room
        <br />
        to be you.
      </div>
      <div className="menu-bar">
        <a href={immersive ? "/" : "#top"} aria-label={zh ? "返回官网" : "Back to website"}>
          <img src="/favicon.svg" width={23} height={23} alt="" />
        </a>
        <span className="os-name">Veilan OS</span>
        <span className="menu-active-app">{t.desktop.apps[layout.focus]}</span>
        <div className="menu-right">
          <button
            className={cn("veil-switch", layout.veil && "is-on")}
            onClick={toggleVeil}
            aria-pressed={layout.veil}
          >
            <Sparkles size={12} />
            {zh ? "薄纱" : "Veil"}
            <span />
          </button>
          <button
            ref={searchButton}
            aria-label={zh ? "搜索应用" : "Search apps"}
            onClick={() => setSearch(true)}
          >
            <Search size={15} />
          </button>
          <Wifi
            size={15}
            className="status-icon"
            aria-label={zh ? "模拟网络状态" : "Simulated network status"}
          />
          <BatteryFull
            size={19}
            className="status-icon"
            aria-label={zh ? "模拟电池状态" : "Simulated battery status"}
          />
          <time>{clock}</time>
        </div>
      </div>
      {immersive && (
        <a className="demo-back" href="/">
          <ArrowLeft size={13} />
          {zh ? "返回官网" : "Back to website"}
          <span>{zh ? "浏览器交互演示" : "Browser demo"}</span>
        </a>
      )}
      {notice && (
        <div className="notice" role="status">
          <span className="notice-icon">
            <Sparkles size={19} />
          </span>
          <div>
            <strong>{zh ? "欢迎来到 Veilan" : "Welcome to Veilan"}</strong>
            <p>
              {zh ? "慢下来，把注意力留给喜欢的事。" : "A quieter space for the things you love."}
            </p>
          </div>
          <button aria-label={t.desktop.dismiss} onClick={() => setNotice(false)}>
            <X size={13} />
          </button>
          <span className="notice-life" />
        </div>
      )}
      {APPS.map((id) => {
        const win = layout.wins[id];
        return (
          <section
            key={id}
            hidden={!win.open || (compact && id !== layout.focus)}
            aria-label={t.desktop.apps[id]}
            className={cn(
              "win",
              `win-${id}`,
              layout.veil && id !== layout.focus && "is-veiled",
              win.max && "is-maximized",
            )}
            style={{
              left: `${win.x}%`,
              top: `${win.y}%`,
              width: `${SIZE[id].w}%`,
              height: `${SIZE[id].h}%`,
              zIndex: win.z + 1,
            }}
            onPointerDown={() => focus(id)}
            onFocusCapture={() => {
              if (layout.focus !== id) focus(id);
            }}
          >
            <div
              className="win-title"
              onPointerDown={(event) => startDrag(event, id)}
              onDoubleClick={(event) => {
                if (!(event.target as HTMLElement).closest("button")) maximize(id);
              }}
            >
              <div className="traffic-lights">
                <button
                  className="traffic-close"
                  aria-label={`${labels.close} ${t.desktop.apps[id]}`}
                  onClick={() => close(id)}
                >
                  <X size={8} />
                </button>
                <button
                  className="traffic-min"
                  aria-label={`${labels.minimize} ${t.desktop.apps[id]}`}
                  onClick={() => close(id)}
                >
                  <Minus size={8} />
                </button>
                <button
                  className="traffic-max"
                  aria-label={`${labels.maximize} ${t.desktop.apps[id]}`}
                  onClick={() => maximize(id)}
                >
                  <Maximize2 size={7} />
                </button>
              </div>
              <span>{t.desktop.apps[id]}</span>
              <span className="window-toolbar-icon">
                {id === "notes" ? (
                  <FileText size={13} />
                ) : id === "files" ? (
                  <Search size={13} />
                ) : null}
              </span>
            </div>
            <div className="window-content">
              <WindowBody
                id={id}
                note={
                  note ??
                  (zh
                    ? "给灵感留一点空白。\n\n窗外的光，刚泡好的咖啡，\n还有一个不被打扰的下午。\n\n今天，想做点什么？"
                    : "A little room for inspiration.\n\nThe afternoon light. A fresh coffee.\nA moment that is entirely yours.\n\nWhat will you make today?")
                }
                setNote={editNote}
                veil={layout.veil}
                toggleVeil={toggleVeil}
                wallpaper={wallpaper}
                setWallpaper={setWallpaper}
                reset={() => setLayout(prev => ({ ...INITIAL, veil: prev.veil }))}
              />
            </div>
          </section>
        );
      })}
      {!APPS.some((id) => layout.wins[id].open) && (
        <div className="empty-desk">
          <Sparkles size={32} />
          <p>{t.desktop.empty}</p>
        </div>
      )}
      <div className="dock" role="toolbar" aria-label={zh ? "程序坞" : "App dock"}>
        {APPS.map((id) => {
          const Icon = ICONS[id];
          return (
            <button
              key={id}
              className={cn("dock-btn", layout.wins[id].open && "is-open")}
              aria-label={t.desktop.apps[id]}
              aria-pressed={layout.wins[id].open}
              onClick={() => focus(id)}
            >
              <span className={`app-icon app-${id}`}>
                <Icon size={26} strokeWidth={1.6} />
              </span>
              <span className="dock-tooltip">{t.desktop.apps[id]}</span>
            </button>
          );
        })}
        <span className="dock-separator" />
        <button
          className="dock-btn"
          aria-label={zh ? "搜索应用" : "Search apps"}
          onClick={() => setSearch(true)}
        >
          <span className="app-icon app-search">
            <Search size={25} strokeWidth={1.6} />
          </span>
          <span className="dock-tooltip">{zh ? "搜索" : "Search"}</span>
        </button>
      </div>
      {immersive && (
        <div className="demo-help">
          <span>{zh ? "拖动窗口，自在探索" : "Drag a window. Make it yours."}</span>
          <button onClick={() => setSearch(true)}>
            <kbd>⌘ / Ctrl K</kbd>
          </button>
          <button onClick={() => setLang(zh ? "en" : "zh")}>{zh ? "EN" : "中文"}</button>
        </div>
      )}
      {search && (
        <div className="spotlight-backdrop" onClick={dismissSearch}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={zh ? "搜索应用" : "Search apps"}
            className="spotlight"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key !== "Tab") return;
              const items = event.currentTarget.querySelectorAll<HTMLElement>("input, button");
              const first = items[0],
                last = items[items.length - 1];
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
              }
              if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
              }
            }}
          >
            <div className="spotlight-input">
              <Search size={22} />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={zh ? "想打开什么？" : "What would you like to open?"}
                aria-label={zh ? "搜索应用" : "Search apps"}
              />
              <button onClick={dismissSearch} aria-label={zh ? "关闭搜索" : "Close search"}>
                <X size={18} />
              </button>
            </div>
            <p className="spotlight-label">{zh ? "应用程序" : "APPLICATIONS"}</p>
            {APPS.filter((id) =>
              `${t.desktop.apps[id]} ${id}`.toLowerCase().includes(query.toLowerCase()),
            ).map((id) => {
              const Icon = ICONS[id];
              return (
                <button
                  className="spotlight-result"
                  key={id}
                  onClick={() => {
                    focus(id);
                    dismissSearch();
                  }}
                >
                  <span className={`app-icon app-${id}`}>
                    <Icon size={21} />
                  </span>
                  {t.desktop.apps[id]}
                  <ChevronRight size={15} />
                </button>
              );
            })}
            {!APPS.some((id) =>
              `${t.desktop.apps[id]} ${id}`.toLowerCase().includes(query.toLowerCase()),
            ) && (
              <p className="spotlight-empty">
                {zh
                  ? "没有找到应用，试试「笔记」或「终端」。"
                  : "No apps found. Try Notes or Terminal."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type BodyProps = {
  id: AppId;
  note: string;
  setNote: (text: string) => void;
  veil: boolean;
  toggleVeil: () => void;
  wallpaper: string;
  setWallpaper: (value: string) => void;
  reset: () => void;
};
function WindowBody({
  id,
  note,
  setNote,
  veil,
  toggleVeil,
  wallpaper,
  setWallpaper,
  reset,
}: BodyProps) {
  const { t, lang } = useI18n();
  const zh = lang === "zh";
  const [folder, setFolder] = useState("home");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  if (id === "notes")
    return (
      <div className="notes-app">
        <div className="notes-meta">
          <span>{zh ? "今天 · 我的笔记" : "Today · My notes"}</span>
          <span>
            <Check size={11} />
            {zh ? "本地保存" : "Saved locally"}
          </span>
        </div>
        <textarea
          aria-label={zh ? "编辑笔记" : "Edit note"}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          spellCheck={false}
        />
        <div className="notes-bottom">
          {zh ? "只属于这台浏览器的小小想法。" : "Little thoughts. Kept in this browser."}
        </div>
      </div>
    );
  if (id === "term") return <TerminalApp veil={veil} note={note} />;
  if (id === "files") {
    const files =
      folder === "home"
        ? ["readme.txt", "desktop.veil", "Ideas"]
        : folder === "docs"
          ? ["readme.txt", "release-notes.txt"]
          : ["desktop.veil"];
    return (
      <div className="files-app">
        <aside>
          <p>{zh ? "收藏" : "FAVORITES"}</p>
          {[
            ["home", zh ? "个人空间" : "Home"],
            ["docs", zh ? "文稿" : "Documents"],
            ["system", zh ? "系统" : "System"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={folder === key ? "selected" : ""}
              onClick={() => {
                setFolder(key);
                setSelectedFile(null);
              }}
            >
              <Folder size={13} />
              {label}
            </button>
          ))}
          <div className="files-drive">
            <HardDrive size={14} />
            Veilan HD<span>24 GB / 32 GB</span>
          </div>
        </aside>
        <div className="files-main">
          <div className="files-path">
            {folder === "home" ? "Home" : folder === "docs" ? "Documents" : "System"}
            <span>
              {files.length} {zh ? "项" : "items"}
            </span>
          </div>
          {selectedFile ? (
            <div className="file-preview">
              <button onClick={() => setSelectedFile(null)}>
                <ArrowLeft size={12} />
                {zh ? "返回" : "Back"}
              </button>
              <h3>{selectedFile}</h3>
              <p>
                {selectedFile === "Ideas"
                  ? note
                  : selectedFile === "desktop.veil"
                    ? "[desktop]\nchannel = 2026.11-veil\nfocus = yours\nlayout = remembered"
                    : zh
                      ? "你好，Veilan。\n\n这是 VEILAN OS 的浏览器交互演示，不是真正的操作系统。\n\n试着拖动窗口、写一段笔记，或在终端输入 help。\n内容只保存在本地浏览器。"
                      : "Hello, Veilan.\n\nThis is an interactive browser demo, not a real operating system.\n\nDrag a window, write a note, or type help in Terminal.\nYour changes stay in this browser."}
              </p>
            </div>
          ) : (
            <div className="file-grid">
              {files.map((file) => (
                <button key={file} onClick={() => setSelectedFile(file)}>
                  {file === "Ideas" ? (
                    <Folder size={38} fill="#a0c9ed" color="#72a7d5" strokeWidth={1} />
                  ) : (
                    <FileText size={35} strokeWidth={1} color="#9ca4b4" />
                  )}
                  <span>{file}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="system-app">
      <div className="system-brand">
        <img src="/favicon.svg" width={52} height={52} alt="" />
        <h3>Veilan OS</h3>
        <p>
          Veil · 2026.11 <span>{zh ? "网页演示" : "Web demo"}</span>
        </p>
      </div>
      <div className="settings-group">
        <button onClick={toggleVeil}>
          <span>
            <Sparkles size={15} />
            {zh ? "薄纱专注" : "Veil focus"}
          </span>
          <span
            className={cn("toggle", veil && "is-on")}
            role="switch"
            aria-checked={veil}
            aria-label={zh ? "薄纱专注" : "Veil focus"}
          >
            <i />
          </span>
        </button>
        <div className="wallpaper-setting">
          <span>{zh ? "桌面外观" : "Wallpaper"}</span>
          <div className="wallpaper-options">
            {[
              ["dawn", zh ? "晨曦" : "Dawn"],
              ["ocean", zh ? "海洋" : "Ocean"],
              ["dusk", zh ? "暮色" : "Dusk"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={cn(`wallpaper-swatch wallpaper-${key}`, wallpaper === key && "selected")}
                aria-label={label}
                aria-pressed={wallpaper === key}
                onClick={() => setWallpaper(key)}
              >
                {key === "dusk" ? (
                  <Moon size={12} />
                ) : key === "dawn" ? (
                  <Sun size={12} />
                ) : (
                  <span>≈</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="system-description">
        {zh
          ? "一个桌面，一点空间。所有交互均在浏览器中模拟，无需安装。"
          : "One desktop. A little room. All interactions are simulated in your browser. No install required."}
      </p>
      <button className="reset-layout" onClick={reset}>
        {zh ? "恢复默认窗口布局" : "Reset window layout"}
      </button>
      <span className="system-version">VEILAN TEAM · PREVIEW</span>
    </div>
  );
}

function TerminalApp({ veil, note }: { veil: boolean; note: string }) {
  const { lang } = useI18n();
  const zh = lang === "zh";
  const [input, setInput] = useState("");
  const [lines, setLines] = useState([
    "Veilan Shell — 2026.11",
    "Browser sandbox · type help to explore",
    "",
  ]);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [lines]);
  function run() {
    const command = input.trim();
    setInput("");
    if (command === "clear") {
      setLines([]);
      return;
    }
    const output =
      command === "help"
        ? "help              Available commands\nveil status       Preview system status\nls                List demo files\ncat notes.txt     Read your note\ndate              Local date and time\nwhoami            Current demo user\nclear             Clear terminal"
        : command === "veil status"
          ? `channel    2026.11-veil\nveil       ${veil ? "on" : "off"}\nwindows    remembered\nruntime    browser demo`
          : command === "ls"
            ? "readme.txt    desktop.veil    notes.txt"
            : command === "cat notes.txt"
              ? note
              : command === "date"
                ? new Date().toLocaleString(zh ? "zh-CN" : "en-GB")
                : command === "whoami"
                  ? "guest@veilan"
                  : command === ""
                    ? ""
                    : `veil: ${command}: ${zh ? "演示环境不支持此命令，输入 help 查看。" : "command not found. Type help for demo commands."}`;
    setLines((prev) => [...prev.slice(-150), `guest@veilan ~ % ${command}`, output]);
  }
  return (
    <div className="terminal-app">
      <div className="terminal-output" role="log" aria-live="polite">
        {lines.map((line, i) => (
          <p key={i}>{line || "\u00a0"}</p>
        ))}
        <div ref={end} />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
      >
        <label htmlFor="terminal-command">guest@veilan ~ %</label>
        <input
          id="terminal-command"
          aria-label={zh ? "终端命令" : "Terminal command"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </form>
      <p className="terminal-hint">
        {zh
          ? "模拟终端 · 不会执行系统命令"
          : "Simulated terminal · no system commands are executed"}
      </p>
    </div>
  );
}
