/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
/* eslint-disable no-async-promise-executor */

// crux of it adapted from https://github.com/testing-library/dom-testing-library
// /blob/d347302d6b17280b71505d55d0cb9cda376b95cc/src/wait-for.js

/**
 * @returns {boolean} whether jest timers are enabled
 */
function areJestFakeTimersEnabled() {
  /* istanbul ignore else */
  if (typeof jest !== 'undefined' && jest !== null) {
    return (
      setTimeout._isMockFunction === true
      || Object.prototype.hasOwnProperty.call(setTimeout, 'clock')
    );
  }
  // istanbul ignore next
  return false;
}

/**
 * Wait for an assertion to stop failing with an optional timeout;
 * considers some quirks with jest fake timers.
 * usage: waitFor(() => expect(condition).[jestExpr e.g. "toNotEqual"/"toEqual"/etc]())
 *
 * @param {Function} callback method which returns a boolean to indicate that we have
 * @param {object} options document these options
 * @param {any} options.container container of selector to query
 * @param {number} options.timeout time to wait before timing out
 * @param {number} options.interval interval between refreshing check
 * @param {Function} options.onTimeout timeout callback which accepts an error called
 * @param {object} options.mutationObserverOptions options passed to the mutation observer which
 * we're queryingh the container on for updates
 * @returns {Promise} promise which waits for given callback to return true
 */
export default async function waitFor(
  callback,
  {
    container = window.document,
    timeout = 3000,
    interval = 40,
    onTimeout,
    mutationObserverOptions = {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    }
  } = {
    container: window.document,
    timeout: 100,
    interval: 50,
    onTimeout,
    mutationObserverOptions: {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    }
  }
) {
  if (typeof callback !== 'function') {
    throw new TypeError('Received `callback` arg must be a function');
  }

  return new Promise(async (resolve, reject) => {
    let lastError;
    let intervalId;
    let observer;
    let finished = false;
    let promiseStatus = 'idle';

    const overallTimeoutTimer = setTimeout(handleTimeout, timeout);

    const usingJestFakeTimers = areJestFakeTimersEnabled();
    if (usingJestFakeTimers) {
      checkCallback();

      // this is a dangerous rule to disable because it could lead to an
      // infinite loop. However, eslint isn't smart enough to know that we're
      // setting finished inside `onDone` which will be called when we're done
      // waiting or when we've timed out.
      // eslint-disable-next-line no-unmodified-loop-condition
      while (!finished) {
        if (!areJestFakeTimersEnabled()) {
          const error = new Error(
            'Changed from using fake timers to real timers while using waitFor. '
            + 'This is not allowed and will result in very strange behavior. '
            + 'Please ensure you\'re awaiting all async things your test is doing '
            + 'before changing to real timers. For more info, please go to '
            + 'https://github.com/testing-library/dom-testing-library/issues/830'
          );
          reject(error);
          return;
        }
        // we *could* (maybe should?) use `advanceTimersToNextTimer` but it's
        // possible that could make this loop go on forever if someone is using
        // third party code that's setting up recursive timers so rapidly that
        // the user's timer's don't get a chance to resolve.
        jest.advanceTimersByTime(interval);

        // It's really important that checkCallback is run *before* we flush
        // in-flight promises (original dev on dom-testing-library util hasn't
        // figured out specifics here)
        checkCallback();

        // In this rare case, *must* wait for in-flight promises
        // to resolve before continuing
        // https://stackoverflow.com/a/59243586/971592
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => {
          setTimeout(r, 0);
          jest.advanceTimersByTime(0);
        });
      }
    } else {
      intervalId = setInterval(checkRealTimersCallback, interval);
      const { MutationObserver } = window;
      observer = new MutationObserver(checkRealTimersCallback);
      observer.observe(container, mutationObserverOptions);
      checkCallback();
    }

    /**
     * clears timers/intervals and resolve the promise
     * @param {*} error TODO
     * @param {*} result TODO
     */
    function onDone(error, result) {
      finished = true;
      clearTimeout(overallTimeoutTimer);

      if (!usingJestFakeTimers) {
        clearInterval(intervalId);
        observer.disconnect();
      }

      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }

    /**
     * detect whether or not timers were changed
     * @returns {any} TODO
     */
    function checkRealTimersCallback() {
      if (areJestFakeTimersEnabled()) {
        const error = new Error(
          'Changed from using real timers to fake timers while using waitFor. '
          + 'This is not allowed and will result in very strange behavior. '
          + 'Please ensure you\'re awaiting all async things your test is doing before '
          + 'changing to fake timers. For more info, please go to '
          + 'https://github.com/testing-library/dom-testing-library/issues/830'
        );
        return reject(error);
      }

      return checkCallback();
    }

    /**
     * TODO: document this
     */
    function checkCallback() {
      // if promise has not yet resolved,
      // check does nothing
      if (promiseStatus === 'pending') {
        return;
      }

      // otherwise, run the callback and check the result has run already
      try {
        const result = callback();
        if (typeof result?.then === 'function') {
          promiseStatus = 'pending';
          result.then(
            (resolvedValue) => {
              promiseStatus = 'resolved';
              onDone(null, resolvedValue);
            },
            (rejectedValue) => {
              promiseStatus = 'rejected';
              lastError = rejectedValue;
            }
          );
        } else {
          onDone(null, result);
        }
        // If `callback` throws, wait for the next mutation,
        // interval, or timeout.
      } catch (error) {
        // Save the most recent callback error to reject the
        // promise with it in the event of a timeout
        lastError = error;
      }
    }

    /**
     * processes a timeout once needed
     */
    function handleTimeout() {
      if (lastError) {
        const error = new Error(lastError);
        if (onTimeout) {
          onTimeout(error);
        } else {
          throw error;
        }
      } else {
        const error = new Error('Timed out in waitFor');
        if (onTimeout) {
          onTimeout(error);
        }
        throw error;
      }
    }
  });
}
