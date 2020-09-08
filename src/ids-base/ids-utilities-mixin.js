const IdsUtilitiesMixin = {};

IdsUtilitiesMixin.utilities = {
  /**
   *
   * @param {string} val string value from the property
   * @returns {boolean} true/false value
   */
  stringToBool(val) {
    return (val).toLowerCase() === 'true';
  }
};

export { IdsUtilitiesMixin };
