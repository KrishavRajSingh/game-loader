import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 600 } });
await page.goto("http://localhost:3000/dino", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: "shots/dino-fresh.png" });
const info = await page.evaluate(() => {
  const svg = document.querySelector("svg[viewBox='0 0 600 150']");
  if (!svg) return "no svg";
  const r = svg.getBoundingClientRect();
  const trex = svg.querySelector("g[transform^='translate(']");
  const trexBBox = trex ? trex.getBoundingClientRect() : null;
  return {
    svgRect: { x: r.x, y: r.y, w: r.width, h: r.height },
    trexRect: trexBBox ? { x: trexBBox.x, y: trexBBox.y, w: trexBBox.width, h: trexBBox.height } : null,
    trexTransform: trex?.getAttribute("transform"),
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
