/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import '../helpers/match-media-mock';

import '../../src/mixins/ids-xss-mixin/ids-xss-mixin';
import '../../src/components/ids-message/ids-message';

describe('IdsXssMixin tests (properties)', () => {
  let messageEl: any;

  beforeEach(async () => {
    messageEl = document.createElement('ids-message');
    messageEl.id = 'xss-tests';

    document.body.appendChild(messageEl);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    messageEl = null;
  });

  test('will remove tags that are not allowed', () => {
    messageEl.message = 'Hey Man, <script id="test-script">alert(sup);</script> nice shot!';

    expect(messageEl.message).toBe('Hey Man, alert(sup); nice shot!');
  });

  test('can configure which tags are ignored', () => {
    const testInput = 'There should be no link after this sentence. <a href="http://example.com">Link</a>';
    const testOutput = 'There should be no link after this sentence. Link';

    // Ignore Everything
    messageEl.xssIgnoredTags = '';
    messageEl.message = testInput;

    expect(messageEl.message).toBe(testOutput);

    // Test junk value.  Nothing should be altered.
    messageEl.xssIgnoredTags = 4;
    messageEl.message = testInput;

    expect(messageEl.message).toBe(testOutput);
  });
});

describe('IdsXssMixin tests (attributes)', () => {
  let messageEl: any;

  beforeEach(async () => {
    document.body.insertAdjacentHTML('beforeend', `<ids-message id="xss-tests" xss-ignored-tags=""></ids-message>`);
    messageEl = document.querySelector('ids-message');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    messageEl = null;
  });

  test('ignores tags when its `xss-ignored-tags` property is empty', () => {
    const testInput = 'There should be no link after this sentence. <a href="http://example.com">Link</a>';
    const testOutput = 'There should be no link after this sentence. Link';
    messageEl.message = testInput;

    expect(messageEl.message).toBe(testOutput);
  });
});
