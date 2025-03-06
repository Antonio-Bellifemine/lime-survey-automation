import { test, expect } from '../../../base';
import { checkVisibility } from '../../../utils/helpers';




// Reset storage state for this file to avoid being authenticated by global-auth.ts
test.use({ storageState: { cookies: [], origins: [] } });
let USERNAME;
({ USERNAME } = process.env); // Destructuring from process.env
USERNAME = USERNAME || "User Not Set"; // Fallback if undefined

// Use regex to extract the first letter of USERNAME
const regex = /^(.)/; // Matches the first character
const match = USERNAME.match(regex); // Find the match
const dynamicLetter = match[1].toUpperCase(); // First letter, uppercase, no default

test('validate a user can log in and lands on user dashboard', async ({ page, Pom }) => {
  await Pom.auth.adminLimeSurveyLogin();
  const userAvatarSettingsButton = page.getByRole('button', { name: `${dynamicLetter} ${USERNAME}` });
  const surveyActionBar = page.locator('.survey-actionbar');
  const editSelectedSurveyButton = page.getByText('Edit selected surveys Delete')

  await checkVisibility(userAvatarSettingsButton);
  await checkVisibility(surveyActionBar);
  await checkVisibility(editSelectedSurveyButton);
});
