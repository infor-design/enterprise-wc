import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 8000,
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: !process.env.CI,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry if fails */
  retries: 1,
  /* Set workers process.env.CI ? 2 : */
  workers: process.env.CI ? 2 : 5,
  /* Control the snap shot names */
  snapshotPathTemplate: '{testDir}/{testFileDir}/snapshots/{arg}.snap',
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html'],
    ['junit', { outputFile: 'test-results/junit-results.xml' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:4444',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer , 'on-first-retry' */
    trace: 'off',

    /* Changes the timezone of the context. */
    timezoneId: 'America/New_York'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'node server'
  },
});
