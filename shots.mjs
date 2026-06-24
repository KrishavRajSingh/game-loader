// quick screenshot script for visual verification
import { chromium } from "playwright";

const routes = [
  { path: "/", name: "home" },
  { path: "/dino", name: "dino" },
  { path: "/snake", name: "snake" },
  { path: "/pong", name: "pong" },
  { path: "/sandbox", name: "sandbox" },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  reducedMotion: "no-preference",
});
const page = await ctx.newPage();

for (const r of routes) {
  await page.goto(`http://localhost:3000${r.path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `shots/${r.name}.png`, fullPage: r.name === "home" });
  console.log(`shot ${r.name}: shots/${r.name}.png`);
}

await browser.close();
