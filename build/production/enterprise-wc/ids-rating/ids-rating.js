/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/ids-rating/ids-rating-base.js":
/*!******************************************************!*\
  !*** ./src/components/ids-rating/ids-rating-base.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _mixins_ids_events_mixin_ids_events_mixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mixins/ids-events-mixin/ids-events-mixin */ "./src/mixins/ids-events-mixin/ids-events-mixin.js");
/* harmony import */ var _mixins_ids_keyboard_mixin_ids_keyboard_mixin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mixins/ids-keyboard-mixin/ids-keyboard-mixin */ "./src/mixins/ids-keyboard-mixin/ids-keyboard-mixin.js");
/* harmony import */ var _mixins_ids_theme_mixin_ids_theme_mixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../mixins/ids-theme-mixin/ids-theme-mixin */ "./src/mixins/ids-theme-mixin/ids-theme-mixin.js");
/* harmony import */ var _core_ids_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/ids-element */ "./src/core/ids-element.js");




var Base = (0,_mixins_ids_theme_mixin_ids_theme_mixin__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_mixins_ids_keyboard_mixin_ids_keyboard_mixin__WEBPACK_IMPORTED_MODULE_1__["default"])((0,_mixins_ids_events_mixin_ids_events_mixin__WEBPACK_IMPORTED_MODULE_0__["default"])(_core_ids_element__WEBPACK_IMPORTED_MODULE_3__["default"])));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Base);

/***/ }),

/***/ "./src/components/ids-render-loop/ids-render-loop-common.js":
/*!******************************************************************!*\
  !*** ./src/components/ids-render-loop/ids-render-loop-common.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "timestamp": () => (/* binding */ timestamp)
/* harmony export */ });
/**
 * Gets an accurate, current timestamp from the system.
 * @private
 * @returns {number} a current timestamp
 */
function timestamp() {
  return window.performance.now();
}

/***/ }),

/***/ "./src/components/ids-render-loop/ids-render-loop-global.js":
/*!******************************************************************!*\
  !*** ./src/components/ids-render-loop/ids-render-loop-global.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ids_render_loop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ids-render-loop */ "./src/components/ids-render-loop/ids-render-loop.js");
 // Stores the global RenderLoop instance.
// If access to the RenderLoop directly is needed, app developers should use this
// single instance and NOT construct another RenderLoop.

var renderLoop = new _ids_render_loop__WEBPACK_IMPORTED_MODULE_0__.IdsRenderLoop();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (renderLoop);


/***/ }),

/***/ "./src/components/ids-render-loop/ids-render-loop-item.js":
/*!****************************************************************!*\
  !*** ./src/components/ids-render-loop/ids-render-loop-item.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/wrapNativeSuper */ "./node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js");
/* harmony import */ var _ids_render_loop_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ids-render-loop-common */ "./src/components/ids-render-loop/ids-render-loop-common.js");








function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_5__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }


/**
 * An IDS RenderLoop Queue Item
 * @type {IdsRenderLoopItem}
 * @param {object} settings incoming item options
 */

var IdsRenderLoopItem = /*#__PURE__*/function (_Object) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_3__["default"])(IdsRenderLoopItem, _Object);

  var _super = _createSuper(IdsRenderLoopItem);

  /**
   * @param {object} settings incoming item options
   */
  function IdsRenderLoopItem() {
    var _this;

    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, IdsRenderLoopItem);

    _this = _super.call(this); // This can be referenced by the RenderLoopAPI to change this item's settings

    _this.id = settings.id; // Setting a duration greater than '-1' causes the RenderLoopItem to automatically
    // remove itself from the queue after that duration.

    _this.duration = -1;

    if (typeof settings.duration === 'number') {
      _this.duration = parseInt(settings.duration, 10);
    } // Either ID or a duration is required.


    if (_this.duration < 1 && (typeof _this.id !== 'string' || !_this.id.length)) {
      throw new Error('cannot build a RenderLoopItem with no duration and no namespace');
    } // Number of frames this loop item will step before running its
    // `updateCallback()`, if defined


    _this.updateDuration = 1;

    if (typeof settings.updateDuration === 'number') {
      _this.updateDuration = parseInt(settings.updateDuration, 10);
    }

    _this.setNextUpdateTime(); // handles the setting of user-defined callback functions


    if (typeof settings.updateCallback !== 'function' && typeof settings.timeoutCallback !== 'function') {
      throw new Error('cannot register callback to RenderLoop because callback is not a function');
    }

    if (typeof settings.updateCallback === 'function') {
      _this.updateCallback = settings.updateCallback.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    }

    if (typeof settings.timeoutCallback === 'function') {
      _this.timeoutCallback = settings.timeoutCallback.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
    } // Internal state


    _this.paused = false;
    _this.startTime = (0,_ids_render_loop_common__WEBPACK_IMPORTED_MODULE_7__.timestamp)();
    _this.totalStoppedTime = 0;
    return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_4__["default"])(_this, (0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_2__["default"])(_this));
  }
  /**
   * Appends the update duration to a current timestamp and stores it, to define
   * when this item will next run its update callback.
   * @returns {void}
   */


  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(IdsRenderLoopItem, [{
    key: "setNextUpdateTime",
    value: function setNextUpdateTime() {
      this.nextUpdateTime = (0,_ids_render_loop_common__WEBPACK_IMPORTED_MODULE_7__.timestamp)() + this.updateDuration;
    }
    /**
     * Causes the update cycle of this loop item not to occur
     * @returns {void}
     */

  }, {
    key: "pause",
    value: function pause() {
      this.paused = true;
      this.lastPauseTime = (0,_ids_render_loop_common__WEBPACK_IMPORTED_MODULE_7__.timestamp)();
    }
    /**
     * Causes the update cycle of this loop item to start occurring
     * @returns {void}
     */

  }, {
    key: "resume",
    value: function resume() {
      this.resumeTime = (0,_ids_render_loop_common__WEBPACK_IMPORTED_MODULE_7__.timestamp)();
      this.totalStoppedTime += this.resumeTime - (this.lastPauseTime || 0);
      delete this.lastPauseTime;
      this.paused = false;
    }
    /**
     * @readonly
     * @returns {number} the elapsed time this RenderLoop item has existed for
     */

  }, {
    key: "elapsedTime",
    get: function get() {
      return (0,_ids_render_loop_common__WEBPACK_IMPORTED_MODULE_7__.timestamp)() - (this.startTime + this.totalStoppedTime);
    }
    /**
     * @readonly
     * @returns {boolean} true if the item's `updateCallback` will be fired on this renderLoop tick
     */

  }, {
    key: "canUpdate",
    get: function get() {
      return typeof this.nextUpdateTime === 'number' && (0,_ids_render_loop_common__WEBPACK_IMPORTED_MODULE_7__.timestamp)() > this.nextUpdateTime;
    }
    /**
     * Fires a defined `updateCallback()` under the right conditions
     * @param {object} timeInfo containing raw time information from the loop (last, delta, now)
     * @param {...Array<any>} [callbackArgs] user-defined parameters that get passed
     *  to an `updateCallback()` method.
     * @returns {void}
     */

  }, {
    key: "update",
    value: function update(timeInfo) {
      if (typeof this.updateCallback !== 'function' || !this.canUpdate) {
        return;
      } // NOTE: This runs in this `IdsRenderLoopItem`s context


      for (var _len = arguments.length, callbackArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        callbackArgs[_key - 1] = arguments[_key];
      }

      this.updateCallback.apply(this, [timeInfo].concat(callbackArgs));
      this.setNextUpdateTime();
    }
    /**
     * Fires a defined `timeoutCallback()` under the right conditions.
     * @returns {void}
     */

  }, {
    key: "timeout",
    value: function timeout() {
      if (typeof this.timeoutCallback !== 'function' || this.noTimeout) {
        return;
      } // NOTE: This runs in this `IdsRenderLoopItem`s context


      this.timeoutCallback();
    }
    /**
     * @param {boolean} noTimeout causes the item to be destroyed without
     * triggering the `timeoutCallback` function
     * @returns {void}
     */

  }, {
    key: "destroy",
    value: function destroy(noTimeout) {
      if (noTimeout) {
        this.noTimeout = true;
      }

      this.doRemoveOnNextTick = true;
    }
  }]);

  return IdsRenderLoopItem;
}( /*#__PURE__*/(0,_babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_6__["default"])(Object));

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IdsRenderLoopItem);

/***/ }),

/***/ "./src/components/ids-render-loop/ids-render-loop.js":
/*!***********************************************************!*\
  !*** ./src/components/ids-render-loop/ids-render-loop.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "IdsRenderLoop": () => (/* binding */ IdsRenderLoop)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _ids_render_loop_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ids-render-loop-common */ "./src/components/ids-render-loop/ids-render-loop-common.js");
/* harmony import */ var _ids_render_loop_item__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ids-render-loop-item */ "./src/components/ids-render-loop/ids-render-loop-item.js");




/**
 * Sets up a timed loop using the `requestAnimationFrame` API.
 * This can be used for controlling animations,  or asynchronously staggering
 * routines for a specified duration.
 */

