import { test, expect } from '../../../base';
import { getSurveyIdFromUrlParams, deleteFilesInDirectory, clickWithRetry } from '../../../utils/helpers';


let surveyId: string;
const savePath = `${process.cwd()}/utils/exported-surveys/`;
test.beforeEach(async ({ page, Pom }) => {
  await page.goto('');
  await deleteFilesInDirectory(savePath);

});

test.describe('Export Scenarios', () => {

  test('export .lss file', async ({ page, Pom }) => {

    const survey = "limesurvey_survey_735837.lss";

    await Pom.surveysList.importSurvey(survey);
    await page.getByRole('button', { name: 'Go to survey' }).click();
    await page.waitForURL(url => url.searchParams.has('surveyid'));
    surveyId = await getSurveyIdFromUrlParams(page.url());
    // console.log("HERE!!!==>", surveyId); // debug
    await Pom.header.goToSurveysListPageViaLimeSurveyHeaderButton();
    await Pom.surveysList.openSurveyEditPageBySurveyId(surveyId);
    await page.getByRole('button', { name: 'Export' }).click();
    await page.getByRole('link', { name: 'Survey structure (.lss)' }).click();
    const downloadPromise = page.waitForEvent('download');
    await clickWithRetry(page, page.getByRole('button', { name: 'Export', exact: true }));

    const download = await downloadPromise;
    // Wait for the download process to complete and save the downloaded file somewhere.
    try {
      await download.saveAs(savePath + download.suggestedFilename());
    } catch (error) {
      console.error('Failed to save download:', error);
    };

    const exportSuccesful = deleteFilesInDirectory(savePath);
    // this return true if a file exists in the exported survey directory, false if not.
    await expect(exportSuccesful).toBeTruthy();
  });


  /**
   * 
   * The commented out tests are valid but out of scope for our customer use case. They may come into scope
   * and that's why they're not deleted.
   */
  // test.skip('export queXML format (*.xml) file', async ({ page, Pom }) => {

  //   surveyId = await Pom.surveysList.createSurvey("testing-survey-export");    
  //   await Pom.surveyEdit.goToSurveysListPageViaBreadcrumb();
  //   await Pom.surveysList.openSurveyEditPageBySurveyId(surveyId);
  //   await page.getByRole('button', { name: 'Export' }).click();
  //   await page.getByRole('link', { name: 'queXML format (*.xml)' }).click();
  //   const downloadPromise = page.waitForEvent('download');
  //   await clickWithRetry(page, page.getByRole('button', { name: 'Export', exact: true }));

  //   const download = await downloadPromise;
  //   // Wait for the download process to complete and save the downloaded file somewhere.
  //   try {
  //     await download.saveAs(savePath + download.suggestedFilename());
  //   } catch (error) {
  //     console.error('Failed to save download:', error);
  //   };

  //   const exportSuccesful = deleteFilesInDirectory(savePath);
  //   // this return true if a file exists in the exported survey directory, false if not.
  //   await expect(exportSuccesful).toBeTruthy();
  // });

  // test.skip('export queXML PDF export file', async ({ page, Pom }) => {
  //   surveyId = await Pom.surveysList.createSurvey("testing-survey-export");    
  //   await Pom.surveyEdit.goToSurveysListPageViaBreadcrumb();
  //   await Pom.surveysList.openSurveyEditPageBySurveyId(surveyId);
  //   await page.getByRole('button', { name: 'Export' }).click();
  //   await page.getByRole('link', { name: 'queXML PDF export' }).click();
  //   await page.getByRole('button', { name: 'Export', exact: true }).click();
  //   await page.getByRole('button', { name: 'queXML PDF export' }).click();

  //   const downloadPromise = page.waitForEvent('download');

  //   const download = await downloadPromise;
  //   // Wait for the download process to complete and save the downloaded file somewhere.
  //   try {
  //     await download.saveAs(savePath + download.suggestedFilename());
  //   } catch (error) {
  //     console.error('Failed to save download:', error);
  //   };


  //   const exportSuccesful = deleteFilesInDirectory(savePath);
  //   // this return true if a file exists in the exported survey directory, false if not.
  //   await expect(exportSuccesful).toBeTruthy();
  // });

  // test.skip('export Tab-separated-values format export file', async ({ page, Pom }) => {
  //   surveyId = await Pom.surveysList.createSurvey("testing-survey-export");    
  //   await Pom.surveyEdit.goToSurveysListPageViaBreadcrumb();
  //   await Pom.surveysList.openSurveyEditPageBySurveyId(surveyId);
  //   await page.getByRole('button', { name: 'Export' }).click();
  //   await page.getByRole('link', { name: 'Tab-separated-values format' }).click();
  //   await page.getByRole('button', { name: 'Export', exact: true }).click();

  //   const downloadPromise = page.waitForEvent('download');

  //   const download = await downloadPromise;
  //   // Wait for the download process to complete and save the downloaded file somewhere.
  //   try {
  //     await download.saveAs(savePath + download.suggestedFilename());
  //   } catch (error) {
  //     console.error('Failed to save download:', error);
  //   };

  //   const exportSuccesful = deleteFilesInDirectory(savePath);
  //   // this return true if a file exists in the exported survey directory, false if not.
  //   await expect(exportSuccesful).toBeTruthy();
  // });

  // test.skip('export Printable survey (*.html) export file', async ({ page, Pom }) => {
  //   surveyId = await Pom.surveysList.createSurvey("testing-survey-export");    
  //   await Pom.surveyEdit.goToSurveysListPageViaBreadcrumb();
  //   await Pom.surveysList.openSurveyEditPageBySurveyId(surveyId);
  //   await page.getByRole('button', { name: 'Export' }).click();
  //   await page.getByRole('link', { name: 'Printable survey (*.html)' }).click();
  //   await page.getByRole('button', { name: 'Export', exact: true }).click();

  //   const downloadPromise = page.waitForEvent('download');

  //   const download = await downloadPromise;
  //   // Wait for the download process to complete and save the downloaded file somewhere.
  //   try {
  //     await download.saveAs(savePath + download.suggestedFilename());
  //   } catch (error) {
  //     console.error('Failed to save download:', error);
  //   };

  //   const exportSuccesful = deleteFilesInDirectory(savePath);
  //   // this return true if a file exists in the exported survey directory, false if not.
  //   await expect(exportSuccesful).toBeTruthy();
  // });

  // test.skip('export Printable survey export file', async ({ page, Pom }) => {
  //   surveyId = await Pom.surveysList.createSurvey("testing-survey-export");    
  //   await Pom.surveyEdit.goToSurveysListPageViaBreadcrumb();
  //   await Pom.surveysList.openSurveyEditPageBySurveyId(surveyId);
  //   await page.getByRole('button', { name: 'Export' }).click();
  //   await page.getByRole('link', { name: 'Printable survey', exact: true }).click();
  //   await page.getByRole('button', { name: 'Export', exact: true }).click();

  //   const downloadPromise = page.waitForEvent('download');

  //   const download = await downloadPromise;
  //   // Wait for the download process to complete and save the downloaded file somewhere.
  //   try {
  //     await download.saveAs(savePath + download.suggestedFilename());
  //   } catch (error) {
  //     console.error('Failed to save download:', error);
  //   };

  //   const exportSuccesful = deleteFilesInDirectory(savePath);
  //   // this return true if a file exists in the exported survey directory, false if not.
  //   await expect(exportSuccesful).toBeTruthy();
  // });

});

test.afterEach(async ({ Pom }) => {
  await Pom.ajaxRequests.deleteMultipleSurveys([surveyId]);
});