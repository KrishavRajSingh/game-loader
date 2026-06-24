import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 700 } });
// Clear hi-score to start fresh
await page.goto("http://localhost:3000/dino", { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.removeItem("game-loader:dino:hi"));
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.locator("svg[viewBox='0 0 600 150']").click();
// Run for a bit
await page.waitForTimeout(1500);
await page.screenshot({ path: "shots/dino-run1.png" });
await page.waitForTimeout(500);
await page.screenshot({ path: "shots/dino-run2.png" });
await page.waitForTimeout(500);
await page.screenshot({ path: "shots/dino-run3.png" });
// Now jump
await page.keyboard.press("Space");
await page.waitForTimeout(150);
await page.screenshot({ path: "shots/dino-jump1.png" });
await page.waitForTimeout(300);
await page.screenshot({ path: "shots/dino-jump2.png" });
await browser.close();
console.log("done");
