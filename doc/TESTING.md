# Testing

The IDS components are backed by end-to-end (e2e) test suites.  When contributing to the IDS enterprise project, before we can accept pull requests we expect that new tests will be provided to prove that new functionality works, and that all existing tests pass.

The testing strategy is to aim for 100% coverage but initially 80% is the minimum. You should try to make sure to cover all the functionality of the component with tests. Any time you fix a bug you should also make an additional test for that bug if it was not noticed by a test.

When covering tests you can use either the functional tests `*-func-test.js` or e2e puppeteer tests `*-e2e-test.js`. The coverage is combined between these. Because the functional tests use JSDOM this means that some things may not be testable with it so in that case you should try to test it in an e2e puppeteer test which uses a real browser.

Aim for 100% but the minimum is 80% and we can come back to some.

## Test Stack

- [Jest](https://webdriver.io/) test runner for all tests.
- [Jest Puppeteer](https://github.com/smooth-code/jest-puppeteer) test runner for e2e tests.
- [Puppeteer](https://pptr.dev/) puppeteer documentation.

## Puppeteer Troubleshooting

If you are having an issue with puppeteer when running tests, and have already installed project dependencies (e.g. `npm i`), then you can try running:

```sh
node node_modules/puppeteer/install.js
```

## Debugging Tests

You can either use the playwright debugger or visual code. For more info see this [quick video](https://www.youtube.com/watch?v=tJF7UhA59Gc).  This is also [well documented](https://playwright.dev/docs/getting-started-vscode).

Another tip is to run `npm run build && node server` and then open the browser to http://localhost:4444 and inspect the page that is in question for debugging.

## Generating Tests

Walk through [this video](https://www.youtube.com/watch?v=LM4yqrOzmFE) for a great description on this process.

## Visual Regression tests

We are using [percy.io](https://docs.percy.io/docs/puppeteer) for visual regression tests. First run the e2e tests with the special "percy" command `npm run test:visuals`. To run this you need to add the `PERCY_TOKEN` to your bashrc from the [percy settings page](https://percy.io/Infor-Design-System/IDS-Web-Components/settings).

We should have one visual regression image per component. When you PR a test an action will ask that reviewers check the images and approve. An example test looks like this:

```js
  it('should not have visual regressions (percy)', async () => {
    await page.goto('http://localhost:4444/ids-tag', { waitUntil: ['networkidle0', 'domcontentloaded'] });
    await percySnapshot(page, 'ids-tag');
  });
```

## Skipping Tests

- You can run a specific test by name such as `npx playwright test example.spec-a example.spec-b`
- To run only one test in a suite add only. For example `test.only(`. This only works when limiting scope. (i.e. `npm run test -- component-func`)
- To run only one suite use `describe.only(`. This only works when limiting scope. (i.e. `npm run test -- component-func`)
- To skip a test add `test.skip(`
- You can also tag tests and run them via a grep [see docs for details](https://playwright.dev/docs/test-annotations#tag-tests).

## Test writing tips

## Accessibility

Among any specific accessibility tests you care to write one common tool we use is [Axe for Playwright](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md). The Playwright docs have an [excellent guide worth reading](https://playwright.dev/docs/accessibility-testing).

Do try to fix any errors but if needed you may want to skip some elements or rules.

- [Skipping Rules](https://playwright.dev/docs/accessibility-testing#disabling-individual-scan-rules)
- [Excluding Elements](https://playwright.dev/docs/accessibility-testing#excluding-individual-elements-from-a-scan)

## Coverage

We are trying for full coverage (100%) but this is not always possible. But do your best.

## Avoiding Flaky Tests

- [Use retrying assertions](https://playwright.dev/docs/test-assertions#auto-retrying-assertions)
- [Dont Use manual assertions](https://playwright.dev/docs/best-practices#dont-use-manual-assertions)
- [Review Best Practices](https://playwright.dev/docs/best-practices)

## Trouble Shooting

`Error: browserType.launch: Executable doesn't exist at /Users` - reinstall browsers with command `npx playwright install`
