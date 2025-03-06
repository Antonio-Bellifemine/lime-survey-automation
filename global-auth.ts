import { chromium, type FullConfig, expect } from '@playwright/test';
import Auth from "./page-object-models/auth";
const { PROJECT_NAME } = process.env;


async function globalSetup(config: FullConfig) {
  // Find the project by name
  const project = config.projects.find(p => p.name === PROJECT_NAME) || config.projects[0];
  const { storageState } = project.use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const auth = new Auth(page);

  await auth.adminLimeSurveyLogin()

  await page.context().storageState({ path: storageState as string });
  await browser.close();
}

export default globalSetup;
