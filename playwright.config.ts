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
  timeout: 15000,
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry if fails */
  retries: 2,
  /* Set workers process.env.CI ? 2 : */
  workers: undefined,
  /* Control the snap shot names */
  snapshotPathTemplate: '{testDir}/{testFileDir}/snapshots/{arg}.snap',
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['./tests/zephyr/reporter.ts',
      {
        // Zephyr Scale api token
        apiKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7ImJhc2VVcmwiOiJodHRwczovL2luZm9yd2lraS5hdGxhc3NpYW4ubmV0IiwidXNlciI6eyJhY2NvdW50SWQiOiI3MTIwMjA6ZjUwNjc3MzEtMTc3Zi00NTU5LTlmMmItYzNkNzFkZjU4ZDU2In19LCJpc3MiOiJjb20ua2Fub2FoLnRlc3QtbWFuYWdlciIsInN1YiI6ImEwZDdlMWE3LWMxZGYtM2Q5Zi05YmVhLWY4NzkyMjdlMjBjZSIsImV4cCI6MTc1MTQ1MjU2NywiaWF0IjoxNzE5OTE2NTY3fQ.wMNMcvtEdtVr_8pODmXCFY63NbLYOCcc0y9znPMeBu4',
        // Jira project ID
        projectId: 'IDS',
        // Build ID
        buildId: '32452',
        // Branch ID
        branchId: 'Development',
        // Base Zephyr Scale api url
        baseUrl: 'https://api.zephyrscale.smartbear.com/v2',
        // Test cycle folder Id
        testCycleFolderId: '15108775',
        codeBase: 'Web Component',
        codeVersion: '1.3'
      }
    ]
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
    },

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
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'node server',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  },
});
