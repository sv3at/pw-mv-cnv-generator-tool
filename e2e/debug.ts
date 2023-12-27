// For debugging purposes
// ***********************

import {test, expect, defineConfig, PlaywrightTestConfig} from "@playwright/test";
const playwright = require('playwright');
import * as path from 'path';
import * as fs from 'fs';
import { FormatterOptionsArgs, Row, writeToStream } from '@fast-csv/format';
export const thisIsAModule = true;

let BASEURL = "canva.com";
let MAGIC_VIDEO_DEEPLINK = "https://"+BASEURL+"/design?create&type=TAD9VKDO5tI&category=tAEEZ_gIPxM&ui=eyJEIjp7IksiOnsiQiI6dHJ1ZX19LCJBIjp7IkIiOnsiQiI6dHJ1ZX19LCJHIjp7IkIiOnRydWV9fQ";
let USERNAME = "slava+free@test." + BASEURL;

/*
Next stpes:
* Create a build pipeline which will run daily and save 50 results into CSV
* Create a chart, analyze trends/error types; save red flagged errors as a separate entity;
* Add a customized list of prompts (instead of static built in/example ones)
* Check and remove the remainder bits of flakiness (also find a better way of tracking and categorizing these in the output)

* Create QA forum prezo and include such details as: 
-how it started and evolved
-structure and runs
-feedback from the team and comms with stakeholders (improving saving media IDs)
-issues caught so far
-potential issues to be caught in the future
*/

declare global {var designId: string}
declare global {var promptMessage: string}
declare global {var resonForFailureToGenerateTheDesign: string}
declare global {var couldntCreateVideoMsgCount: number}
declare global {var generatedDescriptions: string[]}
declare global {var pageDurations: string[]}
declare global {var mediaSelected: number[]}
declare global {var mediaIDs: string[]}

test.beforeEach(async ({ context }, testInfo) => {
  console.log(`Running ${testInfo.title}`);
})

test.afterAll(async ({}, testInfo) => {
  await appendResultsToCsv(promptMessage, designId, generatedDescriptions, pageDurations, mediaSelected, mediaIDs);
}); 

test("Generate a Magic Video", async ({ page }) => {
  test.setTimeout(170000);
  await login(page);
  await createMagicVideoFromDeeplink(page);
  await getUploadsListByLazyLoadingTheEntireList(page);

  // Get a random number of items to be selected, between 7 & 10
  const numberOfMediaToBeSelected = getRandomNumberNoRepeat(3)[2];
  await clickRandomUploadedMedia(page, numberOfMediaToBeSelected);

  globalThis.promptMessage = await generatePromptUsingBuiltInExampleButton(page);

  // await generateTheMagicDesign(page, numberOfMediaToBeSelected);
 });





// async function debugAnExistingDesign(page, numberOfMediaToBeSelected){
//   globalThis.pageDurations = [];
//   globalThis.generatedDescriptions = [];
//   globalThis.resonForFailureToGenerateTheDesign = "";
  
//     // Click on pages in the timeline   
//       console.log("\n" + "Number Of Media To Be Selected: " + numberOfMediaToBeSelected)
//       await clickOnEachPageOnTheTimeline(numberOfMediaToBeSelected, pageDurations, generatedDescriptions, page) 
//       console.log("Successfully generated design and saved the results.")
// }

// test("Debug", async ({ page }) => {
//   test.setTimeout(170000);
//   await login(page);

//   // Design with empty text on pages
//   // await page.goto('https://www.canva.com/design/DAFzAFyupFo/2_YqeI89u10dCxgybatzaQ/edit?utm_content=DAFzAFyupFo&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton');

//   // Regular design with 7 generated pages
//   await page.goto('https://www.canva.com/design/DAFzAifSfwQ/TFIhoUWx8dk0gqjuyHmCTw/edit?utm_content=DAFzAifSfwQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton');

//   globalThis.promptMessage = "Just debugging";
//   globalThis.designId =  "Just debugging";
//   globalThis.mediaSelected =  [123];
//   globalThis.mediaIDs =  ["Just debugging"];
//   let nrOfPagesInTheExistingDesign = 7; 
  
