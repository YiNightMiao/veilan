import { createFileRoute } from "@tanstack/react-router";
import { Desktop } from "@/components/desktop";
import { LangProvider } from "@/components/lang";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Veilan OS — 在线体验" },
      {
        name: "description",
        content: "在浏览器中体验 VEILAN OS。打开应用、拖动窗口，给灵感一点空间。",
      },
    ],
  }),
  component: () => (
    <LangProvider>
      <main className="demo-page">
        <Desktop immersive />
      </main>
    </LangProvider>
  ),
});
