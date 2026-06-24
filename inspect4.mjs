import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 700 } });
await page.goto("http://localhost:3000/dino", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
// Click the SVG to start
await page.locator("svg[viewBox='0 0 600 150']").click();
await page.waitForTimeout(3000);
await page.screenshot({ path: "shots/dino-running.png" });
await page.waitForTimeout(2000);
await page.screenshot({ path: "shots/dino-running2.png" });
await browser.close();
console.log("done");
