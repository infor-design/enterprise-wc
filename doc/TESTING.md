# Testing

The IDS components are backed by both functional and end-to-end (e2e) test suites.  When contributing to the IDS enterprise project, before we can accept pull requests we expect that new tests will be provided to prove that new functionality works, and that all existing tests pass.

## Test Stack

- [Jest](https://https://webdriver.io/) test runner for all tests.
- [Jest Puppeteer](https://github.com/smooth-code/jest-puppeteer) test runner for e2e tests.

## Setting up the test environment

If you have never run the tests before, prior to running `npm run test` it may be necessary to install Puppeteer to allow a browser connection:

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

## Running test in watch mode

If your doing a lot of testing and changing you can save a lot of time running jest in watch mode. When you do any tests that change will be quickly rerun. To do so type `npm run test:watch` in the command line and then change a test file and watch that it reruns right away.

## Debugging e2e Tests

We could improve this...

- Add a puppeteer debug stop with `await jestPuppeteer.debug();`
```js
  test('adds 1 + 2 to equal 3', () => {
    await jestPuppeteer.debug();
    expect(1 + 2).toBe(3);
  });
```
- edit the jest-puppeteer.config.js and set `devtools: true` and `headless: false`
- run `npm run test`

## Visual Regression tests

We are using [percy.io](https://docs.percy.io/docs/puppeteer) for visual regression tests. First run the e2e tests with the special "percy" command `npm run test:visuals`. To run this you need to add the `PERCY_TOKEN` to your bashrc from the [percy settings page](https://percy.io/Infor-Design-System/IDS-Web-Components/settings).

We should have one visual regression image per component. When you PR a test an action will ask that reviewers check the images and approve. An example test looks like this:

```js
  it('should not have visual regressions (percy)', async () => {
    await page.setBypassCSP(true);
    await page.goto('http://localhost:4444/ids-tag', { waitUntil: 'load' });
    await percySnapshot(page, 'ids-tag');
  });
```

## Skipping Tests

- To run only one test in a suite add only. For example `test.only(`
- To run only one suite use `describe.only(`
- To skip a test add `test.skip(`

## Coverage

- To run in coverage mode (since it takes longer) use the command `npm run test:coverage`
- Open the [coverage report](../coverage/index.html)  in any browser
- Drill in to the component in question and try and improve coverage to 100%

## To Figure Out

- [ ] Add [jest dom](https://github.com/testing-library/jest-dom)
- [x] Snap Shots - good for aria tests
- [ ] Add [image testing](https://github.com/americanexpress/jest-image-snapshot)
- [ ] Browser Stack with [percy](https://percy.io)
- [x] Travis / CI / Or github actions
- [ ] Axe test Examples
- [ ] Postinstall script for Puppeteer install