var IdsRenderLoop = /*#__PURE__*/function () {
  /**
   * @param {object} [settings] incoming settings
   * @param {boolean} [settings.autoStart = true] causes the loop to start immediately
   * @param {HTMLElement} [settings.eventTargetElement] if defined,
   * causes RenderLoop events to be triggered on this element
   */
  function IdsRenderLoop() {
    var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      autoStart: true
    };

    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, IdsRenderLoop);

    /**
     * On each RenderLoop tick (requestAnimationFrame), this array is iterated.
     * @property {Array<IdsRenderLoopItem>} items containing active RenderLoop items.
     */
    this.items = [];
    /**
     * @property {boolean} doLoop when true, the loop creates a `tick()`
     */

    this.doLoop = false;
    /**
     * @property {number} totalStoppedTime records the total number of stopped ticks
     */

    this.totalStoppedTime = 0; // Handle Settings

    if (settings.autoStart) {
      this.start();
    }
  }
  /**
   * Start the entire render loop
   * @returns {void}
   */


  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(IdsRenderLoop, [{
    key: "start",
    value: function start() {
      this.doLoop = true;
      var resume = false;
      /**
       * @property {number} startTime contains a timestamp number for when the loop begins.
       */

      if (!this.startTime) {
        this.startTime = (0,_ids_render_loop_common__WEBPACK_IMPORTED_MODULE_2__.timestamp)();
      } // If the loop was previously stopped, record some timestamps
      // about when it resumed, and the pause duration.


      if (this.lastStopTime) {
        resume = true;
        this.resumeTime = (0,_ids_render_loop_common__WEBPACK_IMPORTED_MODULE_2__.timestamp)();
        this.totalStoppedTime += this.resumeTime - this.lastStopTime;
        delete this.lastStopTime;
      }

      var self = this;
      var last = (0,_ids_render_loop_common__WEBPACK_IMPORTED_MODULE_2__.timestamp)();
      var now;
      var deltaTime;
      /**
       * Actually performs a renderloop `tick()`
       * @returns {void}
       */

      function tick() {
        // Don't continue if the loop is stopped externally
        if (!self.doLoop) {
          return;
        }

        now = (0,_ids_render_loop_common__WEBPACK_IMPORTED_MODULE_2__.timestamp)();
        deltaTime = (now - last) / 1000; // Iterate through each item stored in the queue and "update" each one.
        // In some cases, items will be removed from the queue automatically.
        // In some cases, `update` events will be triggered on loop items, if they are
        // ready to be externally updated.

        self.items.forEach(function (loopItem) {
          // Remove if we've set the `doRemoveOnNextTick` flag.
          if (loopItem.doRemoveOnNextTick) {
            self.remove(loopItem);
            return;
          }

          if (resume) {
            loopItem.resume();
          } // Return out if we're "paused"


          if (loopItem.paused) {
            return;
          } // Check duration


          if (typeof loopItem.duration === 'number' && loopItem.duration > -1) {
            if (loopItem.elapsedTime >= loopItem.duration) {
              loopItem.destroy();
              return;
            }
          } // Pass information about current timing
          // last = previous timestamp
          // now = current timestamp
          // delta = difference between the two


          var timeInfo = {
            last: last,
            delta: deltaTime,
            now: now
          };
          loopItem.update(timeInfo);
        }); // Continue the loop

        last = now;
        resume = false;
        requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }
    /**
     * Stops the entire render loop and pauses every item.
     * @returns {void}
     */

  }, {
    key: "stop",
    value: function stop() {
      this.doLoop = false;
      this.lastStopTime = (0,_ids_render_loop_common__WEBPACK_IMPORTED_MODULE_2__.timestamp)();
      this.items.forEach(function (loopItem) {
        loopItem.pause();
      });
    }
    /**
     * @readonly
     * @returns {number} amount of time that has passed since the RenderLoop was started.
     */

  }, {
    key: "elapsedTime",
    get: function get() {
      return (0,_ids_render_loop_common__WEBPACK_IMPORTED_MODULE_2__.timestamp)() - ((this.startTime || 0) + this.totalStoppedTime);
    }
    /**
     * @param {IdsRenderLoopItem} loopItem the pre-constructed loop item.
     * @returns {IdsRenderLoopItem} The IdsRenderLoopItem as just rendered
     */

  }, {
    key: "register",
    value: function register(loopItem) {
      this.items.push(loopItem);
      return loopItem;
    }
    /**
     * Actually does the removal of a registered callback from the queue
     * Pulled out into its own function because it can be automatically called by
     * the tick, or manually triggered from an external API call.
     * @private
     * @param {IdsRenderLoopItem|string} obj the renderLoopItem, or its ID string
     * @returns {IdsRenderLoopItem | undefined} reference to the removed renderLoopItem
     */

  }, {
    key: "remove",
    value: function remove(obj) {
      var _removedItem;

      var removedItem; // Remove directly

      if (obj instanceof _ids_render_loop_item__WEBPACK_IMPORTED_MODULE_3__["default"]) {
        removedItem = obj;
        this.items = this.items.filter(function (item) {
          return item !== obj;
        });
      } // Remove by id


      if (typeof obj === 'string') {
        this.items = this.items.filter(function (item) {
          if (item.id !== obj) {
            return true;
          }

          removedItem = item;
          return false;
        });
      } // Cause the item to timeout


      if ((_removedItem = removedItem) !== null && _removedItem !== void 0 && _removedItem.timeoutCallback) {
        removedItem.timeout();
      } // If this is undefined, an item was NOT removed from the queue successfully.


      return removedItem;
    }
  }]);

  return IdsRenderLoop;
}();



/***/ }),

/***/ "./src/core/ids-attributes.js":
/*!************************************!*\
  !*** ./src/core/ids-attributes.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "attributes": () => (/* binding */ attributes)
/* harmony export */ });
/* unused harmony export prefix */
// Please keep constants alphabetized
var attributes = {
  ACCEPT: 'accept',
  ACTIVE: 'active',
  ADVANCED: 'advanced',
  ALT: 'alt',
  ALTERNATE_ROW_SHADING: 'alternate-row-shading',
  ANIMATED: 'animated',
  ANIMATION_STYLE: 'animation-style',
  ALIGN: 'align',
  ALIGN_EDGE: 'align-edge',
  ALIGN_TARGET: 'align-target',
  ALIGN_X: 'align-x',
  ALIGN_Y: 'align-y',
  ALLOW_LINK: 'allow-link',
  APPEARANCE: 'appearance',
  ARROW: 'arrow',
  ARROW_TARGET: 'arrow-target',
  AUDIBLE: 'audible',
  AUTO: 'auto',
  AUTOGROW: 'autogrow',
  AUTOGROW_MAX_HEIGHT: 'autogrow-max-height',
  AUTO_FIT: 'auto-fit',
  AUTO_HEIGHT: 'auto-height',
  AUTOSELECT: 'autoselect',
  AXIS: 'axis',
  BADGE_COLOR: 'badge-color',
  BADGE_POSITION: 'badge-position',
  BG_TRANSPARENT: 'bg-transparent',
  BOLD: 'bold',
  BLEED: 'bleed',
  BUTTONS: 'buttons',
  CANCEL: 'cancel',
  CAPTURES_FOCUS: 'captures-focus',
  CARD_HEIGHT: 'card-height',
  CARD_WIDTH: 'card-width',
  CHAR_MAX_TEXT: 'char-max-text',
  CHAR_REMAINING_TEXT: 'char-remaining-text',
  CHARACTER_COUNTER: 'character-counter',
  CHECKED: 'checked',
  CLEARABLE: 'clearable',
  CLEARABLE_FORCED: 'clearable-forced',
  COL_END: 'col-end',
  COL_SPAN: 'col-span',
  COL_SPAN_XS: 'col-span-xs',
  COL_SPAN_SM: 'col-span-sm',
  COL_SPAN_MD: 'col-span-md',
  COL_SPAN_LG: 'col-span-lg',
  COL_SPAN_XL: 'col-span-xl',
  COL_SPAN_XXL: 'col-span-xxl',
  COL_START: 'col-start',
  COLLAPSE_ICON: 'collapse-icon',
  COLOR: 'color',
  COLOR_VARIANT: 'color-variant',
  COLS: 'cols',
  COMPACT: 'compact',
  COMPLETED_LABEL: 'completed-label',
  COUNT: 'count',
  COPYRIGHT_YEAR: 'copyright-year',
  CLICKABLE: 'clickable',
  CSS_CLASS: 'css-class',
  CURSOR: 'cursor',
  CYCLES_FOCUS: 'cycles-focus',
  DATA: 'data',
  DELAY: 'delay',
  DEVICE_SPECS: 'device-specs',
  DIRTY_TRACKER: 'dirty-tracker',
  DISABLE_EVENTS: 'disable-native-events',
  DISABLED: 'disabled',
  DISMISSIBLE: 'dismissible',
  DISPLAY: 'display',
  DRAGGABLE: 'draggable',
  EDGE: 'edge',
  ERROR: 'error',
  EXPAND_ICON: 'expand-icon',
  EXPANDED: 'expanded',
  EXPANDER_TYPE: 'expander-type',
  FALLBACK: 'fallback',
  FIELD_HEIGHT: 'field-height',
  FILE: 'file',
  FILE_NAME: 'file-name',
  FILL: 'fill',
  FIXED: 'fixed',
  FIRST: 'first',
  FOCUSABLE: 'focusable',
  FONT_SIZE: 'font-size',
  FONT_WEIGHT: 'font-weight',
  GAP: 'gap',
  GAP_X: 'gap-x',
  GAP_Y: 'gap-y',
  GROUP: 'group',
  GROUP_DISABLED: 'group-disabled',
  HANDLE: 'handle',
  HEIGHT: 'height',
  HITBOX: 'hitbox',
  HORIZONTAL: 'horizontal',
  HREF: 'href',
  HEX: 'hex',
  ICON: 'icon',
  ICON_ALIGN: 'icon-align',
  ID: 'id',
  INDETERMINATE: 'indeterminate',
  INLINE: 'inline',
  INITIALS: 'initials',
  IS_DRAGGING: 'is-dragging',
  JUSTIFY: 'justify',
  KEEP_OPEN: 'keep-open',
  LABEL: 'label',
  LABEL_AUDIBLE: 'label-audible',
  LABEL_FILETYPE: 'label-filetype',
  LABEL_HIDDEN: 'label-hidden',
  LABEL_PROGRESS: 'label-progress',
  LABEL_REQUIRED: 'label-required',
  LABEL_TOTAL: 'label-total',
  LANGUAGE: 'language',
  LINEAR: 'linear',
  LOCALE: 'locale',
  MAX: 'max',
  MAX_FILE_SIZE: 'max-file-size',
  MAX_FILES: 'max-files',
  MAX_FILES_IN_PROCESS: 'max-files-in-process',
  MAX_TRANSFORM_X: 'max-transform-x',
  MAX_TRANSFORM_Y: 'max-transform-y',
  MASK: 'mask',
  MASK_GUIDE: 'mask-guide',
  MASK_OPTIONS: 'mask-options',
  MASK_RETAIN_POSITIONS: 'mask-retain-positions',
  MAXLENGTH: 'maxlength',
  MENU: 'menu',
  MESSAGE_TEXT: 'message-text',
  METHOD: 'method',
  MESSAGE: 'message',
  MESSAGE_TITLE: 'message-title',
  MIN: 'min',
  MIN_COL_WIDTH: 'min-col-width',
  MIN_TRANSFORM_X: 'min-transform-x',
  MIN_TRANSFORM_Y: 'min-transform-y',
  MODE: 'mode',
  MULTIPLE: 'multiple',
  NAME: 'name',
  NAV_DISABLED: 'nav-disabled',
  NEXT: 'next',
  NO_MARGINS: 'no-margins',
  NO_RIPPLE: 'no-ripple',
  NO_TEXT_ELLIPSIS: 'no-text-ellipsis',
  OPACITY: 'opacity',
  OVERFLOW: 'overflow',
  ORIENTATION: 'orientation',
  PAGE_COUNT: 'page-count',
  PAGE_NUMBER: 'page-number',
  PAGE_SIZE: 'page-size',
  PADDING: 'padding',
  PARENT_CONTAINMENT: 'parent-containment',
  PARENT_DISABLED: 'parent-disabled',
  PERCENT: 'percent',
  PERCENTAGE_VISIBLE: 'percentage-visible',
  PLACEHOLDER: 'placeholder',
  PLACEMENT: 'placement',
  POSITION_STYLE: 'position-style',
  PARAM_NAME: 'param-name',
  POSITION: 'position',
  PREVIOUS: 'previous',
  PRINTABLE: 'printable',
  PROGRESS_BAR: 'progress-bar',
  PRODUCT_NAME: 'product-name',
  PRODUCT_VERSION: 'product-version',
  LAST: 'last',
  LINK: 'link',
  LINK_TEXT: 'link-text',
  PROGRESS: 'progress',
  PROGRESS_COLOR: 'progress-color',
  READONLY: 'readonly',
  RESIZABLE: 'resizable',
  REQUIRED: 'required',
  ROUND: 'round',
  ROOT_ITEM: 'root-item',
  ROW_END: 'row-end',
  ROW_HEIGHT: 'row-height',
  ROW_SPAN: 'row-span',
  ROW_START: 'row-start',
  ROWS: 'rows',
  RESET: 'reset',
  SAVE_POSITION: 'save-position',
  SCROLLABLE: 'scrollable',
  SCROLL_TOP: 'scroll-top',
  SELECT: 'select',
  SELECTABLE: 'selectable',
  SELECTED: 'selected',
  SHAPE: 'shape',
  SHOW_BROWSE_LINK: 'show-browse-link',
  SQUARE: 'square',
  SIZE: 'size',
  SRC: 'src',
  STARS: 'stars',
  START: 'start',
  STATUS: 'status',
  STEP: 'step',
  STEP_NUMBER: 'step-number',
  STEPS_IN_PROGRESS: 'steps-in-progress',
  STICKY: 'sticky',
  SUBMENU: 'submenu',
  SWATCH: 'swatch',
  SWIPE_TYPE: 'swipe-type',
  TABBABLE: 'tabbable',
  TABINDEX: 'tabindex',
  TARGET: 'target',
  TITLE: 'title',
  TIMEOUT: 'timeout',
  TOOLTIP: 'tooltip',
  TOTAL: 'total',
  TRANSLATE_TEXT: 'translate-text',
  TRIGGER: 'trigger',
  TRIGGERFIELD: 'triggerfield',
  TRIGGER_LABEL: 'trigger-label',
  TEXT: 'text',
  TEXT_ALIGN: 'text-align',
  TEXT_DECORATION: 'text-decoration',
  TEXT_ELLIPSIS: 'text-ellipsis',
  TOGGLE_COLLAPSE_ICON: 'toggle-collapse-icon',
  TOGGLE_EXPAND_ICON: 'toggle-expand-icon',
  TOGGLE_ICON_ROTATE: 'toggle-icon-rotate',
  TYPE: 'type',
  UNIQUE_ID: 'unique-id',
  URL: 'url',
  USE_DEFAULT_COPYRIGHT: 'use-default-copyright',
  USE_TOGGLE_TARGET: 'use-toggle-target',
  USER_STATUS: 'user-status',
  VALIDATE: 'validate',
  VALIDATION_EVENTS: 'validation-events',
  VALIDATION_HAS_ERROR: 'validation-has-error',
  VALUE: 'value',
  VALUE_SECONDARY: 'value-secondary',
  VERSION: 'version',
  VERTICAL: 'vertical',
  VIRTUAL_SCROLL: 'virtual-scroll',
  VISIBLE: 'visible',
  X: 'x',
  XSS_IGNORED_TAGS: 'xss-ignored-tags',
  Y: 'y'
}; // Please keep constants alphabetized

