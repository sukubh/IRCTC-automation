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
   
    
    try {
        await page.goto('https://www.irctc.co.in/nget/train-search');
        // login
        await login(page)
        
        // insert train detail 
        await searchTrainAfterLogin(page)
    
        // setting the Date
        await setdate(page)

        const now = new Date();
        let millisTill11 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0, 1, 0) - now;
        if (millisTill11 < 0) {
             // it's after 11am, schedule for next day
             millisTill11 += 24 * 60 * 60 * 1000;
        }
    
        setTimeout(async function() {
            try {
                await dataFill(page)
            } catch (error) {
                console.log("timer err-->", error);
            }
        }, millisTill11);
    
    } catch (error) {
        console.log("main err-->", error);
    }

})();

const dataFill = async(page) => {
    //
    const val = await page.evaluate(async (details) => {
        const boxs = [...document.querySelectorAll('div[class="ng-star-inserted"] > div[class="form-group no-pad col-xs-12 bull-back border-all"]')];
        await new Promise(resolve => setTimeout(resolve, 1000));
        for (let i = 0; i < boxs.length; i++) {
            let trains = boxs[i].querySelector('div[class="col-sm-5 col-xs-11 train-heading"]> strong').innerText;
            if(trains && trains.includes(details.train) ) {
                return i
            }
        }
        return -1
    }, details); 
    console.log('found the train', val);

    if(details.sleeper) {
        // selecting sleeper
        await page.waitForSelector('div[class="ng-star-inserted"]:nth-child(' + (val + 1) + ') > div[class="form-group no-pad col-xs-12 bull-back border-all"] div[tabindex="0"]');
        await page.click('div[class="ng-star-inserted"]:nth-child(' + (val + 1) + ') > div[class="form-group no-pad col-xs-12 bull-back border-all"] div[tabindex="0"]')
    } else {
        // selecting for AC 3
        await page.waitForSelector('div[class="ng-star-inserted"]:nth-child(' + (val + 1) + ') > div[class="form-group no-pad col-xs-12 bull-back border-all"]  td[style="padding-right: 6px; padding-bottom: 6px;"]:nth-child(2)');
        await page.click('div[class="ng-star-inserted"]:nth-child(' + (val + 1) + ') > div[class="form-group no-pad col-xs-12 bull-back border-all"]  td[style="padding-right: 6px; padding-bottom: 6px;"]:nth-child(2)')
    }

    // await page.waitForSelector('div[class="ng-star-inserted"]:nth-child(' + (val + 1) + ') > div[class="form-group no-pad col-xs-12 bull-back border-all"]  td[style="padding-right: 6px; padding-bottom: 6px;"]:nth-child(3)');
    // await page.click('div[class="ng-star-inserted"]:nth-child(' + (val + 1) + ') > div[class="form-group no-pad col-xs-12 bull-back border-all"]  td[style="padding-right: 6px; padding-bottom: 6px;"]:nth-child(3)')
    
    // selection of set
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.waitForSelector('div[class="ng-star-inserted"]:nth-child(' + (val + 1) + ') > div[class="form-group no-pad col-xs-12 bull-back border-all"] div[style="padding: 5px 0;"]', {timeout: 50000});
    await page.click('div[class="ng-star-inserted"]:nth-child(' + (val + 1) + ') > div[class="form-group no-pad col-xs-12 bull-back border-all"] div[style="padding: 5px 0;"]')


    // clicking book button
    await page.waitForSelector('div[class="ng-star-inserted"]:nth-child(' + (val + 1) + ') > div[class="form-group no-pad col-xs-12 bull-back border-all"] button[class="btnDefault train_Search ng-star-inserted"]');
    await page.click('div[class="ng-star-inserted"]:nth-child(' + (val + 1) + ') > div[class="form-group no-pad col-xs-12 bull-back border-all"] button[class="btnDefault train_Search ng-star-inserted"]')
    
    // selection passenger
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.waitForSelector('ul.ui-autocomplete-items.ui-autocomplete-list.ui-widget-content.ui-widget.ui-corner-all.ui-helper-reset >  li:nth-child(5)');
    await page.click('ul.ui-autocomplete-items.ui-autocomplete-list.ui-widget-content.ui-widget.ui-corner-all.ui-helper-reset >  li:nth-child(5)')

    // // clicking Add passenger
    // await new Promise(resolve => setTimeout(resolve, 1000));
    // await page.waitForSelector('div[class="zeroPadding pull-left ng-star-inserted"] > a[tabindex="0"]')
    // await page.click('div[class="zeroPadding pull-left ng-star-inserted"] > a[tabindex="0"]')

    // // selection passenger
    // await page.waitForSelector('ul.ui-autocomplete-items.ui-autocomplete-list.ui-widget-content.ui-widget.ui-corner-all.ui-helper-reset > li:nth-child(' + ( 4 ) + ')');
    // await page.click('ul.ui-autocomplete-items.ui-autocomplete-list.ui-widget-content.ui-widget.ui-corner-all.ui-helper-reset > li:nth-child(' + ( 4 ) + ')')

    // clicking payment methode and continue
    await page.waitForSelector('div.ui-panel-content.ui-widget-content  div[class="ui-radiobutton-box ui-widget ui-state-default"]')
    await page.click('div.ui-panel-content.ui-widget-content  div[class="ui-radiobutton-box ui-widget ui-state-default"]')
    await page.click('button[class="train_Search btnDefault"]')

    //
    // You can prompt the user here to fill in the CAPTCHA manually
    console.log('Please fill in the CAPTCHA 2.');

    // Wait for user to fill in the CAPTCHA manually
    await page.waitForSelector('div[class="form-group col-xs-12 hidden-xs"]  button[class="btnDefault train_Search"]', {timeout: 60000});
    await page.evaluate(() => {
        const button = document.querySelector('div[class="form-group col-xs-12 hidden-xs"]  button[class="btnDefault train_Search"]');
        button.addEventListener('click', () => {
            button.clicked = true;
            resolve();
        });
    });

    console.log('CAPTCHA is filled 2');

    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.waitForSelector('div[id="pay-type"] > span > div.bank-type:nth-child(3)', {timeout: 60000});
    await page.click('div[id="pay-type"] > span > div.bank-type:nth-child(3)')
    await page.waitForSelector('td[class="col-lg-12 col-md-12 col-pad col-sm-12 col-xs-12 pull-left"]', {timeout: 60000});
    await page.click('td[class="col-lg-12 col-md-12 col-pad col-sm-12 col-xs-12 pull-left"]')

    // await page.click('button[class="btn btn-primary hidden-xs ng-star-inserted"]')
}

