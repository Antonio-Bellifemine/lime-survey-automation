import { expect, type Locator, type Page, test } from '@playwright/test';

const { USERNAME, PASSWORD, OKTA_USERNAME, ADMIN_BASE_URL } = process.env;


export class Auth {

  readonly page: Page;
  private baseURL: string;
  oktaSignInButton: Locator;
  limeSurveyLoginButton: Locator;
  usernameInput: Locator;
  passwordInput: Locator;
  signInButton: Locator;
  logoutButton: Locator;
  contactUsButton: Locator;
  oktaLoginLogo: Locator;
  oktaSignInLandingPage: Locator;




  constructor(page: Page) {
    this.page = page;
    this.baseURL = `${ADMIN_BASE_URL}`;
    this.oktaSignInButton = page.getByRole('button', { name: 'Sign in' });
    this.limeSurveyLoginButton = page.getByRole('button', { name: 'Log in' });
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.signInButton = page.getByRole('button', { name: 'submit' });
    this.logoutButton = page.getByRole('button', { name: 'LOG OUT' });
    this.contactUsButton = page.getByRole('button', { name: 'CONTACT US' });
    this.oktaLoginLogo = page.locator('.okta-sign-in-header');
    this.oktaSignInLandingPage = page.getByText('Sign in with your account to');

  };

  async adminLimeSurveyLogin() {
    await this.page.goto(this.baseURL);
    if (await this.oktaLoginLogo.isVisible() === true) {
      await this.adminOktaLogin();
    }
    
    // Then, wait for the button to be enabled
    await expect(this.limeSurveyLoginButton).toBeEnabled();
    await this.usernameInput.fill(`${ USERNAME }`);
    await this.passwordInput.fill(`${ PASSWORD }`);
    await this.limeSurveyLoginButton.click();
  };

  async adminOktaLogin() {
    await this.usernameInput.fill(`${ OKTA_USERNAME }`);
    await this.passwordInput.fill(`${ PASSWORD }`);
    await this.oktaSignInButton.click();
  };

};
export default Auth;