//   await debugAnExistingDesign(page, nrOfPagesInTheExistingDesign);
//  });

 function getDate(){
  var m = new Date();
  var dateString = m.getUTCFullYear() +"-"+ (m.getUTCMonth()+1) +"-"+ m.getUTCDate() 
  + "-" + m.getUTCHours() + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds();  
  return dateString;
 }

 function getDay(){
  var m = new Date();
  var dateString = m.getUTCFullYear() +"-"+ (m.getUTCMonth()+1) +"-"+ m.getUTCDate();  
  return dateString;
 }

// async function login(page) {
//   // Open Canva Prod
//   await page.goto('/');
//   await expect(page).toHaveTitle("Canva: Visual Suite for Everyone");
  
//   //Click Log-in button
//   await page.getByText('Log In').nth(0).click();
//   await expect(page.getByRole('heading', { name: 'Log in or sign up in seconds' })).toBeVisible();  

//   /*
//   Error: Timed out 5000ms waiting for expect(received).toBeVisible()
// Call log:
//   - expect.toBeVisible with timeout 5000ms
//   - waiting for getByRole('heading', { name: 'Log in or sign up in seconds' })


//   85 |   //Click Log-in button
//   86 |   await page.getByText('Log In').nth(0).click();
// > 87 |   await expect(page.getByRole('heading', { name: 'Log in or sign up in seconds' })).toBeVisible();  
//      |                                                                                     ^
//   88 |
//   89 |   //Input email
//   90 |   await page.getByRole('button', { name: 'Continue with email' }).click();    

//     at login (/Users/slava/work/slava-magic-video-generator-tool/e2e/canva-magic-video.spec.ts:87:85)
//     at /Users/slava/work/slava-magic-video-generator-tool/e2e/canva-magic-video.spec.ts:54:3
//   */

//   //Input email
//   await page.getByRole('button', { name: 'Continue with email' }).click();    
//   await page.getByPlaceholder('julie@example.com').fill(process.env.USERNAME);
//   await page.getByRole('button', { name: 'Continue' }).click();
  
//   //Input password
//   await expect(page.getByRole('heading', { name: 'Log in to your account' })).toBeVisible();
//   await page.getByPlaceholder('Enter password').fill(process.env.PASSWORD);

//   const loginButton = await page.locator("button.ogth8A");
//   expect(await loginButton).toBeVisible;
//   await loginButton.click();

//   await expect(page).toHaveTitle("Canva: Visual Suite for Everyone")

//   const canvaCentralBanner = page.locator('.__CGbQ .GHIRjw').nth(0);

//   await canvaCentralBanner.scrollIntoViewIfNeeded();
//   await expect(canvaCentralBanner).toBeEnabled({timeout: 50000});
//   await expect(canvaCentralBanner).toBeVisible({timeout: 50000});  
//   await expect(canvaCentralBanner).toHaveText('For you');  

//   console.log("Logged in using Canva account: " + process.env.USERNAME)
// }



