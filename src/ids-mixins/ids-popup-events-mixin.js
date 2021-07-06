import IdsEventsMixin from './ids-events-mixin';

// Attributes that will be applied to Popups with the Interactions Mixin.
const POPUP_INTERACTION_ATTRIBUTES = [];

const IdsPopupInteractionsMixin = (superclass) => class extends IdsEventsMixin(superclass) {
  constructor() {
    super();
  }

  /**
   * @property {boolean} hasOpenEvents true if "open" events are currently applied to this component
   */
  hasOpenEvents = false;

  /**
   * @returns {Array<string>} IdsInput component observable properties
   */
  static get attributes() {
    return [...super.attributes, ...POPUP_INTERACTION_ATTRIBUTES];
  }

  /**
   * Attaches some events when the Popupmenu is opened.
   * @private
   * @returns {void}
   */
  addOpenEvents() {
    // Attach all these events on a Renderloop-staggered timeout
    window.requestAnimationFrame(() => {
      // Attach a click handler to the window for detecting clicks outside the popup.
      // If these aren't captured by a popup, the menu will close.
      this.onEvent('click.toplevel', window, () => {
        this.hide();
      });
      this.hasOpenEvents = true;
    });
  }

  /**
   * Detaches some events when the Popupmenu is closed.
   * @private
   * @returns {void}
   */
  removeOpenEvents() {
    if (!this.hasOpenEvents) {
      return;
    }
    this.offEvent('click.toplevel', window);
    this.hasOpenEvents = false;
  }
};

export default IdsPopupInteractionsMixin;
