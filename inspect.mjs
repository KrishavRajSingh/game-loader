import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3000/dino", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
// Get the SVG content
const html = await page.evaluate(() => {
  const svg = document.querySelector("svg[viewBox='0 0 600 150']");
  return svg ? svg.outerHTML.slice(0, 3000) : "no svg";
});
console.log(html);
await browser.close();
