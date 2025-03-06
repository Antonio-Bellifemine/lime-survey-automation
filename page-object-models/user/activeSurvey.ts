
import { expect, Locator, Page } from '../../base';
import { User } from '../../utils/userInterface';

export class ActiveSurvey {

    readonly page: Page;
    limeSurveyHomeButton: Locator;
    startSurveyButton: Locator;
    resumeLaterButton: Locator;
    loadUnfinishedSurveyButton: Locator;
    returnToSurveyButton: Locator;
    submitButton: Locator
    previousButton: Locator;
    surveyPercentageBar: Locator

    constructor(page: Page) {
        this.page = page;
        this.startSurveyButton = page.getByRole('button', { name: 'Next' });
        this.resumeLaterButton = page.getByRole('link', { name: 'Resume later' });
        this.loadUnfinishedSurveyButton = page.getByRole('link', { name: 'Load unfinished survey' });
        this.returnToSurveyButton = page.getByRole('link', { name: 'Return to survey' });
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.previousButton = page.getByRole('button', { name: 'Previous' });
        this.surveyPercentageBar = page.getByText(/^\d+%$/);
    };



    openActiveSurvey = async (surveyName: string) => {
        await this.page.getByRole('link', { name: surveyName, exact: true }).click();
    };

    startSurvey = async () => {
        await this.startSurveyButton.click();
    };

    saveActiveSurvey = async (user: User) => {
        const { firstName, lastName, password, email } = user;
        const hidden = await this.returnToSurveyButton.isHidden();
        if (hidden) {
            await this.resumeLaterButton.click();
        };

        await this.page.getByRole('textbox', { name: 'Name: Mandatory' }).fill(`QA-AUTO-${firstName}-${lastName}`);
        await this.page.getByRole('textbox', { name: 'Password: Mandatory', exact: true }).fill(password);
        await this.page.getByRole('textbox', { name: 'Repeat password: Mandatory' }).fill(password);
        await this.page.getByRole('textbox', { name: 'Your email address:' }).fill(email);
        await this.page.getByRole('button', { name: 'Save now' }).click();
        await this.page.getByRole('link', { name: 'Close' }).click();
    };

    openSpecificSurveyBySurveyId = async (surveyId: string) => {
        await this.page.goto(`${process.env.BASE_URL}/index.php/${surveyId}`);
    };

    loadUnfinishedSurvey = async (user: User, surveyId: string) => {
        await this.page.context().clearCookies();
        await this.openSpecificSurveyBySurveyId(surveyId)
        const { firstName, lastName, password } = user;
        const hidden = await this.returnToSurveyButton.isHidden();
        if (hidden) {
            await this.loadUnfinishedSurveyButton.click();
        };
        await this.page.locator('#loadname').fill(`QA-AUTO-${firstName}-${lastName}`);
        await this.page.getByRole('textbox', { name: 'Password: Mandatory' }).fill(password);
        await this.page.getByRole('button', { name: 'Load now' }).click();
    };

}
export default ActiveSurvey;