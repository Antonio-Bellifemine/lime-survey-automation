import { Locator, Page, expect } from '../base';
import { clickWithRetry, getSurveyIdFromUrlParams } from '../utils/helpers';
import path from 'path';

export class SurveysList {

  readonly page: Page;
  userAvatarSettingsButton: Locator;
  editSelectedSurveyButton: Locator;
  surveyActionBar: Locator;
  createNewSurveyButton: Locator;
  surveyTitleInput: Locator;
  createSurveyButton: Locator;
  newestSurveyCheckbox: Locator;
  editSelectedSurveysButton: Locator;
  deleteNewestSurveyButton: Locator;
  deleteSruveyModalButton: Locator;
  closeDeletedSurveyModal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userAvatarSettingsButton = page.getByRole('button', { name: 'A antonio.bellifemine' });
    this.surveyActionBar = page.locator('.survey-actionbar');
    this.createNewSurveyButton = page.getByRole('link', { name: 'Create survey' });
    this.surveyTitleInput = page.getByLabel('Survey title:', { exact: true });
    this.createSurveyButton = page.getByRole('button', { name: 'Create survey' });
    this.newestSurveyCheckbox = page.locator('#sid_0');
    this.editSelectedSurveyButton = page.getByRole('button', { name: 'Edit selected surveys' });
    this.deleteNewestSurveyButton = page.getByRole('link', { name: 'Delete' });
    this.deleteSruveyModalButton = page.getByRole('button', { name: 'Delete' });
    this.closeDeletedSurveyModal = page.locator('#massive-actions-modal-survey-grid-delete-0').getByRole('button');
  };


  createSurvey = async (surveyName?: string) => {
    const name = surveyName ? surveyName : 'QA-AUTO-TEST';
    await this.createNewSurveyButton.click();
    await this.surveyTitleInput.fill(name);
    await this.createSurveyButton.click();
    await this.page.waitForURL(/surveyid=\d+/);
    return await getSurveyIdFromUrlParams(this.page.url());
  };

  importSurvey = async (fileName: string) => {
    await expect(this.createNewSurveyButton).toBeVisible();
    await this.createNewSurveyButton.click();
    await this.page.getByRole('tab', { name: 'Import' }).click();
    await this.page.getByLabel('Select survey structure file').setInputFiles(path.join(__dirname, '..', 'utils', 'survey-import-files', `${fileName}`));
    await this.page.getByRole('button', { name: 'Import survey' }).click();
    await this.page.waitForURL('**/surveyAdministration/copy');
  };

  deleteNewestSurvey = async () => {
    await this.waitForDashboardView();
    await this.newestSurveyCheckbox.check();
    await clickWithRetry(this.page, this.editSelectedSurveyButton);
    await this.deleteNewestSurveyButton.click();
    await this.deleteSruveyModalButton.click();
    await this.closeDeletedSurveyModal.click();
  };

  searchForSurveyViaSurveyId = async (surveyId: string) => {
    await this.page.getByPlaceholder('Search').click();
    await this.page.getByPlaceholder('Search').fill(surveyId);
    await this.page.getByPlaceholder('Search').press('Enter');
  };

  openSurveyEditPageBySurveyId = async (surveyId?: string) => {
    const el = this.page.getByRole('cell', { name: surveyId })
    await el.isVisible()
    await el.click();
  };

  waitForDashboardView = async () => {
    await this.page.waitForURL(url => url.pathname === '/index.php/dashboard/view', { timeout: 5000 });
  }

};
export default SurveysList;