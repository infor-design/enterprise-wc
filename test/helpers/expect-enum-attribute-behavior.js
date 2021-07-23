import { stringUtils } from '../../src/ids-base/ids-string-utils';

const RANDOM_VALUE = 'rando_val_23';

/**
 * Runs assertions on a test that a standard element attribute
 * can be one of a specific set of values while getting
 * coverage % for setters/getters.
 *
 * @param {object} param0 params
 * @param {HTMLElement} param0.elem Element to test
 * @param {string} param0.attribute the attribute namespace to check e.g. "parent-containment"
 * @param {Array<string>} param0.values possible values the enum can be set to
 * @param {string|null} param0.defaultValue a default value the attribute
 * should be set to when no valid attribute is set. If set to "null", will
 * assume that the attribute should be removed when it has invalid value.
 */
export default function expectEnumAttributeBehavior({
  elem,
  attribute,
  values,
  defaultValue
}) {
  const camelCasedAttrib = stringUtils.camelCase(attribute);

  for (const v of values) {
    elem.setAttribute(attribute, v);
    expect(elem.getAttribute(v)).toEqual(v);
  }

  if (defaultValue) {
    elem.setAttribute(attribute, RANDOM_VALUE);
    expect(elem.attribute).toEqual(defaultValue);

    elem.setAttribute(attribute, values[0]);
    expect(elem.attribute).toEqual(values[0]);

    elem[camelCasedAttrib] = RANDOM_VALUE;
    expect(elem[camelCasedAttrib]).toEqual(defaultValue);
  }

  if (defaultValue === null) {
    elem[camelCasedAttrib] = RANDOM_VALUE;
    expect(elem[camelCasedAttrib]).toEqual(defaultValue);
    expect(elem.hasAttribute(attribute)).toBeFalsy();
  }

  for (const v of values.reverse()) {
    elem.setAttribute(attribute, v);
    expect(elem.getAttribute(v)).toEqual(v);
  }
}
