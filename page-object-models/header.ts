
import { expect, Locator, Page } from '../base';

export class Header {

    readonly page: Page;
    limeSurveyHomeButton: Locator;



    constructor(page: Page) {
        this.page = page;
        this.limeSurveyHomeButton =  page.getByRole('link', { name: 'LimeSurvey', exact: true });
    };



    goToSurveysListPageViaLimeSurveyHeaderButton = async () => {
        this.limeSurveyHomeButton.click();
    }
}
export default Header;