var prefix = {
  PREFIX: 'ids'
};

/***/ }),

/***/ "./src/core/ids-decorators.js":
/*!************************************!*\
  !*** ./src/core/ids-decorators.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "customElement": () => (/* binding */ customElement),
/* harmony export */   "scss": () => (/* binding */ scss)
/* harmony export */ });
/* unused harmony export appendIds */
/**
 * Custom Element Decorator
 * @param  {string} name The custom element name
 * @returns {Function} The function that did the decorating
 */
function customElement(name) {
  return function (target) {
    if (!customElements.get(name)) {
      customElements.define(name, target);
    }
  };
}
/**
 * Styles Decorator
 * @param {string} cssStyles The css stringified stylesheet
 * @returns {Function} The function that did the decorating
 */

function scss(cssStyles) {
  return function (target) {
    target.prototype.cssStyles = cssStyles;
  };
}
/**
 * Call appendIds in base if needed to add automation ids and ids
 * @returns {Function} The function that did the decorating
 */

function appendIds() {
  return function (target) {
    target.prototype.appendIds = true;
  };
}

/***/ }),

/***/ "./src/core/ids-element.js":
/*!*********************************!*\
  !*** ./src/core/ids-element.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IdsElement)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/wrapNativeSuper */ "./node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _ids_attributes__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ids-attributes */ "./src/core/ids-attributes.js");
/* harmony import */ var _components_ids_render_loop_ids_render_loop_global__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../components/ids-render-loop/ids-render-loop-global */ "./src/components/ids-render-loop/ids-render-loop-global.js");
/* harmony import */ var _components_ids_render_loop_ids_render_loop_item__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../components/ids-render-loop/ids-render-loop-item */ "./src/components/ids-render-loop/ids-render-loop-item.js");
/* harmony import */ var _utils_ids_string_utils_ids_string_utils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/ids-string-utils/ids-string-utils */ "./src/utils/ids-string-utils/ids-string-utils.js");








function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }





var VERSION = '0.0.0-beta.15';
/**
 * Simple dictionary used to cache attribute names
 * to their corresponding property names.
 * @type {object.<string, string>}
 */

var attribPropNameDict = Object.fromEntries(Object.entries(_ids_attributes__WEBPACK_IMPORTED_MODULE_7__.attributes).map(function (_ref) {
  var _ref2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6__["default"])(_ref, 2),
      _ = _ref2[0],
      attrib = _ref2[1];

  return [attrib, (0,_utils_ids_string_utils_ids_string_utils__WEBPACK_IMPORTED_MODULE_10__.camelCase)(attrib)];
}));
/**
 * IDS Base Element
 */

