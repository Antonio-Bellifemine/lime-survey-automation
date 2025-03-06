import { expect, type Locator, fs, path } from "../base";
import 'dotenv/config';

/**
 * Asserts that one or multiple Playwright locators are visible on the page.
 *
 * @param elements - A single Playwright `Locator` or an array of `Locator`s to check for visibility.
 *
 * ## Example Usage:
 * 
 * ### Checking a single element:
 * ```typescript
 * await checkVisibility(page.locator('#myElement'));
 * ```
 *
 * ### Checking multiple elements:
 * ```typescript
 * await checkVisibility([
 *   page.locator('#firstElement'),
 *   page.locator('.secondElement'),
 *   page.locator('//thirdElement')
 * ]);
 * ```
 *
 * @throws Will fail the test if any element is not visible.
 */
export const checkVisibility = async (elements: Locator | Locator[]) => {
  // If a single locator is passed, wrap it in an array to handle both cases
  if (!Array.isArray(elements)) {
    elements = [elements];
  }

  // Use Promise.all to check visibility for all locators in parallel
  await Promise.all(elements.map(async (element) => {
    await expect(element).toBeVisible();
  }));
};

/**
 * Asserts that one or multiple Playwright locators are visible on the page.
 *
 * @param elements - A single Playwright `Locator` or an array of `Locator`s to check for visibility.
 *
 * ## Example Usage:
 * 
 * ### Checking a single element:
 * ```typescript
 * await checkVisibility(page.locator('#myElement'));
 * ```
 *
 * ### Checking multiple elements:
 * ```typescript
 * await checkVisibility([
 *   page.locator('#firstElement'),
 *   page.locator('.secondElement'),
 *   page.locator('//thirdElement')
 * ]);
 * ```
 *
 * @throws Will fail the test if any element is not visible.
 */
export const validateElementsAreNotVisible = async (elements: Locator | Locator[]) => {
  // If a single locator is passed, wrap it in an array to handle both cases
  if (!Array.isArray(elements)) {
    elements = [elements];
  }

  // Use Promise.all to check visibility for all locators in parallel
  await Promise.all(elements.map(async (element) => {
    await expect(element).toBeHidden();
  }));
};




/**
 * Extracts the survey ID from URL parameters.
 * @param url - The URL to extract the survey ID from.
 * @returns {Promise<string | null>} - The survey ID if found, null otherwise.
 * @throws {Error} - If the URL is invalid or no survey ID is found.
 */
export async function getSurveyIdFromUrlParams(url: string): Promise<string | null> {
  try {
    const urlObj = new URL(url);
    const surveyId = urlObj.searchParams.get('surveyid'); // Check 'surveyid'
    return surveyId; // Returns string | null
  } catch (error) {
    console.error('Invalid URL:', url, error);
    throw new Error('Failed to parse URL for survey ID');
  }
}

/**
 * Extracts the survey ID from a survey URL.
 * The ID is expected to be a sequence of digits following "index.php/" in the URL.
 *
 * @param {string} url - The URL containing the survey ID.
 * @returns {string | null} The survey ID as a string if found, otherwise null.
 */
export async function getSurveyIdFromParticipantSurveyUrl(url: string) {
  const regex = /index\.php\/(\d+)/; // Matches digits after "index.php/"
  const match = url.match(regex);
  // console.log(match ? match[1] : null) // debug
  return match ? match[1] : null; // Return the ID or null if not found
};

/**
 * Get the base URL for the given project name.
 * @returns {string} - The base URL for the specified project.
*/
export function getBaseUrl(): string {
  const { ADMIN_BASE_URL, REGULAR_USER_BASE_URL, REG_USER } = process.env;

  if (REG_USER === 'true') {
    return REGULAR_USER_BASE_URL;
  }

  return ADMIN_BASE_URL;
};

/**
  * Attempts to click an element specified by the selector, retrying if the click fails.
  * Useful for handling elements that may not be immediately interactable due to loading or other conditions.
  * 
  * @param page - The Playwright Page object used to perform actions within the browser context.
  * @throws Will throw an error if the element cannot be clicked after the maximum number of attempts.
  * Example usage:
  * ```
  * await clickWithRetry(page, '#my-element');
  * ```
*/
export async function clickWithRetry(page, elementToClick) {
  let retryDelay = 1000
  let maxAttempts = 10;
  const element = elementToClick;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // click the element
      await element.click();
      console.log(`Clicked on attempt ${attempt}`);
      break; // Exit loop if click is successful
    } catch (error) {
      console.log(`Attempt ${attempt} failed: ${error}`);
      if (attempt === maxAttempts) {
        throw new Error(`Failed to click element after ${maxAttempts} attempts`);
      }
      // Wait for the specified retry delay before the next attempt
      await page.waitForTimeout(retryDelay);
    }
  }
};




/**
 * Deletes all files within the specified directory.
 * @param directoryPath - The path to the directory from which files should be deleted.
 *
 *  Example usage of the deleteFilesInDirectory function
 *   const directory: string = 'utils/exported-surveys/file1';
 *    deleteFilesInDirectory(directory);
 */
export async function deleteFilesInDirectory(directoryPath: string): Promise<boolean> {
  try {
    // Check if the directory exists before proceeding
    if (!fs.existsSync(directoryPath)) {
      console.log('Directory does not exist.');
      return false
    }

    // Read all entries in the directory
    const files: string[] = fs.readdirSync(directoryPath);

    for (const file of files) {
      // Construct the full file path
      const filePath: string = path.join(directoryPath, file);

      // Retrieve file stats to determine if it's a file or directory
      const stat: fs.Stats = fs.statSync(filePath);

      if (stat.isFile()) {
        // Delete the file if it's indeed a file
        fs.unlinkSync(filePath);
        console.log(`Deleted: ${file}`);
        return true
      }
    }
  } catch (error) {
    // Log any errors that occur during file operations
    console.error('An error occurred while deleting files:', (error as Error).message);
    return false
  }
}