const setdate = async(page) => {
    // Class
    await page.waitForSelector('span.ui-dropdown-trigger-icon.ui-clickable.ng-tns-c65-32.pi.pi-chevron-down')
    await page.click('span.ui-dropdown-trigger-icon.ui-clickable.ng-tns-c65-32.pi.pi-chevron-down')
    await page.waitForSelector('li[aria-label="Sleeper (SL)"]')
    await page.click('li[aria-label="Sleeper (SL)"]')
    //Genaral
    await page.click('span.ui-dropdown-trigger-icon.ui-clickable.ng-tns-c65-33.pi.pi-chevron-down')
    await page.waitForSelector('li[aria-label="TATKAL"]')
    await page.click('li[aria-label="TATKAL"]')
    // Date
    await page.waitForSelector('input[placeholder="DD/MM/YYYY *"]')
    await page.evaluate(() => document.querySelector('input[placeholder="DD/MM/YYYY *"]').value = '');
    const inputValue = await page.$eval('input[placeholder="DD/MM/YYYY *"]', el => el.value);
    await page.type('input[placeholder="DD/MM/YYYY *"]', details.date);
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
        return new Promise((resolve, reject) => {
            const button = document.querySelector('button[style="padding: 10px 14px;"]');
            button.addEventListener('click', () => {
                button.clicked = true;
                resolve();
            });
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

const searchTrainAfterLogin = async(page) => {
    // To check all the compounent are mounted
    await new Promise(resolve => setTimeout(resolve, 1000));
    // // To check all the compounent are mounted
    // await page.waitForSelector('span.ui-dropdown-trigger-icon.ui-clickable.pi.pi-chevron-down');
    
    

    //From
    await page.type('input.ng-tns-c57-8.ui-inputtext.ui-widget.ui-state-default.ui-corner-all.ui-autocomplete-input.ng-star-inserted', details.from);
    // await page.keyboard.press('Enter');
    // TO
    await page.type('input.ng-tns-c57-9.ui-inputtext.ui-widget.ui-state-default.ui-corner-all.ui-autocomplete-input.ng-star-inserted', details.to);
    // await page.waitForTimeout(2000);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.click('button[label="Find Trains"]')
}