import { type Page } from '@playwright/test';
const { AJAX_REQUEST_BASE_URL } = process.env;

export class AjaxRequests {
    readonly page: Page;
    private baseUrl: string;
    private defaultHeaders: object;
    private customHeaders: object;

    constructor(page: Page) {
        if (!AJAX_REQUEST_BASE_URL) {
            throw new Error('AJAX_REQUEST_BASE_URL environment variable is not set');
        }
        this.baseUrl = AJAX_REQUEST_BASE_URL;
        this.page = page;
        this.defaultHeaders = {
            'x-requested-with': 'XMLHttpRequest',
            'accept': '*/*',

            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'origin': this.baseUrl,

            'referer': `${this.baseUrl}/index.php/dashboard/view`,
        };
    }

    async post(endpoint: string, data: string, customHeaders: { [key: string]: string } = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            ...this.defaultHeaders,
            ...customHeaders
        };

        try {
            // console.log('POST Request:', { url, headers, data }); // debug
            const response = await this.page.request.post(url, {
                headers: headers,
                data: data,
            });

            const status = response.status();
            const body = await response.text();

            if (!response.ok()) {
                throw new Error(`Request failed with status ${status}. Response: ${body}`);
            }

            return { status, body };
        } catch (error) {
            console.error('AJAX Error:', error);
            throw error;
        }
    }

    async deleteMultipleSurveys(surveyIds: string[]) {

        const endpoint = '/surveyAdministration/deleteMultiple';

        const cookies = await this.page.context().cookies();
        // console.log('Retrieved Cookies:', cookies); // debug

        const csrfCookie = cookies.find(cookie => cookie.name === 'YII_CSRF_TOKEN');
        if (!csrfCookie) {
            throw new Error('YII_CSRF_TOKEN not found in cookies');
        }
        const csrfToken = csrfCookie.value;

        // console.log('CSRF Token from Cookies:', csrfToken); // debug

        // Encode only dynamic parts, use raw token
        const data = `sItems=${encodeURIComponent(JSON.stringify(surveyIds))}&aAttributesToUpdate=${encodeURIComponent(JSON.stringify([]))}&grididvalue=survey-grid&YII_CSRF_TOKEN=${csrfToken}`;

        return (await this.post(endpoint, data)).status;

    }

    async createSurvey(surveyName: string) {

        const endpoint = '/surveyAdministration/insert';

        const cookies = await this.page.context().cookies();


        const csrfCookie = cookies.find(cookie => cookie.name === 'YII_CSRF_TOKEN');
        if (!csrfCookie) {
            throw new Error('YII_CSRF_TOKEN not found in cookies');
        }
        const csrfToken = csrfCookie.value;

        // Manually encode the payload, using surveyName parameter
        const data = `YII_CSRF_TOKEN=${csrfToken}&surveyls_title=${encodeURIComponent(surveyName)}&language=en&gsid=1&administrator=default&admin=&adminemail=&saveandclose=1&YII_CSRF_TOKEN=${csrfToken}`;
        const customHeaders: { [key: string]: string } = {
            'referer': `${this.baseUrl}/surveyAdministration/newSurvey`,
        };

        return this.post(endpoint, data, customHeaders);
    }
}

export default AjaxRequests;



//TODO make this curl into a custom import survey method
// curl 'https://limesurveytest18.smartresearchadvisor.com/index.php/surveyAdministration/copy' \
// -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
// -H 'accept-language: en-US,en;q=0.9' \
// -H 'cache-control: max-age=0' \
// -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundaryzQTBemJjcEQDxdxj' \
// -b 'LS-ARVOPKKLKSNVAHWT=745j5d84igb4kv2ea04qmslefm; YII_CSRF_TOKEN=TWlIb204VHQzVDJwY2hQWWs0eUJZR3FYa0U1Y2h5NVOWGkia1Z_AiKzsIm2ukPIg94HCiERzgq7_auJ9P78b4g%3D%3D' \
// -H 'origin: https://limesurveytest18.smartresearchadvisor.com' \
// -H 'priority: u=0, i' \
// -H 'referer: https://limesurveytest18.smartresearchadvisor.com/index.php/surveyAdministration/newSurvey' \
// -H 'sec-ch-ua: "Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"' \
// -H 'sec-ch-ua-mobile: ?0' \
// -H 'sec-ch-ua-platform: "macOS"' \
// -H 'sec-fetch-dest: document' \
// -H 'sec-fetch-mode: navigate' \
// -H 'sec-fetch-site: same-origin' \
// -H 'sec-fetch-user: ?1' \
// -H 'upgrade-insecure-requests: 1' \
// -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36' \
// --data - raw $'------WebKitFormBoundaryzQTBemJjcEQDxdxj\r\nContent-Disposition: form-data; name="YII_CSRF_TOKEN"\r\n\r\nTWlIb204VHQzVDJwY2hQWWs0eUJZR3FYa0U1Y2h5NVOWGkia1Z_AiKzsIm2ukPIg94HCiERzgq7_auJ9P78b4g==\r\n------WebKitFormBoundaryzQTBemJjcEQDxdxj\r\nContent-Disposition: form-data; name="the_file"; filename="limesurvey_survey_735837.lss"\r\nContent-Type: application/octet-stream\r\n\r\n\r\n------WebKitFormBoundaryzQTBemJjcEQDxdxj\r\nContent-Disposition: form-data; name="translinksfields"\r\n\r\n0\r\n------WebKitFormBoundaryzQTBemJjcEQDxdxj\r\nContent-Disposition: form-data; name="translinksfields"\r\n\r\n1\r\n------WebKitFormBoundaryzQTBemJjcEQDxdxj\r\nContent-Disposition: form-data; name="sid"\r\n\r\n0\r\n------WebKitFormBoundaryzQTBemJjcEQDxdxj\r\nContent-Disposition: form-data; name="action"\r\n\r\nimportsurvey\r\n------WebKitFormBoundaryzQTBemJjcEQDxdxj--\r\n'