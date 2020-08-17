const IdsUtilitiesMixin = {}

IdsUtilitiesMixin.utilities = {
  /**
   *
   * @param {string} val
   */
  stringToBool(val) {
    return (val + '').toLowerCase() === 'true';
  }
}

export { IdsUtilitiesMixin };
