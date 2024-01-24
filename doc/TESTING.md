# Testing

The IDS components are backed by end-to-end (e2e) test suites using [Playwright](https://playwright.dev).  When contributing to the IDS enterprise project, before we expect that new tests will be provided to prove that new functionality works, and that all existing tests pass.

You should try to make sure to cover all the functionality of the component with tests. Any time you fix a bug you should also make an additional test for that bug if it was not noticed by a test.

Aim for both coverage and that the functionality is correctly tested.

## Test Stack

- [Playwright](https://playwright.dev) playwright documentation.

## Debugging Tests

You can either use the playwright debugger or the [visual code plugin](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright). For more info see this [quick video](https://www.youtube.com/watch?v=tJF7UhA59Gc).  This is also [well documented](https://playwright.dev/docs/getting-started-vscode).

Another tip is to run `npm run build && node server` and then open the browser to http://localhost:4444 and inspect the page that is in question for debugging.

## Generating Tests

Walk through [this video](https://www.youtube.com/watch?v=LM4yqrOzmFE) for a great description on this process.

### Running tests locally

You may want to run the test commands in a few ways depending what your doing.

- Full build, test run and coverage. This requires building and generating coverage so takes a while. Use command `npm run test:coverage`
- Full test run and coverage. If the code did not change and only tests did. You may want to skip the build step to save time. Use command `test:coverage:no-build`
- Running or debugging a few tests. If the code did not change and your not interested in coverage you can run a single component tests. Use command `npx playwright test -- alert`

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

- You can run a specific test by name such as `npx playwright test example.spec-a example.spec-b`
- To run only one test in a suite add only. For example `test.only(`. This only works when limiting scope. (i.e. `npm run test -- component-func`)
- To run only one suite use `describe.only(`. This only works when limiting scope. (i.e. `npm run test -- component-func`)
- To skip a test add `test(`
- You can also tag tests and run them via a grep [see docs for details](https://playwright.dev/docs/test-annotations#tag-tests).

## Test writing tips

## Accessibility

Among any specific accessibility tests you care to write one common tool we use is [Axe for Playwright](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md). The Playwright docs have an [excellent guide worth reading](https://playwright.dev/docs/accessibility-testing).

Do try to fix any errors but if needed you may want to skip some elements or rules.

- [Skipping Rules](https://playwright.dev/docs/accessibility-testing#disabling-individual-scan-rules)
- [Excluding Elements](https://playwright.dev/docs/accessibility-testing#excluding-individual-elements-from-a-scan)

## Avoiding Flaky Tests

- [Use retrying assertions](https://playwright.dev/docs/test-assertions#auto-retrying-assertions)
- [Dont Use manual assertions](https://playwright.dev/docs/best-practices#dont-use-manual-assertions)
- [Review Best Practices](https://playwright.dev/docs/best-practices)

## Trouble Shooting

`Error: browserType.launch: Executable doesn't exist at /Users` - reinstall browsers with command `npx playwright install`
`Not getting expected coverage` - Run `npm run build:coverage` to instrument the code. It may have been replaced with a watch run or app run build.
