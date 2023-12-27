import { defineConfig } from '@playwright/test';
// import { PlaywrightTestConfig } from '@playwright/test';
import { getDate } from "./e2e/datetime";
import dotenv from 'dotenv'
 dotenv.config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  // testMatch: '/.*spec.ts/',
  /* Run tests in files in parallel */
  timeout: 200000,
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  // reporter: 'line',
  // reporter: './my-awesome-reporter.ts',

  //https://github.com/microsoft/playwright/pull/14964
  reporter: [['html', { outputFolder: './reports/' + getDate("yyyy-MM") + 
    '/' + getDate("yyyy-MM-dd") + '/' + reportDateTime + '/playwright-report/' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  // use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'https://www.canva.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // trace: 'on-first-retry',
    
    
    // Debugging artifacts.
    // screenshot: 'on',
    // trace: 'on',
    // video: 'on',

    
    // args: [
    //   '--start-maximized',
    //   '--disable-dev-shm-usage',
    //   '--no-sandbox'
    // ],
  
  // video: "true",

  // create two scripts in your package.json:
  // "headless":"HEADLESS=true npm run test"
  // "local":"npm run test"

  // },

  /* Configure projects for major browsers */
  // projects: [
  //   {
  //     name: 'chromium',
  //     use: { ...devices['Desktop Chrome'] },
  //   },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  // ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
