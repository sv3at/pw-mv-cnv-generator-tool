import { test, expect } from "@playwright/test";
import { getDate } from "./datetime";

export async function login(page, url) {
  // Open Canva Prod
  await page.goto(url);
  await expect(page).toHaveTitle("Canva: Visual Suite for Everyone");
  
  //Click Log-in button
  await page.click('._38oWvQ:has-text("Log In")');

  //Input email
  await page.locator('._7IvJg :text("Continue with email")').click();
  // await page.fill('input[placeholder="julie@example.com"]', process.env.USERNAME);
  await page.fill('input[placeholder="julie@example.com"]', 'sveatoslav.circel@gmail.com')
  await page.locator('._38oWvQ').nth(0).click();
  
  //Input password
  // await page.fill('input[placeholder="Enter password"]', process.env.PASSWORD);
  await page.fill('input[placeholder="Enter password"]', 'Ty50n#cn');
  await page.locator("button.ogth8A").click();
  await expect(page).toHaveTitle("Canva: Visual Suite for Everyone")

  const canvaCentralBanner = page.locator('.__CGbQ .GHIRjw').nth(0);
  await canvaCentralBanner.scrollIntoViewIfNeeded();
  await expect(canvaCentralBanner).toBeEnabled({timeout: 50000});
  await expect(canvaCentralBanner).toBeVisible({timeout: 50000});  
  await expect(canvaCentralBanner).toHaveText('For you');  

  console.log("Logged in using Canva account: " + process.env.USERNAME)
}

export async function createMagicVideoFromDeeplink(page) {
  await page.goto(process.env.MAGIC_VIDEO_DEEPLINK);
  globalThis.designId = page.url() + "; " + process.env.USERNAME;
  console.log(page.url());
}

export async function getUploadsListByLazyLoadingTheEntireList(page)  {
      let initialUploadItemsLength = 0;
      let consecutiveUploadItemsLength = 1;
  
      console.log("\n" + "Itterating through the uploads list until initial Length = consecutive Length")
      while (initialUploadItemsLength < consecutiveUploadItemsLength){
      
        const inputElement1 = page.locator('div.tOhFhQ._1aoKLw');
        const count1 = await inputElement1.count()
        initialUploadItemsLength = count1;
        console.log("initialUploadItemsLength: " + count1);
  
        // scrolling through the list of uploads
        // https://github.com/microsoft/playwright/issues/4302
        await page.evaluate(() => { window.scrollBy(0, 2000)});
  
        // wait a bit for the keyborad/event/actions to propagate & all the elements to load
        // https://github.com/microsoft/playwright/issues/14422
        await page.waitForTimeout(200);
        const tempMediaAsset = page.locator('div.tOhFhQ._1aoKLw').nth(-1)
  
        // wait for element before trying to hover
        await page.waitForSelector('div.tOhFhQ._1aoKLw').then(() =>
          tempMediaAsset.waitFor({ state: 'visible' }),
          await tempMediaAsset.hover()
        );
  
        // making sure the last image object skeleton disappears
        await page.locator('.A0JANA .n7vSfw').nth(-1).waitFor({ state: 'hidden' });
        // making sure the last image thumbnail is loaded
        await page.locator('div.tOhFhQ._1aoKLw').nth(-1).waitFor({ state: 'visible' });
        const inputElement2 = page.locator('div.tOhFhQ._1aoKLw');
        const count2 = await inputElement2.count();
        consecutiveUploadItemsLength = count2;
        console.log("consecutiveUploadItemsLength: " + count2);
  
        await page.evaluate(() => { window.scrollBy(0, 2000)});
        await page.locator('.A0JANA .n7vSfw').nth(-1).waitFor({ state: 'hidden' })
        await page.locator('div.tOhFhQ._1aoKLw').nth(-1).waitFor({ state: 'visible' })
    }
}

