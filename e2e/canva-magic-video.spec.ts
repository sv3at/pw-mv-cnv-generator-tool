import { test } from "@playwright/test";
import { appendResultsToCsv } from "./csv";
import * as helpers from "./helpers";
export const thisIsAModule = true;

// The stealth plugin is optimized for chromium based browsers currently
// Check stealth levels: https://bot.sannysoft.com/
// For more details: https://www.npmjs.com/package/playwright-extra#more-examples
const { chromium } = require('playwright-extra')
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
chromium.use(StealthPlugin());

declare global {var designId: string}
declare global {var promptMessage: string}
declare global {var resonForFailureToGenerateTheDesign: string}
declare global {var couldntCreateVideoMsgCount: number}
declare global {var generatedDescriptions: string[]}
declare global {var pageDurations: string[]}
declare global {var mediaSelected: number[]}
declare global {var mediaIDs: string[]}
const numberOfMediaToBeSelected = helpers.getRandomNumberNoRepeat(helpers.fromTo(3,7));

test.beforeEach(async ({}, testInfo) => {
  console.log(`Running ${testInfo.title}`);
});

test("Generate a Magic Video", async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  test.setTimeout(200000);  
  await helpers.login(page, "https://canva.com");
  await helpers.createMagicVideoFromDeeplink(page);
  await helpers.getUploadsListByLazyLoadingTheEntireList(page); 
  await helpers.clickRandomUploadedMedia(page, numberOfMediaToBeSelected);
  globalThis.promptMessage = await helpers.generatePromptUsingBuiltInExampleButton(page);
  await helpers.generateTheMagicDesign(page, numberOfMediaToBeSelected);
  await appendResultsToCsv(promptMessage, designId, generatedDescriptions, pageDurations, mediaSelected, mediaIDs);
});