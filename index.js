const puppeteer = require('puppeteer');
let details = require('./env');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
            `--window-size=${2080},${800}`,
        ]
    });
    const page = await browser.newPage();
    await page.goto('https://www.irctc.co.in/nget/train-search');
    
    try {
        
        
        // insert train detail 
        await searchTrain(page)

        // seting the Date
        await setdate(page)

        // login
        await login(page)
    } catch (error) {
        console.log("err-->", error);
    }

})();

const setdate = async(page) => {
    // Date
    await page.waitForSelector('input[placeholder="DD/MM/YYYY *"]')
    await page.evaluate(() => document.querySelector('input[placeholder="DD/MM/YYYY *"]').value = '');
    const inputValue = await page.$eval('input[placeholder="DD/MM/YYYY *"]', el => el.value);
    await page.type('input[placeholder="DD/MM/YYYY *"]', '18/02/2024');
    // await page.keyboard.press('Enter');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.click('button[class="hidden-xs search_btn btn"]')
}

const login = async(page) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.waitForSelector('a.search_btn.loginText.ng-star-inserted');
    await page.click('a.search_btn.loginText.ng-star-inserted');
    await page.waitForSelector('input[placeholder="User Name"]');
    // await page.click('input[placeholder="User Name"]');
    await page.type('input[placeholder="User Name"]', details.userName);
    await new Promise(resolve => setTimeout(resolve, 500));
    // await page.click('input[placeholder="Password"]');
    await page.waitForSelector('input[placeholder="Password"]');
    await page.type('input[placeholder="Password"]', details.Password);
    await new Promise(resolve => setTimeout(resolve, 500));
    // await page.waitForSelector('button[style="padding: 10px 14px;"]')
    await page.waitForSelector('input[id="captcha"]');
  
    // You can prompt the user here to fill in the CAPTCHA manually
    console.log('Please fill in the CAPTCHA.');

    // Wait for user to fill in the CAPTCHA manually
    await page.evaluate(() => {
        const button = document.querySelector('button[style="padding: 10px 14px;"]');
        button.addEventListener('click', () => {
            button.clicked = true;
        });
    });

    console.log('CAPTCHA is filled');
}

const searchTrain = async(page) => {
    // To check all the compounent are mounted
    await new Promise(resolve => setTimeout(resolve, 1000));
    // To check all the compounent are mounted
    await page.waitForSelector('input.ng-tns-c57-8.ui-inputtext.ui-widget.ui-state-default.ui-corner-all.ui-autocomplete-input.ng-star-inserted');
    
    // Class
    await page.click('span.ui-dropdown-trigger-icon.ui-clickable.ng-tns-c65-11.pi.pi-chevron-down')
    await page.waitForSelector('li[aria-label="Sleeper (SL)"]')
    await page.click('li[aria-label="Sleeper (SL)"]')
    // //Genaral
    await page.click('span.ui-dropdown-trigger-icon.ui-clickable.ng-tns-c65-12.pi.pi-chevron-down')
    await page.waitForSelector('li[aria-label="TATKAL"]')
    await page.click('li[aria-label="TATKAL"]')

    //From
    await page.type('input.ng-tns-c57-8.ui-inputtext.ui-widget.ui-state-default.ui-corner-all.ui-autocomplete-input.ng-star-inserted', 'HOSUR - HSRA');
    // await page.keyboard.press('Enter');
    // TO
    await page.type('input.ng-tns-c57-9.ui-inputtext.ui-widget.ui-state-default.ui-corner-all.ui-autocomplete-input.ng-star-inserted', 'COIMBATORE JN - CBE (COIMBATORE)');
    // await page.waitForTimeout(2000);
    await page.keyboard.press('Enter');
}