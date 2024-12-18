import puppeteer from "puppeteer";
import { TaskParamName } from "@/lib/types";

// launch browser, goto page and save browser & page in environment
export async function launchBrowserExecutor(environment) {
  const websiteUrl = environment.getInput(TaskParamName.WebsiteUrl);

  const browser = await puppeteer.launch();
  environment.log.info("Browser launched successfully.");
  environment.setBrowser(browser);

  const page = await browser.newPage();
  await page.goto(websiteUrl);
  environment.setPage(page);

  environment.log.info(`Successfully opened the page: "${websiteUrl}".`);
}
