const fsp = require("fs").promises;
const path = require("path");
const puppeteer = require("puppeteer");

if (process.argv.length !== 4) {
  console.error("Usage: npm run export [url] [output-dir]");
  process.exit(1);
}

let url = process.argv[2];
const outputDirectory = process.argv[3];

(async () => {
  await fsp.mkdir(outputDirectory, { recursive: true });
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  let goingOn = true;
  let slide = 1;
  console.log(`▶️  Exporting all slides to ${outputDirectory}`);
  await page.goto(url);
  while (goingOn) {
    const paddedSlide =
      "0".repeat(2 - Math.floor(Math.log10(slide))) + slide.toString();
    console.log(`   📸 Exporting slide ${slide}…`);
    await page.screenshot({
      path: path.join(outputDirectory, `slide${paddedSlide}.png`)
    });
    slide++;
    await page.keyboard.press("Space");
    goingOn = url !== page.url();
    url = page.url();
  }
  await browser.close();
  console.log("✅ Done");
})();
