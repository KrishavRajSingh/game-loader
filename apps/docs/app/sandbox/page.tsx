import { FakeFetch } from "../../components/FakeFetch";

export default function SandboxPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-10">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-bulb" />
          <span className="font-mono text-[11px] tracking-[0.22em] text-bulb uppercase">
            /sandbox
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-light tracking-tight">
          Sandbox: a real <em className="italic text-bulb">loader UX</em>.
        </h1>
        <p className="text-muted text-lg max-w-2xl mt-4 leading-relaxed">
          Simulates a typical data fetch. Click the button — the game
          plays while the data is &quot;loading&quot;, then the real content
          appears. Try switching games, sizes, and delays.
        </p>
      </div>
      <FakeFetch />
    </div>
  );
}