var IdsElement = /*#__PURE__*/function (_HTMLElement) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__["default"])(IdsElement, _HTMLElement);

  var _super = _createSuper(IdsElement);

  function IdsElement() {
    var _this;

    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, IdsElement);

    _this = _super.call(this);

    _this.addBaseName();

    _this.render();

    return _this;
  }
  /**
   * Add the component name and baseclass
   * @private
   */


  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(IdsElement, [{
    key: "addBaseName",
    value: function addBaseName() {
      var _this$nodeName;

      // Add the base class and version
      this.name = (_this$nodeName = this.nodeName) === null || _this$nodeName === void 0 ? void 0 : _this$nodeName.toLowerCase();
      this.IdsVersion = VERSION;
    }
    /**
     * Insert the id's and data-**-id to the various parts in the component
     * @private
     */

  }, {
    key: "addInternalIds",
    value: function addInternalIds() {
      var parts = this.shadowRoot.querySelectorAll('[part]');

      if (parts.length === 0) {
        return;
      }

      if (this.id) {
        this.appendIdtoPart(parts, 'id', this.id);
      }

      for (var i = 0; i < this.attributes.length; i++) {
        if (this.attributes[i].name.includes('data-') && this.attributes[i].name.includes('id')) {
          this.appendIdtoPart(parts, this.attributes[i].name, this.getAttribute(this.attributes[i].name));
        }
      }
    }
    /**
     * Copy down the id's and data-**-id to the different parts in the component
     * @param  {Array} parts The array of parts
     * @param  {string} name The id name
     * @param  {string} value The id value
     * @private
     */

  }, {
    key: "appendIdtoPart",
    value: function appendIdtoPart(parts, name, value) {
      for (var i = 0; i < parts.length; i++) {
        var _this$state;

        var label = void 0;
        var newId = "".concat(value, "-").concat(parts[i].getAttribute('part'));

        if (name === 'id' && parts[i].id) {
          label = this.shadowRoot.querySelector("[for=\"".concat(parts[i].id, "\"]"));
        }

        parts[i].setAttribute(name, newId);

        if (label) {
          label.setAttribute('for', newId);
        }

        if (name === 'id' && (_this$state = this.state) !== null && _this$state !== void 0 && _this$state.id) {
          this.state.id = newId;
        }
      }
    }
    /**
     * Handle Setting changes of the value has changed by calling the getter
     * in the extending class.
     * @param  {string} name The property name
     * @param  {string} oldValue The property old value
     * @param  {string} newValue The property new value
     */

  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        if (!attribPropNameDict[name]) {
          attribPropNameDict[name] = (0,_utils_ids_string_utils_ids_string_utils__WEBPACK_IMPORTED_MODULE_10__.camelCase)(name);
        }

        this[attribPropNameDict[name]] = newValue;
      }
    }
    /**
     * Release events and cleanup, if implementing disconnectedCallback
     * in a component you can just call super.
     */

  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      if (this.detachAllEvents) {
        this.detachAllEvents();
      }

      if (this.detachAllListeners) {
        this.detachAllListeners();
      }
    }
    /**
     * Handle Changes on Properties, this is part of the web component spec.
     * @type {Array}
     */

  }, {
    key: "render",
    value:
    /**
     * Render the component using the defined template.
     * @returns {object} The object for chaining.
     */
    function render() {
      var _this$shadowRoot,
          _this$shadowRoot2,
          _this$shadowRoot3,
          _this$shadowRoot4,
          _this$shadowRoot6,
          _this2 = this;

      if (!this.template) {
        return this;
      }

      var templateHTML = this.template();

      if (!templateHTML) {
        return this;
      } // Make template and shadow objects


      var template = document.createElement('template');

      if ((_this$shadowRoot = this.shadowRoot) !== null && _this$shadowRoot !== void 0 && _this$shadowRoot.innerHTML) {
        var _iterator = _createForOfIteratorHelper(this.shadowRoot.children),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var el = _step.value;

            if (el.nodeName !== 'STYLE') {
              el.remove();
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      if (!this.shadowRoot) {
        this.attachShadow({
          mode: 'open'
        });
      }

      this.appendStyles();
      template.innerHTML = templateHTML;
      (_this$shadowRoot2 = this.shadowRoot) === null || _this$shadowRoot2 === void 0 ? void 0 : _this$shadowRoot2.appendChild(template.content.cloneNode(true));
      this.container = (_this$shadowRoot3 = this.shadowRoot) === null || _this$shadowRoot3 === void 0 ? void 0 : _this$shadowRoot3.querySelector(".".concat(this.name));

      if (((_this$shadowRoot4 = this.shadowRoot) === null || _this$shadowRoot4 === void 0 ? void 0 : _this$shadowRoot4.firstElementChild.nodeName) === 'STYLE' && !this.container) {
        var _this$shadowRoot5;

        this.container = (_this$shadowRoot5 = this.shadowRoot) === null || _this$shadowRoot5 === void 0 ? void 0 : _this$shadowRoot5.firstElementChild.nextElementSibling;
      }

      if (((_this$shadowRoot6 = this.shadowRoot) === null || _this$shadowRoot6 === void 0 ? void 0 : _this$shadowRoot6.firstElementChild.nodeName) !== 'STYLE' && !this.container) {
        var _this$shadowRoot7;

        this.container = (_this$shadowRoot7 = this.shadowRoot) === null || _this$shadowRoot7 === void 0 ? void 0 : _this$shadowRoot7.firstElementChild;
      } // Runs on next next paint to be sure rendered() fully


      if (this.rendered) {
        _components_ids_render_loop_ids_render_loop_global__WEBPACK_IMPORTED_MODULE_8__["default"].register(new _components_ids_render_loop_ids_render_loop_item__WEBPACK_IMPORTED_MODULE_9__["default"]({
          duration: 1,
          timeoutCallback: function timeoutCallback() {
            _this2.rendered();
          }
        }));
      } // Add automation Ids


      if (this.appendIds) {
        this.addInternalIds();
      }

      return this;
    }
    /**
     * @returns {string} containing this component's HTML Template
     */

  }, {
    key: "template",
    value: function template() {
      return '';
    }
    /**
     * @returns {string} gets the nonce from the meta tag
     */

  }, {
    key: "nonce",
    get: function get() {
      this.cachedNonce = '';

      if (!document.nonce) {
        var csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');

        if (csp) {
          var _nonce$;

          var nonce = csp.getAttribute('content').match(/'nonce-(.*?)'/g);
          nonce = nonce ? (_nonce$ = nonce[0]) === null || _nonce$ === void 0 ? void 0 : _nonce$.replace('\'nonce-', '').replace('\'', '') : undefined;
          document.nonce = nonce;
        }
      }

      return document.nonce;
    }
    /**
     * Append Styles if present
     * @private
     */

  }, {
    key: "appendStyles",
    value: function appendStyles() {
      var _this$shadowRoot8;

      if (this.hasStyles) {
        return;
      }

      var style = document.createElement('style');
      style.textContent = this.cssStyles;
      style.setAttribute('nonce', this.nonce);
      (_this$shadowRoot8 = this.shadowRoot) === null || _this$shadowRoot8 === void 0 ? void 0 : _this$shadowRoot8.appendChild(style);
      this.hasStyles = true;
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return this.attributes;
    }
    /**
     * @returns {Array<string>} this component's observable properties
     */

  }, {
    key: "attributes",
    get: function get() {
      return [];
    }
  }]);

  return IdsElement;
}( /*#__PURE__*/(0,_babel_runtime_helpers_wrapNativeSuper__WEBPACK_IMPORTED_MODULE_5__["default"])(HTMLElement));



/***/ }),

/***/ "./src/mixins/ids-events-mixin/ids-events-mixin.js":
/*!*********************************************************!*\
  !*** ./src/mixins/ids-events-mixin/ids-events-mixin.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/get */ "./node_modules/@babel/runtime/helpers/esm/get.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _components_ids_render_loop_ids_render_loop_global__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../components/ids-render-loop/ids-render-loop-global */ "./src/components/ids-render-loop/ids-render-loop-global.js");
/* harmony import */ var _components_ids_render_loop_ids_render_loop_item__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../components/ids-render-loop/ids-render-loop-item */ "./src/components/ids-render-loop/ids-render-loop-item.js");
/* harmony import */ var _utils_ids_string_utils_ids_string_utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../utils/ids-string-utils/ids-string-utils */ "./src/utils/ids-string-utils/ids-string-utils.js");










function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }




/**
 * A mixin that adds event handler functionality that is also safely torn down when a component is
 * removed from the DOM.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */

var IdsEventsMixin = function IdsEventsMixin(superclass) {
  var _addLongPressListener, _removeLongPressListener, _addSwipeListener, _removeSwipeListener, _addKeyboardFocusListener, _removeKeyboardFocusListener, _addHoverEndListener, _addKeyDownEndListener, _removeHoverEndListener, _removeKeyDownEndListener;

  return _addLongPressListener = /*#__PURE__*/new WeakSet(), _removeLongPressListener = /*#__PURE__*/new WeakSet(), _addSwipeListener = /*#__PURE__*/new WeakSet(), _removeSwipeListener = /*#__PURE__*/new WeakSet(), _addKeyboardFocusListener = /*#__PURE__*/new WeakSet(), _removeKeyboardFocusListener = /*#__PURE__*/new WeakSet(), _addHoverEndListener = /*#__PURE__*/new WeakSet(), _addKeyDownEndListener = /*#__PURE__*/new WeakSet(), _removeHoverEndListener = /*#__PURE__*/new WeakSet(), _removeKeyDownEndListener = /*#__PURE__*/new WeakSet(), /*#__PURE__*/function (_superclass) {
    (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(_class2, _superclass);

    var _super = _createSuper(_class2);

    function _class2() {
      var _this;

      (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, _class2);

      _this = _super.call(this);

      _removeKeyDownEndListener.add((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));

      _removeHoverEndListener.add((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));

      _addKeyDownEndListener.add((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));

      _addHoverEndListener.add((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));

      _removeKeyboardFocusListener.add((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));

      _addKeyboardFocusListener.add((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));

      _removeSwipeListener.add((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));

      _addSwipeListener.add((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));

      _removeLongPressListener.add((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));

      _addLongPressListener.add((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));

      (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this), "vetoableEventTypes", []);

      (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this), "detachEventsByName", function (eventName) {
        var isValidName = typeof eventName === 'string' && eventName.length;

        if (isValidName && _this.handledEvents.has(eventName)) {
          var event = _this.handledEvents.get(eventName);

          _this.offEvent(eventName, event.target, event.options);
        }
      });

      _this.handledEvents = new Map(); // for event-subscription related logic, bind "this" of the
      // functions to the class instance to avoid this calls from
      // delegated functions or other external scoping issues

      _this.detachAllEvents = _this.detachAllEvents.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
      _this.detachEventsByName = _this.detachEventsByName.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
      _this.offEvent = _this.offEvent.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
      _this.onEvent = _this.onEvent.bind((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
      return _this;
    }

    (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(_class2, [{
      key: "onEvent",
      value:
      /**
       * Add and keep track of an event listener.
       * @param {string|any} eventName The event name with optional namespace
       * @param {HTMLElement} target The DOM element to register
       * @param {Function|any} callback The callback code to execute
       * @param {object} options Additional event settings (passive, once, bubbles ect)
       */
      function onEvent(eventName, target, callback, options) {
        if (!target) {
          return;
        }

        if (eventName.indexOf('longpress') === 0) {
          _classPrivateMethodGet(this, _addLongPressListener, _addLongPressListener2).call(this, eventName, target, options);
        }

        if (eventName.indexOf('keyboardfocus') === 0) {
          _classPrivateMethodGet(this, _addKeyboardFocusListener, _addKeyboardFocusListener2).call(this, eventName, target, options);
        }

        if (eventName.indexOf('hoverend') === 0) {
          _classPrivateMethodGet(this, _addHoverEndListener, _addHoverEndListener2).call(this, eventName, target, options);
        }

        if (eventName.indexOf('keydownend') === 0) {
          _classPrivateMethodGet(this, _addKeyDownEndListener, _addKeyDownEndListener2).call(this, eventName, target, options);
        }

        if (eventName.indexOf('swipe') === 0) {
          _classPrivateMethodGet(this, _addSwipeListener, _addSwipeListener2).call(this, eventName, target, options);
        }

        target.addEventListener(eventName.split('.')[0], callback, options);
        this.handledEvents.set(eventName, {
          target: target,
          callback: callback,
          options: options
        });
      }
      /**
       * Remove event listener
       * @param {string} eventName The event name with optional namespace
       * @param {HTMLElement} target The DOM element to deregister (or previous registered target)
       * @param {object} options Additional event settings (passive, once, passive ect)
       */

    }, {
      key: "offEvent",
      value: function offEvent(eventName, target, options) {
        var handler = this.handledEvents.get(eventName);
        this.handledEvents["delete"](eventName); // Handle Special events

        if (eventName.indexOf('longpress') === 0 && handler !== null && handler !== void 0 && handler.callback) {
          _classPrivateMethodGet(this, _removeLongPressListener, _removeLongPressListener2).call(this);

          return;
        }

        if (eventName.indexOf('keyboardfocus') === 0 && handler !== null && handler !== void 0 && handler.callback) {
          _classPrivateMethodGet(this, _removeKeyboardFocusListener, _removeKeyboardFocusListener2).call(this);

          return;
        }

        if (eventName.indexOf('hoverend') === 0 && handler !== null && handler !== void 0 && handler.callback) {
          _classPrivateMethodGet(this, _removeHoverEndListener, _removeHoverEndListener2).call(this);

          return;
        }

        if (eventName.indexOf('keydownend') === 0 && handler !== null && handler !== void 0 && handler.callback) {
          _classPrivateMethodGet(this, _removeKeyDownEndListener, _removeKeyDownEndListener2).call(this);

          return;
        }

        if (eventName.indexOf('swipe') === 0 && handler !== null && handler !== void 0 && handler.callback) {
          _classPrivateMethodGet(this, _removeSwipeListener, _removeSwipeListener2).call(this);

          return;
        }

        var targetApplied = target || (handler === null || handler === void 0 ? void 0 : handler.target);

        if (handler !== null && handler !== void 0 && handler.callback && targetApplied !== null && targetApplied !== void 0 && targetApplied.removeEventListener) {
          targetApplied.removeEventListener(eventName.split('.')[0], handler.callback, options || handler.options);
        }
      }
      /**
       * Create and trigger a custom event
       * @param {string} eventName The event id with optional namespace
       * @param {HTMLElement} target The DOM element to register
       * @param {object} [options = {}] The custom data to send
       */

    }, {
      key: "triggerEvent",
      value: function triggerEvent(eventName, target) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var event = new CustomEvent(eventName.split('.')[0], options);
        target.dispatchEvent(event);
      }
      /**
       * @returns {Array<string>} names of vetoable events.  Override this in your component
       * to listen for and handle vetoable events.
       */

    }, {
      key: "triggerVetoableEvent",
      value:
      /**
       * Triggers an event that occurs before the show/hide operations of the Modal that can "cancel"
       * @param {string} eventType the name of the event to trigger
       * @returns {boolean} true if the event works
       */
      function triggerVetoableEvent(eventType) {
        if (this.vetoableEventTypes.length > 0 && !this.vetoableEventTypes.includes(eventType)) {
          return false;
        }

        var canShow = true;

        var eventResponse = function eventResponse(veto) {
          canShow = !!veto;
        };

        this.triggerEvent(eventType, this, {
          detail: {
            elem: this,
            response: eventResponse
          }
        });
        return canShow;
      }
      /**
       * Detach all event handlers
       */

    }, {
      key: "detachAllEvents",
      value: function detachAllEvents() {
        var _this2 = this;

        this.handledEvents.forEach(function (value, key) {
          _this2.offEvent(key, value.target, value.options);
        });

        _classPrivateMethodGet(this, _removeLongPressListener, _removeLongPressListener2).call(this);

        _classPrivateMethodGet(this, _removeKeyboardFocusListener, _removeKeyboardFocusListener2).call(this);

        _classPrivateMethodGet(this, _removeHoverEndListener, _removeHoverEndListener2).call(this);

        _classPrivateMethodGet(this, _removeKeyDownEndListener, _removeKeyDownEndListener2).call(this);

        _classPrivateMethodGet(this, _removeSwipeListener, _removeSwipeListener2).call(this);
      }
      /**
       * Detach a specific handlers associated with a name
       * @param {string} [eventName] an optional event name to filter with
       */

    }, {
      key: "clearTimer",
      value:
      /**
       * Clear the timer
       * @private
       */
      function clearTimer() {
        var _this$timer;

        (_this$timer = this.timer) === null || _this$timer === void 0 ? void 0 : _this$timer.destroy(true);
        this.timer = null;
      }
      /**
       * Detach all hoverend events
       * @private
       */

    }], [{
      key: "attributes",
      get: function get() {
        return (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_4__["default"])((0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(_class2), "attributes", this));
      }
    }]);

    return _class2;
  }(superclass);

  function _addLongPressListener2(eventName, target, options) {
    var _this3 = this;

    if (this.longPressOn) {
      return;
    } // Setup events


    this.onEvent('touchstart.longpress', target, function (e) {
      e.preventDefault();

      if (!_this3.timer) {
        _this3.timer = _components_ids_render_loop_ids_render_loop_global__WEBPACK_IMPORTED_MODULE_9__["default"].register(new _components_ids_render_loop_ids_render_loop_item__WEBPACK_IMPORTED_MODULE_10__["default"]({
          duration: (options === null || options === void 0 ? void 0 : options.delay) || 500,
          timeoutCallback: function timeoutCallback() {
            var event = new CustomEvent('longpress', e);
            target.dispatchEvent(event);

            _this3.clearTimer();
          }
        }));
      }
    }, {
      passive: true
    });
    this.onEvent('touchend.longpress', target, function (e) {
      e.preventDefault();

      _this3.clearTimer();
    }, {
      passive: true
    });
    this.longPressOn = true;
  }

  function _removeLongPressListener2() {
    if (!this.longPressOn) {
      return;
    }

    this.longPressOn = false;
    this.timer = null;
    this.detachEventsByName('touchstart.longpress');
    this.detachEventsByName('touchend.longpress');
  }

  function _addSwipeListener2(eventName, target, options) {
    if (this.swipeOn) {
      return;
    }

    var touchstartX = 0;
    var touchendX = 0;

    if (options) {
      options.passive = true;
    } // Setup events


    this.onEvent('touchstart.swipe', target, function (e) {
      touchstartX = e.changedTouches[0].screenX;
    }, options);
    this.onEvent('touchend.swipe', target, function (e) {
      touchendX = e.changedTouches[0].screenX;
      var direction = '';

      if (touchendX < touchstartX) {
        direction = 'left';
      }

      if (touchendX > touchstartX) {
        direction = 'right';
      }

      if (!direction) {
        return;
      }

      var event = new CustomEvent('swipe', {
        detail: {
          direction: direction,
          trigger: 'touch'
        }
      });
      target.dispatchEvent(event);
    }, options);

    if (options !== null && options !== void 0 && options.scrollContainer) {
      var lastPercentage = 0;
      this.onEvent('scroll', options.scrollContainer, function (e) {
        var eventTarget = e.target;
        var scrollPercentage = 100 * (eventTarget.scrollLeft / (eventTarget.scrollWidth - eventTarget.clientWidth));

        if (Math.abs(lastPercentage - scrollPercentage) < 1) {
          return;
        }

        lastPercentage = scrollPercentage;
        var direction = '';

        if (scrollPercentage === 0) {
          direction = 'right';
        }

        if (scrollPercentage > 98) {
          direction = 'left';
        }

        if (!direction) {
          return;
        }

        var event = new CustomEvent('swipe', {
          detail: {
            direction: direction,
            trigger: 'scroll'
          }
        });
        target.dispatchEvent(event);
      }, {
        passive: true
      });
    }

    this.swipeOn = true;
  }

  function _removeSwipeListener2() {
    if (!this.swipeOn) {
      return;
    }

    this.swipeOn = false;
    this.detachEventsByName('touchstart.swipe');
    this.detachEventsByName('touchend.swipe');
  }

  function _addKeyboardFocusListener2(eventName, target) {
    var _this4 = this;

    if (this.keyboardFocusOn) {
      return;
    } // Get namespace


    this.isClick = false; // Setup events

    this.onEvent('click.keyboardfocus', target, function () {
      _this4.isClick = true;
    });
    this.onEvent('keypress.keyboardfocus', target, function () {
      _this4.isClick = false;
    });
    this.onEvent('focus.keyboardfocus', target, function (e) {
      var event = new CustomEvent('keyboardfocus', e);
      target.dispatchEvent(event);
    }, false);
    this.keyboardFocusOn = true;
  }

  function _removeKeyboardFocusListener2() {
    if (!this.keyboardFocusOn) {
      return;
    }

    this.keyboardFocusOn = false;
    this.detachEventsByName("click.keyboardfocus");
    this.detachEventsByName("keypress.keyboardfocus");
  }

  function _addHoverEndListener2(eventName, target, options) {
    var _this5 = this;

    // Setup events
    this.onEvent('mouseenter.eventsmixin', target, function (e) {
      if (!_this5.timer) {
        _this5.timer = _components_ids_render_loop_ids_render_loop_global__WEBPACK_IMPORTED_MODULE_9__["default"].register(new _components_ids_render_loop_ids_render_loop_item__WEBPACK_IMPORTED_MODULE_10__["default"]({
          duration: (options === null || options === void 0 ? void 0 : options.delay) || 500,
          timeoutCallback: function timeoutCallback() {
            var event = new CustomEvent('hoverend', e);
            target.dispatchEvent(event);

            _this5.clearTimer();
          }
        }));
      }
    });
    this.onEvent('mouseleave.eventsmixin', target, function () {
      _this5.clearTimer();
    });
    this.onEvent('click.eventsmixin', target, function () {
      _this5.clearTimer();
    });
    this.hoverEndOn = true;
  }

  function _addKeyDownEndListener2(eventName, target, options) {
    var _this6 = this;

    var keys = '';
    this.onEvent('keydown.eventsmixin', target, function (e) {
      if (!(0,_utils_ids_string_utils_ids_string_utils__WEBPACK_IMPORTED_MODULE_11__.isPrintable)(e)) {
        return;
      }

      keys += e.key;

      if (!_this6.timer) {
        _this6.timer = _components_ids_render_loop_ids_render_loop_global__WEBPACK_IMPORTED_MODULE_9__["default"].register(new _components_ids_render_loop_ids_render_loop_item__WEBPACK_IMPORTED_MODULE_10__["default"]({
          duration: (options === null || options === void 0 ? void 0 : options.delay) || 500,
          timeoutCallback: function timeoutCallback() {
            var event = new CustomEvent('keydownend', {
              detail: {
                keys: keys
              }
            });
            keys = '';
            target.dispatchEvent(event);

            _this6.clearTimer();
          }
        }));
      }
    });
    this.keyDownEndOn = true;
  }

  function _removeHoverEndListener2() {
    if (!this.hoverEndOn) {
      return;
    }

    this.hoverEndOn = false;
    this.timer = null;
    this.detachEventsByName('click.eventsmixin');
    this.detachEventsByName('mouseleave.eventsmixin');
    this.detachEventsByName('mouseenter.eventsmixin');
  }

  function _removeKeyDownEndListener2() {
    if (!this.keyDownEndOn) {
      return;
    }

    this.keyDownEndOn = false;
    this.timer = null;
    this.detachEventsByName('keydown.eventsmixin');
  }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IdsEventsMixin);

/***/ }),