async function login(page) {
  // Open Canva Prod
  await page.goto("https://"+BASEURL);
  await page.waitForLoadState('networkidle');
  console.log(`Page title: ${await page.title()}`);

  await expect(page).toHaveTitle("Canva: Visual Suite for Everyone");
  // assert((await page.title()) === 'Canva: Visual Suite for Everyone', 'Title does not match');
  
  //Click Log-in button
  try {
    expect(page.getByText('Log In').nth(0)).toBeVisible({
      timeout: 15000,
    });  
  } catch (error) {
    if (error instanceof playwright.errors.TimeoutError)
      console.log('Timeout!');
  }

  await page.getByText('Log In').nth(0).click();
  await expect(page.getByRole('heading', { name: 'Log in or sign up in seconds' })).toBeVisible();  

  //Input email
  await page.getByRole('button', { name: 'Continue with email' }).click();    
  
  // await page.getByPlaceholder('julie@example.com').fill(process.env.USERNAME);
  // await page.getByPlaceholder('julie@example.com').fill("slava+free@test.canva.com");
  await page.getByPlaceholder('julie@example.com').fill(USERNAME);
  console.log(USERNAME)
  
  await page.getByRole('button', { name: 'Continue' }).click();
  
  //Input password
  await expect(page.getByRole('heading', { name: 'Log in to your account' })).toBeVisible();
  await page.getByPlaceholder('Enter password').fill(USERNAME.split("@")[0]);
  // await page.getByPlaceholder('Enter password').fill("slava+free");

  // const loginButton = await page.locator("button.ogth8A");
  // expect(await loginButton).toBeVisible;

  // await Promise.all([
  //   page.waitForNavigation(),
  //   loginButton.click()
  // ]);

  // wait for Login Button to be enabled and click
  await page.waitForSelector(`button.ogth8A`,{ visible: true, timeout: (5000) })
  page.locator("button.ogth8A").click();

  // await expect(page).toHaveTitle("Canva: Visual Suite for Everyone")

  const canvaCentralBanner = page.locator('.__CGbQ .GHIRjw').nth(0);

  // await canvaCentralBanner.scrollIntoViewIfNeeded();
  await expect(canvaCentralBanner).toBeEnabled({timeout: 50000});
  await expect(canvaCentralBanner).toBeVisible({timeout: 50000});  
  await expect(canvaCentralBanner).toHaveText('For you');  

  // console.log("Logged in using Canva account: " + process.env.USERNAME)
  console.log("Logged in using Canva account: " + USERNAME)
}

async function getUploadsListByLazyLoadingTheEntireList(page){ 
  
  let initialUploadMenuItems;
  let initialUploadItemsLength = 0;
  let consecutiveUploadMenuItems;
  let consecutiveUploadItemsLength = 1;

  console.log("\n" + "Itterating through the uploads list until initial Length = consecutive Length")
  while (initialUploadItemsLength < consecutiveUploadItemsLength){
    
    
    // await page.locator('div.tOhFhQ._1aoKLw').waitFor();    
    // initialUploadMenuItems = await page.locator("div.tOhFhQ._1aoKLw").count();
    // console.log(await page.locator('tr').count());

    const inputElement1 = page.locator('div.tOhFhQ._1aoKLw');
    const count1 = await inputElement1.count()


    // let minLength = await inputElement.evaluate(e => (e as HTMLInputElement).minLength);
    initialUploadItemsLength = count1;
    console.log("initialUploadItemsLength: " + count1);

    //scrolling through the list of uploads
    // page.keyboard.down('End')

    await page.evaluate(() => {
      window.scrollBy(0, 2000);    
    });

    // removed; wait a bit for the keydown event to propagate & all the elements to load
    await page.waitForTimeout(200);

    const tempMediaAsset = page.locator('div.tOhFhQ._1aoKLw').nth(-1)
    // await tempMediaAsset.hover();

    // wait for element before trying to hover

    // page.waitForSelector(tempMediaAsset).then(() =>
    //   await tempMediaAsset.hover()); 
    // };

    // wait for element before trying to hover
    await page.waitForSelector('div.tOhFhQ._1aoKLw').then(() =>
      tempMediaAsset.waitFor({ state: 'visible' }),
      await tempMediaAsset.hover() 
    );

    //making sure the last image object skeleton disappears
    await page.locator('.A0JANA .n7vSfw').nth(-1).waitFor({ state: 'hidden' })
    //making sure the last image thumbnail is loaded
    await page.locator('div.tOhFhQ._1aoKLw').nth(-1).waitFor({ state: 'visible' })

    // consecutiveUploadMenuItems = await page.locator("div.tOhFhQ._1aoKLw").all();

    const inputElement2 = page.locator('div.tOhFhQ._1aoKLw');
    const count2 = await inputElement2.count()


    consecutiveUploadItemsLength = count2;
    console.log("consecutiveUploadItemsLength: " + consecutiveUploadMenuItems);
    
    // page.keyboard.down('End')
    await page.evaluate(() => {
      window.scrollBy(0, 2000);    
    });

    await page.locator('.A0JANA .n7vSfw').nth(-1).waitFor({ state: 'hidden' })
    await page.locator('div.tOhFhQ._1aoKLw').nth(-1).waitFor({ state: 'visible' })
    }
}



