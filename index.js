const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
            `--window-size=${2080},${800}`,
            `--user-data-dir=C:\Users\sushi\AppData\Local\Google\Chrome\User Data` // replace with the actual path to your data directory
        ]
        // executablePath: 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave', // replace with the actual path to your Brave browser executable
    });
    const page = await browser.newPage();
    await page.goto('https://www.irctc.co.in/nget/train-search');
    
    // await page.waitForSelector('a.search_btn.loginText.ng-star-inserted');
    // await page.click('a.search_btn.loginText.ng-star-inserted');
    // await page.waitForSelector('input[placeholder="User Name"]');
    // await page.type('input[placeholder="User Name"]', 'bhandary_9');
    // await page.waitForSelector('input[placeholder="Password"]');
    // await page.type('input[placeholder="Password"]', 'Sk@8056697281');

    // // Date
    // await page.evaluate(() => document.querySelector('input.ng-tns-c58-10.ui-inputtext.ui-widget.ui-state-default.ui-corner-all.ng-star-inserted').value = '');
    // const inputValue = await page.$eval('input.ng-tns-c58-10.ui-inputtext.ui-widget.ui-state-default.ui-corner-all.ng-star-inserted', el => el.value);
    // await page.type('input.ng-tns-c58-10.ui-inputtext.ui-widget.ui-state-default.ui-corner-all.ng-star-inserted', '01/03/2024');

    // To check all the compounent are mounted
    await page.waitForSelector('input.ng-tns-c57-8.ui-inputtext.ui-widget.ui-state-default.ui-corner-all.ui-autocomplete-input.ng-star-inserted');
    
    // Class
    await page.click('span.ui-dropdown-trigger-icon.ui-clickable.ng-tns-c65-11.pi.pi-chevron-down')
    await page.waitForSelector('li[aria-label="Sleeper (SL)"]')
    await page.click('li[aria-label="Sleeper (SL)"]')
    // //Genaral
    // await page.click('span.ui-dropdown-trigger-icon.ui-clickable.ng-tns-c65-12.pi.pi-chevron-down')
    // await page.waitForSelector('li[aria-label="TATKAL"]')
    // await page.click('li[aria-label="TATKAL"]')

    //From
    await page.type('input.ng-tns-c57-8.ui-inputtext.ui-widget.ui-state-default.ui-corner-all.ui-autocomplete-input.ng-star-inserted', 'HOSUR - HSRA');
    // await page.keyboard.press('Enter');
    // TO
    await page.type('input.ng-tns-c57-9.ui-inputtext.ui-widget.ui-state-default.ui-corner-all.ui-autocomplete-input.ng-star-inserted', 'COIMBATORE JN - CBE (COIMBATORE)');
    // await page.waitForTimeout(2000);
    await page.keyboard.press('Enter');

    // Date
    await page.waitForSelector('input[placeholder="DD/MM/YYYY *"]')
    await page.evaluate(() => document.querySelector('input[placeholder="DD/MM/YYYY *"]').value = '');
    const inputValue = await page.$eval('input[placeholder="DD/MM/YYYY *"]', el => el.value);
    await page.type('input[placeholder="DD/MM/YYYY *"]', '01/03/2024');
    await page.click('button.hidden-xs.search_btn.btn')

})();