import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3000/dino", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.locator("svg[viewBox='0 0 600 150']").click();
await page.waitForTimeout(1000);
const result = await page.evaluate(() => {
  const svg = document.querySelector("svg[viewBox='0 0 600 150']");
  if (!svg) return "no svg";
  const trex = svg.querySelector("g[transform^='translate(50']");
  if (!trex) return "no trex group";
  const bbox = trex.getBoundingClientRect();
  const rect = svg.getBoundingClientRect();
  return {
    trexTransform: trex.getAttribute("transform"),
    trexBBox: { x: bbox.x, y: bbox.y, w: bbox.width, h: bbox.height },
    svgBBox: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
    innerHTML: trex.innerHTML.slice(0, 500),
  };
});
console.log(JSON.stringify(result, null, 2));
await browser.close();
