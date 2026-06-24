import { listGameMeta } from "@game-loader/react/meta";
import { GameCard } from "../components/GameCard";
import { Hero } from "../components/Hero";

export default function Home() {
  const games = listGameMeta();
  return (
    <div>
      <Hero />

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-baseline justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-bulb" />
              <span className="font-mono text-[11px] tracking-[0.22em] text-bulb uppercase">
                The games
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-light max-w-xl">
              Three loaders, one <em className="italic text-bulb">API</em>.
            </h2>
          </div>
          <p className="hidden md:block text-muted text-sm max-w-xs text-right">
            Each game implements the same <code className="text-foreground">GameProps</code> contract.
            Add your own in a 3-file PR.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 md:row-span-2">
            <GameCard id="dino" size="lg" />
          </div>
          <GameCard id="snake" size="md" />
          <GameCard id="pong" size="md" />
        </div>
      </section>

      <section className="border-t border-rule">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-bulb" />
            <span className="font-mono text-[11px] tracking-[0.22em] text-bulb uppercase">
              Why this exists
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-light max-w-2xl mb-12">
            The original <code className="font-mono text-base not-italic text-bulb">react-chrome-dino</code> is broken on modern React.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
            {[
              {
                k: "01",
                t: "React 16 + CRA",
                d: "No TypeScript, no SSR, no React 19 support. Companies stuck on it can't ship to Next.js.",
              },
              {
                k: "02",
                t: "rAF loop never cleans up",
                d: "The original leaks a requestAnimationFrame handle on every unmount. Memory + CPU creep with every loading flash.",
              },
              {
                k: "03",
                t: "External sprite assets",
                d: "Loaders should appear instantly. Network-sprite-based loaders flash empty on slow connections.",
              },
            ].map((row) => (
              <div key={row.k} className="border-t border-rule pt-5">
                <div className="font-mono text-[11px] tracking-[0.18em] text-bulb mb-2">
                  {row.k}
                </div>
                <h3 className="font-display text-xl mb-2">{row.t}</h3>
                <p className="text-muted text-sm leading-relaxed">{row.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
