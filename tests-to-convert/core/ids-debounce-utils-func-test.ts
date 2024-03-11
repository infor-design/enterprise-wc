/**
 * @jest-environment jsdom
 */
import debounce from '../../src/utils/ids-debounce-utils/ids-debounce-utils';

describe('IdsDebounceUtils Tests', () => {
  beforeEach(async () => {
    jest.useFakeTimers();
  });

  afterEach(async () => {
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  test('should executes just once with default threshold', () => {
    const func = jest.fn();
    const debounced: any = debounce(func, 0);
    expect(func).not.toBeCalled();
    debounced();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(100);
    debounced();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(249);
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(1);
    expect(func).toBeCalledTimes(1);
  });

  test('should executes just once', () => {
    const func = jest.fn();
    const debounced: any = debounce(func, 500);
    expect(func).not.toBeCalled();
    debounced();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(100);
    debounced();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(499);
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(1);
    expect(func).toBeCalledTimes(1);
  });

  test('should executes immediately', () => {
    const func = jest.fn();
    const debounced: any = debounce(func, 500, true);
    expect(func).not.toBeCalled();
    debounced();
    expect(func).toBeCalledTimes(1);
  });
});