/***/ "./src/mixins/ids-keyboard-mixin/ids-keyboard-mixin.js":
/*!*************************************************************!*\
  !*** ./src/mixins/ids-keyboard-mixin/ids-keyboard-mixin.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");






function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/**
 * Handle keyboard shortcuts and pressed down keys
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
var IdsKeyboardMixin = function IdsKeyboardMixin(superclass) {
  return /*#__PURE__*/function (_superclass) {
    (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__["default"])(_class, _superclass);

    var _super = _createSuper(_class);

    function _class() {
      var _this;

      (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, _class);

      _this = _super.call(this);

      _this.initKeyboardHandlers();

      return _this;
    }
    /**
     * Initializes the keyboard management system with the current object
     * @private
     */


    (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(_class, [{
      key: "initKeyboardHandlers",
      value: function initKeyboardHandlers() {
        var _this2 = this;

        this.hotkeys = new Map();
        this.pressedKeys = new Map();

        this.keyDownHandler = function (e) {
          _this2.press(e.key);

          _this2.dispatchHotkeys(e);
        };

        this.onEvent('keydown.keyboard', this, this.keyDownHandler);

        this.keyUpHandler = function (e) {
          _this2.unpress(e.key);
        };

        this.onEvent('keyup.keyboard', this, this.keyUpHandler);
      }
      /**
       * Add a key to the pressedKeys Map.
       * @private
       * @param {string} key a string representing a {KeyboardEvent.key} that was pressed
       * @returns {Map} the current set of pressed keys
       */

    }, {
      key: "press",
      value: function press(key) {
        return this.pressedKeys.set("".concat(key), true);
      }
      /**
       * Add a listener for a key or set of keys
       * @param {Array|string} keycode An array of all matchinng keycodes
       * @param {HTMLElement} elem The object with the listener attached
       * @param {Function} callback The call back when this combination is met
       */

    }, {
      key: "listen",
      value: function listen(keycode, elem, callback) {
        var keycodes = Array.isArray(keycode) ? keycode : [keycode];

        var _iterator = _createForOfIteratorHelper(keycodes),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var c = _step.value;
            this.hotkeys.set("".concat(c), callback);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      /**
       * Removes a single applied listener for a hotkey combination
       * @param {string} key An array of all matching keycodes
       * @returns {Map} the current set of hotkeys
       */

    }, {
      key: "unlisten",
      value: function unlisten(key) {
        return this.hotkeys["delete"]("".concat(key));
      }
      /**
       * Remove a key from the pressedKeys map.
       * @private
       * @param {string} key a string representing a {KeyboardEvent.key} that is no longer active
       * @returns {boolean} whether or not the key had been previously logged as "pressed"
       */

    }, {
      key: "unpress",
      value: function unpress(key) {
        return this.pressedKeys["delete"]("".concat(key));
      }
      /**
       * Dispatch an event on any active listeners
       * @private
       * @param {object} e a string representing a {KeyboardEvent.key} that is no longer active
       * @returns {void}
       */

    }, {
      key: "dispatchHotkeys",
      value: function dispatchHotkeys(e) {
        this.hotkeys.forEach(function (value, key) {
          if (key.split(',').indexOf(e.key) > -1) {
            value(e);
          }
        });
      }
      /**
       * Remove all handlers and clear memory
       */

    }, {
      key: "detachAllListeners",
      value: function detachAllListeners() {
        if (this.keyDownHandler && this.offEvent) {
          this.offEvent('keydown.keyboard', this, this.keyDownHandler);
          delete this.keyDownHandler;
        }

        if (this.keyUpHandler && this.offEvent) {
          this.offEvent('keyup.keyboard', this, this.keyUpHandler);
          delete this.keyUpHandler;
        }
      }
    }]);

    return _class;
  }(superclass);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IdsKeyboardMixin);

/***/ }),

/***/ "./src/mixins/ids-theme-mixin/ids-theme-mixin.js":
/*!*******************************************************!*\
  !*** ./src/mixins/ids-theme-mixin/ids-theme-mixin.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/get */ "./node_modules/@babel/runtime/helpers/esm/get.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _core_ids_attributes__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../core/ids-attributes */ "./src/core/ids-attributes.js");








function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }


/**
 * A mixin that adds theming functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */

var IdsThemeMixin = function IdsThemeMixin(superclass) {
  return /*#__PURE__*/function (_superclass) {
    (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(_class, _superclass);

    var _super = _createSuper(_class);

    function _class() {
      (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, _class);

      return _super.call(this);
    }

    (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(_class, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        var _get2;

        (_get2 = (0,_babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_3__["default"])((0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(_class.prototype), "connectedCallback", this)) === null || _get2 === void 0 ? void 0 : _get2.call(this);
        this.initThemeHandlers();
      }
      /**
       * Init the mixin events and states
       * @private
       */

    }, {
      key: "initThemeHandlers",
      value: function initThemeHandlers() {
        var _this = this;

        this.switcher = document.querySelector('ids-theme-switcher');

        if (!this.switcher) {
          return;
        }

        this.mode = this.switcher.mode;
        this.version = this.switcher.version;
        this.onEvent('themechanged', this.switcher, function (e) {
          _this.mode = e.detail.mode;
          _this.version = e.detail.version;
        });
      }
      /**
       * Set the mode of the current theme
       * @param {string} value The mode value for example: light, dark, or contrast
       */

    }, {
      key: "mode",
      get: function get() {
        return this.getAttribute('mode') || 'light';
      }
      /**
       * Set the theme to a particular theme version
       * @param {string} value The version value for example: classic or new
       */
      ,
      set: function set(value) {
        this.setAttribute('mode', value);
        this.container.setAttribute('mode', value);
      }
    }, {
      key: "version",
      get: function get() {
        return this.getAttribute('version') || 'new';
      },
      set: function set(value) {
        this.setAttribute('version', value);
        this.container.setAttribute('version', value);
      }
    }], [{
      key: "attributes",
      get: function get() {
        return [].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_3__["default"])((0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(_class), "attributes", this)), [_core_ids_attributes__WEBPACK_IMPORTED_MODULE_7__.attributes.MODE, _core_ids_attributes__WEBPACK_IMPORTED_MODULE_7__.attributes.VERSION]);
      }
    }]);

    return _class;
  }(superclass);
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (IdsThemeMixin);

/***/ }),

/***/ "./src/utils/ids-string-utils/ids-string-utils.js":
/*!********************************************************!*\
  !*** ./src/utils/ids-string-utils/ids-string-utils.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "camelCase": () => (/* binding */ camelCase),
/* harmony export */   "stringToBool": () => (/* binding */ stringToBool),
/* harmony export */   "isPrintable": () => (/* binding */ isPrintable)
/* harmony export */ });
/* unused harmony exports removeDuplicates, stringToNumber, injectTemplate, buildClassAttrib */
/**
 * Convert a string in presumed kebab case to camel case
 * @param  {string} str [description]
 * @returns {string} The return string
 */
function camelCase(str) {
  return (str.slice(0, 1).toLowerCase() + str.slice(1)).replace(/([-_ ]){1,}/g, ' ').split(/[-_ ]/).reduce(function (cur, acc) {
    var _acc$;

    return cur + ((_acc$ = acc[0]) === null || _acc$ === void 0 ? void 0 : _acc$.toUpperCase()) + acc.substring(1);
  });
}
/**
 * Removes all duplicate characters from a string and returns another string
 * containing ALL unique characters.  Useful for construction of REGEX objects
 * with characters from an input field, etc.
 * @param {string} str The string to process
 * @returns {string} The processed string
 */

function removeDuplicates(str) {
  return str.split('').filter(function (item, pos, self) {
    return self.indexOf(item) === pos;
  }).join('');
}
/**
 * Convert an attribute string into a boolean representation
 * @param {string|boolean|any} val string value from the component attribute
 * @returns {boolean} The return boolean
 */

function stringToBool(val) {
  if (typeof val === 'string' && val.toLowerCase() === 'false') {
    return false;
  }

  return val !== null && (val === true || typeof val === 'string' && val !== 'false');
}
/**
 * Converts an attribute string into a number
 * @param {string|number|any} val string value from the component attribute
 * @returns {number} The return boolean
 */

function stringToNumber(val) {
  var v = (val === null || val === void 0 ? void 0 : val.toString()) * 1; // Converting String to Number

  return !isNaN(v) ? v : 0; // eslint-disable-line
}
/**
 * Inject template variables in a string
 * @param {string} str The string to inject into
 * @param {string} obj The string to inject into
 * @returns {obj} The dataset row / item
 */

function injectTemplate(str, obj) {
  return str.replace(/\${(.*?)}/g, function (_x, g) {
    return obj[g];
  });
}
/**
 * Combines classes and considers truthy/falsy +
 * doesn't pollute the attribs/DOM
 * @param  {...any} classes classes/expressions
 * @returns {string} ` class="c1 c2..."` || ""
 */

function buildClassAttrib() {
  for (var _len = arguments.length, classes = new Array(_len), _key = 0; _key < _len; _key++) {
    classes[_key] = arguments[_key];
  }

  var classAttrib = classes.reduce(function () {
    var attribStr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var c = arguments.length > 1 ? arguments[1] : undefined;

    if (attribStr && c) {
      return "".concat(attribStr, " ").concat(c);
    }

    if (!attribStr && c) {
      return c;
    }

    return attribStr;
  }, '');
  return !classAttrib ? '' : " class=\"".concat(classAttrib, "\"");
}
/**
 * Checks a keycode value and determines if it belongs to a printable character
 * @private
 * @param {number} e the event to inspect
 * @returns {boolean} Returns true if the key is a printable one.
 */

