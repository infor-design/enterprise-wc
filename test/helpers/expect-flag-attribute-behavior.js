import { IdsStringUtils } from '../../src/utils';

/**
 * Runs assertions on a test that an element's standard flag attribute
 * should be able to be toggled and predictable with respect to it's
 * attribute as well as properties in every permutation while
 * getting coverage for setters/getters.
 *
 * @param {object} param0 params
 * @param {HTMLElement} param0.elem Element to test
 * @param {string} param0.attribute string-attribute-namespace
 */
export default function expectFlagAttributeBehavior({ elem, attribute }) {
  const initialValue = IdsStringUtils.stringToBool(elem.getAttribute(attribute));
  const camelCasedAttrib = IdsStringUtils.camelCase(attribute);

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
