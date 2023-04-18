# Testing

The IDS components are backed by both functional and end-to-end (e2e) test suites.  When contributing to the IDS enterprise project, before we can accept pull requests we expect that new tests will be provided to prove that new functionality works, and that all existing tests pass.

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

## Debugging Functional Tests

- Add a debugger statement to the test

```js
  test('adds 1 + 2 to equal 3', () => {
    debugger;
    expect(1 + 2).toBe(3);
  });
```
- Type `npm run test:debug` in the command line
- In chrome go to url `chrome://inspect/`
- Click the "inspect" target and then click go in the debugger to get to your test debug point
- You can also debug a single test with a partial name of the test behind `--` for example `node --inspect-brk node_modules/.bin/jest --runInBand -- dropdown-func`

## Running test in watch mode

If your doing a lot of testing and changing you can save a lot of time running Jest in watch mode. When you do any tests that change will be quickly rerun. To do so type `npm run test:watch` in the command line and then change a test file and watch that it reruns right away.

## Debugging e2e Tests

We could improve this...

- Add a puppeteer debug stop with `debugger` and use `await jestPuppeteer.debug();` to pause the browser
```js
  test('adds 1 + 2 to equal 3', () => {
    debugger;
    expect(1 + 2).toBe(3);
    await jestPuppeteer.debug();
  });
```
- Also check out `await jestPuppeteer.debug();`
- edit the jest-puppeteer.config.js and set `devtools: true` and `headless: false`
- run `npm run test:debug -- tooltip`
- may also need to make the [timeout](https://github.com/infor-design/enterprise-wc/blob/main/jest.config.js#L21) longer temporarily

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

- You can run a specific test by name such as `npm run test -- ids-data-source-mixin-func-test`
- To run only one test in a suite add only. For example `test.only(`. This only works when limiting scope. (i.e. `npm run test -- component-func`)
- To run only one suite use `describe.only(`. This only works when limiting scope. (i.e. `npm run test -- component-func`)
- To skip a test add `test.skip(`

## e2e Test Tips

## Coverage

- To run in coverage mode (which may take more time than just running tests alone), use the command `npm run test:coverage`
- Open the local file `<folder>/coverage/index.html` in any browser
- Drill in to the component in question and try and improve coverage to 100% at a minimum statements, branches, functions and lines should al be green
- The build checks will drop if we go below 95% or the coverage decreases (working on tweaking the right values here)
- If while inspecting the coverage report you notice a black "E" or "I", this would indicate that a connected logic branch (else or if) to the line reported is not detected as covered

We are trying for full coverage (100%) but this is not always possible. But do your best.
Keep in mind we can now cover tests with either an 2e test or a functional test. Functional tests in jest are faster and can be used for things like:

- Testing the functions/api
- Testing the settings/getters and setters
- Testing Keyboard (although this can also be done in e2e)
- Testing event handlers and firing events

e2e tests can be best for:

- Some jest bugs with shadowRoot
- Mouse, Touch, Dragging, Keyboard
- Accessibility Scans
