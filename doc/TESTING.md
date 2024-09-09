# Testing

The IDS components are backed by [Playwright](https://playwright.dev). When contributing to the IDS enterprise project we expect a test for the functionality and that existing tests pass. Any time you fix a bug you should also make an additional test for that bug if it was not noticed by a test. Aim for both coverage and that the functionality is correctly tested.

## Test Stack

- [Playwright](https://playwright.dev) playwright documentation.

## Debugging Tests

You can either use the playwright debugger or the [visual code plugin](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright), the visual studio plugin is great. For more info see this [quick video](https://www.youtube.com/watch?v=tJF7UhA59Gc).  This is also [well documented](https://playwright.dev/docs/getting-started-vscode).

Another tip is to run `npm run build && node server` and then open the browser to http://localhost:4444 and inspect the page that is in question for debugging or the equal page on port 4300.

## Generating Tests

Walk through [this video](https://www.youtube.com/watch?v=LM4yqrOzmFE) for a great description on this process.

## Running test on the command line

You may want to run the test commands in a few ways depending what your doing. See the package.json for all of the commands in the script section.

- Full build, test run and coverage. This requires building and generating coverage so takes a while. Use command `npm run test:coverage`
- Full test run and coverage. If the code did not change and only tests did. You may want to skip the build step to save time. Use command `test:coverage:no-build`
- Running or debugging a few tests. If the code did not change and your not interested in coverage you can run a single component tests. Use command `npx playwright test -- alert`

### Test Command Breakdown

- `PERCY_LOGLEVEL=silent` silents the percy tests as they are chatty with messages
- `npx playwright test` the main test command
- `npx playwright test -- component` the main test command for just one component (partial name)
- `npx percy exec --` run the percy tests, mainly do this on the CI but it can be done locally if needed with the key
- `npx rimraf .nyc_output` remove coverage output from previous runs
- `npm run build:coverage` build the code with instrumentation so coverage can be collected
- `npm run test` Silences percy and runs playwright tests, can add `-- component` to this
- `npx nyc report` Make a readable coverage report
- `open coverage/index.html` Open the coverage report
- `npx playwright test --update-snapshots` Update snapshots for all tests and
- `npx playwright test --ui` Run the playwright GUI tool, most things in here are also in the Visual studio code plugin

## Visual Regression tests

We are using [percy.io](https://github.com/percy/percy-playwright) for visual regression tests. To run this you need to add the `PERCY_TOKEN` to your bashrc from the [percy settings page](https://percy.io/Infor-Design-System/IDS-Web-Components/settings).

Then run the command `npx percy exec -- npm run test`

We should have at least one visual regression image per component. When you create a Pull Request (PR) a github action will ask that reviewers check the images are as expected and approve. An example test looks like:

```js
test('matches visual snapshot in percy', async ({ page, browserName }) => {
  if (browserName !== 'chromium') return;
  await percySnapshot(page, 'ids-tag');
});
```

## Skipping Tests

- Usually its handy to run a components test do this by appending part of the name `npm run test -- tag`
- You can run a specific test by name such as `npx playwright test example.spec-a example.spec-b`
- To run only one test in a suite add only. For example `test.only(`. This only works when limiting scope. (i.e. `npm run test -- component-func`)
- To run only one suite use `describe.only(`. This only works when limiting scope. (i.e. `npm run test -- component-func`)
- To skip a test add `test(`
- You can also tag tests and run them via a grep [see docs for details](https://playwright.dev/docs/test-annotations#tag-tests).

## Converting Tests

The main goal is to convert all the tests in the `tests-to-convert` folder and into the files in `tests`. Each component generally has one file only in the new system.

- Open the component file in tests-to-convert to convert and look at each test
- Open the matching component file in tests to convert into
- Add async to the test for example `test('can set empty message label', async ({ page }) => {`
- Copy the test over to the new file. Put it in a new document section that makes sense for example:

```js
  test.describe('empty message tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ids-data-grid/empty-message.html');
    });

    test('can set empty message description', async ({ page }) => {
```

- A test step like `expect(dataGrid.getAttribute('suppress-empty-message')).toEqual(null);` is checking an attribute when checking something try to use [locators](https://playwright.dev/docs/locators) so the result would be something like `expect(await page.locator('ids-data-grid').getAttribut('suppress-empty-message')).toEqual(null);`
- A test step like `dataGrid.suppressEmptyMessage = true;` means you need to run JS in the page using an evaluate so this will become

```js
const value = await page.evaluate(() => {
  const elem = document.querySelector<IdsDataGrid>('ids-data-grid')!;
  elem.suppressEmptyMessage = true;
});
```

- fix any language issues for example `should render empty message with slot` can be `can render empty message with the slot`

## Component Test Mini-Tutorial

### What to test

- Test the settings for all settings and test both setting the attributes and the js setting
- Any api functions for input/result
- Any event handlers fire (only once)
- Aim for 100% test coverage in the tests of possible
- Include Axe and Percy tests

### Code the playwright tests

Add basic loading test.

```js
test('should not have errors', async ({ page, browserName }) => {
  if (browserName === 'firefox') return;
    let exceptions = null;
    await page.on('pageerror', (error) => {
    exceptions = error;
  });

  await page.goto(url);
  await page.waitForLoadState();
  await expect(exceptions).toBeNull();
});
```

Add axe test that runs accessibility tests through the axe API.

```js
test('should pass an Axe scan', async ({ page, browserName }) => {
  if (browserName !== 'chromium') return;
  const accessibilityScanResults = await new AxeBuilder({ page } as any)
   .exclude('[disabled]') // Disabled elements do not have to pass
   .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

Note that you can ignore some rules if they do not make sense. For example some designs might not be accessible for color contrast.

```js
const accessibilityScanResults = await new AxeBuilder({ page } as any)
  .exclude('[disabled]') // Disabled elements do not have to pass
  .analyze();
```

In the future we plan will add many more tests, including tests for QA team to do regression tests.

### Additional Steps

See the [checklist](https://github.com/infor-design/enterprise-wc/blob/main/doc/CHECKLIST.md#general-component-checklist) for additional steps.

#### Code the percy tests

We use [percy](https://percy.io/) for visual regression tests. Its a simplified process for visual images regression testing. You should add one test per component per theme (new theme only). We have a limit of 100,000 screen shots. So be aware of this. Each time you push small updated it can effect the count once you do a pull request. Add the `skip-ci-tests` label or close your PR and reopen it if its not ready for review and you keep adding fixes over and over. For these tests the name of the file is `ids-component-name-percy-test.js`. These tests run on the CI when you do pull requests. Come back and check the checks section on the pull request for results.

A percy tests sets the theme and takes a screen shot. Note the file name  and theme convention in the `percySnapshot` command and looks like this, make sure the name is unique and has the component name and the theme name (we may later add more themes to this).

```js
test('should match the visual snapshot in percy', async ({ page, browserName }) => {
  if (browserName !== 'chromium') return;
  await percySnapshot(page, 'ids-accordion-light');
});
```

## Test writing tips

## Accessibility

Among any specific accessibility tests you care to write one common tool we use is [Axe for Playwright](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md). The playwright docs have an [excellent guide worth reading](https://playwright.dev/docs/accessibility-testing).

Try to fix any errors but if needed you may want to skip some elements or rules.

- [Skipping Rules](https://playwright.dev/docs/accessibility-testing#disabling-individual-scan-rules)
- [Excluding Elements](https://playwright.dev/docs/accessibility-testing#excluding-individual-elements-from-a-scan)

## Avoiding Flaky Tests

- [Use retrying assertions](https://playwright.dev/docs/test-assertions#auto-retrying-assertions)
- [Dont Use manual assertions](https://playwright.dev/docs/best-practices#dont-use-manual-assertions)
- [Review Best Practices](https://playwright.dev/docs/best-practices)

## Trouble Shooting

- `Error: browserType.launch: Executable doesn't exist at /Users` - reinstall browsers with command `npx playwright install`
- `Not getting expected coverage` - Run `npm run build:coverage` to instrument the code. It may have been replaced with a watch run or app run build.