function isPrintable(e) {
  var controlKeys = ['Alt', 'Shift', 'Control', 'Meta', 'CapsLock', 'Enter', 'Escape', 'Tab'];

  if (controlKeys.indexOf(e.key) > -1 || e.key.indexOf('Arrow') > -1) {
    return false;
  }

  if (e.altKey && e.keyCode === 38 || e.keyCode > 111 && e.keyCode < 124) {
    return false;
  }

  return true;
}

/***/ }),

/***/ "./src/components/ids-rating/ids-rating.scss":
/*!***************************************************!*\
  !*** ./src/components/ids-rating/ids-rating.scss ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

        const styles = `:host{--ids-color-palette-amber-10: #FEF2E5;--ids-color-palette-amber-20: #FDDFBD;--ids-color-palette-amber-30: #FCC888;--ids-color-palette-amber-40: #FBAF50;--ids-color-palette-amber-50: #FA9601;--ids-color-palette-amber-60: #F98300;--ids-color-palette-amber-70: #DF6F00;--ids-color-palette-amber-80: #CD6200;--ids-color-palette-amber-90: #BB5500;--ids-color-palette-amber-100: #A14100;--ids-color-palette-amethyst-10: #F1EBFC;--ids-color-palette-amethyst-20: #DDCBF7;--ids-color-palette-amethyst-30: #C2A1F1;--ids-color-palette-amethyst-40: #A876EB;--ids-color-palette-amethyst-50: #8D4BE5;--ids-color-palette-amethyst-60: #7928E1;--ids-color-palette-amethyst-70: #6C23C9;--ids-color-palette-amethyst-80: #591DA8;--ids-color-palette-amethyst-90: #4E1A91;--ids-color-palette-amethyst-100: #3B1470;--ids-color-palette-azure-10: #E6F1FD;--ids-color-palette-azure-20: #BEDCFA;--ids-color-palette-azure-30: #8ABFF7;--ids-color-palette-azure-40: #55A3F3;--ids-color-palette-azure-50: #1C86EF;--ids-color-palette-azure-60: #0072ED;--ids-color-palette-azure-70: #0066D4;--ids-color-palette-azure-80: #0054B1;--ids-color-palette-azure-90: #004A99;--ids-color-palette-azure-100: #003876;--ids-color-palette-emerald-10: #EBF9F1;--ids-color-palette-emerald-20: #CBEFDC;--ids-color-palette-emerald-30: #A1E4BF;--ids-color-palette-emerald-40: #78D8A3;--ids-color-palette-emerald-50: #4DCC86;--ids-color-palette-emerald-60: #2AC371;--ids-color-palette-emerald-70: #25AF65;--ids-color-palette-emerald-80: #1F9254;--ids-color-palette-emerald-90: #1C7F49;--ids-color-palette-emerald-100: #156138;--ids-color-palette-graphite-10: #EEEEEE;--ids-color-palette-graphite-20: #D3D3D3;--ids-color-palette-graphite-30: #B1B1B1;--ids-color-palette-graphite-40: #8F8F8F;--ids-color-palette-graphite-50: #6C6C6C;--ids-color-palette-graphite-60: #535353;--ids-color-palette-graphite-70: #4A4A4A;--ids-color-palette-graphite-80: #3E3E3E;--ids-color-palette-graphite-90: #363636;--ids-color-palette-graphite-100: #292929;--ids-color-palette-ruby-10: #FBE7E8;--ids-color-palette-ruby-20: #F5C3C4;--ids-color-palette-ruby-30: #EE9496;--ids-color-palette-ruby-40: #E66467;--ids-color-palette-ruby-50: #DF3539;--ids-color-palette-ruby-60: #DA1217;--ids-color-palette-ruby-70: #C31014;--ids-color-palette-ruby-80: #A30D11;--ids-color-palette-ruby-90: #8D0B0E;--ids-color-palette-ruby-100: #6C080B;--ids-color-palette-slate-10: #EFEFF0;--ids-color-palette-slate-20: #D7D7D8;--ids-color-palette-slate-30: #B7B7BA;--ids-color-palette-slate-40: #97979B;--ids-color-palette-slate-50: #77777C;--ids-color-palette-slate-60: #606066;--ids-color-palette-slate-70: #56565B;--ids-color-palette-slate-80: #47474C;--ids-color-palette-slate-90: #3E3E42;--ids-color-palette-slate-100: #2F2F32;--ids-color-palette-classic-slate-10: #DEE1E8;--ids-color-palette-classic-slate-20: #C8CBD4;--ids-color-palette-classic-slate-30: #ABAEB7;--ids-color-palette-classic-slate-40: #888B94;--ids-color-palette-classic-slate-50: #656871;--ids-color-palette-classic-slate-60: #50535A;--ids-color-palette-classic-slate-70: #414247;--ids-color-palette-classic-slate-80: #313236;--ids-color-palette-classic-slate-90: #212224;--ids-color-palette-classic-slate-100: #1c1819;--ids-color-palette-turquoise-10: #ECF8F8;--ids-color-palette-turquoise-20: #CFEEEE;--ids-color-palette-turquoise-30: #A8E1E1;--ids-color-palette-turquoise-40: #82D4D4;--ids-color-palette-turquoise-50: #5CC6C7;--ids-color-palette-turquoise-60: #40BDBE;--ids-color-palette-turquoise-70: #39A9AA;--ids-color-palette-turquoise-80: #2F8D8E;--ids-color-palette-turquoise-90: #297B7B;--ids-color-palette-turquoise-100: #1F5E5E;--ids-color-palette-white: #ffffff;--ids-color-palette-black: #000000;--ids-color-status-base: #0066D4;--ids-color-status-caution: #FFD726;--ids-color-status-danger: #DA1217;--ids-color-status-success: #2AC371;--ids-color-status-warning: #F98300;--ids-color-brand-primary-lighter: #55A3F3;--ids-color-brand-primary-base: #0072ED;--ids-color-brand-primary-alt: #0066D4;--ids-color-brand-primary-contrast: #ffffff;--ids-color-brand-secondary-lighter: #97979B;--ids-color-brand-secondary-base: #606066;--ids-color-brand-secondary-alt: #56565B;--ids-color-brand-secondary-contrast: #3E3E42;--ids-color-boxshadow-base: #EFEFF0;--ids-color-border-lighter: #606066;--ids-color-border-base: #47474C;--ids-color-border-darker: #3E3E42;--ids-color-font-base: #2F2F32;--ids-color-font-info: #47474C;--ids-color-font-muted: #606066;--ids-color-icon-base: #47474C;--ids-color-body-base: #EFEFF0;--ids-color-body-lightest: #ffffff;--ids-font-family-base: "source sans pro", helvetica, arial, sans-serif;--ids-font-family-monospace: "source code pro", monospace;--ids-size-font-base: 16px;--ids-size-font-xs: 14px;--ids-size-font-sm: 16px;--ids-size-font-md: 22px;--ids-size-font-lg: 28px;--ids-size-font-xl: 42px;--ids-size-font-px-10: 1px;--ids-size-font-px-12: 12px;--ids-size-font-px-14: 14px;--ids-size-font-px-16: 16px;--ids-size-font-px-20: 20px;--ids-size-font-px-24: 24px;--ids-size-font-px-28: 28px;--ids-size-font-px-32: 32px;--ids-size-font-px-40: 40px;--ids-size-font-px-48: 48px;--ids-size-font-px-60: 60px;--ids-size-font-px-72: 72px;--ids-size-icon-height: 17px;--ids-size-icon-width: 22px;--ids-number-font-weight-light: 300;--ids-number-font-weight-base: 400;--ids-number-font-weight-bold: 600;--ids-number-font-line-height-xs: 1.44;--ids-number-font-line-height-sm: 1.5;--ids-number-font-line-height-md: 1.45;--ids-number-font-line-height-lg: 1.43;--ids-number-font-line-height-xl: 1.33;--ids-number-opacity-disabled: 0.5;--ids-number-spacing-base: 8px;--ids-number-border-radius-sm: 2px;--ids-number-border-radius-md: 6px}.rating{align-items:center;display:inline-flex;flex-direction:row}.rating span{display:none}.star{cursor:pointer;margin:0 4px}.star[icon=star-outlined]{color:var(--ids-color-palette-graphite-50)}.star[icon=star-outlined]:hover{color:var(--ids-color-palette-azure-60)}.star[icon=star-outlined]:focus-visible{outline:none;color:var(--ids-color-palette-azure-60)}.star[icon=star-filled]{color:var(--ids-color-palette-amber-60)}.star[icon=star-filled]:hover{color:var(--ids-color-palette-azure-60)}.star[icon=star-filled]:focus-visible{outline:none;color:var(--ids-color-palette-azure-60)}.star[icon=star-half]{color:var(--ids-color-palette-amber-60)}.star[icon=star-half]:hover{color:var(--ids-color-palette-azure-60)}.star[icon=star-half]:focus-visible{outline:none;color:var(--ids-color-palette-azure-60)}:host([readonly]) .star{cursor:default}:host([readonly]) .star[icon=star-outlined]:hover{color:var(--ids-color-palette-graphite-50)}:host([readonly]) .star[icon=star-filled]:hover{color:var(--ids-color-palette-amber-60)}:host([readonly]) .star[icon=star-half]:hover{color:var(--ids-color-palette-amber-60)}`;
        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (styles);
    

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayLikeToArray)
/* harmony export */ });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayWithHoles)
/* harmony export */ });
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayWithoutHoles)
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _assertThisInitialized)
/* harmony export */ });
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _classCallCheck)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/construct.js":
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/construct.js ***!
  \**************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _construct)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");
/* harmony import */ var _isNativeReflectConstruct_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./isNativeReflectConstruct.js */ "./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js");


function _construct(Parent, args, Class) {
  if ((0,_isNativeReflectConstruct_js__WEBPACK_IMPORTED_MODULE_1__["default"])()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _createClass)
/* harmony export */ });
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _defineProperty)
/* harmony export */ });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/get.js":
/*!********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/get.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _get)
/* harmony export */ });
/* harmony import */ var _superPropBase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./superPropBase.js */ "./node_modules/@babel/runtime/helpers/esm/superPropBase.js");

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = (0,_superPropBase_js__WEBPACK_IMPORTED_MODULE_0__["default"])(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _getPrototypeOf)
/* harmony export */ });
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inherits.js":
/*!*************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inherits.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inherits)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/isNativeFunction.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/isNativeFunction.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _isNativeFunction)
/* harmony export */ });
function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _isNativeReflectConstruct)
/* harmony export */ });
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _iterableToArray)
/* harmony export */ });
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _iterableToArrayLimit)
/* harmony export */ });
function _iterableToArrayLimit(arr, i) {
  var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _nonIterableRest)
