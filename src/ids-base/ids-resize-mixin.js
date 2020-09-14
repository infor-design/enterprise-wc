/**
 * Builds the global IDS object
 * @private
 * @returns {void}
 */
function checkForIDS() {
  if (!window.Ids) {
    window.Ids = {};
  }
}

// This is a global array of resizable target components.
// Any elements that end up here will have their `refresh()` methods called
// whenever the resizeObserver is triggered.
let resizeTargets = [];

// This is a global array of mutationObserver targets.
// Any elements that end up here will have their `refresh()` methods called
// whenever the mutationObserver is triggered.
let mutationTargets = [];

/**
 * This mixin provides access to a global ResizeObserver/MutationObserver instances
 * used by all IDS Components.
 */
const IdsResizeMixin = {
  /**
   * This method needs to run
   * @returns {void}
   */
  setupResize() {
    checkForIDS();

    // Build the global instance of it doesn't exist.
    // The global resize handler will attempt to run a `refresh` method
    // if it finds one on any registered component.
    if (!window.Ids.resizeObserver && typeof ResizeObserver !== 'undefined') {
      window.Ids.resizeObserver = new ResizeObserver(() => {
        resizeTargets.forEach((e) => {
          if (typeof e.refresh === 'function') {
            e.refresh();
          }
        });
      });
    }

    // Connect the `ro` property to the global instance
    if (!this.ro) {
      this.ro = window.Ids.resizeObserver;
    }

    // Check the global resize targets array and add this component if it's not already there.
    if (!resizeTargets.includes(this)) {
      resizeTargets.push(this);
    }
  },

  /**
   * Disconnects this component from the Global Resize handler
   * @returns {void}
   */
  disconnectResize() {
    if (this.ro) {
      resizeTargets = resizeTargets.filter((e) => !this.isEqualNode(e));
      delete this.ro;
    }
  },

  /**
   * Property that can be used to detect the existence
   * @returns {boolean} whether or not this component should currently listen
   * for Resize instructions.
   */
  shouldResize() {
    return typeof ResizeObserver !== 'undefined' && this.ro instanceof ResizeObserver;
  },

  /**
   * Sets up a global instance of MutationObserver that will fire an IDS Component's `refresh()`
   * method when it needs to update.
   * @returns {void}
   */
  setupDetectMutations() {
    checkForIDS();

    // Setup a MutationObserver on the alignTarget that will cause this Popup instance
    // to move itself whenever an attribute that controls size is changed.
    // This can help adjust the popup automatically when its target moves.
    // @TODO: Implement a way to detect CSS property changes on the alignTarget.
    // @TODO: this should probably also update if the `alignTarget` changes to something else,
    // but we don't currently have a way to detect that.
    if (!window.Ids.mutationObserver && typeof MutationObserver !== 'undefined') {
      window.Ids.mutationObserver = new MutationObserver((mutation) => {
        switch (mutation.type) {
          case 'childList':
            break;
          default: // 'attributes'
            if (typeof this.refresh === 'function') {
              this.refresh();
            }
        }
      });
    }

    // Connect the `mo` property to the global instance
    if (!this.mo) {
      this.mo = window.Ids.mutationObserver;
    }

    if (!mutationTargets.includes(this)) {
      mutationTargets.push(this);
    }
  },

  disconnectDetectMutations() {
    if (this.mo) {
      mutationTargets = mutationTargets.filter((e) => !this.isEqualNode(e));
      delete this.mo;
    }
  },

  /**
   * Property that can be used to detect the existence
   * @returns {boolean} whether or not this component should currently listen
   * for Resize instructions.
   */
  shouldDetectMutations() {
    return typeof MutationObserver !== 'undefined' && this.mo instanceof MutationObserver;
  }
};

export { IdsResizeMixin };
