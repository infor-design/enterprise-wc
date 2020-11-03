/**
 * Track changes on inputs elements and show a dirty indicator.
 */
const IdsDirtyTrackerMixin = {
  /**
   * Handle dirty tracker values
   * @returns {void}
   */
  handleDirtyTracker() {
    if (this.dirtyTracker) {
      if (this.input) {
        const val = this.input.value;
        this.dirty = { original: val !== null ? val : '' };
        this.dirtyTrackerEvents();
      }
    }
  },

  /**
   * Check if dirty tracker icon exists if not add it
   * @private
   * @returns {void}
   */
  appendDirtyTrackerIcon() {
    let icon = this.shadowRoot.querySelector('.icon-dirty');
    if (!icon) {
      icon = document.createElement('ids-icon');
      icon.setAttribute('icon', 'dirty');
      icon.setAttribute('size', 'small');
      icon.className = 'icon-dirty';
      this.input?.parentNode?.insertBefore(icon, this.input);
    }
  },

  /**
   * Remove if dirty tracker icon exists
   * @private
   * @returns {void}
   */
  removeDirtyTrackerIcon() {
    const icon = this.shadowRoot.querySelector('.icon-dirty');
    if (icon) {
      icon.remove();
    }
  },

  /**
   * Check if dirty tracker msg exists if not add it
   * @private
   * @returns {void}
   */
  appendDirtyTrackerMsg() {
    let msg = this.label?.querySelector('.msg-dirty');
    if (!msg) {
      msg = document.createElement('ids-label');
      msg.setAttribute('audible', true);
      msg.className = 'msg-dirty';
      msg.innerHTML = ', Modified';
      this.label?.appendChild(msg);
    }
  },

  /**
   * Remove if dirty tracker msg exists
   * @private
   * @returns {void}
   */
  removeDirtyTrackerMsg() {
    const msg = this.label?.querySelector('.msg-dirty');
    if (msg) {
      msg.remove();
    }
  },

  /**
   * Set dirtyTracker
   * @private
   * @param {string} val The current element value
   * @returns {void}
   */
  setDirtyTracker(val) {
    if (typeof val === 'undefined') {
      this.handleDirtyTracker();
      return;
    }

    this.isDirty = this.dirty?.original !== val;
    if (this.isDirty) {
      this.appendDirtyTrackerIcon();
      this.appendDirtyTrackerMsg();
    } else {
      this.removeDirtyTrackerIcon();
      this.removeDirtyTrackerMsg();
    }
  },

  /**
   * Handle dirty tracker events
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  dirtyTrackerEvents(option) {
    const action = option === 'remove' ? 'removeEventListener' : 'addEventListener';
    if (this.input) {
      this.eventHandlers[action]('change', this.input, () => {
        this.setDirtyTracker(this.input.value);
      });
    }
  },

  /**
   * Destroy dirty tracker
   * @returns {void}
   */
  destroyDirtyTracker() {
    this.dirtyTrackerEvents('remove');
    this.removeDirtyTrackerIcon();
  }
};

export { IdsDirtyTrackerMixin };