/* harmony export */ });
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _nonIterableSpread)
/* harmony export */ });
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _possibleConstructorReturn)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assertThisInitialized.js */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");


function _possibleConstructorReturn(self, call) {
  if (call && ((0,_babel_runtime_helpers_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(call) === "object" || typeof call === "function")) {
    return call;
  }

  return (0,_assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__["default"])(self);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/slicedToArray.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _slicedToArray)
/* harmony export */ });
/* harmony import */ var _arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js");
/* harmony import */ var _iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArrayLimit.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableRest.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js");




function _slicedToArray(arr, i) {
  return (0,_arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr, i) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr, i) || (0,_nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/superPropBase.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/superPropBase.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _superPropBase)
/* harmony export */ });
/* harmony import */ var _getPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = (0,_getPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(object);
    if (object === null) break;
  }

  return object;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _toConsumableArray)
/* harmony export */ });
/* harmony import */ var _arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithoutHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js");
/* harmony import */ var _iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableSpread.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js");




function _toConsumableArray(arr) {
  return (0,_arrayWithoutHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr) || (0,_nonIterableSpread_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _unsupportedIterableToArray)
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _wrapNativeSuper)
/* harmony export */ });
/* harmony import */ var _getPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");
/* harmony import */ var _isNativeFunction_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isNativeFunction.js */ "./node_modules/@babel/runtime/helpers/esm/isNativeFunction.js");
/* harmony import */ var _construct_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./construct.js */ "./node_modules/@babel/runtime/helpers/esm/construct.js");




function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !(0,_isNativeFunction_js__WEBPACK_IMPORTED_MODULE_2__["default"])(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return (0,_construct_js__WEBPACK_IMPORTED_MODULE_3__["default"])(Class, arguments, (0,_getPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_1__["default"])(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************************************!*\
  !*** ./src/components/ids-rating/ids-rating.js ***!
  \*************************************************/
/* unused harmony export default */
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/get */ "./node_modules/@babel/runtime/helpers/esm/get.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../core/ids-attributes */ "./src/core/ids-attributes.js");
/* harmony import */ var _core_ids_decorators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../core/ids-decorators */ "./src/core/ids-decorators.js");
/* harmony import */ var _utils_ids_string_utils_ids_string_utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../utils/ids-string-utils/ids-string-utils */ "./src/utils/ids-string-utils/ids-string-utils.js");
/* harmony import */ var _ids_rating_base__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ids-rating-base */ "./src/components/ids-rating/ids-rating-base.js");
/* harmony import */ var _ids_rating_scss__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./ids-rating.scss */ "./src/components/ids-rating/ids-rating.scss");










var _dec, _dec2, _class, _attachEventHandlers;

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }






/**
 * IDS Rating Component
 * @type {IdsRating}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 */

var IdsRating = (_dec = (0,_core_ids_decorators__WEBPACK_IMPORTED_MODULE_10__.customElement)('ids-rating'), _dec2 = (0,_core_ids_decorators__WEBPACK_IMPORTED_MODULE_10__.scss)(_ids_rating_scss__WEBPACK_IMPORTED_MODULE_13__["default"]), _dec(_class = _dec2(_class = (_attachEventHandlers = /*#__PURE__*/new WeakSet(), /*#__PURE__*/function (_Base) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(IdsRating, _Base);

  var _super = _createSuper(IdsRating);

  function IdsRating() {
    var _this;

    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, IdsRating);

    _this = _super.call(this);

    _attachEventHandlers.add((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));

    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_8__["default"])((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this), "ratingArr", (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_this.container.children));

    return _this;
  }

  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(IdsRating, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      if (!this.readonly) {
        _classPrivateMethodGet(this, _attachEventHandlers, _attachEventHandlers2).call(this);
      } else {
        this.updateHalfStar(this.ratingArr);
      }

      (0,_babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_4__["default"])((0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(IdsRating.prototype), "connectedCallback", this).call(this);
    }
  }, {
    key: "template",
    value:
    /**
     * Create the template for the rating contents
     * @returns {string} The template
     */
    function template() {
      var html = '<div class="rating">';

      for (var i = 0; i < this.stars; i++) {
        html += "<ids-icon class=\"star star-".concat(i, "\" role=\"button\" aria-label=\"").concat(i + 1, " out of 5 Stars\" icon=\"star-outlined\" tabindex=\"0\" size=\"").concat(this.size, "\"></ids-icon>");
      }

      html += '</div>';
      return html;
    }
    /**
     * @returns {Array<string>} this component's observable properties
     */

  }, {
    key: "value",
    get: function get() {
      return Number(this.getAttribute('value') || '0');
    }
    /**
     * Sets the stars attribute
     * @param {string} num string value from the stars attribute
     */
    ,
    set:
    /**
     * Sets the value attribute
     * @param {string|number} val string value from the value attribute
     */
    function set(val) {
      var isReadonly = (0,_utils_ids_string_utils_ids_string_utils__WEBPACK_IMPORTED_MODULE_11__.stringToBool)(this.readonly);

      if (val && !isReadonly) {
        this.ratingArr.forEach(function (element) {
          element.setAttribute('icon', 'star-outlined');
          element.classList.remove('is-half');
          element.classList.remove('active');
        });
        var valueArray = this.ratingArr;
        var starArray = valueArray.slice(0, parseInt(val));
        starArray.forEach(function (element) {
          element.setAttribute('icon', 'star-filled');
          element.classList.add('active');
        });
        this.setAttribute('value', val.toString());
      }

      if (val && isReadonly) {
        this.ratingArr.forEach(function (element) {
          element.setAttribute('icon', 'star-outlined');
          element.classList.remove('active');
          element.classList.remove('is-half');
        });
        this.updateHalfStar(this.ratingArr);
      }
    }
  }, {
    key: "stars",
    get: function get() {
      return this.getAttribute('stars') || 5;
    }
    /**
     * Sets the readonly attribute
     * @param {string} ro string value from the readonly attribute
     */
    ,
    set: function set(num) {
      if (num) {
        this.setAttribute('stars', num.toString());
      }
    }
  }, {
    key: "readonly",
    get: function get() {
      return this.getAttribute('readonly') || false;
    }
    /**
     * Sets the size attribute
     * @param {string} s string value from the size attribute
     */
    ,
    set: function set(ro) {
      if (ro && this.readonly) {
        this.offEvent('click', this.container);
        this.updateHalfStar(this.ratingArr);
        this.setAttribute('readonly', ro.toString());
      }

      if (ro && !this.readonly) {
        _classPrivateMethodGet(this, _attachEventHandlers, _attachEventHandlers2).call(this);

        this.setAttribute('readonly', ro.toString());
      }
    }
  }, {
    key: "size",
    get: function get() {
      return this.getAttribute('size') || 'large';
    }
    /**
     * Handle events
     * @private
     * @returns {void}
     */
    ,
    set: function set(s) {
      if (s) {
        this.ratingArr.forEach(function (element) {
          return element.setAttribute('size', s.toString());
        });
        this.setAttribute('size', s.toString());
      }
    }
  }, {
    key: "updateStars",
    value:
    /**
     * Sets star state, active class and icon attribute
     * @param {any} event event target
     */
    function updateStars(event) {
      var activeElements = this.ratingArr.filter(function (item) {
        return item.classList.contains('active');
      });
      var attrName = 'star-filled';
      var action = 'add';

      var _iterator = _createForOfIteratorHelper(this.ratingArr),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var ratingOption = _step.value;
          ratingOption.classList[action]('active');
          ratingOption.setAttribute('icon', attrName);

          if (ratingOption === event.target) {
            action = 'remove';
            attrName = 'star-outlined';
          }

          if (activeElements.length === 1 && event.target.classList.contains('star-0')) {
            activeElements[0].classList.remove('active');
            activeElements[0].setAttribute('icon', 'star-outlined');
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.updateValue(this.ratingArr);
    }
    /**
     * Sets and updates value attribute
     * @param {any} arr NodeList
     */

  }, {
    key: "updateValue",
    value: function updateValue(arr) {
      var val = (0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])(arr);

      var value = val.filter(function (el) {
        return el.classList.contains('active');
      });
      this.setAttribute('value', value.length);
    }
    /**
     * Sets and updates value attribute for halfstar
     * @param {any} arr NodeList
     */

  }, {
    key: "updateHalfStar",
    value: function updateHalfStar(arr) {
      var value = this.value;
      var roundValue = Math.round(value);

      for (var i = 0; i < roundValue; i++) {
        arr[i].classList.add('active');
        arr[i].setAttribute('icon', 'star-filled');
      }

      if (value < roundValue) {
        var activeArr = arr.filter(function (act) {
          return act.classList.contains('active');
        });
        var lastItem = activeArr[activeArr.length - 1];
        lastItem.classList.add('is-half');
        lastItem.setAttribute('icon', 'star-half');
      }
    }
  }], [{
    key: "attributes",
    get: function get() {
      return [].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_4__["default"])((0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(IdsRating), "attributes", this)), [_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.CLICKABLE, _core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.COMPACT, _core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.MODE, _core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.READONLY, _core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.SIZE, _core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.STARS, _core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.VALUE, _core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.VERSION]);
    }
  }]);

  return IdsRating;
}(_ids_rating_base__WEBPACK_IMPORTED_MODULE_12__["default"]))) || _class) || _class);

function _attachEventHandlers2() {
  var _this2 = this;

  this.onEvent('click', this.container, function (e) {
    return _this2.updateStars(e);
  });
  this.onEvent('keyup', this.container, function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && _this2.readonly === false) {
      _this2.updateStars(e);
    }
  });
}


})();

/******/ })()
;
//# sourceMappingURL=ids-rating.js.map