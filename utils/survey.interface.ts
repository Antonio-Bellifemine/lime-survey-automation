import { faker } from "..";
/**
 * Represents a user with basic details for registration.
 */
export interface NewSurveyData {
    /** new survey question in a lorem ipsum sentence*/
    question: string;
    /** new survey question in 2 lorem ipsum words */
    questionGroup: string;
    /** random email address. */
    email: string;
    /** random first name. */
    firstName: string;
    /** random last name. */
    lastName: string;
    /** random phone number */
    phoneNumber: string;
    /** random survey response in lorem ipsum sentence format */
    surveyResponse: string;
    /** random yes or no*/
    yesOrNo: string
    /** random date in MM/DD/YYYY format (example 02/24/2024)*/
    randomDate: string
  }
  // TODO finish survey