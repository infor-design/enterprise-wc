/**
 * Mocks Canvas getContext('2d') to use within our Jest environment
 */
const fetch: any = jest.fn(() => (
  Promise.resolve({
    json: () => Promise.resolve({ text: () => '' }),
    text: () => ''
  })
));

global.fetch = fetch;
export default fetch;
