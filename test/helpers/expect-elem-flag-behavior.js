import { stringUtils } from '../../src/ids-base/ids-string-utils';

/**
 * Runs assertions on a test that an element's standard flag attribute
 * should be able to be toggled and predictable with respect to it's
 * attribute as well as properties in every permutation.
 *
 * @param {HTMLElement} elem Element to test
 * @param {string} attribute string-attribute-namespace
 */
export default function expectElemFlagBehavior(elem, attribute) {
  const initialValue = stringUtils.stringToBool(elem.getAttribute(attribute));
  const camelCasedAttrib = stringUtils.camelCase(attribute);

  if (initialValue) {
    elem[camelCasedAttrib] = false;
    expect(elem[camelCasedAttrib]).toEqual(false);
  }

  expect(elem[camelCasedAttrib]).toEqual(false);

  elem[camelCasedAttrib] = true;
  expect(elem[camelCasedAttrib]).toEqual(true);

  elem.removeAttribute(attribute);
  expect(elem[camelCasedAttrib]).toEqual(false);

  elem.setAttribute(attribute, true);
  expect(elem.hasAttribute(attribute)).toEqual(true);

  elem.removeAttribute(attribute);
  expect(elem[camelCasedAttrib]).toEqual(false);

  elem.setAttribute(attribute, '');
  expect(elem[camelCasedAttrib]).toEqual(true);

  elem[camelCasedAttrib] = false;
  expect(elem.hasAttribute(attribute)).toEqual(false);
}
