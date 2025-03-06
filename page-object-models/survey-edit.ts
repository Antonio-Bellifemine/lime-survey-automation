import { expect, Locator, Page, step } from '../base';

export class SurveyEdit {

  readonly page: Page;
  userAvatarSettingsButton: Locator;
  editSelectedSurveyButton: Locator;
  surveyActionBar: Locator;
  surveyStructure: Locator;
  surveyListPageBreadcrumb: Locator;


  constructor(page: Page) {
    this.page = page;
    this.userAvatarSettingsButton = page.getByRole('button', { name: 'A antonio.bellifemine' });
    this.editSelectedSurveyButton = page.getByText('Edit selected surveys Delete');
    this.surveyActionBar = page.locator('.survey-actionbar');
    this.surveyListPageBreadcrumb = page.getByRole('heading', { name: 'Breadcrumb' }).locator('#breadcrumb__surveylist--link');

  };


  deleteSurvey = async (surveyId: string) => {
    // await this.page.waitForURL(url => url.searchParams.has('iSurveyID'));
    await this.page.getByRole('button', { name: 'Tools' }).click();
    await this.page.getByRole('link', { name: 'Delete survey' }).click();
    await expect(this.page.getByRole('heading', { name: 'Delete survey' })).toBeVisible();
    await expect(this.page.getByText('Warning')).toBeVisible();
    await expect(this.page.getByText('You are about to delete this')).toBeVisible();
    await expect(this.page.getByText(`You are about to delete this survey (${surveyId}) This process will delete this`)).toBeVisible();
    await this.page.getByRole('button', { name: 'Delete survey' }).click();
    //  await expect(this.page.getByText('Survey deleted.')).toBeVisible();  
  };


  getQuestionGroupQuestionCount = async (questionGroupName: string, numberOfExpectedQuestions: string, questionGroupListOrder?: number) => {
    let number = questionGroupListOrder ? questionGroupListOrder : 1;
    return this.page.locator('li').filter({ hasText: `${questionGroupName} ${numberOfExpectedQuestions}` }).locator('i').nth(number);
  };

  goToSurveysListPageViaBreadcrumb = async () => {
    await this.surveyListPageBreadcrumb.click();
  };

};
export default SurveyEdit;