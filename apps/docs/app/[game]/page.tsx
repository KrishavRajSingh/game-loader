import Link from "next/link";
import { notFound } from "next/navigation";
import { getGameMeta, listGameMeta } from "@game-loader/react/meta";
import { GamePlayground } from "../../components/GamePlayground";

export function generateStaticParams() {
  return [{ game: "dino" }, { game: "snake" }, { game: "pong" }];
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const { game } = await params;
  const meta = getGameMeta(game);
  if (!meta) notFound();
  const others = listGameMeta().filter((m) => m.id !== meta.id);
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-bulb" />
          <span className="font-mono text-[11px] tracking-[0.22em] text-bulb uppercase">
            /games/{meta.id}
          </span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-light tracking-tight">
          {meta.displayName}
        </h1>
        <div className="flex flex-wrap gap-2 mt-4">
          {meta.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] font-mono uppercase tracking-wider text-muted border border-rule rounded-full px-2.5 py-1"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>
      <GamePlayground game={meta.id} description={meta.description} />
      <section className="border-t border-rule pt-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-bulb mb-4">
          Other games
        </div>
        <div className="flex flex-wrap gap-3">
          {others.map((o) => (
            <Link
              key={o.id}
              href={`/${o.id}`}
              className="group inline-flex items-center gap-2 bg-ink-2 border border-rule rounded-full px-4 py-2 hover:border-bulb/60 transition-colors"
            >
              <span className="font-display text-base">{o.displayName}</span>
              <span className="text-muted group-hover:text-bulb transition-colors">
                →
              </span>
            </Link>
          ))}
          <Link
            href="/sandbox"
            className="inline-flex items-center gap-2 bg-ink-2 border border-rule rounded-full px-4 py-2 hover:border-bulb/60 transition-colors"
          >
            <span className="font-display text-base">Try the sandbox</span>
            <span className="text-muted">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