async function customWaiter(element) {
     try {
        // await element.scrollIntoViewIfNeeded({timeout: 15000});
        // await element.focus();
        
        // const watchDog = page.waitForFunction(() => window.innerWidth < 100);        
        // await page.setViewportSize({ width: 50, height: 50 });
        // await watchDog;

        // await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        await expect(element).toBeEnabled({timeout: 50000});
        await expect(element).toBeVisible({timeout: 50000}); 
        // await element.hover();  
    } catch (error) {
        console.log("Something went wrong...")
    }
}



async function createMagicVideoFromDeeplink(page) {
  await page.goto(process.env.MAGIC_VIDEO_DEEPLINK);
  globalThis.designId = page.url() + "; " + process.env.USERNAME;
  console.log(page.url());

  const element = await page.getByText("Select at least three files to add to your video.")
  await expect(element).toHaveCount(1)
}

async function clickRandomUploadedMedia(page, numberOfMedia){    
  console.log("\n" + "Selecting " + numberOfMedia + " random unique items from the uploads list.")
  let totalNumberOfYourUploads = (await page.locator("div.tOhFhQ._1aoKLw").all()).length;
  console.log("Your total number of uploaded media assets: " + totalNumberOfYourUploads)
  let uniqueIndexes: number[] = [];

  //get 10 unique indexes for user uploaded media
  while(uniqueIndexes.length !== numberOfMedia) { 
    var r = Math.floor(Math.random() * totalNumberOfYourUploads-1) + 1;
    if(uniqueIndexes.indexOf(r) === -1) uniqueIndexes.push(r);
  } 
  
  console.log("The following media will be selected " + uniqueIndexes);
  globalThis.mediaSelected = uniqueIndexes;
  globalThis.mediaIDs = [];

  //Clicking the items in the uploads list
  for (let i = 0; i < uniqueIndexes.length; i++) {
    const handle = await page.locator('div.hWTqZA img').nth(uniqueIndexes[i]);
    const mediaSource = await handle.getAttribute("src");

    if (mediaSource.includes("video-private-assets")) {
      const splittedVideoMedia = mediaSource.split("?")[0].split("com/")[1];
      mediaIDs.push(splittedVideoMedia);
    } else if (mediaSource.includes("media.canva.com")) {      
      // const mediaRegex = new RegExp('^\w+?.*image-resize/\d\/\d+?.*/');
      const splittedPhotoMedia = mediaSource.split("/")[7].split("?")[0];
      const mediaPhotoId = Buffer.from(splittedPhotoMedia, 'base64').toString().split("/")[4];
      mediaIDs.push(mediaPhotoId);
    }
    
    await customWaiter(handle);

    // Add a little wait between pages clicks to eliminate flakiness
    await page.waitForTimeout(200);
    await handle.click();
  }
  console.log("Media IDs of used assets: " + mediaIDs);
}


// async function customWaiter(element) {
//   await element.scrollIntoViewIfNeeded();
//   await expect(element).toBeEnabled({timeout: 50000});

//   // await expect(await element).toBeVisible();
//   // await page.locator('div.tOhFhQ._1aoKLw').waitFor({ state: 'visible' })
//   await expect(element).toBeVisible({timeout: 50000});  

//   await element.hover(); 
// }

function getRandomNumberNoRepeat(length){
  let numberPick = [3,4,5,6,7,8,9,10]
  // let numberPick = [10,10,10,10,10]
  return numberPick.sort(() => Math.random() -0.5).slice(0, length)
}

function getRandomPromptsNumberNoRepeat(length){
  let numberPick = [1,2,3,4,5,6,7,8]
  return numberPick.sort(() => Math.random() -0.5).slice(0, length)
}

async function generatePromptUsingBuiltInExampleButton(page) {
  //Generate a built in text prompt
  const nrOfTimesToClickOnExampleButton =  getRandomPromptsNumberNoRepeat(3)[2]
  console.log("Nr of Times Clicked On Example Button: "+ nrOfTimesToClickOnExampleButton)
  for (let i = 1; i <= nrOfTimesToClickOnExampleButton; i++) {
    expect(await page.locator(".ewamZw")).toBeVisible;
    await page.locator(".ewamZw").click(); 

    expect(await page.locator(".aE7_7g")).toBeVisible;
    // await page.waitForTimeout(100);  
  }
  let usedPrompt = await page.textContent(".aE7_7g"); 
  console.log("Selected prompt: " + usedPrompt + "\n");
  return usedPrompt;
}

