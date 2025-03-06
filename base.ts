import { test as base, Locator, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import {
  Auth,
  SurveysList,
  Header,
  SurveyEdit,
  ActiveSurvey,
  AjaxRequests,
} from './index.js';






// Define a type for the Pom fixture containing all the page objects
type PomFixture = {
  auth: Auth;
  surveysList: SurveysList;
  header: Header;
  surveyEdit: SurveyEdit;
  activeSurvey: ActiveSurvey;
  ajaxRequests: AjaxRequests
};

// Extend the base test to include the shared Pom fixture
export const test = base.extend<{ Pom: PomFixture }>({
  Pom: async ({ page }, use) => {

    const Pom = {
      auth: new Auth(page),
      surveysList: new SurveysList(page),
      header: new Header(page),
      surveyEdit: new SurveyEdit(page),
      activeSurvey: new ActiveSurvey(page),
      ajaxRequests: new AjaxRequests(page),
    }
    await use(Pom);
  },
});





/**
 * Decorator function for wrapping POM methods in a test.step.
 *
 * Use it without a step name `@step()`.
 *
 * Or with a step name `@step("Search something")`.
 *
 * @param stepName - The name of the test step.
 * @returns A decorator function that can be used to decorate test methods.
 */
export function step(stepName?: string) {
  return function decorator(
    target: Function,
    context: ClassMethodDecoratorContext
  ) {
    return function replacementMethod(...args: any) {
      const name = `${stepName || (context.name as string)} (${this.name})`
      return test.step(name, async () => {
        return await target.call(this, ...args)
      })
    }
  }
};

export { expect, Locator, Page, chromium } from '@playwright/test';
export { fs, path }