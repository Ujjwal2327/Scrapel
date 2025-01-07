import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import { TaskParamName } from "@/lib/types";

export async function launchBrowserExecutor(environment) {
  const websiteUrl = environment.getInput(TaskParamName.WebsiteUrl);
  if (!websiteUrl) throw new Error(`${TaskParamName.WebsiteUrl} not provided.`);

  const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

  let browser;
  if (!DEV_MODE) {
    const executablePath = await chromium.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar"
    );
    browser = await puppeteerCore.launch({
      executablePath,
      args: chromium.args,
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport,
    });
  } else {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  // const browser = await puppeteer.launch({
  //   headless: true, // Run in headless mode
  //   args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for Vercel
  //   executablePath:
  //     process.env.CHROME_EXECUTABLE_PATH || puppeteer.executablePath(), // Path to Chrome
  // });

  // console.log(
  //   "Using Puppeteer's bundled Chromium executable:",
  //   puppeteer.executablePath()
  // );

  environment.log.info("Browser launched successfully.");
  environment.setBrowser(browser);

  const page = await browser.newPage();
  await page.goto(websiteUrl);
  environment.setPage(page);

  environment.log.info(`Successfully opened the page: "${websiteUrl}".`);
}