async function generateTheMagicDesign(page, numberOfMediaToBeSelected){
  console.log("Generating a Magic Video \n");
  // Click generate 
  await page.locator(".DJdNZA ._38oWvQ").click({timeout: 120000}); 
  await page.waitForLoadState('domcontentloaded');
  await page.locator('.PanoWQ .OYPEnA').toBeVisible;

  //waiting until the magic video generation progress bar disappears
  const timeJustBeforeExport = new Date();
  while (await page.locator('.TfRV3Q .PRZdzQ ._4UMEGg .w9XDaw .fM_HdA').first().isVisible({timeout: 150000 })) { 
    console.log("Waiting until the Magic Video generation progress bar UI disappears: " + getDate())  
    await page.waitForTimeout(2000);
  }

  const timeAfterExport = new Date();
  let timeToGenerateTheMagicVideo = Math.abs(timeJustBeforeExport.getTime() - timeAfterExport.getTime())/1000;
  console.log("Time took to generate the Magic Video: " + timeToGenerateTheMagicVideo + " seconds.")

  try {
    //Wait for Music track to appear on the timeline
    let audioTrack = await page.locator('div.myOKOg  .HJPvcg');    

    globalThis.couldntCreateVideoMsgCount = await page.locator('h1.wp6_yg._5Ob_nQ.fM_HdA').count();
    globalThis.pageDurations = [];
    globalThis.generatedDescriptions = [];
    globalThis.resonForFailureToGenerateTheDesign = "";

      if (globalThis.couldntCreateVideoMsgCount > 0 || audioTrack.count() < 1) {
        //TODO MOVE .count() OUTSIDE OF CONDITIONAL
        let pageDuration = "empty; "

        const failedMessage = await page.locator("p.KzArew").nth(0).textContent();
        const reasonForFailure = "FAILED!: " + failedMessage;
        resonForFailureToGenerateTheDesign = failedMessage;

        pageDurations.push(pageDuration);  
        generatedDescriptions.push(reasonForFailure);
        
        console.log("Failed to generate the magic design! " + generatedDescriptions)
        throw new Error();
      }
    else {
      generatedDescriptions.push(" ");

      // Click on pages in the timeline   
      console.log("\n" + "Number Of Media To Be Selected: " + numberOfMediaToBeSelected)
      await clickOnEachPageOnTheTimeline(numberOfMediaToBeSelected, pageDurations, generatedDescriptions, page) 
      console.log("Successfully generated design and saved the results.")
    }
  }
  catch (error) {
    test.fail((couldntCreateVideoMsgCount>0), "Failed to generate the Magic Video with msg: " + resonForFailureToGenerateTheDesign +". See output.csv for more details");
  }
}

async function clickOnEachPageOnTheTimeline(numberOfMediaToBeSelected, pageDurations, 
  generatedDescriptions, page) {
  for (let i = 0; i < numberOfMediaToBeSelected; i++) {
    const pageOnTheTimeline = await page.locator('.JkY5pQ').nth(i);
    await expect(await pageOnTheTimeline).toBeVisible();
    await pageOnTheTimeline.hover();
    await pageOnTheTimeline.click();

    // Add a little wait between pages clicks
    await page.waitForTimeout(200);

    //get page duration
    await page.locator("div.Ix2gvg:nth-child(1) > button:nth-child(1) > p:nth-child(1)").nth(0).toBeVisible;
    const pDuration = await page.locator("div.Ix2gvg:nth-child(1) > button:nth-child(1) > p:nth-child(1)").nth(0).textContent();
    let pageDuration:string = pDuration as string;
    pageDurations.push(pageDuration);  

    // Add a little wait between loading page text elements
    await page.waitForTimeout(100);
    
    const generatedTextElementsOnAPage = await page.locator('div.pb6miQ p.PanoWQ span.OYPEnA').nth(0);
    let generatedText: string;       

    //Checking if pages contain generated text
    const value = await page.evaluate(el => el !== null, await page.$('div.pb6miQ p.PanoWQ span.OYPEnA'))
    if (value) {
      generatedText = await page.locator('div.pb6miQ p.PanoWQ span.OYPEnA').nth(0).innerText();
      console.log("not empty; " + generatedText);
    } else {
      generatedText = "empty; "
      console.log("empty; ");
    }

    generatedDescriptions.push(generatedText);
    await page.screenshot({ path: './screenshots/' + getDay() +  '/screenshot '+getDate()+'.png', fullPage: true }); 
  }
}

