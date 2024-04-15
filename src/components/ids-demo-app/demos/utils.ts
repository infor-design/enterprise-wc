import {
  camelCase,
  stringToBool,
  stringToNumber,
  injectTemplate,
  isPrintable,
  escapeRegExp,
  kebabCase
} from '../../../utils/ids-string-utils/ids-string-utils';

import {
  colorNameToRgba,
  contrastColor
} from '../../../utils/ids-color-utils/ids-color-utils';

import {
  stripTags,
  stripHTML,
  sanitizeHTML,
  sanitizeConsoleMethods,
  unescapeHTML,
  escapeHTML
} from '../../../utils/ids-xss-utils/ids-xss-utils';

import {
  clearAnimationInterval,
  clearAnimationTimeout,
  cssTransitionTimeout,
  requestAnimationInterval,
  requestAnimationTimeout,
} from '../../../utils/ids-timer-utils/ids-timer-utils';

import { isObject, isObjectAndNotEmpty } from '../../../utils/ids-object-utils/ids-object-utils';

(window as any).utils = {
  camelCase,
  stringToBool,
  stringToNumber,
  injectTemplate,
  isPrintable,
  escapeRegExp,
  kebabCase,
  colorNameToRgba,
  contrastColor,
  stripTags,
  stripHTML,
  sanitizeHTML,
  sanitizeConsoleMethods,
  unescapeHTML,
  escapeHTML,
  clearAnimationInterval,
  clearAnimationTimeout,
  cssTransitionTimeout,
  requestAnimationInterval,
  requestAnimationTimeout,
  isObject,
  isObjectAndNotEmpty
};
