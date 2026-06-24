import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  reducedMotion: "no-preference",
});
const page = await ctx.newPage();

// 1. /dino default (waiting)
await page.goto("http://localhost:3000/dino", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: "shots/dino.png" });

// 2. /dino running (after one click). The mhasbini package renders a
// <canvas> inside `.interstitial-wrapper`, not the SVG our port used.
await page.locator(".interstitial-wrapper").click();
await page.waitForTimeout(2500);
await page.screenshot({ path: "shots/dino-running.png" });

// 3. /dino jumped
await page.keyboard.press("Space");
await page.waitForTimeout(120);
await page.screenshot({ path: "shots/dino-jumping.png" });
await page.waitForTimeout(800);

// 4. Force a crash by running for a long time without input, then capturing
await page.waitForTimeout(8000);
await page.screenshot({ path: "shots/dino-crashed.png" });

// 5. /dino night mode — clear hi-score, run with fast-forward via a long run
await page.evaluate(() => localStorage.removeItem("game-loader:dino:hi"));
await page.reload({ waitUntil: "networkidle" });
await page.locator(".interstitial-wrapper").click();
// Let the score climb to 700+
await page.waitForTimeout(20000);
await page.screenshot({ path: "shots/dino-night.png" });

// 6. Home page with the new dino in the hero
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.screenshot({ path: "shots/home.png", fullPage: true });

await browser.close();
console.log("done");
