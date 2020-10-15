/**
 * Track changes on inputs elements and show a dirty indicator.
 */
const IdsTrackdirtyMixin = {
  /**
   * Should use trackdirty OR not, init false
   * @private
   */
  useTrackdirty: false,

  /**
   * Handle trackdirty values
   * @private
   * @returns {void}
   */
  handleTrackdirty() {
    if (this.trackdirty) {
      if (this.input) {
        const val = this.input.getAttribute('value');
        this.dirty = { original: val !== null ? val : '' };
        this.useTrackdirty = true;
        this.trackdirtyEvents();
      }
    }
  },

  /**
   * Check if dirty icon exists if not add it
   * @private
   * @returns {void}
   */
  appendTrackdirtyIcon() {
    if (this.useTrackdirty) {
      const icon = this.querySelector('.icon-dirty');
      const label = this.querySelector('ids-label');
      const classList = `icon-dirty${label ? ' has-label' : ''}`;
      if (!icon) {
        this.insertAdjacentHTML('afterbegin', `<ids-icon icon="dirty" size="small" class="${classList}"></ids-icon>`);
      }
    }
  },

  /**
   * Remove if dirty icon exists
   * @private
   * @returns {void}
   */
  removeTrackdirtyIcon() {
    const icon = this.querySelector('.icon-dirty');
    if (icon) {
      icon.remove();
    }
  },

  /**
   * Check if dirty icon exists if not add it
   * @private
   * @returns {void}
   */
  appendTrackdirtyMsg() {
    if (this.useTrackdirty) {
      const msg = this.querySelector('.msg-dirty');
      if (!msg) {
        const label = this.querySelector('ids-label');
        label?.insertAdjacentHTML('beforeend', '<ids-label audible="true" class="msg-dirty">, Modified</ids-label>');
      }
    }
  },

  /**
   * Remove if dirty icon exists
   * @private
   * @returns {void}
   */
  removeTrackdirtyMsg() {
    const msg = this.querySelector('.msg-dirty');
    const label = this.querySelector('ids-label');
    if (msg && label) {
      msg.remove();
    }
  },

  /**
   * Set trackdirty icon exists
   * @private
   * @param {string} val The current element value
   * @returns {void}
   */
  setTrackdirty(val) {
    if (typeof val === 'undefined') {
      this.handleTrackdirty();
      return;
    }

    if (this.useTrackdirty) {
      this.isDirty = this.dirty?.original !== val;
      if (this.isDirty) {
        this.appendTrackdirtyIcon();
        this.appendTrackdirtyMsg();
      } else {
        this.removeTrackdirtyIcon();
        this.removeTrackdirtyMsg();
      }
    }
  },

  /**
   * Handle trackdirty events
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  trackdirtyEvents(option) {
    const action = option === 'remove' ? 'removeEventListener' : 'addEventListener';
    if (this.input) {
      this.eventHandlers[action]('triggerchange', this.input, (e) => {
        if (e?.detail) {
          this.setTrackdirty(e.detail?.value);
        }
      });
    }
  },

  /**
   * Destroy trackdirty
   * @returns {void}
   */
  destroyTrackdirty() {
    if (this.input) {
      this.trackdirtyEvents('remove');
    }
    this.removeTrackdirtyIcon();
    this.useTrackdirty = false;
  }
};

export { IdsTrackdirtyMixin };
