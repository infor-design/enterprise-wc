import IdsIcon from '../ids-icon/ids-icon';

/**
 * Track changes on inputs elements and show a dirty indicator.
 */
const IdsDirtyTrackerMixin = {
  isCheckbox: false,
  isRadioGroup: false,

  /**
   * Handle dirty tracker values
   * @returns {void}
   */
  handleDirtyTracker() {
    this.isCheckbox = this.input?.getAttribute('type') === 'checkbox';
    this.isRadioGroup = this.input?.classList.contains('ids-radio-group');

    if (this.dirtyTracker) {
      if (this.input) {
        const val = this.valMethod(this.input);
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
      if (this.isCheckbox) {
        this.labelEl?.appendChild(icon);
      } else if (this.isRadioGroup) {
        const refEl = this.shadowRoot.querySelector('slot');
        this.input?.insertBefore(icon, refEl);
      } else {
        this.input?.parentNode?.insertBefore(icon, this.input);
      }
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
   * Get the value or checked if checkbox or radio
   * @private
   * @param {object} el .
   * @returns {string} element value
   */
  valMethod(el) {
    return (this.isCheckbox || this.isRadioGroup) ? this.checked : el.value;
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
      this.appendDirtyTrackerMsg();
      this.appendDirtyTrackerIcon();
    } else {
      this.removeDirtyTrackerMsg();
      this.removeDirtyTrackerIcon();
    }
  },

  /**
   * Handle hide-focus css class for first radio button in radio group
   * @private
   * @param {string} option If 'remove', will remove attached events
   * @returns {void}
   */
  handleRadioGroupHidefocusClass(option) {
    if (this.isRadioGroup) {
      const radio = this.querySelector('ids-radio');
      if (radio) {
        const events = ['hidefocusadd', 'hidefocusremove'];
        if (option === 'remove') {
          events.forEach((evt) => {
            const handler = this.eventHandlers?.handledEvents?.get(evt);
            if (handler && handler.target === radio) {
              this.eventHandlers.removeEventListener(evt, radio);
            }
          });
        } else {
          events.forEach((evt) => {
            this.eventHandlers.addEventListener(evt, radio, (e) => {
              setTimeout(() => {
                const icon = this.shadowRoot.querySelector('.icon-dirty');
                const shouldRemove = e.type === 'hidefocusadd';
                icon?.classList[shouldRemove ? 'remove' : 'add']('radio-focused');
              }, 0);
            });
          });
        }
      }
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
        this.handleRadioGroupHidefocusClass('remove');
      } else {
        this.eventHandlers.addEventListener(eventName, this.input, () => {
          const val = this.valMethod(this.input);
          this.setDirtyTracker(val);
        });
        setTimeout(() => {
          this.handleRadioGroupHidefocusClass();
        }, 0);
      }
    }
  },

  /**
   * Destroy dirty tracker
   * @private
   * @returns {void}
   */
  destroyDirtyTracker() {
    this.dirtyTrackerEvents('remove');
    this.removeDirtyTrackerIcon();
    this.removeDirtyTrackerMsg();
  }
};

export { IdsDirtyTrackerMixin };
