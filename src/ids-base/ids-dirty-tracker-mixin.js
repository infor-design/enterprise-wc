import { IdsEventsMixin } from './ids-events-mixin';

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
        this.dirty = { original: val };
        this.dirtyTrackerEvents();
      }
    } else {
      this.destroyDirtyTracker();
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
    let msg = this.labelEl?.querySelector('.msg-dirty');
    if (!msg) {
      msg = document.createElement('ids-text');
      msg.setAttribute('audible', true);
      msg.className = 'msg-dirty';
      msg.innerHTML = ', Modified';
      this.labelEl?.appendChild(msg);
    }
  },

  /**
   * Remove if dirty tracker msg exists
   * @private
   * @returns {void}
   */
  removeDirtyTrackerMsg() {
    const msg = this.labelEl?.querySelector('.msg-dirty');
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
    if (this.input) {
      const eventName = 'change';
      if (option === 'remove') {
        const handler = this.eventHandlers?.handledEvents?.get(eventName);
        if (handler && handler.target === this.input) {
          this.eventHandlers.removeEventListener(eventName, this.input);
        }
      } else {
        this.eventHandlers.addEventListener(eventName, this.input, () => {
          this.setDirtyTracker(this.input.value);
        });
      }
    }
  },

  /**
   * Destroy dirty tracker
   * @returns {void}
   */
  destroyDirtyTracker() {
    this.dirtyTrackerEvents('remove');
    this.removeDirtyTrackerIcon();
    this.removeDirtyTrackerMsg();
  }
};

export { IdsDirtyTrackerMixin };
