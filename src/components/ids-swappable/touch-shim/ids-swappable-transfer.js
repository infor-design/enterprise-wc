export default class DataTransfer {
  constructor() {
    this.dropEffect = 'move';
    this.effectAllowed = 'all';
    this.data = {};
  }

  get dropEffect() {
    return this.dropEffect;
  }

  set dropEffect(value) {
    this.dropEffect = value;
  }

  get effectAllowed() {
    return this.effectAllowed;
  }

  set effectAllowed(value) {
    this.effectAllowed = value;
  }

  get types() {
    return Object.keys(this.data);
  }

  /**
   * Removes the data associated with a given type.
   *
   * The type argument is optional. If the type is empty or not specified, the data
   * associated with all types is removed. If data for the specified type does not exist,
   * or the data transfer contains no data, this method will have no effect.
   *
   * @param type Type of data to remove.
   */
  clearData(type) {
    if (type != null) {
      delete this.data[type];
    } else {
      this.data = null;
    }
  }

  getData(type) {
    return this.data[type] || '';
  }

  setData(type, value) {
    this.data[type] = value;
  }

  setDragImage = function (instance, img, offsetX, offsetY) {
    instance.imgCustom = img;
    instance.imgOffset = { x: offsetX, y: offsetY };
  };
}
