import puppeteer from "puppeteer";
import { TaskParamName } from "@/lib/types";

export async function launchBrowserExecutor(environment) {
  const websiteUrl = environment.getInput(TaskParamName.WebsiteUrl);

  const browser = await puppeteer.launch({
    headless: true, // Run in headless mode
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for Vercel
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH || puppeteer.executablePath(), // Path to Chrome
  });

  console.log(
    "Using Puppeteer's bundled Chromium executable:",
    puppeteer.executablePath()
  );

  environment.log.info("Browser launched successfully.");
  environment.setBrowser(browser);

  const page = await browser.newPage();
  await page.goto(websiteUrl);
  environment.setPage(page);

  environment.log.info(`Successfully opened the page: "${websiteUrl}".`);
}
