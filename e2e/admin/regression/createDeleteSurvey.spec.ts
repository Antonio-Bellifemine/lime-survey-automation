import { test, expect } from '../../../base';
import { checkVisibility, getSurveyIdFromUrlParams } from '../../../utils/helpers';


let surveyId: string;

test.beforeEach(async ({ page, Pom }) => {
  await page.goto('');
});

test.describe('Create & Delete scenarios', () => {

  test('validate a user can create a survey, it\'s visible in the surveys list', async ({ page, Pom }) => {
    surveyId = await Pom.surveysList.createSurvey();
    // console.log("HERE!!!==>", surveyId); // debug
    // await expect(page.getByText('Your new survey was created.')).toBeVisible();
    await Pom.surveyEdit.goToSurveysListPageViaBreadcrumb();
    await page.getByRole('link', { name: 'Inactive' }).first().isVisible()
    // the new survey should be visible
    await expect(page.getByRole('cell', { name: surveyId, exact: true })).toBeVisible();
    // the new survey should be inactive by default
    await expect(page.getByRole('link', { name: 'Inactive' }).first()).toBeVisible();
    // delete the survey 
    await Pom.ajaxRequests.deleteMultipleSurveys([surveyId]);
  });

  test('validate a user can delete a survey', async ({ page, Pom }) => {
    await Pom.ajaxRequests.createSurvey("QA-AUTO-TEST-DELETE-SURVEY");
    await page.reload();
    await expect(page.getByRole('cell', { name: 'QA-AUTO-TEST-DELETE-SURVEY' })).toBeVisible();
    await Pom.surveysList.newestSurveyCheckbox.check();
    await Pom.surveysList.editSelectedSurveyButton.click();
    await Pom.surveysList.deleteNewestSurveyButton.click();
    await Pom.surveysList.deleteSruveyModalButton.click();
    await Pom.surveysList.closeDeletedSurveyModal.click();
    await page.reload();
    await expect(page.getByRole('cell', { name: 'QA-AUTO-TEST-DELETE-SURVEY' })).toBeHidden();
  });

});
