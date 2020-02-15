const puppeteer = require('puppeteer');

const TIMEOUT_DURATION_HOURS = 24 * 30;
const TIMEOUT_DURATION_SECONDS = 30;
const REQUEST_CACHE = {};

async function ssr(url) {
    const now = +new Date();
    if (REQUEST_CACHE[url]) {
        const diffInHrs = (now - REQUEST_CACHE[url]['ttl']) / (1000 * 3600);
        if (diffInHrs < TIMEOUT_DURATION_HOURS) {
            return REQUEST_CACHE[url]['html'];
        }
    };
    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' })
        const html = await page.content(); // serialized HTML of page DOM.
        await browser.close();
        REQUEST_CACHE[url] = { ttl: now, html };
        return html;
    } catch (error) {
        console.log('Error', error);
        throw new Error(error);
    }
}

module.exports = ssr;