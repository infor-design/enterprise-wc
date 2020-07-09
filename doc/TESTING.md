# Testing

The IDS components are backed by both functional and end-to-end (e2e) test suites.  When contributing to the IDS enterprise project, before we can accept pull requests we expect that new tests will be provided to prove that new functionality works, and that all existing tests pass.

## Test Stack

- [Jest](https://https://webdriver.io/) test runner for all tests.
- [Jest Puppeteer](https://github.com/smooth-code/jest-puppeteer) test runner for e2e tests.

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
- [ ] Snap Shots - good for aria tests
- [ ] Add [image testing](https://github.com/americanexpress/jest-image-snapshot)
- [ ] Travis / CI / Or github actions
- [ ] Browser Stack with [percy](https://percy.io/?utm_source=automate_paid&utm_medium=email&utm_campaign=percy_acquisition)
