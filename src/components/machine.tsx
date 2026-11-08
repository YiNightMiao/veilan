import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/lang";
import { cn } from "@/lib/cn";

type Arch = "x86_64" | "arm64";
type Verdict = "bad" | "tight" | "good";

type MachineState = {
  arch: Arch;
  mem: number;
  disk: number;
  name: string;
};

const STORE = "veilan-machine";
const INITIAL: MachineState = { arch: "x86_64", mem: 8, disk: 64, name: "" };

function isState(value: unknown): value is MachineState {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    (v.arch === "x86_64" || v.arch === "arm64") &&
    typeof v.mem === "number" &&
    typeof v.disk === "number" &&
    typeof v.name === "string"
  );
}

function judge(mem: number, disk: number): Verdict {
  if (disk < 32) return "bad";
  if (mem <= 4) return "tight";
  return "good";
}

export function Machine() {
  const { t } = useI18n();
  const [state, setState] = useState<MachineState>(INITIAL);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");

  useEffect(() => {
    const raw = localStorage.getItem(STORE);
    if (raw) {
      try {
        const parsed: unknown = JSON.parse(raw);
        if (isState(parsed)) setState({ ...parsed, name: parsed.name.slice(0, 40) });
      } catch {
        /* keep defaults */
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORE, JSON.stringify(state));
  }, [state, ready]);

  const verdict = judge(state.mem, state.disk);
  const verdictCopy = t.machine[verdict];
  const size = state.arch === "arm64" ? t.machine.sizeArm : t.machine.sizeX86;
  const file = `veilan-desktop-2026.11-veil-${state.arch}.iso`;

  const sheet = useMemo(() => {
    const name = state.name.trim() || "—";
    return [
      t.machine.sheet,
      `${t.machine.name} · ${name}`,
      `${t.machine.arch} · ${state.arch}`,
      `${t.machine.mem} · ${state.mem} GB`,
      `${t.machine.disk} · ${state.disk} GB`,
      `${t.release.specs[0].k} · 2026.11 Veil`,
      `${t.machine.file} · ${file}`,
      `${t.machine.size} · ${size}`,
      `${t.machine.result} · ${verdictCopy.title}`,
    ].join("\n");
  }, [file, size, state, t, verdictCopy.title]);

  async function copySheet() {
    try {
      await navigator.clipboard.writeText(sheet);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
    window.setTimeout(() => setCopied("idle"), 2200);
  }

  return (
    <section id="machine" className="py-20 md:py-28">
      <div className="mx-auto grid w-full min-w-0 max-w-6xl gap-10 px-5 lg:grid-cols-2 lg:items-start">
        <div className="min-w-0">
          <p className="text-sm font-medium text-veil-ink">{t.machine.kicker}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{t.machine.title}</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{t.machine.lead}</p>
          <form
            className="mt-8 grid gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              void copySheet();
            }}
          >
            <fieldset>
              <legend className="mb-2 text-sm font-medium">{t.machine.arch}</legend>
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t.machine.arch}>
                {(["x86_64", "arm64"] as const).map((arch) => (
                  <button
                    key={arch}
                    type="button"
                    role="radio"
                    aria-checked={state.arch === arch}
                    className="choice"
                    onClick={() => setState((prev) => ({ ...prev, arch }))}
                  >
                    {arch === "arm64" ? "ARM64" : "x86_64"}
                  </button>
                ))}
              </div>
            </fieldset>
            <ChoiceRow
              label={t.machine.mem}
              value={state.mem}
              options={[4, 8, 16]}
              unit="GB"
              onChange={(mem) => setState((prev) => ({ ...prev, mem }))}
            />
            <ChoiceRow
              label={t.machine.disk}
              value={state.disk}
              options={[16, 32, 128]}
              unit="GB"
              onChange={(disk) => setState((prev) => ({ ...prev, disk }))}
            />
            <label className="grid gap-2 text-sm font-medium">
              {t.machine.name}
              <input
                className="field font-normal"
                maxLength={40}
                value={state.name}
                placeholder={t.machine.namePh}
                onChange={(event) => setState((prev) => ({ ...prev, name: event.target.value }))}
              />
            </label>
          </form>
        </div>
        <div className="min-w-0">
          <div
            className={cn(
              "rounded-xl border border-line border-l-4 bg-bg p-5",
              verdict === "good" && "border-l-veil",
              verdict === "tight" && "border-l-veil-ink",
              verdict === "bad" && "border-l-ink",
            )}
            aria-live="polite"
          >
            <p className="text-lg font-semibold">{verdictCopy.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{verdictCopy.detail}</p>
          </div>
          <pre className="mt-4 max-w-full overflow-x-auto whitespace-pre-wrap break-all rounded-xl bg-mist p-4 font-mono text-sm leading-relaxed text-ink">
            {sheet}
          </pre>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-ink" onClick={() => void copySheet()}>
              {copied === "ok" ? t.machine.copied : t.machine.copy}
            </button>
            <p className="text-sm text-muted">{copied === "fail" ? t.machine.copyFail : t.machine.local}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChoiceRow({
  label,
  value,
  options,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  options: number[];
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={value === option}
            className="choice tabular-nums"
            onClick={() => onChange(option)}
          >
            {option} {unit}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
