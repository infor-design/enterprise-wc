import IdsSplitterPane from './ids-splitter-pane';

/**
 * Saved object type
 */
export type IdsSplitterSavedHostProps = 'align' | 'axis' | 'disabled';

/**
 * Saved object interface
 */
export interface IdsSplitterSaved {
  /** Flag for saved values, can be use or not */
  canRestore?: boolean;
  /** The splitter align */
  align?: string;
  /** The axis used */
  axis?: string;
  /** The disabled state */
  disabled?: boolean;
  /** List of pane sizes */
  sizes?: number[];
}

/**
 * IDS Splitter Local Storage
 * @type {object}
 */
export default class IdsSplitterLocalStorage {
  constructor(root: any) {
    this.root = root;
  }

  root: any;

  /**
   * Returns true if local storage may be used / is available
   * @private
   * @returns {boolean} If it can be used.
   */
  #canUseLocalStorage(): boolean {
    try {
      if (typeof localStorage?.getItem === 'function') return true;
    } catch (exception) {
      return false;
    }
    return false;
  }

  /**
   * Check if save position, is valid.
   * @private
   * @returns {boolean} true if is valid.
   */
  #canSavePosition(): boolean {
    return this.root.savePosition && this.#canUseLocalStorage();
  }

  /**
   * Save position.
   * @private
   * @returns {void}
   */
  savePosition(): void {
    if (this.#canSavePosition()) {
      const saveObj: IdsSplitterSaved = { sizes: [...this.root.sizes()] };
      ['align', 'axis', 'disabled'].forEach((key) => {
        saveObj[key as IdsSplitterSavedHostProps] = this.root[key];
      });

      // Save to local storage
      localStorage.setItem(this.idTobeUsed(this.root.uniqueId), JSON.stringify(saveObj));
      this.root.triggerEvent('save-position', this.root, {
        detail: { elem: this.root, uniqueId: this.root.uniqueId, value: saveObj }
      });
    }
  }

  /**
   * Restore the saved position from local storage
   * @private
   * @returns {IdsSplitterSaved|null} The position
   */
  restorePosition(): IdsSplitterSaved | null {
    if (!this.#canSavePosition()) return null;

    let saveObj: IdsSplitterSaved = {};
    const savedStr = localStorage.getItem(this.idTobeUsed(this.root.uniqueId));
    if (typeof savedStr === 'string' && savedStr !== '') {
      saveObj = { ...JSON.parse(savedStr), canRestore: false };
      const len = saveObj?.sizes?.length;
      const panes = [...this.root.childNodes].filter((n) => n instanceof IdsSplitterPane);
      if (len && len === panes?.length) {
        saveObj.canRestore = true;
        ['align', 'axis', 'disabled'].forEach((key) => {
          if (saveObj[key as IdsSplitterSavedHostProps] !== this.root[key]) saveObj.canRestore = false;
        });
      }
    }
    return saveObj?.canRestore ? saveObj : null;
  }

  /**
   * Clear the saved position from local storage
   * @param {string} uniqueId If undefined, will use Internal attached.
   * @returns {void}
   */
  clearPosition(uniqueId?: string): void {
    const clearIds = [];
    if (this.#canUseLocalStorage()) {
      const removeId = uniqueId || this.root.uniqueId;
      const savedKay = this.idTobeUsed(removeId);
      const found = Object.keys(localStorage).some((key) => key === savedKay);
      if (found) {
        localStorage.removeItem(savedKay);
        clearIds.push(removeId);
      }
    }
    this.root.triggerEvent('clear-position', this.root, {
      detail: { elem: this.root, clearIds }
    });
  }

  /**
   * Clear all related saved position from local storage
   * @returns {void}
   */
  clearPositionAll(): void {
    const clearIds: string[] = [];
    if (this.#canUseLocalStorage()) {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        const temp = '{idstempclearstorage}';
        const tempId = this.idTobeUsed(temp);
        // from: 'ids-splitter-{idstempclearstorage}-usersettings-position'
        // to: '^ids-splitter-(.+)-usersettings-position$'
        const regexFound = new RegExp(`^${tempId.replace(temp, '(.+)')}$`, 'g');
        if (regexFound.test(key)) {
          const parts = tempId.split(temp);
          // from: ['ids-splitter-', '-usersettings-position']
          // to: '^ids-splitter-|-usersettings-position$'
          const regexExtract = new RegExp(`^${parts.join('|')}$`, 'g');
          const removeId = key.replace(regexExtract, '');
          localStorage.removeItem(key);
          clearIds.push(removeId);
        }
      });
    }
    this.root.triggerEvent('clear-position', this.root, {
      detail: { elem: this.root, clearIds }
    });
  }

  /**
   * Get the id to be use.
   * @param {string} uniqueId The uniqueId.
   * @param {string} suffix Optional suffix string to make the id more unique.
   * @param {string} prefix Optional prefix string to make the id more unique.
   * @returns {string} The id.
   */
  idTobeUsed(uniqueId?: any, suffix?: string, prefix?: string): string {
    const defaults: any = { uniqueId: '', prefix: 'ids-splitter', suffix: 'usersettings-position' };
    const hasValue = [uniqueId, suffix, prefix].some((x) => (x !== undefined && x !== null));
    let returnId = defaults.prefix;
    if (hasValue) {
      const use = (key: string, val?: string) => (val ?? defaults[key]);
      returnId = `${use('prefix', prefix)}-${use('uniqueId', uniqueId)}-${use('suffix', suffix)}`;
    }
    return returnId;
  }
}
