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

/**
 * This mixin provides access to a global ResizeObserver instance used by all IDS Components,
 * and is responsible for setting up a local MutationObserver instance for this component that
 * automatically triggers a `refresh()` method if one is available.
 *
 * NOTE: When using this mixin, it's still required for you to implement
 * `ResizeObserver.connect()/disconnect()` and `MutationObserver.connect()/disconnect()`
 * when connecting/disconnecting a component.
 */
const IdsResizeMixin = {
  /**
   * This method needs to run
   * @private
   * @returns {void}
   */
  setupResize() {
    checkForIDS();

    // Build the global instance of it doesn't exist.
    // The global resize handler will attempt to run a `refresh` method
    // if it finds one on any registered component.
    if (!window.Ids.resizeObserver && typeof ResizeObserver !== 'undefined') {
      /* istanbul ignore next */
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
   * @private
   * @returns {void}
   */
  disconnectResize() {
    if (this.ro) {
      resizeTargets = resizeTargets.filter((e) => !this.isEqualNode(e));
      delete this.ro;
    }
  },

  /**
   * Detects whether or not this component should be checking for resize.
   * @private
   * @returns {boolean} whether or not this component should currently listen
   * for Resize instructions.
   */
  shouldResize() {
    return typeof ResizeObserver !== 'undefined' && this.ro instanceof ResizeObserver;
  },

  /**
   * Sets up a MutationObserver that will fire an IDS Component's `refresh()`
   * method when it needs to update.
   * @private
   * @returns {void}
   */
  setupDetectMutations() {
    checkForIDS();

    if (!this.mo && typeof MutationObserver !== 'undefined') {
      this.mo = new MutationObserver((mutation) => {
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

    /* istanbul ignore next */
    if (!this.mutationTargets) {
      this.mutationTargets = [];
    }
    if (!this.mutationTargets.includes(this)) {
      this.mutationTargets.push(this);
    }
  },

  /**
   * @private
   * @returns {void}
   */
  disconnectDetectMutations() {
    if (this.mo) {
      this.mutationTargets = [];
      delete this.mo;
    }
  },

  /**
   * Detects whether or not this component should be watching for DOM Mutations.
   * @private
   * @returns {boolean} whether or not this component should currently listen
   * for Resize instructions.
   */
  shouldDetectMutations() {
    return typeof MutationObserver !== 'undefined' && this.mo instanceof MutationObserver;
  }
};

export { IdsResizeMixin };
