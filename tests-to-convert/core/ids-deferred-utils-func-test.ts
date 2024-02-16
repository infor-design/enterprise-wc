import { IdsDeferred } from '../../src/utils/ids-deferred-utils/ids-deferred-utils';

describe('IdsDeferred Util', () => {
  test('can resolve a promise externally', (done) => {
    const dfrd = new IdsDeferred();
    const onResolve = jest.fn();
    const promise = dfrd.promise;

    // attach promise listener
    promise
      .then(onResolve)
      .finally(() => {
        expect(onResolve).toHaveBeenCalledTimes(1);
        done();
      });

    // resolve promise
    dfrd.resolve();
  });

  test('can reject a promise externally', (done) => {
    const dfrd = new IdsDeferred();
    const onReject = jest.fn();
    const promise = dfrd.promise;

    // attach promise listener
    promise
      .catch(onReject)
      .finally(() => {
        expect(onReject).toHaveBeenCalledTimes(1);
        done();
      });

    // reject promise
    dfrd.reject();
  });

  test('can resolve promise with arguments', async () => {
    const dfrd = new IdsDeferred();
    const testValue = 'payload';

    dfrd.resolve(testValue);
    const result = await dfrd.promise;

    expect(result).toEqual(testValue);
  });
});