export async function clickRandomUploadedMedia(page, numberOfMedia){    
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

export async function generatePromptUsingBuiltInExampleButton(page) {
  //Generate a built in text prompt
  const nrOfTimesToClickOnExampleButton = getRandomNumberNoRepeat(fromTo(1,8))
  console.log("Nr of Times Clicked On Example Button: "+ nrOfTimesToClickOnExampleButton)
  for (let i = 1; i <= nrOfTimesToClickOnExampleButton; i++) {
    expect(await page.locator(".ewamZw")).toBeVisible;
    await page.locator(".ewamZw").click(); 
    expect(await page.locator(".aE7_7g")).toBeVisible;
  }
  let usedPrompt = await page.textContent(".aE7_7g"); 
  console.log("Selected prompt: " + usedPrompt + "\n");
  return usedPrompt;
}

export async function generateTheMagicDesign(page, numberOfMediaToBeSelected){
  console.log("Generating a Magic Video: \n");
  // Click "Generate"
  await page.locator(".DJdNZA ._38oWvQ").click({timeout: 120000}); 
  await page.waitForLoadState('domcontentloaded');
  await page.locator('.PanoWQ .OYPEnA').toBeVisible;

  // Waiting until the magic video generation progress bar disappears, 
  // and optionally could measure the time to it took to generate a magic video
  const timeJustBeforeExport = new Date();  

  try {
    console.log("Waiting until the Magic Video ")
    while (await page.evaluate(el => el !== null, await page.$('.TfRV3Q .PRZdzQ ._4UMEGg .w9XDaw .fM_HdA'))) {
      console.log("Waiting until the Magic Video generation progress bar UI disappears: " + getDate("yyyy-MM-dd HH:mm:ss"))  
      await page.waitForTimeout(2000);
    }
    const timeAfterExport = new Date();
    let timeToGenerateTheMagicVideo = Math.abs(timeJustBeforeExport.getTime() - timeAfterExport.getTime())/1000;
    console.log("Time took to generate the Magic Video: " + timeToGenerateTheMagicVideo + " seconds.")
  } catch (error) {
    console.log("Finished generating a design. Something might have failed along the way...")  
  }

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
        await page.screenshot({ path: './reports/' + getDate("yyyy-MM") + "/" + getDate("yyyy-MM-dd") +
        '/' + reportDateTime + '/screenshots/run-failed-image-' +  reportDateTime +'.png', fullPage: true }); 
        console.log("Failed to generate the magic design! " + generatedDescriptions)
        // throw new Error(); 
        throw new Error('Coudlnt generate the design: ' + reasonForFailure);

        //TODO: Doesn't fail here sometimes, to be fixed

      }
      else {
        //To make sure it doesnt error out if the descriptions are null for some reason
        generatedDescriptions.push(" ");
        
        // Click on pages in the timeline
        console.log("\n" + "Number Of Media To Be Selected: " + numberOfMediaToBeSelected)       
        await clickOnEachPageOnTheTimeline(numberOfMediaToBeSelected, pageDurations, generatedDescriptions, page) 
        console.log("Successfully generated design and saved the results.")
      }
  }
  catch (error) {
    test.fail((couldntCreateVideoMsgCount>0), "Failed to generate the Magic Video with msg: " + resonForFailureToGenerateTheDesign +". See output.csv for more details");
    console.log(error);
  }
 }

export async function clickOnEachPageOnTheTimeline(numberOfMediaToBeSelected, pageDurations, 
  generatedDescriptions, page) {
  for (let i = 0; i < numberOfMediaToBeSelected; i++) {
    const pageOnTheTimeline = await page.locator('.JkY5pQ').nth(i);
    await expect(await pageOnTheTimeline).toBeVisible();
    await pageOnTheTimeline.hover();
    await pageOnTheTimeline.click();

    // Add a little wait between pages clicks, to make sure the browser doesn't crash
    await page.waitForTimeout(200);

    //get page duration
    await page.locator("div.Ix2gvg:nth-child(1) > button:nth-child(1) > p:nth-child(1)").nth(0).toBeVisible;
    const pDuration = await page.locator("div.Ix2gvg:nth-child(1) > button:nth-child(1) > p:nth-child(1)").nth(0).textContent();
    let pageDuration:string = pDuration as string;
    pageDurations.push(pageDuration);  

    // Add a little wait between loading page text elements, to make sure the browser doesn't crash
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
    // Will take every 2nd (or so) screenshot of the page
    // https://github.com/microsoft/playwright/issues/15773#issuecomment-1292776820
    await page.screenshot({ path: './reports/' + getDate("yyyy-MM") + "/" + getDate("yyyy-MM-dd") + "/" 
    + reportDateTime + '/screenshots' + '/screenshot '+ getDate("yyyy-MM-dd HH-mm-ss")+'.png', fullPage: true }); 

    // reporter: [['html', { outputFolder: './e2e/reports/' + helpers.getDate() + '/playwright-report/' + helpers.getDate("detailed")}]],

    //TODO: perf optimization of screenshots
    //const base64 = (await (await page.context().newCDPSession(page)).send('Page.captureScreenshot')).data
  }
}

export function getToken(token) {
  if (token) {
    return token;
  } else {
    return " "
  }
}

export async function customWaiter(element) {
  await element.scrollIntoViewIfNeeded();
  await expect(element).toBeEnabled({timeout: 50000});
  await expect(element).toBeVisible({timeout: 50000});  
  await element.hover(); 
}

export function fromTo(from, max) {
      var arr = new Array();
      var i = from;
      while (max--) arr.push(++i);      
          return arr; 
}
 
 export function getRandomNumberNoRepeat(numberPickArray){
    // let numberPickArray = [3,4,5,6,7,8,9,10]
    // let numberPickArray = [10,10,10,10,10]
    return numberPickArray.sort(() => Math.random() -0.5).slice(0, 1)[0]
 }