async function debugAnExistingDesign(page, numberOfMediaToBeSelected){
  globalThis.pageDurations = [];
  globalThis.generatedDescriptions = [];
  globalThis.resonForFailureToGenerateTheDesign = "";
  
    // Click on pages in the timeline   
      console.log("\n" + "Number Of Media To Be Selected: " + numberOfMediaToBeSelected)
      await clickOnEachPageOnTheTimeline(numberOfMediaToBeSelected, pageDurations, generatedDescriptions, page) 
      console.log("Successfully generated design and saved the results.")
}
// For debugging purposes
// ***********************
// test("Debug", async ({ page }) => {
//   test.setTimeout(170000);
//   await login(page);

//   // Design with empty text on pages
//   // await page.goto('https://www.canva.com/design/DAFzAFyupFo/2_YqeI89u10dCxgybatzaQ/edit?utm_content=DAFzAFyupFo&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton');

//   // Regular design with 7 generated pages
//   await page.goto('https://www.canva.com/design/DAFzAifSfwQ/TFIhoUWx8dk0gqjuyHmCTw/edit?utm_content=DAFzAifSfwQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton');

//   globalThis.promptMessage = "Just debugging";
//   globalThis.designId =  "Just debugging";
//   globalThis.mediaSelected =  [123];
//   globalThis.mediaIDs =  ["Just debugging"];
//   let nrOfPagesInTheExistingDesign = 7; 
  
//   await debugAnExistingDesign(page, nrOfPagesInTheExistingDesign);
//  });

function appendResultsToCsv(prompt, url, descriptions, durations, mediaSelected, mediaIDs){
  const csvFile = new CsvFile({
  path: path.resolve(__dirname, 'output.csv'),
  // headers to write 
  headers: ['RunDate', 'PropmtUsed', 'Output', "Durations", 'DesignURL', 'MediaSelected', 'MediaIDs'],
});

csvFile
  .update([
    { Date: getDate(), PropmtUsed: prompt, Output: descriptions, 
    PageDurations: durations, DesignURL: url, MediaSelected: mediaSelected, 
    MediaIDs: mediaIDs} 
  ])
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });
}

type CsvFileOpts = {
  headers: string[];
  path: string;
};

class CsvFile {
//https://c2fo.github.io/fast-csv/docs/formatting/examples/#appending-to-a-csv
static write(stream: NodeJS.WritableStream, rows: Row[], options: FormatterOptionsArgs<Row, Row>): Promise<void> {
    return new Promise((res, rej) => {
        writeToStream(stream, rows, options)
            .on('error', (err: Error) => rej(err))
            .on('finish', () => res());
    });
  }

  private readonly headers: string[];
  private readonly path: string;
  private readonly writeOpts: FormatterOptionsArgs<Row, Row>;
  constructor(opts: CsvFileOpts) {
      this.headers = opts.headers;
      this.path = opts.path;
      this.writeOpts = { includeEndRowDelimiter: true };
  }

  update(rows: Row[]): Promise<void> {
      return CsvFile.write(fs.createWriteStream(this.path,  { flags: 'a' }), rows, { ...this.writeOpts });
  }

  append(rows: Row[]): Promise<void> {
      return CsvFile.write(fs.createWriteStream(this.path, { flags: 'a' }), rows, {
          ...this.writeOpts,
          // dont write the headers when appending
          writeHeaders: false,
      } as FormatterOptionsArgs<Row, Row>);
  }

  read(): Promise<Buffer> {
      return new Promise((res, rej) => {
          fs.readFile(this.path, (err, contents) => {
              if (err) {
                  return rej(err);
              }
              return res(contents);
          });
      });
  }
}