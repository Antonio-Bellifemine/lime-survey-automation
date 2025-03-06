import { test, expect } from '../../../base';
import { type Browser } from '@playwright/test';
import { checkVisibility, getSurveyIdFromUrlParams } from '../../../utils/helpers';


let surveyId: string;

test.beforeEach(async ({ page, Pom }) => {
  await page.goto('');

});

test.describe('Activate Survey Scenario(s)', () => {

  test('activated survey is visible on publication index page', async ({ page, Pom }) => {
    await Pom.surveysList.importSurvey("limesurvey_survey_735837.lss");
    await page.getByRole('button', { name: 'Go to survey' }).click();
    await page.waitForURL(url => url.searchParams.has('surveyid'));
    surveyId = await getSurveyIdFromUrlParams(page.url());
    // console.log("HERE!!!==>", surveyId); // debug
    await Pom.header.goToSurveysListPageViaLimeSurveyHeaderButton();
    await Pom.surveysList.openSurveyEditPageBySurveyId(surveyId);
    await page.getByRole('link', { name: 'Publication & access' }).click();
    const publicSurveyIndexPageOn = page.locator('#listpublic').getByText('On');
    // this validates the metadata form the .lss import also impirted the existing setting for publication on index page to be on
    await expect(publicSurveyIndexPageOn).toHaveCSS('background-color', 'rgb(51, 54, 65)');
    await page.getByRole('button', { name: 'Activate survey' }).click();
    await page.getByRole('button', { name: 'Save and activate' }).click();
    await page.goto(process.env.BASE_URL);
    const activatedSurveyIsVisible = page.getByRole('link', { name: 'QA-AUTO-Sample_Questions' });
    await expect(activatedSurveyIsVisible).toBeEnabled();
    await expect(activatedSurveyIsVisible).toBeVisible();
  });

});

test.afterEach(async ({ Pom }) => {
  await Pom.ajaxRequests.deleteMultipleSurveys([surveyId]);
});
