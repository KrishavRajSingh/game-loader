"use client";

import { useState } from "react";
import { GameLoader, type GameId, type Size } from "@game-loader/react";

const SAMPLE_DATA = {
  user: { id: 42, name: "Ada Lovelace", plan: "Pro" },
  metrics: { dau: 12_840, mrr: 28_400, churn: 0.024 },
  recent: [
    { id: 1, action: "Deployed v2.4.1", at: "12 min ago" },
    { id: 2, action: "Merged PR #481", at: "1 h ago" },
    { id: 3, action: "Resolved incident #22", at: "3 h ago" },
  ],
};

export function FakeFetch() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<typeof SAMPLE_DATA | null>(null);
  const [game, setGame] = useState<GameId>("dino");
  const [size, setSize] = useState<Size>("md");
  const [delay, setDelay] = useState(2500);

  const fetch = () => {
    setLoading(true);
    setData(null);
    setTimeout(() => {
      setData(SAMPLE_DATA);
      setLoading(false);
    }, delay);
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-5 bg-ink-2 border border-rule rounded-xl p-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-bulb mb-2">
              game
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["dino", "snake", "pong"] as GameId[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGame(g)}
                  className={`px-3 py-1.5 rounded-full text-sm font-mono border transition-colors ${
                    game === g
                      ? "bg-bulb text-ink border-bulb"
                      : "border-rule text-muted hover:text-foreground"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-bulb mb-2">
              size
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["sm", "md", "lg"] as Size[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-3 py-1.5 rounded-full text-sm font-mono border transition-colors ${
                    size === s
                      ? "bg-bulb text-ink border-bulb"
                      : "border-rule text-muted hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bulb">
                fake fetch delay
              </span>
              <span className="font-mono text-xs text-foreground">
                {delay}ms
              </span>
            </div>
            <input
              type="range"
              min={300}
              max={8000}
              step={100}
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="w-full accent-bulb"
            />
          </div>
          <button
            onClick={fetch}
            disabled={loading}
            className="w-full bg-bulb text-ink font-medium px-4 py-2.5 rounded-full disabled:opacity-50 hover:bg-bulb-2 transition-colors"
          >
            {loading ? "Fetching…" : "Fetch dashboard data"}
          </button>
        </div>

        <div className="bg-ink-2 border border-rule rounded-xl overflow-hidden">
          <GameLoader loading={loading} game={game} size={size} theme="dark">
            <div className="w-full h-full min-h-[220px] p-6 flex flex-col justify-center gap-3 bg-ink-2">
              {!data && !loading && (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-bulb">
                    Idle
                  </span>
                  <span className="text-sm">
                    Hit the button to start a fetch.
                  </span>
                </div>
              )}
              {data && (
                <>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-bulb">
                      user
                    </p>
                    <p className="font-display text-2xl mt-1">
                      {data.user.name}
                      <span className="text-muted"> · {data.user.plan}</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <Stat label="DAU" value={data.metrics.dau.toLocaleString()} />
                    <Stat label="MRR" value={`$${data.metrics.mrr.toLocaleString()}`} />
                    <Stat label="Churn" value={`${(data.metrics.churn * 100).toFixed(1)}%`} />
                  </div>
                  <ul className="text-sm text-muted mt-2 space-y-1">
                    {data.recent.map((r) => (
                      <li key={r.id} className="flex justify-between">
                        <span>{r.action}</span>
                        <span className="font-mono text-xs">{r.at}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </GameLoader>
        </div>
      </div>

      <pre className="bg-ink-2 border border-rule rounded-lg p-5 text-xs overflow-x-auto">
        <code className="font-mono">
          <span className="text-muted">{"const "}</span>
          <span className="text-foreground">{"[loading, setLoading]"}</span>
          <span className="text-muted">{" = useState(false);"}</span>
          {"\n"}
          <span className="text-muted">{"const "}</span>
          <span className="text-foreground">{"[data, setData]"}</span>
          <span className="text-muted">{" = useState(null);"}</span>
          {"\n\n"}
          <span className="text-muted">{"const "}</span>
          <span className="text-foreground">{"load"}</span>
          <span className="text-muted">{" = async () => {"}</span>
          {"\n  "}
          <span className="text-foreground">{"setLoading(true);"}</span>
          {"\n  "}
          <span className="text-muted">{"const "}</span>
          <span className="text-foreground">{"res"}</span>
          <span className="text-muted">{" = "}</span>
          <span className="text-foreground">{"await"}</span>
          <span className="text-muted">{" fetch("}</span>
          <span className="text-bulb">{`"/api/dashboard"`}</span>
          <span className="text-muted">{");"}</span>
          {"\n  "}
          <span className="text-foreground">{"setData(await res.json());"}</span>
          {"\n  "}
          <span className="text-foreground">{"setLoading(false);"}</span>
          {"\n"}
          <span className="text-muted">{"};"}</span>
          {"\n\n"}
          <span className="text-muted">{"<"}</span>
          <span className="text-foreground">{"GameLoader"}</span>
          <span className="text-muted">{" loading={"}</span>
          <span className="text-foreground">{"loading"}</span>
          <span className="text-muted">{"} game="}</span>
          <span className="text-bulb">{`"${game}"`}</span>
          <span className="text-muted">{" size="}</span>
          <span className="text-bulb">{`"${size}"`}</span>
          <span className="text-muted">{">"}</span>
          {"\n  "}
          <span className="text-foreground">{"<Dashboard data={data} />"}</span>
          {"\n"}
          <span className="text-muted">{"</"}</span>
          <span className="text-foreground">{"GameLoader"}</span>
          <span className="text-muted">{">"}</span>
        </code>
      </pre>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink border border-rule rounded-md p-2.5">
      <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-bulb">
        {label}
      </p>
      <p className="font-display text-lg mt-0.5">{value}</p>
    </div>
  );
}
