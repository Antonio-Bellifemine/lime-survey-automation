import { test, expect } from '../../../base';
import { checkVisibility, getSurveyIdFromParticipantSurveyUrl } from '../../../utils/helpers';
import { generateRandomUser } from '../../../utils/userInterface';

let surveyId: string;
let surveyName = "test"

async function verifySurveyElements(page) {
    // Combine repeated button visibility checks into one reusable function
    const activeSurveyElements = [
        page.getByRole('button', { name: 'Submit' }),
        page.getByRole('button', { name: 'Previous' }),
        page.getByRole('link', { name: 'Resume later' }),
        // validates the progress percentage bar is visible but wildcards the actual percentage.
        page.getByText(/\d+%/).nth(1)
    ];
    await checkVisibility(activeSurveyElements);
}

test.beforeEach(async ({ page, Pom }) => {
    await page.goto(process.env.BASE_URL);
    await Pom.activeSurvey.openActiveSurvey(surveyName);
    surveyId = await getSurveyIdFromParticipantSurveyUrl(page.url());
});

test.describe('Survey Participation', () => {

    test('validate a user can create participate in an active survey', async ({ page, Pom }) => {
        let headerSurveyName = await page.getByRole('heading').textContent();
        await expect(page.getByRole('heading', { name: `${headerSurveyName}` })).toHaveText(surveyName);
        await expect(page.getByText('There is 1 question in this survey.')).toBeVisible();
        await Pom.activeSurvey.startSurvey();
        await page.getByRole('textbox', { name: 'hello please answer yes or no' }).fill('Yes');
        await Pom.activeSurvey.submitButton.click();
        await expect(page.getByText('Thank you!')).toBeVisible();
        await expect(page.getByText('Your survey responses have been recorded.')).toBeVisible();
    });

    // Note: This test combines saving and continuing a survey into a single test case rather than following the single assertion principle.
    // Why? We’re testing an end-to-end user journey (save → continue) to ensure the full flow works with a single user, minimizing test data generation in the backend.
    // Separate tests could generate redundant users, cluttering the database, and wouldn’t directly validate the save-to-load continuity we need.
    test('validate a user can save and continue progress on survey', async ({ page, Pom }) => {
        // Generate a single random user to use throughout the test, ensuring consistency between save and load actions
        const user = generateRandomUser();

        // Step 1: Simulate starting a survey and saving progress
        // Check the save finished survey page modal to confirm the UI prompts the user correctly
        const saveFinishedSurveyModal = [
            page.getByText('Save your unfinished survey'),
            page.getByText('Enter a name and password for this survey and click save below.'),
            page.getByText('Your survey will be saved using that name and password, and can be completed later by logging in with the same name and password.'),
            page.getByText('If you give an email address, an email containing the details will be sent to you.'),
            page.getByText('After having clicked the save button you can either close this browser window or continue filling out the survey.'),
            page.getByText('To remain anonymous please use a pseudonym as your username, also an email address is not required.')
        ];
        // Begin the survey
        await Pom.activeSurvey.startSurvey();
        // Trigger the "save later" action
        await Pom.activeSurvey.resumeLaterButton.click();
        // Verify the save modal appears with all expected elements
        await checkVisibility(saveFinishedSurveyModal);
        // Save the survey with the generated user’s credentials
        await Pom.activeSurvey.saveActiveSurvey(user);
        // Confirm save success message
        await expect(page.getByText('Your survey was successfully saved. Close')).toBeVisible();
        // Navigate to resume later option
        await Pom.activeSurvey.resumeLaterButton.click();
        // Verify success tooltip
        await expect(page.getByRole('tooltip', { name: 'Success Your responses were successfully saved.' })).toBeVisible();

        // Attempt to load the previously saved survey with the same user
        await Pom.activeSurvey.loadUnfinishedSurvey(user, surveyId);
        await verifySurveyElements(page);

    });


});

