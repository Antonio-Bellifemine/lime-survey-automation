import { test, expect } from '../../../base';
import { checkVisibility, getSurveyIdFromUrlParams } from '../../../utils/helpers';


let surveyId: string;

test.beforeEach(async ({ page, Pom }) => {
  await page.goto('');

});

test.describe('Import Scenarios', () => {

  test('Import .lss files - validate imported stats & check visibility on surveys list page', async ({ page, Pom }) => {
    await Pom.surveysList.importSurvey("limesurvey_survey_735837.lss");

    const importSuccessElements =
      [
        page.getByRole('heading', { name: 'Success' }),
        page.getByText('Survey structure import'),
        page.getByRole('cell', { name: '1' }).first(),
        page.getByRole('cell', { name: '1' }).nth(1),
        page.getByRole('cell', { name: '3' }),
        page.getByRole('cell', { name: '20' }),
        page.getByRole('cell', { name: '746' }),
        page.getByRole('cell', { name: '74', exact: true }),
        page.getByRole('cell', { name: '94' }),
        page.getByRole('cell', { name: '0', exact: true }).first(),
        page.getByRole('cell', { name: '0', exact: true }).nth(1),
        page.getByRole('cell', { name: '0', exact: true }).nth(2),
        page.getByRole('cell', { name: '0', exact: true }).nth(3),
        page.getByRole('cell', { name: '0', exact: true }).nth(4),
        page.getByRole('cell', { name: '2', exact: true }),
        page.getByText('Import of survey is completed.')
      ];

    await checkVisibility(importSuccessElements);

    await page.getByRole('button', { name: 'Go to survey' }).click();
    surveyId = await getSurveyIdFromUrlParams(page.url());
    await Pom.header.goToSurveysListPageViaLimeSurveyHeaderButton();
    await expect(page.getByRole('cell', { name: surveyId })).toBeVisible();
    // console.log("HERE!!!==>", surveyId); // debug
  });

});

test.afterEach(async ({ Pom }) => {
  await Pom.ajaxRequests.deleteMultipleSurveys([surveyId]);
});
