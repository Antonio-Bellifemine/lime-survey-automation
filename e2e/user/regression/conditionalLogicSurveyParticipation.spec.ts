import { test, expect, Page } from '../../../base';
import { checkVisibility, validateElementsAreNotVisible, getSurveyIdFromParticipantSurveyUrl } from '../../../utils/helpers';

let surveyId: string = "954844"
const sharedHealthConditions = [
    'cancer',
    'diabetes',
    'heart disease',
    'obesity',
    'mental health conditions',
    'autoimmune conditions',
    'arthritis',
    'ADHD/ADD',
    'asthma',
    'eczema or other skin condition',
]

function getHealthConditionLocators(page: Page, donor: string, conditions: string[]) {
    let healthOrHistory = donor === "sperm" ? "health" : "history";

    const baseLocator = page.getByLabel(`If the ${donor} donor\'s ${healthOrHistory}`);
    return conditions.map(condition => baseLocator.getByText(condition));
};

function checkConditionVisibility(locator) {
    Promise.all(locator.map(locator => expect(locator).toBeVisible()));
};

test.beforeEach(async ({ page, Pom }) => {
    await page.goto(`${process.env.BASE_URL}/index.php/${surveyId}`);
    await Pom.activeSurvey.startSurvey();
});


test.describe('Survey conditional Logic page 1', () => {

    test('validate user can not go to next page without required answers', async ({ page, Pom }) => {
        await page.getByLabel('Mother\'s Pregnancy History Please provide information about the BIRTH MOTHER\'s').selectOption('AO03');
        await page.getByLabel('Number of pregnancies AFTER').selectOption('AO04');
        await page.getByLabel('Number of miscarriages PRIOR').selectOption('AO13');
        await page.getByLabel('Number of miscarriages AFTER').selectOption('AO01');
        await page.getByRole('textbox', { name: 'Please indicate if there was' }).click();
        await page.getByRole('textbox', { name: 'Please indicate if there was' }).fill('testing');
        await page.getByLabel('Total number of live births:').selectOption('AO03');
        await page.getByLabel('Total number of still births:').selectOption('AO01');
        await page.getByLabel('Total number of abortions:').selectOption('AO13');
        await page.getByRole('textbox', { name: 'Please provide any additional' }).fill('QA-Auto Testing');
        await page.getByRole('radiogroup', { name: 'Is the conception history of' }).getByLabel('yes').check();
        await page.getByRole('button', { name: 'Next' }).click();
        await expect(page.getByText('One or more required questions have not been answered. You cannot proceed until these have been completed.')).toBeVisible();
        await page.locator('#bootstrap-alert-box-modal button').click();
    });

    test('validate 1st conditional question (Number of miscarriages Prior the birth of this child)', async ({ page, Pom }) => {
        // first conditional question
        const conditionElements = [
            page.locator('#question28062 div').filter({ hasText: 'first trimester second' }).first(),
            page.locator('#question28146 div').filter({ hasText: 'first trimester second' }).first(),
        ];
        await page.getByLabel('Number of miscarriages PRIOR').selectOption('AO03');
        await checkVisibility(conditionElements);
    });

    test('validate 2nd conditional question (Number of miscarriages AFTER the birth of this child)', async ({ page, Pom }) => {
        const conditionElements = [
            page.locator('#question28066 div').filter({ hasText: 'first trimester second' }).first(),
            page.locator('#question28155 div').filter({ hasText: 'first trimester second' }).first(),
            page.locator('#question28156 div').filter({ hasText: 'first trimester second' }).first(),
            page.locator('#question28157 div').filter({ hasText: 'first trimester second' }).first(),
            page.locator('#question28158 div').filter({ hasText: 'first trimester second' }).first()
        ];
        await page.getByLabel('Number of miscarriages AFTER').selectOption('AO06');
        await checkVisibility(conditionElements);
    });

    test('validate 3rd conditional question (Egg Donor Health History Note)', async ({ page, Pom }) => {
        const healthConditions = [
            ...sharedHealthConditions,
            'don\'t know egg donor\'s'
        ];
        const locators = getHealthConditionLocators(page, "egg", healthConditions);

        const conditionElements = [
            page.locator('#question28136 div').filter({ hasText: 'Please indicate which of the' }).first(),
            page.getByText('egg donor was a blood relative'),
            page.getByText('egg donor\'s health history is'),
        ];

        await page.getByRole('radiogroup', { name: 'Egg Donor Health History Note' }).getByLabel('yes').check();
        await checkVisibility(conditionElements);
        await checkConditionVisibility(locators);
        await page.getByRole('radiogroup', { name: 'Egg Donor Health History Note' }).getByLabel('no', { exact: true }).check();
        await validateElementsAreNotVisible(conditionElements);
        await page.getByRole('radiogroup', { name: 'Egg Donor Health History Note' }).getByLabel('don\'t know').check();
        await validateElementsAreNotVisible(conditionElements);

    });

    test('validate 4th conditional question (Sperm Donor Health History Note)', async ({ page, Pom }) => {


        const healthConditions = [
            ...sharedHealthConditions,
            'other health condition'
        ];
        const locators = getHealthConditionLocators(page, "sperm", healthConditions);

        const conditionElements = [
            page.getByText('Please indicate which of the following apply to the sperm donor:'),
            page.getByText('sperm donor was a blood'),
            page.getByText('sperm donor\'s health history is unknown'),
            page.getByText('If the sperm donor\'s health history is known, please answer the following questions.'),
            page.getByText('Did the sperm donor have a history of any of the following?')
        ];

        await page.getByRole('radiogroup', { name: 'Sperm Donor Health History' }).getByLabel('yes').check();
        await checkVisibility(conditionElements);
        checkConditionVisibility(locators);

        await page.getByLabel('If the sperm donor\'s health').getByText(healthConditions[10]).click();

        const spermDonorOtherHealthElements = [
            page.getByText('Sperm donor\'s other health'),
            page.getByRole('textbox', { name: 'Sperm donor\'s other health' })
        ]

        await checkVisibility(spermDonorOtherHealthElements)
        await page.getByLabel('If the sperm donor\'s health').getByText(healthConditions[10]).click();
        await page.getByLabel('If the sperm donor\'s health').getByText(healthConditions[1]).click();
        await validateElementsAreNotVisible(spermDonorOtherHealthElements);

    });
});

//TODO page 2 conditional logic
test.describe('Survey conditional Logic page 2', () => { });