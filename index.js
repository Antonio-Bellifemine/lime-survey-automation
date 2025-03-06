import 'dotenv/config';
import { faker } from '@faker-js/faker';

export { faker }


export { Auth } from './page-object-models/auth';
export { SurveysList } from './page-object-models/surveys-list';
export { Header } from './page-object-models/header';
export { SurveyEdit } from './page-object-models/survey-edit';
export { ActiveSurvey } from './page-object-models/user/activeSurvey';
export { AjaxRequests } from './utils/AjaxRequests';