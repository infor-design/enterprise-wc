/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/ids-icon/ids-icon-base.js":
/*!**************************************************!*\
  !*** ./src/components/ids-icon/ids-icon-base.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _mixins_ids_events_mixin_ids_events_mixin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../mixins/ids-events-mixin/ids-events-mixin */ "./src/mixins/ids-events-mixin/ids-events-mixin.js");
/* harmony import */ var _core_ids_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/ids-element */ "./src/core/ids-element.js");


var Base = (0,_mixins_ids_events_mixin_ids_events_mixin__WEBPACK_IMPORTED_MODULE_0__["default"])(_core_ids_element__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Base);

/***/ }),

/***/ "./src/components/ids-icon/ids-icon.js":
/*!*********************************************!*\
  !*** ./src/components/ids-icon/ids-icon.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony export default */
/* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/get */ "./node_modules/@babel/runtime/helpers/esm/get.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var ids_identity_dist_theme_new_icons_standard_path_data_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ids-identity/dist/theme-new/icons/standard/path-data.json */ "./node_modules/ids-identity/dist/theme-new/icons/standard/path-data.json");
/* harmony import */ var _core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../core/ids-attributes */ "./src/core/ids-attributes.js");
/* harmony import */ var _core_ids_decorators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../core/ids-decorators */ "./src/core/ids-decorators.js");
/* harmony import */ var _ids_icon_base__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ids-icon-base */ "./src/components/ids-icon/ids-icon-base.js");
/* harmony import */ var _utils_ids_string_utils_ids_string_utils__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../utils/ids-string-utils/ids-string-utils */ "./src/utils/ids-string-utils/ids-string-utils.js");
/* harmony import */ var _ids_icon_scss__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./ids-icon.scss */ "./src/components/ids-icon/ids-icon.scss");









var _dec, _dec2, _class, _adjustViewbox, _updateBadge;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_6__["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }





 // Import Styles

 // Setting Defaults

var sizes = {
  largex3: 62,
  large: 24,
  normal: 18,
  medium: 18,
  small: 14,
  xsmall: 10
};
/**
 * IDS Icon Component
 * @type {IdsIcon}
 * @inherits IdsElement
 * @mixes IdsLocaleMixin
 */

var IdsIcon = (_dec = (0,_core_ids_decorators__WEBPACK_IMPORTED_MODULE_10__.customElement)('ids-icon'), _dec2 = (0,_core_ids_decorators__WEBPACK_IMPORTED_MODULE_10__.scss)(_ids_icon_scss__WEBPACK_IMPORTED_MODULE_13__["default"]), _dec(_class = _dec2(_class = (_adjustViewbox = /*#__PURE__*/new WeakSet(), _updateBadge = /*#__PURE__*/new WeakSet(), /*#__PURE__*/function (_Base) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_5__["default"])(IdsIcon, _Base);

  var _super = _createSuper(IdsIcon);

  function IdsIcon() {
    var _this;

    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, IdsIcon);

    _this = _super.call(this);

    _updateBadge.add((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));

    _adjustViewbox.add((0,_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));

    return _this;
  }

  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(IdsIcon, [{
    key: "connectedCallback",
    value: function connectedCallback() {}
    /**
     * Return the attributes we handle as getters/setters
     * @returns {Array} The attributes in an array
     */

  }, {
    key: "template",
    value:
    /**
     * Create the Template for the contents
     * @returns {string} The template
     */
    function template() {
      var size = sizes[this.size];
      var template = "<svg xmlns=\"http://www.w3.org/2000/svg\"".concat(this.isFlipped(this.icon) ? " class=\"flipped\"" : '', " stroke=\"currentColor\" fill=\"none\" height=\"").concat(size, "\" width=\"").concat(size, "\" viewBox=\"0 0 18 18\" aria-hidden=\"true\">\n      ").concat(this.iconData(), "\n    </svg>");

      if (this.badgePosition || this.badgeColor) {
        if (!this.badgePosition) {
          this.badgePosition = "bottom-right";
        }

        if (!this.badgeColor) {
          this.badgeColor = "danger";
        }

        template += "<span class=\"notification-badge ".concat(this.badgePosition, " ").concat(this.badgeColor, "\"></span>");
      }

      return template;
    }
    /**
     * Return the icon data for the svg based on the icon name
     * @returns {string} the path data
     */

  }, {
    key: "iconData",
    value: function iconData() {
      return ids_identity_dist_theme_new_icons_standard_path_data_json__WEBPACK_IMPORTED_MODULE_8__[this.icon];
    }
    /**
     * Some icons are flipped in RTL Mode
     * @param {string} iconName icon name to check
     * @returns {boolean} true if flipped / rtl
     */

  }, {
    key: "isFlipped",
    value: function isFlipped(iconName) {
      var flippedIcons = ['add-grid-record', 'add-grid-row', 'attach', 'bullet-list', 'bullet-steps', 'caret-left', 'caret-right', 'cart', 'cascade', 'change-font', 'clear-screen', 'clockwise-90', 'close-cancel', 'close-save', 'closed-folder', 'collapse-app-tray', 'contacts', 'copy-from', 'copy-mail', 'copy-url', 'counter-clockwise-90', 'create-report', 'cut', 'delete-grid-record', 'delete-grid-row', 'display', 'document', 'drilldown', 'duplicate', 'employee-directory', 'expand-app-tray', 'export', 'export-2', 'export-to-pdf', 'first-page', 'folder', 'generate-key', 'get-more-rows', 'group-selection', 'headphones', 'help', 'helper-list-select', 'history', 'import', 'invoice-released', 'key', 'language', 'last-page', 'launch', 'left-align', 'left-arrow', 'left-text-align', 'logout', 'new-document', 'new-expense-report', 'new-time-sheet', 'new-travel-plan', 'next-page', 'no-attachment', 'no-comment', 'no-filter', 'paste', 'phone', 'previous-page', 'queries', 'quick-access', 'redo', 'refresh', 'refresh-current', 'restore-user', 'right-align', 'right-arrow', 'right-text-align', 'run-quick-access', 'save', 'save-close', 'save-new', 'search', 'search-folder', 'search-list', 'search-results-history', 'select', 'send', 'send-submit', 'show-last-x-days', 'special-item', 'stacked', 'tack', 'timesheet', 'tree-collapse', 'tree-expand', 'undo', 'unsubscribe', 'update-preview', 'zoom-100', 'zoom-in', 'zoom-out'];

      if (flippedIcons.includes(iconName)) {
        return true;
      }

      return false;
    }
    /**
     * @returns {string} the current color of the notification badge
     */

  }, {
    key: "badgeColor",
    get: function get() {
      return this.getAttribute(_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.BADGE_COLOR);
    }
    /**
     * @param {string} value sets the color of the notification badge
     */
    ,
    set: function set(value) {
      if (value && this.getAttribute(_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.BADGE_COLOR) !== value) {
        this.setAttribute(_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.BADGE_COLOR, value);

        _classPrivateMethodGet(this, _updateBadge, _updateBadge2).call(this);
      } else if (!value) {
        this.setAttribute(_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.BADGE_COLOR, '');

        _classPrivateMethodGet(this, _updateBadge, _updateBadge2).call(this);
      }
    }
    /**
     * @returns {string} position of notification badge
     */

  }, {
    key: "badgePosition",
    get: function get() {
      return this.getAttribute(_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.BADGE_POSITION);
    }
    /**
     * @param {string} value sets the postion of the notification badge
     */
    ,
    set: function set(value) {
      if (value && this.getAttribute(_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.BADGE_POSITION) !== value) {
        this.setAttribute(_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.BADGE_POSITION, value);

        _classPrivateMethodGet(this, _updateBadge, _updateBadge2).call(this);
      } else if (!value) {
        this.setAttribute(_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.BADGE_POSITION, '');

        _classPrivateMethodGet(this, _updateBadge, _updateBadge2).call(this);
      }
    }
    /**
     * Return the icon name
     * @returns {string} the icon
     */

  }, {
    key: "icon",
    get: function get() {
      return this.getAttribute(_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.ICON) || '';
    }
    /**
     * Sets the icon svg path to render
     * @param {string} value The value must be a valid key in the path-data.json
     */
    ,
    set: function set(value) {
      var _this$shadowRoot;

      var svgElem = (_this$shadowRoot = this.shadowRoot) === null || _this$shadowRoot === void 0 ? void 0 : _this$shadowRoot.querySelector('svg');

      if (value && ids_identity_dist_theme_new_icons_standard_path_data_json__WEBPACK_IMPORTED_MODULE_8__[value]) {
        svgElem.style.display = '';
        this.setAttribute(_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.ICON, value);
        svgElem.innerHTML = this.iconData();
      } else {
        this.removeAttribute(_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.ICON);
        svgElem.style.display = 'none';
      }
    }
    /**
     * Return the size. May be large, normal/medium or small
     * @returns {string} the size
     */

  }, {
    key: "size",
    get: function get() {
      return this.getAttribute(_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.SIZE) || 'normal';
    },
    set: function set(value) {
      if (value && sizes[value]) {
        var _this$container, _this$container2;

        var size = sizes[this.size];
        this.setAttribute(_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.SIZE, value);
        (_this$container = this.container) === null || _this$container === void 0 ? void 0 : _this$container.setAttribute('height', size);
        (_this$container2 = this.container) === null || _this$container2 === void 0 ? void 0 : _this$container2.setAttribute('width', size);
      } else {
        this.removeAttribute(_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.SIZE);
      }

      _classPrivateMethodGet(this, _adjustViewbox, _adjustViewbox2).call(this);
    }
    /**
     * Some specific icon types have different `viewBox`
     * properties that need adjusting at the component level
     * @returns {void}
     */

  }, {
    key: "vertical",
    get:
    /** @returns {string|boolean} Whether or not the icon is vertical */
    function get() {
      return this.getAttribute(_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.VERTICAL) || false;
    }
    /** @param {string|boolean} value Rotate the icon to vertical */
    ,
    set: function set(value) {
      var isVertical = (0,_utils_ids_string_utils_ids_string_utils__WEBPACK_IMPORTED_MODULE_12__.stringToBool)(value);

      if (isVertical) {
        this.setAttribute(_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.VERTICAL, value);
        this.container.classList.add('vertical');
        return;
      }

      this.removeAttribute(_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.VERTICAL);
      this.container.classList.remove('vertical');
    }
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        this[name] = newValue;
      }
    }
  }], [{
    key: "attributes",
    get: function get() {
      return [].concat((0,_babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_4__["default"])((0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_7__["default"])(IdsIcon), "attributes", this)), [_core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.BADGE_COLOR, _core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.BADGE_POSITION, _core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.LANGUAGE, _core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.LOCALE, _core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.ICON, _core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.SIZE, _core_ids_attributes__WEBPACK_IMPORTED_MODULE_9__.attributes.VERTICAL]);
    }
  }]);

  return IdsIcon;
}(_ids_icon_base__WEBPACK_IMPORTED_MODULE_11__["default"]))) || _class) || _class);

function _adjustViewbox2() {
  var viewboxSize = '0 0 18 18';

  switch (this.icon) {
    case 'logo':
      viewboxSize = '0 0 34 34';
      break;

    case 'logo-trademark':
      viewboxSize = '0 0 37 32';
      break;

    default:
      break;
  }

  this.container.setAttribute('viewBox', viewboxSize);
}

function _updateBadge2() {
  var badge = this.shadowRoot.querySelector('span');

  if (!badge) {
    this.shadowRoot.innerHTML = this.template();
    badge = this.shadowRoot.querySelector('span');
  }

  if (!this.badgeColor && !this.badgePosition && badge) {
    this.className = '';
  } else {
    badge.className = '';
    badge.classList.add("notification-badge", "".concat(this.badgePosition), "".concat(this.badgeColor));
  }
}


;

/***/ }),

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

/***/ "./src/components/ids-rating/ids-rating.js":
/*!*************************************************!*\
  !*** ./src/components/ids-rating/ids-rating.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ "./src/components/ids-icon/ids-icon.scss":
/*!***********************************************!*\
  !*** ./src/components/ids-icon/ids-icon.scss ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });

        const styles = `:host{--ids-color-palette-amber-10: #FEF2E5;--ids-color-palette-amber-20: #FDDFBD;--ids-color-palette-amber-30: #FCC888;--ids-color-palette-amber-40: #FBAF50;--ids-color-palette-amber-50: #FA9601;--ids-color-palette-amber-60: #F98300;--ids-color-palette-amber-70: #DF6F00;--ids-color-palette-amber-80: #CD6200;--ids-color-palette-amber-90: #BB5500;--ids-color-palette-amber-100: #A14100;--ids-color-palette-amethyst-10: #F1EBFC;--ids-color-palette-amethyst-20: #DDCBF7;--ids-color-palette-amethyst-30: #C2A1F1;--ids-color-palette-amethyst-40: #A876EB;--ids-color-palette-amethyst-50: #8D4BE5;--ids-color-palette-amethyst-60: #7928E1;--ids-color-palette-amethyst-70: #6C23C9;--ids-color-palette-amethyst-80: #591DA8;--ids-color-palette-amethyst-90: #4E1A91;--ids-color-palette-amethyst-100: #3B1470;--ids-color-palette-azure-10: #E6F1FD;--ids-color-palette-azure-20: #BEDCFA;--ids-color-palette-azure-30: #8ABFF7;--ids-color-palette-azure-40: #55A3F3;--ids-color-palette-azure-50: #1C86EF;--ids-color-palette-azure-60: #0072ED;--ids-color-palette-azure-70: #0066D4;--ids-color-palette-azure-80: #0054B1;--ids-color-palette-azure-90: #004A99;--ids-color-palette-azure-100: #003876;--ids-color-palette-emerald-10: #EBF9F1;--ids-color-palette-emerald-20: #CBEFDC;--ids-color-palette-emerald-30: #A1E4BF;--ids-color-palette-emerald-40: #78D8A3;--ids-color-palette-emerald-50: #4DCC86;--ids-color-palette-emerald-60: #2AC371;--ids-color-palette-emerald-70: #25AF65;--ids-color-palette-emerald-80: #1F9254;--ids-color-palette-emerald-90: #1C7F49;--ids-color-palette-emerald-100: #156138;--ids-color-palette-graphite-10: #EEEEEE;--ids-color-palette-graphite-20: #D3D3D3;--ids-color-palette-graphite-30: #B1B1B1;--ids-color-palette-graphite-40: #8F8F8F;--ids-color-palette-graphite-50: #6C6C6C;--ids-color-palette-graphite-60: #535353;--ids-color-palette-graphite-70: #4A4A4A;--ids-color-palette-graphite-80: #3E3E3E;--ids-color-palette-graphite-90: #363636;--ids-color-palette-graphite-100: #292929;--ids-color-palette-ruby-10: #FBE7E8;--ids-color-palette-ruby-20: #F5C3C4;--ids-color-palette-ruby-30: #EE9496;--ids-color-palette-ruby-40: #E66467;--ids-color-palette-ruby-50: #DF3539;--ids-color-palette-ruby-60: #DA1217;--ids-color-palette-ruby-70: #C31014;--ids-color-palette-ruby-80: #A30D11;--ids-color-palette-ruby-90: #8D0B0E;--ids-color-palette-ruby-100: #6C080B;--ids-color-palette-slate-10: #EFEFF0;--ids-color-palette-slate-20: #D7D7D8;--ids-color-palette-slate-30: #B7B7BA;--ids-color-palette-slate-40: #97979B;--ids-color-palette-slate-50: #77777C;--ids-color-palette-slate-60: #606066;--ids-color-palette-slate-70: #56565B;--ids-color-palette-slate-80: #47474C;--ids-color-palette-slate-90: #3E3E42;--ids-color-palette-slate-100: #2F2F32;--ids-color-palette-classic-slate-10: #DEE1E8;--ids-color-palette-classic-slate-20: #C8CBD4;--ids-color-palette-classic-slate-30: #ABAEB7;--ids-color-palette-classic-slate-40: #888B94;--ids-color-palette-classic-slate-50: #656871;--ids-color-palette-classic-slate-60: #50535A;--ids-color-palette-classic-slate-70: #414247;--ids-color-palette-classic-slate-80: #313236;--ids-color-palette-classic-slate-90: #212224;--ids-color-palette-classic-slate-100: #1c1819;--ids-color-palette-turquoise-10: #ECF8F8;--ids-color-palette-turquoise-20: #CFEEEE;--ids-color-palette-turquoise-30: #A8E1E1;--ids-color-palette-turquoise-40: #82D4D4;--ids-color-palette-turquoise-50: #5CC6C7;--ids-color-palette-turquoise-60: #40BDBE;--ids-color-palette-turquoise-70: #39A9AA;--ids-color-palette-turquoise-80: #2F8D8E;--ids-color-palette-turquoise-90: #297B7B;--ids-color-palette-turquoise-100: #1F5E5E;--ids-color-palette-white: #ffffff;--ids-color-palette-black: #000000;--ids-color-status-base: #0066D4;--ids-color-status-caution: #FFD726;--ids-color-status-danger: #DA1217;--ids-color-status-success: #2AC371;--ids-color-status-warning: #F98300;--ids-color-brand-primary-lighter: #55A3F3;--ids-color-brand-primary-base: #0072ED;--ids-color-brand-primary-alt: #0066D4;--ids-color-brand-primary-contrast: #ffffff;--ids-color-brand-secondary-lighter: #97979B;--ids-color-brand-secondary-base: #606066;--ids-color-brand-secondary-alt: #56565B;--ids-color-brand-secondary-contrast: #3E3E42;--ids-color-boxshadow-base: #EFEFF0;--ids-color-border-lighter: #606066;--ids-color-border-base: #47474C;--ids-color-border-darker: #3E3E42;--ids-color-font-base: #2F2F32;--ids-color-font-info: #47474C;--ids-color-font-muted: #606066;--ids-color-icon-base: #47474C;--ids-color-body-base: #EFEFF0;--ids-color-body-lightest: #ffffff;--ids-font-family-base: "source sans pro", helvetica, arial, sans-serif;--ids-font-family-monospace: "source code pro", monospace;--ids-size-font-base: 16px;--ids-size-font-xs: 14px;--ids-size-font-sm: 16px;--ids-size-font-md: 22px;--ids-size-font-lg: 28px;--ids-size-font-xl: 42px;--ids-size-font-px-10: 1px;--ids-size-font-px-12: 12px;--ids-size-font-px-14: 14px;--ids-size-font-px-16: 16px;--ids-size-font-px-20: 20px;--ids-size-font-px-24: 24px;--ids-size-font-px-28: 28px;--ids-size-font-px-32: 32px;--ids-size-font-px-40: 40px;--ids-size-font-px-48: 48px;--ids-size-font-px-60: 60px;--ids-size-font-px-72: 72px;--ids-size-icon-height: 17px;--ids-size-icon-width: 22px;--ids-number-font-weight-light: 300;--ids-number-font-weight-base: 400;--ids-number-font-weight-bold: 600;--ids-number-font-line-height-xs: 1.44;--ids-number-font-line-height-sm: 1.5;--ids-number-font-line-height-md: 1.45;--ids-number-font-line-height-lg: 1.43;--ids-number-font-line-height-xl: 1.33;--ids-number-opacity-disabled: 0.5;--ids-number-spacing-base: 8px;--ids-number-border-radius-sm: 2px;--ids-number-border-radius-md: 6px}:host{display:inline-flex;align-self:center;contain:content;place-self:center;position:relative}.vertical{transform:rotate(90deg)}.flipped{transform:scaleX(-1)}.notification-badge{border-radius:4px;height:6px;width:6px;background-color:var(--ids-color-status-danger);position:absolute}.notification-badge.base{background-color:var(--ids-color-status-base)}.notification-badge.caution{background-color:var(--ids-color-status-caution)}.notification-badge.danger{background-color:var(--ids-color-status-danger)}.notification-badge.success{background-color:var(--ids-color-status-success)}.notification-badge.warning{background-color:var(--ids-color-status-warning)}.notification-badge.top-right{bottom:75%;left:75%}.notification-badge.top-left{bottom:75%;left:0}.notification-badge.bottom-right{bottom:0;left:75%}.notification-badge.bottom-left{bottom:0;left:0}`;
        /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (styles);
    

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

/***/ }),

/***/ "./node_modules/ids-identity/dist/theme-new/icons/standard/path-data.json":
/*!********************************************************************************!*\
  !*** ./node_modules/ids-identity/dist/theme-new/icons/standard/path-data.json ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"add-grid-record":"<path d=\\"M12 11.5h-1.5v-7h7V8m-2 0v5M13 10.5h5m-17.5 1h7v-7h-7v7z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","add-grid-row":"<path d=\\"M17.5 9V3.5H.5v9H9m2 0h7M14.5 16V9\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","add":"<path d=\\"M8.5 0v17M17 8.5H0\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","additional-help":"<path d=\\"M14.5 17v-5M12 14.5h5M7.5 18v-1m0-2v-3.5A5.5 5.5 0 102 6\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","agent":"<path d=\\"M9 0a6 6 0 00-6 6H2v2h2V6a5 5 0 0110 0v2h2V6h-1a6 6 0 00-6-6z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path><path clip-rule=\\"evenodd\\" d=\\"M9 3a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM6.5 6.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zM9 11a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zm-5 6a5 5 0 0110 0H4z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","alert-alert":"<path d=\\"M8.5 1.5L0 17h17L8.5 1.5z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path><path d=\\"M8.5 8v4m0 1v1\\" stroke=\\"#fff\\" vector-effect=\\"non-scaling-stroke\\"></path>","alert-solid":"<path clip-rule=\\"evenodd\\" d=\\"M0 17L8.5 1.5 17 17H0zm8-5V8h1v4H8zm0 2v-1h1v1H8z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","alert":"<path d=\\"M8.847 8v4m0 1v1m0-12l-8 14.5h16l-8-14.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","amend":"<path d=\\"M0 2.5h18m-12 12h12m-18-6h18m-18 6h5M2.5 12v5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","apply-rule":"<path d=\\"M7.038 12.923l-.39.312.366.458.394-.434-.37-.336zM17 9a8 8 0 01-8 8v1a9 9 0 009-9h-1zm-8 8a8 8 0 01-8-8H0a9 9 0 009 9v-1zM1 9a8 8 0 018-8V0a9 9 0 00-9 9h1zm8-8a8 8 0 018 8h1a9 9 0 00-9-9v1zM4.033 9.966l2.615 3.27.78-.625-2.614-3.27-.781.625zm3.375 3.293l6.539-7.192-.74-.673-6.539 7.193.74.672z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","approved-filled":"<path clip-rule=\\"evenodd\\" d=\\"M1 1h16v11.429A4.571 4.571 0 0112.429 17H1V1zm6.495 11.774l6.385-7.449-.76-.65-5.615 6.55-2.12-2.545-.77.64 2.88 3.454z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","approved":"<path d=\\"M5 9l2.5 3 6-7m-12-3.5h15v9a6 6 0 01-6 6h-9v-15z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","archives":"<path d=\\"M15.5 17.5v-4h-4.1c-.2 1.1-1.2 2-2.4 2s-2.2-.9-2.4-2H2.5v4m13 0h-13m13 0V.5h-13v17m9.3-8.7L9 11.7 6.2 8.8M9 4v7\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","area":"<path d=\\"M0 12.463V0h1v9.176L5.676 4.5l5.448 5.447 4.134-4.134.707.707-7.91 7.91-2.548-2.55-3.73 3.122A4.533 4.533 0 005.537 17H18v1H5.537A5.537 5.537 0 010 12.463z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","arrow-down":"<path d=\\"M8.5 16.37V0M1 9.444L8.5 17 16 9.444\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","arrow-left":"<path d=\\"M1.34 8.5h16.37M8.265 1L.71 8.5 8.265 16\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","arrow-right":"<path d=\\"M16.87 8.5H.5M9.944 16L17.5 8.5 9.944 1\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","arrow-up":"<path d=\\"M8.5 1.34v16.37M16 8.265L8.5.71 1 8.265\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","articles":"<path clip-rule=\\"evenodd\\" d=\\"M16.1 1c-3.5 0-5.9.4-7.1 1.2C7.6 1.3 4.5 1 1.9 1c-.2 0-.5.1-.6.3-.2.1-.3.4-.3.6v12.4c0 .5.4.9.9.9 5.1 0 6.1.9 6.2 1.1.1.4.5.7.9.7.5 0 .8-.3.9-.8.5-.5 3.4-1 6.2-1 .5 0 .9-.4.9-.9V1.9c0-.5-.4-.9-.9-.9zm-8 13.2c-1.2-.5-3-.7-5.3-.8V2.8c2.5.1 4.9.5 5.3 1v10.4zm1.8.1c1.2-.5 2.9-.7 5.3-.8V2.8c-2.5.1-4.9.5-5.3 1v10.5z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","attach":"<path d=\\"M7.5 12.157V7.3s0-2.429 2-2.429 2 2.429 2 2.429v6.8c0 .902-.369 1.767-1.025 2.404A3.553 3.553 0 018 17.5a3.553 3.553 0 01-2.475-.996A3.352 3.352 0 014.5 14.1V5.357c0-1.288.527-2.523 1.464-3.434A5.076 5.076 0 019.5.5c1.326 0 2.598.512 3.536 1.423A4.788 4.788 0 0114.5 5.357V11\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","back-color":"<path clip-rule=\\"evenodd\\" d=\\"M17 17H1V1h16v16zm-5.803-5.655L12.357 15H14L9.875 3h-1.75L4 15h1.578l1.174-3.655h4.445z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path><path clip-rule=\\"evenodd\\" d=\\"M8.956 4a80.418 80.418 0 01-1.317 4.131L7 10h4l-.633-1.869A100.272 100.272 0 019.035 4h-.08z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","bar":"<path d=\\"M.5 0v12.89a4.61 4.61 0 004.61 4.61H18M5.5 7v10.5m5-15.5v15.5m5-13.5v13.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","barcode":"<path d=\\"M.5 3v12m1-12v12m3-12v12m3-12v12m1-12v12m1-12v12m4-12v12m-1-12v12m3-12v12m2-12v12\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","bed":"<path d=\\"M1.5 13H1v1h.5v-1zm16 1h.5v-1h-.5v1zm-.5 1.5v.5h1v-.5h-1zM1 1.5V1H0v.5h1zm-1 14v.5h1v-.5H0zm7.5-9V6H7v.5h.5zm0 4H7v.5h.5v-.5zm-6-.5H1v1h.5v-1zm0 4h16v-1h-16v1zM18 15.5v-5h-1v5h1zM0 1.5v14h1v-14H0zM7.5 7h8V6h-8v1zM17 8.5v2h1v-2h-1zm.5 1.5h-10v1h10v-1zm-9.5.5v-4H7v4h1zM15.5 7A1.5 1.5 0 0117 8.5h1A2.5 2.5 0 0015.5 6v1zm-10 0A1.5 1.5 0 014 8.5v1A2.5 2.5 0 006.5 7h-1zM4 8.5A1.5 1.5 0 012.5 7h-1A2.5 2.5 0 004 9.5v-1zM2.5 7A1.5 1.5 0 014 5.5v-1A2.5 2.5 0 001.5 7h1zM4 5.5A1.5 1.5 0 015.5 7h1A2.5 2.5 0 004 4.5v1zM1.5 11h16v-1h-16v1z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","binoculars":"<path d=\\"M6.5 9.5h5m-5 0a3.001 3.001 0 01-6 0 3.001 3.001 0 016 0zm5 0a3.001 3.001 0 006 0 3.001 3.001 0 00-6 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","bold":"<path clip-rule=\\"evenodd\\" d=\\"M3 17V1h5.406c.824 0 1.588.061 2.291.184.703.123 1.317.34 1.842.65.526.311.938.72 1.237 1.227.299.508.448 1.146.448 1.914 0 .36-.048.72-.145 1.08-.097.36-.235.696-.412 1.006-.178.311-.392.59-.643.835-.25.245-.537.425-.86.54v.098c.404.098.775.25 1.115.454a3.481 3.481 0 011.503 1.865c.145.417.218.896.218 1.435 0 .818-.158 1.522-.473 2.11a4.104 4.104 0 01-1.309 1.46 5.994 5.994 0 01-1.951.86 9.762 9.762 0 01-2.4.282H3zm3-9h2.5c1.047 0 1.313-.19 1.788-.571.475-.381.712-.89.712-1.524 0-.69-.242-1.18-.727-1.47C9.79 4.145 9.508 4 8.5 4H6v4zm2.441 6H6v-4h3c1.196 0 1.53.147 2.118.44.588.294.882.782.882 1.465C12 13.302 10.814 14 8.441 14z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","bookmark-filled":"<path clip-rule=\\"evenodd\\" d=\\"M17 18l-7.5-5L2 18V5.538C2 2.48 4.442 0 7.455 0H17v18z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","bookmark-outlined":"<path clip-rule=\\"evenodd\\" d=\\"M16.5 17l-7-4.583L2.5 17V5.577A5.084 5.084 0 017.59.5h8.91V17z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","bottom-aligned":"<path d=\\"M0 17.5h18M13.5 6v9m-10-.5h6V.5h-6v14z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","bubble":"<path d=\\"M.5 0v12.89a4.61 4.61 0 004.61 4.61H18M8.5 8a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm7-3a2.5 2.5 0 01-5 0 2.5 2.5 0 015 0zm-1 8.5a2 2 0 11-4 0 2 2 0 014 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","building":"<path d=\\"M8.5 17.5h2.667c2.945 0 5.333-2.342 5.333-5.23V.5h-8v17zm0 0h-8v-12h8v12zM2 8.5h5m-5 3h5m-5 3h5m3-11h5m-5 3h5m-5 3h5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","bullet-list":"<path d=\\"M4 2.5h14m-14 12h14m-14-6h14M1.5 14a.5.5 0 100 1 .5.5 0 000-1zm0-6a.5.5 0 100 1 .5.5 0 000-1zm0-6a.5.5 0 100 1 .5.5 0 000-1z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","bullet-steps":"<path d=\\"M4 2.5h14m-14 12h9m-9-6h14M1.5 2a.5.5 0 100 1 .5.5 0 000-1zm0 12a.5.5 0 100 1 .5.5 0 000-1zm0-6a.5.5 0 100 1 .5.5 0 000-1z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","business-object":"<path d=\\"M13.978 15.89A8.5 8.5 0 01.5 9 8.5 8.5 0 019 .5c1.874 0 3.604.605 5.01 1.632\\" stroke=\\"#1C9A17\\" vector-effect=\\"non-scaling-stroke\\"></path><path d=\\"M27.5 9a8.5 8.5 0 01-8.5 8.5A8.5 8.5 0 0110.5 9 8.5 8.5 0 0119 .5 8.5 8.5 0 0127.5 9z\\" stroke=\\"#6DC80D\\" vector-effect=\\"non-scaling-stroke\\"></path>","calculator":"<path d=\\"M11.5 6.006v11m-5-11v11m9.5-3.5H2m14-4H2m0-4h14M1.5 17.49V.506h15V12.5a5 5 0 01-5.005 5L1.5 17.49z\\" stroke=\\"currentColor\\" stroke-width=\\"1.011\\" vector-effect=\\"non-scaling-stroke\\"></path>","calendar":"<path d=\\"M1 7.5h16M3.5 0v3m11-3v3m-14 .5h17v8.727c0 2.912-2.342 5.273-5.23 5.273H.5v-14z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","camera":"<path clip-rule=\\"evenodd\\" d=\\"M17.5 4.5h-4l-1-3h-7l-1 3h-4v12h11.77c2.92 0 5.23-2.248 5.23-5.09V4.5z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path><path clip-rule=\\"evenodd\\" d=\\"M11.5 10a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","cancel":"<path d=\\"M1.917 14.194L16.083 3.806M17.5 9A8.5 8.5 0 019 17.5 8.5 8.5 0 01.5 9 8.5 8.5 0 019 .5 8.5 8.5 0 0117.5 9z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","capslock":"<path d=\\"M17 11L9 1.5 1 11m0 4.5h16\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","caret-down":"<path d=\\"M18.363 4l-9 9.5-9-9.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","caret-left":"<path d=\\"M13 17.5L4 9l9-8.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","caret-right":"<path d=\\"M4 .5L13 9l-9 8.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","caret-solid-left":"<path clip-rule=\\"evenodd\\" d=\\"M11 4L5 9l6 5V4z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","caret-solid-right":"<path clip-rule=\\"evenodd\\" d=\\"M7 14l6-5-6-5v10z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","caret-up":"<path d=\\"M.5 13L9 4l8.5 9\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","cart":"<path d=\\"M1 .5l3 1 2 9m0 0h9l2-6H5m1 6l-1 3h11.5m-9.5 3a1 1 0 10-2 0 1 1 0 002 0zm9 0a1 1 0 10-2 0 1 1 0 002 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","cascade-objects":"<path d=\\"M6.5 3.5v-3h11v11h-2.87M3.5 6.5v-3h11v11h-2.87m-.13 3H5.389A4.89 4.89 0 01.5 12.611V6.5h11v11z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","cascade":"<path d=\\"M6.5 6.5h11v6.111a4.89 4.89 0 01-4.889 4.889H6.5v-11zm0 0h-3m8-3v-3H.5v11h2.87m11.13-5v-3h-11m0 0v11h2.87M3.5 3.5h-3m6 6H18\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","center-text":"<path d=\\"M3 15.5h12m-15-6h18m-18-6h18\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","change-font":"<path d=\\"M0 .5h4c.795 0 1.5.718 1.5 1.5v4.5H2C1.205 6.5.5 5.782.5 5V3.5h5.094M4.5 17.5L11 7l6.5 10.5M7 13.5h8\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","change-row-line-height":"<path d=\\"M18 8.5H8m10 6h-7m7-12h-7M4.5 1v15m0-15L8 4.5M4.5 1L1 4.5M4.5 16L8 12.5M4.5 16L1 12.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","check-list":"<path d=\\"M.5 6.5l3 3 9-9m5 9l-8 8m8 0l-8-8\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","check":"<path d=\\"M.5 9L6 15.5 17.5 2\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","check2":"<path d=\\"M1 9l5 7L16 2m-6 13.5h6m-4-3h6\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","checkbox":"<path d=\\"M9 1.5H.5v10.77a5.231 5.231 0 005.23 5.23h11.767V9M4.5 6.5l5 5 8-11\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","chevron-down":"<path d=\\"M18.363 4l-9 9.5-9-9.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","chevron-left":"<path d=\\"M13 17.5L4 9l9-8.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","chevron-right":"<path d=\\"M4 .5L13 9l-9 8.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","chevron-up":"<path d=\\"M.5 13L9 4l8.5 9\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","clear-formatting":"<path clip-rule=\\"evenodd\\" d=\\"M11.723 13.533L5.569 7.36l.708-.706 6.154 6.171-.708.707z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path><path clip-rule=\\"evenodd\\" d=\\"M10.846 1.363l6.86 6.88-6.717 6.736a5.414 5.414 0 01-7.67 0L.294 11.945 10.846 1.363zm-9.14 10.582l2.321 2.328a4.414 4.414 0 006.253 0l6.014-6.03-5.448-5.464-9.14 9.166z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path><path d=\\"M10.414 2l6.364 6.364-4.95 4.95L5.464 6.95 10.414 2z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","clear-screen":"<path d=\\"M.5 4.5h17M6.004 8l6 6m0-6L6 14.004M.5 17.5h11.77a5.231 5.231 0 005.23-5.23V.5H.5v17z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","clock":"<path d=\\"M8.5 4.423V11l4-1.5m5-.5A8.5 8.5 0 019 17.5 8.5 8.5 0 01.5 9 8.5 8.5 0 019 .5 8.5 8.5 0 0117.5 9z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","clockwise-90":"<path d=\\"M10.5 9.5L14 13l3.5-3.5m-3.5 3V12c0-3.866-2.634-7-6.5-7a7 7 0 00-7 7\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","close-cancel":"<path clip-rule=\\"evenodd\\" d=\\"M16.293.293a.999.999 0 111.414 1.414L15.914 3.5l1.793 1.793a.999.999 0 11-1.414 1.414L14.5 4.914l-1.793 1.793a.997.997 0 01-1.414 0 .999.999 0 010-1.414L13.086 3.5l-1.793-1.793A.999.999 0 1112.707.293L14.5 2.086 16.293.293zM8 3H2.5A2.5 2.5 0 000 5.5v9A2.5 2.5 0 002.5 17h9a2.5 2.5 0 002.5-2.5V10a1 1 0 00-2 0v4.5a.5.5 0 01-.5.5h-9a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5H8a1 1 0 000-2zM5 7h3c.55 0 1 .45 1 1s-.45 1-1 1H5c-.55 0-1-.45-1-1s.45-1 1-1zm0 4h4c.55 0 1 .45 1 1s-.45 1-1 1H5c-.55 0-1-.45-1-1s.45-1 1-1z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","close-save":"<path clip-rule=\\"evenodd\\" d=\\"M17.993 3.886C17.993.021 14 0 14 0v2h-3V0h-1c-.55 0-1 .45-1 1v6a2 2 0 002 2h5a2 2 0 002-2V4l-.007-.114zM11 4h5v3h-5V4zm-2 8c.55 0 1 .45 1 1s-.45 1-1 1H5c-.55 0-1-.45-1-1s.45-1 1-1h4zM6 8H5c-.55 0-1 .45-1 1s.45 1 1 1h1c.55 0 1-.45 1-1s-.45-1-1-1zM2.5 4H6a1 1 0 010 2H2.5a.5.5 0 00-.5.5v9a.5.5 0 00.5.5h9a.5.5 0 00.5-.5V13a1 1 0 012 0v2.5a2.5 2.5 0 01-2.5 2.5h-9A2.5 2.5 0 010 15.5v-9A2.5 2.5 0 012.5 4z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","close":"<path d=\\"M17.5.5l-17 17m17 0L.5.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","closed-folder":"<path d=\\"M.5 4.5h11.214M.5 16.5h11.77c2.888 0 5.23-2.442 5.23-5.454V4.5h-5.885l-5.884-3H.5v15z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","cloud":"<path clip-rule=\\"evenodd\\" d=\\"M13.577 6a4.06 4.06 0 00-1.613.339C11.313 4.684 9.653 3.5 7.692 3.5 5.37 3.5 3.47 5.162 3.176 7.308 1.655 7.575.5 8.841.5 10.375c0 1.726 1.463 3.125 3.27 3.125h9.807c2.167 0 3.923-1.679 3.923-3.75C17.5 7.679 15.744 6 13.577 6z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","collapse-all":"<path d=\\"M15 1L9 7 3 1m12 16l-6-6-6 6\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","collapse-app-tray":"<path d=\\"M17 17.5L8 9l9-8.5m-7 17L1 9l9-8.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","columns":"<path d=\\"M12.5 16.5v-15m-7 15v-15m-5 15h17v-15H.5v15z\\" stroke=\\"currentColor\\" stroke-width=\\".997\\" vector-effect=\\"non-scaling-stroke\\"></path>","comment-alt":"<path clip-rule=\\"evenodd\\" d=\\"M18 1H0v6.5C0 10.656 2.441 13 5.5 13h8l4.5 3V1z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","comment":"<path clip-rule=\\"evenodd\\" d=\\"M17.5 2.5H.5v6c0 2.84 2.111 5 5 5H13l4.5 2.5V2.5z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","component":"<path clip-rule=\\"evenodd\\" d=\\"M15.182 12.864c-.272 0-.44-.056-.682-.143V17.5H9.63a2.313 2.313 0 00-2.175-1.546A2.313 2.313 0 005.279 17.5H.5v-4.778a2.313 2.313 0 001.545-2.176A2.312 2.312 0 00.5 8.369V3.5h4.779c-.087-.243-.143-.41-.143-.682a2.319 2.319 0 014.637 0c0 .272-.056.44-.142.682H14.5v4.87c.243-.087.41-.143.682-.143a2.319 2.319 0 010 4.637z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","compose":"<path d=\\"M14.808 12.472c0 2.889-2.33 5.23-5.203 5.23H.5v-16.5m10.5 2l3 3m-9.5 6.5v-3l8.89-9 3.11 3-9 9h-3z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","confirm":"<path d=\\"M7 12l-.407.29.343.48.418-.416L7 12zm10-3a8 8 0 01-8 8v1a9 9 0 009-9h-1zm-8 8a8 8 0 01-8-8H0a9 9 0 009 9v-1zM1 9a8 8 0 018-8V0a9 9 0 00-9 9h1zm8-8a8 8 0 018 8h1a9 9 0 00-9-9v1zM4.093 8.79l2.5 3.5.814-.58-2.5-3.5-.814.58zm3.26 3.564l6.5-6.5-.707-.708-6.5 6.5.708.707z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","connect":"<path d=\\"M1.5 5.5H17m-15.5 0L5 2M1.5 5.5L5 9m11.5 3.5H1m15.5 0L13 9m3.5 3.5L13 16\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","connections":"<path d=\\"M5.5 15.5h7m-9-3l4-7m7 7l-4-7m-5 9.5a2.5 2.5 0 01-5 0 2.5 2.5 0 015 0zm6-12a2.5 2.5 0 01-5 0 2.5 2.5 0 015 0zm6 12a2.5 2.5 0 01-5 0 2.5 2.5 0 015 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","contacts":"<path d=\\"M2.5.5V0H2v.5h.5zm14 0h.5V0h-.5v.5zm-14 17H2v.5h.5v-.5zm3-3H5v.5h.5v-.5zm8 0v.5h.5v-.5h-.5zM2.5 1h14V0h-14v1zM16 .5v11.77h1V.5h-1zm0 11.77c0 2.667-1.918 4.73-4.167 4.73v1C14.74 18 17 15.379 17 12.27h-1zM11.833 17H2.5v1h9.333v-1zM3 17.5V.5H2v17h1zm8.25-12.75A1.75 1.75 0 019.5 6.5v1a2.75 2.75 0 002.75-2.75h-1zM9.5 6.5a1.75 1.75 0 01-1.75-1.75h-1A2.75 2.75 0 009.5 7.5v-1zM7.75 4.75C7.75 3.783 8.533 3 9.5 3V2a2.75 2.75 0 00-2.75 2.75h1zM9.5 3c.967 0 1.75.783 1.75 1.75h1A2.75 2.75 0 009.5 2v1zm.444 6h-.888v1h.888V9zm-.888 0C6.846 9 5 10.687 5 12.834h1C6 11.299 7.337 10 9.056 10V9zM5 12.834V14.5h1v-1.666H5zM5.5 15h8v-1h-8v1zm8.5-.5v-1.666h-1V14.5h1zm0-1.666C14 10.687 12.153 9 9.944 9v1C11.663 10 13 11.299 13 12.834h1zM1 9h3V8H1v1zm0 6h3v-1H1v1zM1 4h3V3H1v1z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","copy-from":"<path clip-rule=\\"evenodd\\" d=\\"M12.978 18h.522a2.5 2.5 0 002.5-2.5V4.828a2 2 0 00-.586-1.414L12.586.586A2 2 0 0011.172 0H4.5A2.5 2.5 0 002 2.5V6a1 1 0 102 0V2.5a.5.5 0 01.5-.5H10v3c0 .55.45 1 1 1h3v9.5a.5.5 0 01-.5.5h-.522a.985.985 0 00-.986.979v.031c-.003.546.44.99.986.99zm-2.985-5.114C9.993 9.021 6 9 6 9v2H3V9H2c-.55 0-1 .45-1 1v6a2 2 0 002 2h5a2 2 0 002-2v-3l-.007-.114zM8 13H3v3h5v-3z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","copy-mail":"<path clip-rule=\\"evenodd\\" d=\\"M12.977 18h.523a2.5 2.5 0 002.5-2.5V4.828a2 2 0 00-.586-1.414L12.586.586A2 2 0 0011.172 0H4.5A2.5 2.5 0 002 2.5V7a1 1 0 102 0V2.5a.5.5 0 01.5-.5H10v3c0 .55.45 1 1 1h3v9.5a.5.5 0 01-.5.5h-.522a.985.985 0 00-.986.979v.031c-.003.546.44.99.985.99zM10 12a2 2 0 00-2-2H4a2 2 0 00-2 2l4 2 4-2zm-8 4v-2l3.553 1.776a.998.998 0 00.894 0L10 14v2a2 2 0 01-2 2H4a2 2 0 01-2-2z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","copy-url":"<path clip-rule=\\"evenodd\\" d=\\"M13.5 18h-.522a.986.986 0 01-.986-.99v-.031a.985.985 0 01.986-.979h.522a.5.5 0 00.5-.5V6h-3c-.55 0-1-.45-1-1V2H4.5a.5.5 0 00-.5.5V6a1 1 0 11-2 0V2.5A2.5 2.5 0 014.5 0h6.672a2 2 0 011.414.586l2.828 2.828A2 2 0 0116 4.828V15.5a2.5 2.5 0 01-2.5 2.5zM1 13c0-2.721 2.278-5 5-5 2.723 0 5 2.278 5 5 0 2.721-2.28 5-5 5s-5-2.279-5-5zm5.013 3A2.994 2.994 0 013 13c0-.354.06-.689.172-1.005.065.002.841.027.841 1.005 0 1 1 1 1 1s1 0 1 1v1zM7 14c1.134 0 1.104 1.121 1.103 1.136A2.986 2.986 0 009 13c0-.825-.334-1.572-.873-2.113 0 0 .001 1.113-1.127 1.113-.577 0-1 .365-1 1 0 0 0 1 1 1z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","copy":"<path d=\\"M14 13.5h3.5V.5h-13V4m-4 2.429V4.5h1.929m1.428 0H6.43m1.285 0h2.572M13.5 6.429V4.5h-1.929m-3.857 13h2.572m3.214-3.214v-2.572m0-1.285V7.857m0 7.714V17.5h-1.929m-6.428-.04a5.126 5.126 0 01-2.572-1.09m-1.285-1.522a5.123 5.123 0 01-.643-2.49M.5 10.428v-2.57\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","counter-clockwise-90":"<path d=\\"M7.5 9L4 12.5.5 9M4 12v-.5c0-3.866 2.634-7 6.5-7a7 7 0 017 7\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","create-report":"<path d=\\"M9 .5h7.5v11.77c0 2.888-2.507 5.23-5.6 5.23H2.5V9.472M1 9.5h3m-3 5h3m-3-11h7M4.5 0v7\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","cut":"<path d=\\"M4.5 4.5L17 17M5 13L17 1M5.5 15a2.5 2.5 0 01-5 0 2.5 2.5 0 015 0zm0-12a2.5 2.5 0 01-5 0 2.5 2.5 0 015 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","dashboard":"<path d=\\"M.5 13A8.5 8.5 0 019 4.5a8.5 8.5 0 018.5 8.5m-9.154-.654l3.923-3.923\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","database":"<path d=\\"M17.5 9c0 4.693-3.807 8.5-8.5 8.5M17.5 9C17.5 4.307 13.693.5 9 .5M17.5 9H.5M9 17.5A8.501 8.501 0 01.5 9M9 17.5c2.347 0 4.25-3.807 4.25-8.5S11.347.5 9 .5m0 17c-2.347 0-4.25-3.807-4.25-8.5S6.653.5 9 .5m0 17V.5M.5 9C.5 4.307 4.307.5 9 .5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","decrease-row-line-height":"<path d=\\"M18 9.5H8m10-6H8m10 12h-7m-6.5 1V0M8 13l-3.5 4L1 13\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","default":"<path d=\\"M0 16.326h4.74m0 0v-4.74m0 4.74c-2.019-1.59-3.55-3.8-3.55-6.583 0-4.8 3.86-8.69 8.621-8.69 4.762 0 8.622 3.89 8.622 8.69 0 4.8-3.86 8.69-8.622 8.69\\" stroke=\\"currentColor\\" stroke-width=\\"1.077\\" vector-effect=\\"non-scaling-stroke\\"></path>","delete-grid-record":"<path d=\\"M13 9l4 4m0-4l-4 4m-1-1.5h-1.5v-7h7V8m-17 3.5h7v-7h-7v7z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","delete-grid-row":"<path d=\\"M17.5 9V3.5H.5v9H9m1.5 3l5-6m0 6l-5-6\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","delete":"<path d=\\"M0 2.5h18m-12.5 0v-2h7v2m-11 0l2 15H10c2.66 0 5.01-1.805 5.25-4.5L16.5 2.5h-15z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","design-mode":"<path d=\\"M10.5 15.5h5m-11-10H7m-2.5 4H7m-2.5 4H7m-4.5 4h5V.5h-5v17zm13 0h-5V5.077L13 1l2.5 4.077V17.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","dirty":"<path clip-rule=\\"evenodd\\" d=\\"M15 3H2v12.863L15 3z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","display":"<path d=\\"M.5 4.5h17M.5.5v17h11.77a5.231 5.231 0 005.23-5.23V.5H.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","distribute-horiz":"<path d=\\"M12 8.5h6m-18 0h5.5M2.5 4v9m13-9v9m-10 4.5h7V.5h-7v17z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","distribute-vertically":"<path d=\\"M9.5 0v3.5m0 3h-9v5h9m0-5h8v5h-8m0-5v-3m0 8v3m0 3.5v-3.5m0 0H16m-6.5 0H3m6.5-11H16m-6.5 0H3\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","distribution":"<path clip-rule=\\"evenodd\\" d=\\"M3.5 17.5a3 3 0 110-6 3 3 0 010 6zM14.5 17.5a3 3 0 110-6 3 3 0 010 6zM9 6.5a3 3 0 110-6 3 3 0 010 6z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","doc-check":"<path d=\\"M4.5 9.5L7 13l5.5-7.5m-11-5h14v12a5 5 0 01-5 5h-9V.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","document":"<path d=\\"M5 8.5h6m-6-3h9M2.5.5h14v11.77c0 2.888-2.28 5.23-5.09 5.23H2.5V.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","document2":"<path d=\\"M4 8.5h6m-6-3h9M1.5.5h14v11.77c0 2.888-2.28 5.23-5.09 5.23H1.5V.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","double-chevron":"<path d=\\"M1 .5L10 9l-9 8.5m7-17L17 9l-9 8.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","down-arrow":"<path d=\\"M9 16.87V.5M1.5 9.944L9 17.5l7.5-7.556\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","download":"<path d=\\"M9.5 0v14.5m-5-4.5l5 5 5-5m3 1v1.463c0 2.782-2.191 5.037-5 5.037H.5V11\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","drag":"<path clip-rule=\\"evenodd\\" d=\\"M8 18h2v-2H8v2zM8 13h2v-2H8v2zM8 7h2V5H8v2zM8 2h2V0H8v2z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","drilldown":"<path d=\\"M16.37 8.5H0M9.444 16L17 8.5 9.444 1\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","dropdown":"<path clip-rule=\\"evenodd\\" d=\\"M4 6l5 6 5-6H4z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","duplicate":"<path d=\\"M4.256 13.5H.5V.5h13v3.756M11 8v6m3-3H8m9.5 1.3V4.5h-13v13h7.8a5.2 5.2 0 005.2-5.2z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","edit":"<path d=\\"M10.893 2.979l3.894 3.894M8 17.5h9m-16.5 0v-4.055L12.945 1 17 5.055 4.555 17.5H.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","employee-directory":"<path d=\\"M9.75 11.2a5.116 5.116 0 00-2.583-.7H5.832C2.888 10.5.5 13.007.5 16.1v1.4h12v-1.4m5 1.4l-2.18-2.18M10.5 4.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zm5.5 8.5a3.25 3.25 0 11-6.499.001A3.25 3.25 0 0116 12.75z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","empty-circle":"<path clip-rule=\\"evenodd\\" d=\\"M17.5 9A8.5 8.5 0 019 17.5 8.5 8.5 0 01.5 9 8.5 8.5 0 019 .5 8.5 8.5 0 0117.5 9z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","enterprise-planning":"<path d=\\"M6 1.5H2.5v16h7c2.898 0 5-2.342 5-5.23V1.5H11m.5 2l-1-3h-4l-1 3h6z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","error-alert":"<path clip-rule=\\"evenodd\\" d=\\"M0 9a9 9 0 019-9 9 9 0 019 9 9 9 0 01-9 9 9 9 0 01-9-9z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path><path d=\\"M9 5v5.5M9 12v1\\" stroke=\\"#fff\\" vector-effect=\\"non-scaling-stroke\\"></path>","error-solid":"<path clip-rule=\\"evenodd\\" d=\\"M0 9a9 9 0 019-9 9 9 0 019 9 9 9 0 01-9 9 9 9 0 01-9-9zm8.5 1.31V5.08h1v5.23h-1zm0 2.62v-1.31h1v1.31h-1z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","error":"<path d=\\"M9 1.5a8 8 0 018 8h1a9 9 0 00-9-9v1zm8 8a8 8 0 01-8 8v1a9 9 0 009-9h-1zm-8 8a8 8 0 01-8-8H0a9 9 0 009 9v-1zm-8-8a8 8 0 018-8v-1a9 9 0 00-9 9h1zm7.5-4.423V10h1V5.077h-1zm0 6.538V13h1v-1.385h-1z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","exclamation":"<path d=\\"M8.5 14V0m0 16.5V18\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","exit-fullview":"<path d=\\"M18 4.5h-4.5V0M0 4.5h4.5V0M0 13.5h4.5V18M18 13.5h-4.5V18\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","expand-all":"<path d=\\"M15 7L9 1 3 7m12 4l-6 6-6-6\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","expand-app-tray":"<path d=\\"M8.5 17.5L17 9 8.5.5m-8 17L9 9 .5.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","expense-report":"<path d=\\"M12.5 3.5v-3H6.357A4.864 4.864 0 001.5 5.37V15l3-1.5m1.5-3h5m-5-3h7m-8.5.035V17l2.75-1.55L10 17l2.75-1.55L15.5 17V3.5H8.143C6.13 3.5 4.5 5.308 4.5 7.535z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","expired-schedule":"<path d=\\"M9 .5A8.5 8.5 0 0117.5 9 8.5 8.5 0 019 17.5 8.5 8.5 0 01.5 9m8-5v7l4-1.5M.5.5l5 5m0-5l-5 5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","export-2":"<path d=\\"M15 8.5H1.5m5 5L1 8.5l5.5-5m3.5 14h2.27a5.231 5.231 0 005.23-5.23V.5H10\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","export-spreadsheet":"<path d=\\"M9.5.5h7v11.77c0 2.888-2.28 5.23-5.09 5.23H2.5V9m8.5.5h4m-4-3h4m-4-3h4m-4 9h4m-11-3h4m-4 3h4M8.5 4l-3-3m0 0l-3 3m3-3v7\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","export-to-pdf":"<path d=\\"M1.5 16.019v-7.5h2.568c.712 0 1.29.582 1.29 1.3v1.289c0 .718-.578 1.3-1.29 1.3H1.5m15.5.111h-3.5m4.5-4h-4.5v7.5M0 17.519h18m-11-17h5.214c2.84 0 5.143 2.322 5.143 5.185v.315M1.5 3.519l2.5-2.5m0 0l2.5 2.5M4 1.019v5m7.357 3.796v4.408a1.29 1.29 0 01-1.286 1.296H7.5v-7h2.571c.711 0 1.286.58 1.286 1.296z\\" stroke=\\"currentColor\\" stroke-width=\\"1.038\\" vector-effect=\\"non-scaling-stroke\\"></path>","export-xml":"<path d=\\"M7.071.519h5.143c2.84 0 5.143 2.322 5.143 5.185v.315M0 17.519h18m-3.5-9.5v7.5H18m-16.5-7l4 7m-4 0l4-7m2-.5v8m5-7.5l-2.429 2.093L7.5 8.519m-6-5l2.5-2.5m0 0l2.5 2.5M4 1.019v5m8.5 10v-8\\" stroke=\\"currentColor\\" stroke-width=\\"1.038\\" vector-effect=\\"non-scaling-stroke\\"></path>","export-xsd":"<path d=\\"M7.51.547h5.462a5.462 5.462 0 015.461 5.461v.332M0 18.453h18.96M1.58 8.973l5.267 7.374m-5.267 0l5.267-7.374m5.266 1.475c0-.815-.706-1.475-1.58-1.475-.873 0-1.58.66-1.58 1.475v.737c0 .816.707 1.475 1.58 1.475.874 0 1.58.66 1.58 1.475v.737c0 .816-.706 1.475-1.58 1.475-.873 0-1.58-.66-1.58-1.475M1.58 3.707l2.633-2.634m0 0l2.634 2.634M4.213 1.073V6.34m14.22 3.999v4.642c0 .755-.61 1.366-1.365 1.366H14.22V8.973h2.848c.755 0 1.365.61 1.365 1.366z\\" stroke=\\"currentColor\\" stroke-width=\\"1.038\\" vector-effect=\\"non-scaling-stroke\\"></path>","export":"<path d=\\"M8.5 2v12m-4-8.5l4-4 4 4M5 8.5H.5v9h11.8c2.9 0 5.2-2.3 5.2-5.1V8.5H13\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","filter-between":"<path d=\\"M9.5 0v13.25M1 17.5h1m14 0h1m-12 0h1m6 0h1m-8.5-9l5 5 5-5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","filter-calendar":"<path d=\\"M1 7.5h16M3.5 0v3m11-3v3m-14 .5h17v8.727c0 2.912-2.342 5.273-5.23 5.273H.5v-14z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","filter-contains":"<path d=\\"M13 .5h4.5v17H13m-8 0H.5V.5H5m-1.5 13L9 3.5l5.5 10M6 9.5h6\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","filter-does-not-contain":"<path d=\\"M13 .5h4.5v17H13m-8 0H.5V.5H5m-2 8h12\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","filter-does-not-end-with":"<path d=\\"M13 .5h4.5v17H13m-10-9h12\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","filter-does-not-equal":"<path d=\\"M0 4.5h18m-18 9h18m-17.5 4l17-17\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","filter-does-not-start-with":"<path d=\\"M5 .5H.5v17H5m10-9H3\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","filter-end-with":"<path d=\\"M13 .5h4.5v17H13m-9.5-4L9 3.5l5.5 10M6 9.5h6\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","filter-equals":"<path d=\\"M0 4.5h18m-18 9h18\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","filter-greater-equals":"<path d=\\"M1.5.5l15 6-15 6m-1.5 5h18\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","filter-greater-than":"<g clip-path=\\"url(#filter-greater-than-clip0)\\"><path d=\\"M.5 2.5l17 6.75L.5 16\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path></g>","filter-in-range":"<path d=\\"M2.154 8.5h13.692M5.5 12.5l-4-4 4-4m7 8l4-4-4-4\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","filter-is-empty":"<path d=\\"M1.917 14.194L16.083 3.806M17.5 9A8.5 8.5 0 019 17.5 8.5 8.5 0 01.5 9 8.5 8.5 0 019 .5 8.5 8.5 0 0117.5 9z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","filter-is-not-empty":"<path clip-rule=\\"evenodd\\" d=\\"M17.5 9A8.5 8.5 0 019 17.5 8.5 8.5 0 01.5 9 8.5 8.5 0 019 .5 8.5 8.5 0 0117.5 9z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path><path clip-rule=\\"evenodd\\" d=\\"M12.27 9a3.269 3.269 0 11-6.538 0 3.269 3.269 0 016.537 0z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","filter-less-equals":"<path d=\\"M16.5.5l-15 6 15 6m1.5 5H0\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","filter-less-than":"<g clip-path=\\"url(#filter-less-than-clip0)\\"><path d=\\"M17.5 2.5L.5 9.25l17 6.75\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path></g>","filter-not-selected":"<path clip-rule=\\"evenodd\\" d=\\"M17.5 9A8.5 8.5 0 019 17.5 8.5 8.5 0 01.5 9 8.5 8.5 0 019 .5 8.5 8.5 0 0117.5 9z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","filter-selected-notselected":"<path clip-rule=\\"evenodd\\" d=\\"M9 1a8 8 0 100 16A8 8 0 009 1zM0 9a9 9 0 1118 0A9 9 0 010 9z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path><path clip-rule=\\"evenodd\\" d=\\"M9 0a9 9 0 110 18V0z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","filter-selected":"<path d=\\"M7.038 12.923l-.39.312.366.458.394-.434-.37-.336zM17 9a8 8 0 01-8 8v1a9 9 0 009-9h-1zm-8 8a8 8 0 01-8-8H0a9 9 0 009 9v-1zM1 9a8 8 0 018-8V0a9 9 0 00-9 9h1zm8-8a8 8 0 018 8h1a9 9 0 00-9-9v1zM4.033 9.966l2.615 3.27.78-.625-2.614-3.27-.781.625zm3.375 3.293l6.539-7.192-.74-.673-6.539 7.193.74.672z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","filter-start-with":"<path d=\\"M5 .5H.5v17H5m9.5-4L9 3.5l-5.5 10m8.5-4H6\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","filter":"<path d=\\"M0 3.5h18m-12 12h6m-9-6h12\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","finance":"<path d=\\"M4.5 11.925c0 1.975 1.79 3.575 4 3.575s4-1.6 4-3.575c0-2.925-4-3.574-4-3.574s-3.273-.65-3.273-2.926C5.227 3.811 6.692 2.5 8.5 2.5s3.385 1.339 3.385 2.955v.59M8.5 0v18\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","first-page":"<path d=\\"M15.5 17.5L7 9 15.5.5M1.5 0v18\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","flag":"<path d=\\"M.5 0v18m16-7.5h-14V.5h14l-5 5 5 5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","folder":"<path d=\\"M.5 4.5h11.214M.5 16.5h11.77c2.888 0 5.23-2.442 5.23-5.454V4.5h-5.885l-5.884-3H.5v15z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","fore-color":"<path clip-rule=\\"evenodd\\" d=\\"M7.63 6.13L7 8h4l-.63-1.87a65.634 65.634 0 01-.69-2.046C9.464 3.405 9.247 2.71 9.03 2h-.08c-.204.71-.414 1.405-.63 2.084-.217.68-.447 1.361-.69 2.047zM4 13L8.126 1h1.748L14 13h-1.654l-1.153-3.659H6.751L5.58 13H4zM15 15v2H3v-2h12z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","formula-constituents":"<path clip-rule=\\"evenodd\\" d=\\"M12 2v7l4.77 6.705c.624.999-.094 2.295-1.272 2.295H2.503c-1.18 0-1.899-1.298-1.27-2.297L6 9V2c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zM9.5 2h-1a.5.5 0 00-.5.5v6a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-6a.5.5 0 00-.5-.5z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","freight-mgmt":"<path d=\\"M9.5 0v2.5M9 2a2 2 0 11-2 2m1 2l-6.5 4.5M10 6l6.5 4.5m-16 7h17v-7H.5v7z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","fullview":"<path d=\\"M13 .5h4.5V5M5 .5H.5V5M5 17.5H.5V13M13 17.5h4.5V13\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","genealogy":"<path d=\\"M6 13.5h6M3.5 0v2c0 1.587.755 3.025 2 4l7.027 6a5.07 5.07 0 011.973 4.015V18m0-18v1.985A5.07 5.07 0 0112.527 6L5.5 12c-1.245.975-2 2.413-2 4v2M6 4.5h6m-6-4h6m-6 17h6\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","generate-key":"<path d=\\"M8.5 10l7 7.5m-7-2.982L11.018 12m-.518 5.502l1.889-1.889.63-.613M18 3.5h-5M15.5 1v5m-5 0a5 5 0 11-10 0 5 5 0 0110 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","get-more-rows":"<path d=\\"M17.5 9V3.5H.5v9H9m2 0h7M14.5 16V9\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","grid":"<path clip-rule=\\"evenodd\\" d=\\"M15 16.5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM7.5 16.5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM0 16.5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM15 9a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM7.5 9a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM0 9a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM18 1.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM7.5 1.5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM0 1.5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","group-selection":"<path d=\\"M9.66 13.354a15.424 15.424 0 01-.006-.439c0-1.886-1.6-3.415-3.573-3.415H4.073C2.1 9.5.5 11.029.5 12.915V14.5h8.028m5.4-2H11.92c-1.973 0-3.42 1.53-3.42 3.415V17.5h9v-1.585c0-1.885-1.6-3.415-3.573-3.415zM8.5 3.5a3 3 0 11-6 0 3 3 0 016 0zm8 4a3 3 0 11-6 0 3 3 0 016 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","group":"<path clip-rule=\\"evenodd\\" d=\\"M.5 13.5h13V.5H.5v13z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path><path clip-rule=\\"evenodd\\" d=\\"M4.5 17.5h13v-13h-13v13z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","h3":"<path clip-rule=\\"evenodd\\" d=\\"M0 17V1h2v6.986L9 8V1h2v16H9v-7H2v7H0zM19 17c-.603 0-1.155-.06-1.655-.181s-.956-.282-1.369-.484a6.043 6.043 0 01-1.107-.689 6.592 6.592 0 01-.869-.821l1-1.305c.46.483.996.91 1.607 1.28.611.371 1.37.556 2.274.556.92 0 1.675-.253 2.262-.76.587-.508.88-1.197.88-2.067 0-.451-.082-.866-.25-1.245a2.393 2.393 0 00-.82-.979c-.382-.274-.882-.483-1.5-.628-.62-.145-1.382-.218-2.286-.218V7.937c.81 0 1.488-.073 2.035-.218.548-.145.992-.346 1.334-.604.341-.258.583-.564.726-.919a3.01 3.01 0 00.214-1.136c0-.757-.234-1.353-.702-1.788-.468-.435-1.107-.653-1.917-.653-.635 0-1.218.145-1.75.435A6.376 6.376 0 0015.62 4.19l-1.048-1.256a8.192 8.192 0 011.94-1.39C17.219 1.18 18.025 1 18.93 1c.666 0 1.277.089 1.833.266a4.335 4.335 0 011.44.761c.405.33.719.737.94 1.22.223.484.334 1.04.334 1.668 0 .935-.254 1.7-.762 2.296-.508.597-1.174 1.056-2 1.378v.097c.46.113.89.278 1.286.495.397.218.746.492 1.048.822.301.33.535.713.702 1.148.167.435.25.918.25 1.45 0 .677-.131 1.29-.393 1.837a4.086 4.086 0 01-1.071 1.39c-.453.378-.98.669-1.584.87A6.128 6.128 0 0119 17z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","h4":"<path clip-rule=\\"evenodd\\" d=\\"M0 17V1h2v7h7V1h2v16H9v-7H2v7H0zM22 11V1h-2.3L13 11.2V13h7v4h2v-4h2v-2h-2zm-2 0h-4.9L20 3v8z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","half-empty-circle":"<path clip-rule=\\"evenodd\\" d=\\"M1 9a8 8 0 018-8v16a8 8 0 01-8-8zm8-9a9 9 0 100 18A9 9 0 009 0z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","hcm-calendar":"<path d=\\"M1 7.5h16M3.5 0v3m11-3v3m-3.496 7L6 15m.004-5L11 15M.5 3.5h17v8.727c0 2.912-2.342 5.273-5.23 5.273H.5v-14z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","headphones":"<path d=\\"M16.5 9.5h1v2h-1v-2zm0 0v2.77c0 2.889-2.239 5.23-5 5.23m0 0h-2v-1h2v1zM2.5 9V7.153C2.5 3.48 5.635.5 9.5.5s7 2.979 7 6.653V9m-15 2.5h1v-2h-1v2z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","heart-filled":"<path clip-rule=\\"evenodd\\" d=\\"M10.093 2.427L9 3.575 7.908 2.427C6.099.524 3.165.524 1.355 2.427c-1.807 1.904-1.807 4.991 0 6.894L9 17l7.644-7.679c1.808-1.903 1.808-4.99 0-6.894-1.809-1.903-4.743-1.903-6.551 0z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","heart-outlined":"<path clip-rule=\\"evenodd\\" d=\\"M10.032 3.338L9 4.414 7.968 3.338a4.246 4.246 0 00-6.188 0C.073 5.123.073 8.017 1.78 9.801L9 17l7.219-7.199c1.708-1.784 1.708-4.678 0-6.463a4.245 4.245 0 00-6.187 0z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","help":"<path d=\\"M8.5 15v-3.5A5.5 5.5 0 103 6m5.5 12v-1\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","helper-list-select":"<path clip-rule=\\"evenodd\\" d=\\"M2.5 0h13A2.5 2.5 0 0118 2.5V9a1 1 0 01-2 0V6H2v9.5c0 .275.225.5.5.5h6.54c.536 0 .973.428.98.963l.002.04a.981.981 0 01-.98.997H2.5A2.5 2.5 0 010 15.5v-13A2.5 2.5 0 012.5 0zM8 8H5c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1zm0 4H5c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1zM3 4a1 1 0 110-2 1 1 0 010 2zm14 9l-1.242 1.242 1.949 1.965a1 1 0 010 1.414l-.086.086a1 1 0 01-1.414 0l-1.95-1.965L13 17s-.691-.032-1-1c-.344-1.078-1-4-1-4s0-1 1-1l4 1s1 .03 1 1z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","hide-item":"<path d=\\"M17.4.4l-17 17m16.4-8.5s-3 5.5-7.9 5.5-8-5.5-8-5.5 3-5.5 7.9-5.5 8 5.5 8 5.5zm-4.9 0c0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-1.7 1.4-3.1 3.1-3.1 1.7 0 3.1 1.4 3.1 3.1z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","history":"<path d=\\"M8.515 5.36v6.242l3.482-1.384M2.508 0v4.5m0 0h3.5m-3.5 0C4.063 2.584 6.279 1.136 9 1.136c4.695 0 8.5 3.663 8.5 8.182 0 4.52-3.805 8.182-8.5 8.182S.5 13.837.5 9.318\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","home":"<path clip-rule=\\"evenodd\\" d=\\"M17.5 7.17L9 .63.5 7.17v10.46h11.77a5.19 5.19 0 005.23-5.23V7.17z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","horiz-center-align":"<path d=\\"M14.5 8.5H18m-18 0h7.5M3.5 4v9m4 4.5h7V.5h-7v17z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","html":"<path clip-rule=\\"evenodd\\" d=\\"M0 1h2v7h8V1h2v16h-2v-7H2v7H0V1zM19 3h-5V1h12v2h-5v14h-2V3zM28 1h2.39l4.11 12 4.11-12H41v16h-2V8 4.5l-4 11h-1l-4-11V17h-2V1zM45 1h2.032v14H54v2h-9V1z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","import-xml":"<path d=\\"M6.071.519h5.143c2.84 0 5.143 2.322 5.143 5.185v.648M0 17.52h18m-12.5-15L3 5.019m0 0l-2.5-2.5m2.5 2.5v-5m10.5 8.093v7.407H17m-16.5-7l4 7m-4 0l4-7m2-.5v8m5-7.5l-2.429 2.093L6.5 8.519m5 7.5v-8\\" stroke=\\"currentColor\\" stroke-width=\\"1.038\\" vector-effect=\\"non-scaling-stroke\\"></path>","import":"<path d=\\"M8.5 13.5V.5m-4 9.5l4 4 4-4M5 7.5H.5v10h11.8c2.9 0 5.2-2.3 5.2-5.1V7.5H13\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","in-progress-alert":"<path clip-rule=\\"evenodd\\" d=\\"M9 18a9 9 0 009-9 9 9 0 00-9-9 9 9 0 00-9 9 9 9 0 009 9z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path><path d=\\"M2.75 9.05A6.25 6.25 0 019 2.8a6.23 6.23 0 015 2.51V3.05h1v4h-4v-1h2.301A5.234 5.234 0 009 3.8a5.25 5.25 0 00-4.598 7.784l-.876.484A6.219 6.219 0 012.75 9.05zM15.25 9.05c0 .775-.141 1.517-.399 2.203l-.936-.351c.216-.576.335-1.2.335-1.852h1zM13.349 13.54a6.244 6.244 0 01-2.529 1.49l-.29-.956a5.241 5.241 0 002.123-1.253l.696.718zM8.016 15.222a6.203 6.203 0 01-2.746-1.157l.598-.802c.666.496 1.45.837 2.303.971l-.155.988z\\" fill=\\"#fff\\" stroke=\\"none\\"></path>","in-progress-linear":"<path d=\\"M16.762 5.562C15.435 2.579 12.46.5 9 .5 4.306.5.5 4.329.5 9.052c0 1.473.37 2.86 1.023 4.07M17 .5v5h-5M3.907 15.899A8.431 8.431 0 007.673 17.5m3.855-.281a8.487 8.487 0 003.42-2.057m2.034-3.164a8.58 8.58 0 00.518-2.946\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","in-progress-solid":"<path clip-rule=\\"evenodd\\" d=\\"M0 9a9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9 9 9 0 00-9 9zm11-2V6h2.304A5.205 5.205 0 009 3.75 5.256 5.256 0 003.75 9c0 .887.225 1.764.652 2.534l-.875.485A6.256 6.256 0 012.75 9 6.257 6.257 0 019 2.75c2.007 0 3.834.937 5 2.505V3h1v4h-4zm-2.984 8.173a6.251 6.251 0 01-2.746-1.157l.598-.803a5.235 5.235 0 002.303.972l-.155.988zm2.804-.193a6.282 6.282 0 002.528-1.49l-.695-.72a5.266 5.266 0 01-2.124 1.253l.291.957zm3.095-4.128A5.234 5.234 0 0014.25 9h1c0 .758-.135 1.499-.399 2.203l-.936-.351z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","in-progress":"<path d=\\"M16.762 5.562C15.435 2.579 12.46.5 9 .5 4.306.5.5 4.329.5 9.052c0 1.473.37 2.86 1.023 4.07M17 .5v5h-5M3.907 15.899A8.431 8.431 0 007.673 17.5m3.855-.281a8.487 8.487 0 003.42-2.057m2.034-3.164a8.58 8.58 0 00.518-2.946\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","increase-row-line-height":"<path d=\\"M18 8.5H8m10 6H8m10-12h-7M4.5 1v17m0-17L8 5M4.5 1L1 5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","info-alert":"<path clip-rule=\\"evenodd\\" d=\\"M0 9a9 9 0 019-9 9 9 0 019 9 9 9 0 01-9 9 9 9 0 01-9-9z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path><path d=\\"M9 5v1m0 2v5\\" stroke=\\"#fff\\" vector-effect=\\"non-scaling-stroke\\"></path>","info-field-alert":"<path clip-rule=\\"evenodd\\" d=\\"M0 9a9 9 0 019-9 9 9 0 019 9 9 9 0 01-9 9 9 9 0 01-9-9z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path><path d=\\"M8 4.5h2v2H8v-2zM8 7.5h2v6H8v-6z\\" fill=\\"#fff\\" stroke=\\"none\\"></path>","info-field-linear":"<path clip-rule=\\"evenodd\\" d=\\"M9.5 17.5a8 8 0 01-8-8 8 8 0 018-8 8 8 0 018 8 8 8 0 01-8 8zm-9-8a9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9 9 9 0 00-9 9zM9 8.423v5h1v-5H9zM9 5.5v1h1v-1H9z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","info-field-solid":"<path clip-rule=\\"evenodd\\" d=\\"M9 18a9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9 9 9 0 01-9 9zM8.5 6h1V5h-1v1zm0 6.92h1v-5h-1v5z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","info-field":"<path clip-rule=\\"evenodd\\" d=\\"M9.5 17.5a8 8 0 01-8-8 8 8 0 018-8 8 8 0 018 8 8 8 0 01-8 8zm-9-8a9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9 9 9 0 00-9 9zM9 8.423v5h1v-5H9zM9 5.5v1h1v-1H9z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","info-linear":"<path clip-rule=\\"evenodd\\" d=\\"M9.5 17.5a8 8 0 01-8-8 8 8 0 018-8 8 8 0 018 8 8 8 0 01-8 8zm-9-8a9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9 9 9 0 00-9 9zM9 8.423v5h1v-5H9zM9 5.5v1h1v-1H9z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","info-solid":"<path clip-rule=\\"evenodd\\" d=\\"M0 9a9 9 0 009 9 9 9 0 009-9 9 9 0 00-9-9 9 9 0 00-9 9zm8.5-4v1h1V5h-1zm0 3v5h1V8h-1z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","info":"<path d=\\"M9 18a9 9 0 009-9h-1a8 8 0 01-8 8v1zm9-9a9 9 0 00-9-9v1a8 8 0 018 8h1zM9 0a9 9 0 00-9 9h1a8 8 0 018-8V0zM0 9a9 9 0 009 9v-1a8 8 0 01-8-8H0zm9.5 3.923v-5h-1v5h1zM9.5 6V5h-1v1h1z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","insert-grid-row":"<path d=\\"M17.5 8V2.5H.5v9H9m2 0h7M14.5 15V8\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","insert-image":"<path d=\\"M.5 14.379l3.923-3.864 3.923 2.576L17.5 7.939m0-6.439H.5v14h11.77c2.92 0 5.23-2.248 5.23-5.09V1.5zM6.893 5.965a1.889 1.889 0 11-3.777 0 1.889 1.889 0 013.777 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","inventory":"<path d=\\"M6 1.5H2.5v16h7c2.898 0 5-2.342 5-5.23V1.5H11m.5 2l-1.13-3H6.435l-.935 3h6z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","invoice-released":"<path d=\\"M0 8.5h14m0 0L8.5 14M14 8.5L8.5 3M10 17.5h2.41c2.81 0 5.09-2.342 5.09-5.23V.5H10\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","invoicing":"<path d=\\"M3.055 8.5h6.132m-6.132-3h9.198m-.256 8.5c0 .512.2.979.526 1.333.378.41.927.667 1.538.667h1.375c1.14 0 2.064-.896 2.064-2s-.924-2-2.064-2h-1.375c-1.14 0-2.064-.896-2.064-2s.925-2 2.064-2h1.375c1.14 0 2.064.896 2.064 2m-3-4v12m-4.291-.5H.5V.5h14V5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","italic":"<path clip-rule=\\"evenodd\\" d=\\"M6 17L8.23 5H10L7.747 17H6zM9.916 3a.982.982 0 01-.645-.223C9.091 2.627 9 2.41 9 2.127c0-.324.109-.593.327-.807.218-.213.47-.32.757-.32.25 0 .464.078.645.233.18.155.271.375.271.66 0 .324-.109.59-.327.796-.218.207-.47.311-.757.311z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","item-purchase-data":"<path clip-rule=\\"evenodd\\" d=\\"M13 10c-2.408 0-5-.805-5-2.571V3c0-1.71 2.149-3 5-3s5 1.29 5 3v4.429C18 9.195 15.408 10 13 10zm-3-7c0 .249 1.064 1 3 1s3-.751 3-1-1.064-1-3-1-3 .751-3 1zm0 4V5.421c.826.362 1.851.579 3 .579s2.174-.217 3-.579v1.894C15.743 7.57 14.67 8 13 8c-1.681 0-2.759-.437-3.007-.69L10 7zM6 6v1.429c0 .196.018.385.047.571H0a2 2 0 012-2h4zM3.5 16a1.5 1.5 0 11.001-3.001A1.5 1.5 0 013.5 16zm3.544-6c1.179 1.251 3.286 2 5.956 2 2.056 0 3.777-.445 5-1.219V16a2 2 0 01-2 2H2a2 2 0 01-2-2v-6h7.044z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","key":"<path d=\\"M9.5 9l8 8.5m-7.846-2.615l2.615-2.616m0 5.231l1.962-1.961.653-.637M10.89 5.694a5.195 5.195 0 11-10.39 0 5.195 5.195 0 0110.39 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","knowledge-base":"<path d=\\"M6.5 15.5c0-1.59-.548-3.133-1.573-4.348-.892-1.054-1.323-2.51-.971-4.067.38-1.692 1.748-3.07 3.439-3.458a4.674 4.674 0 015.772 4.54 4.606 4.606 0 01-1.06 2.945c-1.023 1.24-1.607 2.781-1.607 4.388m-4 0h4m-4 0v2h4v-2M8.5 1V0m8 9V8M.5 9V8m1-4V3m14 1V3\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","language":"<path d=\\"M8.75 7a.75.75 0 110-1.5.75.75 0 010 1.5zM12 6.25a.75.75 0 101.5 0 .75.75 0 00-1.5 0zM4.75 7a.75.75 0 110-1.5.75.75 0 010 1.5z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path><path clip-rule=\\"evenodd\\" d=\\"M0 1v5.167C0 9.379 2.557 12 5.73 12h7.024L18 16.012V1H0zm1 5.167V2h16v11.988L13.092 11H5.731C3.127 11 1 8.845 1 6.167z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","lasso":"<path d=\\"M3.77 12.281C1.78 11.076.5 9.197.5 7.088.5 3.45 4.305.5 9 .5s8.5 2.949 8.5 6.588c0 3.639-3.805 6.589-8.5 6.589-.913 0-1.792-.112-2.615-.319m-1.399.79a1.177 1.177 0 100-2.354 1.177 1.177 0 100 2.353zm0 0a1.177 1.177 0 110 2.352\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","last-page":"<path d=\\"M1.5.5L10 9l-8.5 8.5m14 .5V0\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","launch":"<path d=\\"M.5 2.462v9.807A5.231 5.231 0 005.73 17.5h9.809M7.692.5H17.5m0 0v9.808M17.5.5l-11 11\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","ledger":"<path d=\\"M11 9.5h4m-4-3h4m-11 0h4m3-3h4m-11 0h4m3 9h4m-11-3h4m-4 3h4m8.5-12v11.77c0 2.888-2.28 5.23-5.09 5.23H2.5V.5h14z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","left-align":"<path d=\\"M.5 18V0M11 3.5H3m.5 12h14v-7h-14v7z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","left-arrow":"<path d=\\"M1.34 8.5h16.37M8.265 1L.71 8.5 8.265 16\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","left-text-align":"<path d=\\"M0 9.5h12m-12 6h18M0 3.5h18\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","line-bar-chart":"<path d=\\"M.5 0v12.463A5.037 5.037 0 005.537 17.5m0 0H18m-12.463 0V13m4.963-3v7.5m5-10.5v10.5m-15-6.296l6.296-6.297 2.519 2.519L15.61 1.13\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","line-chart":"<path d=\\"M.5 0v12.463A5.037 5.037 0 005.537 17.5H18M3.5 12L7 8.5l3 3 6-6\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","link":"<path d=\\"M4 8.5h10m-7-4H4.9C2.746 4.5 1 6.29 1 8.5s1.746 4 3.9 4H7m4-8h2.1c2.154 0 3.9 1.79 3.9 4s-1.746 4-3.9 4H11\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","load":"<path d=\\"M0 16.5h4.5V12M18 1.5h-4.5V6M9 17.5c4.694 0 8.5-3.79 8.5-8.464A8.446 8.446 0 0013.726 2M9 .5C4.306.5.5 4.29.5 8.964A8.446 8.446 0 004.274 16\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","locked":"<path clip-rule=\\"evenodd\\" d=\\"M.5 6.5h16v6a5 5 0 01-5 5H.5v-11zm8 6V15v-2.5zm0 .5a2 2 0 100-4 2 2 0 000 4zm4-8.5a4 4 0 00-8 0v2h8v-2z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","logo-trademark":"<path clip-rule=\\"evenodd\\" d=\\"M0 0h32v32H0V0z\\" fill=\\"#D52027\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path><path clip-rule=\\"evenodd\\" d=\\"M16 9.5c-2.2 0-2.6 1.2-2.6 2.6l-.1 7.6h2v-4.9h1.5v-1.6h-1.5v-1c0-.9.4-1.1 1-1.1.3 0 .5 0 .7.1l.2-1.6c-.4-.1-.8-.1-1.2-.1zM6 13.2h1.9v.6s.3-.8 1.9-.8c2.1 0 2.4 1.3 2.4 3.1v3.6h-2v-3.2c0-.8 0-1.7-1.1-1.7s-1.2.8-1.2 1.7v3.3H6v-6.6zm-3.1 0h2v6.6h-2v-6.6zm17.9-.1c2 0 3.6 1.3 3.6 3.4 0 2.1-1.6 3.4-3.6 3.4s-3.6-1.4-3.6-3.4c-.1-2.1 1.6-3.4 3.6-3.4zm1.6 3.4c0 1-.6 1.7-1.6 1.7s-1.6-.7-1.6-1.7.6-1.7 1.6-1.7 1.6.7 1.6 1.7zM4.9 9.7l-2 1.4v1.1h2V9.7zm22.3 3.5h-2v6.7h2v-2.7c0-1.3.2-2.4 1.7-2.4.3 0 .6 0 .9.1v-1.8c-2.1-.1-2.6.7-2.6.7v-.6z\\" fill=\\"#fff\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path><path clip-rule=\\"evenodd\\" d=\\"M33.7 32v-1.8H33V30h1.6v.2h-.7V32h-.2zM34.9 32v-2h.4l.5 1.4c0 .1.1.2.1.3 0-.1.1-.2.1-.3l.5-1.4h.4v2h-.3v-1.7l-.7 1.7h-.2l-.6-1.7V32h-.2z\\" fill=\\"#B5B5B5\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","logo":"<path clip-rule=\\"evenodd\\" d=\\"M0 0h34v34H0V0z\\" fill=\\"#D52027\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path><path clip-rule=\\"evenodd\\" d=\\"M16.919 9.994c-2.338 0-2.725 1.29-2.725 2.81h-.001v8.203h2.151v-5.25h1.592v-1.72h-1.592v-1.104c0-.918.345-1.133 1.033-1.133.258 0 .459.058.703.144l.101-1.821c-.401-.101-.832-.13-1.262-.13zM6.334 14.038h2.065v.64s.358-.812 2.065-.812c2.18 0 2.581 1.434 2.581 3.299v3.843h-2.151v-3.413c0-.803-.014-1.836-1.119-1.836-1.119 0-1.291.875-1.291 1.778v3.47h-2.15v-6.97zm-3.299 0h2.151v6.97H3.035v-6.97zm19.054-.172c2.15 0 3.872 1.434 3.872 3.657 0 2.222-1.722 3.657-3.872 3.657-2.151 0-3.872-1.435-3.872-3.657 0-2.223 1.721-3.657 3.872-3.657zm1.721 3.657c0 1.046-.646 1.764-1.721 1.764-1.076 0-1.721-.718-1.721-1.764 0-1.047.645-1.764 1.721-1.764 1.075 0 1.721.717 1.721 1.764zM5.186 10.267l-2.151 1.474v1.15h2.151v-2.624zm23.768 3.771h-2.15v6.97h2.15v-2.835c0-1.39.201-2.567 1.836-2.567.315 0 .616.057.918.143v-1.888c-2.192-.094-2.754.786-2.754.786v-.609z\\" fill=\\"#fff\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","logout":"<path d=\\"M15 8.5H1.5m5 5L1 8.5l5.5-5m3.5 14h2.27a5.231 5.231 0 005.23-5.23V.5H10\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","magic-wand":"<path d=\\"M4.5 1v7M8 4.5H1M7.038 7L17.5 17.5M.5.5L2 2M.5 8.5L2 7M8.5.5L7.038 2\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","mail":"<path d=\\"M.5 2.5v13h11.77c2.888 0 5.23-2.328 5.23-5.2V2.5m-17 0h17m-17 0L9 9.542 17.5 2.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","make-same-height":"<path d=\\"M4.503 0L.506 3.767l.733.691 2.745-2.587V16.13L1.24 13.542l-.733.691L4.503 18 8.5 14.233l-.733-.691-2.745 2.587V1.87l2.745 2.587.733-.691L4.503 0z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path><path clip-rule=\\"evenodd\\" d=\\"M10 1v16h8V1h-8zm1 15V2h6v14h-6z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","make-same-size":"<path d=\\"M0 0v4h1V1.707L5.293 6H3v1h4V3H6v2.293L1.707 1H4V0H0zM14 0v1h2.293L12 5.293V3h-1v4h4V6h-2.293L17 1.707V4h1V0h-4zM3 11h4v4H6v-2.293L1.707 17H4v1H0v-4h1v2.293L5.293 12H3v-1zM11 11v4h1v-2.293L16.293 17H14v1h4v-4h-1v2.293L12.707 12H15v-1h-4z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","make-same-width":"<path clip-rule=\\"evenodd\\" d=\\"M1 0v8h16V0H1zm1 7V1h14v6H2z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path><path d=\\"M4.458 16.576l-2.587-2.592H16.13l-2.587 2.592.691.693L18 13.494l-3.767-3.775-.691.693 2.587 2.592H1.87l2.587-2.592-.691-.693L0 13.494l3.767 3.775.691-.693z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","manufacturing":"<path clip-rule=\\"evenodd\\" d=\\"M10.961 8.5L11 3 4.5 8.5v-8h-4v17h6.538v-3.27a1.962 1.962 0 013.923 0v3.27H17.5V3l-6.539 5.5z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","map-pin":"<path clip-rule=\\"evenodd\\" d=\\"M12 7.5a3 3 0 11-6 0 3 3 0 016 0z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path><path clip-rule=\\"evenodd\\" d=\\"M13.95 12.52L9 17.5l-4.95-4.98c-2.733-2.75-2.733-7.209 0-9.957a6.97 6.97 0 019.9 0c2.733 2.748 2.733 7.207 0 9.957z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","map":"<path d=\\"M12.5 16V2m-7 13V1.5m-5 1l5-1.5 7 1.5 5-1.5v13.5l-5 2-7-2-5 2v-14z\\" stroke=\\"currentColor\\" stroke-width=\\".997\\" vector-effect=\\"non-scaling-stroke\\"></path>","marquee":"<path d=\\"M.5 4.015V.5h3.515m13.459 3.515L17.5.5h-3.515M17.5 13.985V17.5h-3.515M.5 13.985V17.5h3.515M.5 6.01v5.98m16.974-5.98l.026 5.98M6.01.5h5.98m-5.98 17h5.98\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","maximize":"<path d=\\"M12.5.5h5m0 0v5m0-5l-5.885 5.885M5.5 17.5h-5m0 0v-5m0 5l5.885-5.885\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","menu":"<path d=\\"M0 3.5h18m-18 12h18m-18-6h18\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","mingle-share":"<path d=\\"M4 8.5h7m-7-3h10m3.5-3H.5v5c0 2.881 2.111 5 5 5H13l4.5 3.5V2.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","minimize":"<path d=\\"M2 11.5h4.5m0 0V16m0-4.5l-6 6M16 6.5h-4.5m0 0V2m0 4.5l6-6\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","minus":"<path d=\\"M0 8.5h18\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","misc":"<path stroke=\\"currentColor\\" d=\\"M.5.5h17v17H.5z\\" vector-effect=\\"non-scaling-stroke\\"></path>","mobile":"<path d=\\"M8 14.5h3M2.5.5h14v11.77c0 2.888-2.28 5.23-5.09 5.23H2.5V.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","money":"<path d=\\"M5 12.182c0 2.148 1.903 3.889 4.25 3.889s4.25-1.74 4.25-3.89C13.5 9 9.25 8.295 9.25 8.295S5.773 7.586 5.773 5.11c0-1.756 1.556-3.182 3.477-3.182 1.921 0 3.596 1.457 3.596 3.214v.643M9.5 0v18\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","more":"<path d=\\"M1.5 10a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM7.5 8.5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0zM15 8.5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","move":"<path d=\\"M6.32 3.504L9.086.738m0 0l2.783 2.783M9.086.738v16m-5.565-4.87L.738 9.087m0 0L3.52 6.303M.738 9.086h16.001m-4.87 5.565l-2.783 2.783-2.783-2.783m8.349-8.348l2.783 2.783-2.783 2.783\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","new-alert":"<path clip-rule=\\"evenodd\\" d=\\"M9 0a9 9 0 100 18A9 9 0 009 0z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path><path clip-rule=\\"evenodd\\" d=\\"M8.986 12.2l3.214 1.929-.321-3.858L14.77 7.7l-3.857-.643L8.986 3.2 7.057 7.057 3.2 7.7l2.893 2.571-.322 3.858L8.986 12.2z\\" fill=\\"#fff\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","new-case":"<path d=\\"M0 4.5h7M.5 9v7.5h11a6 6 0 006-6v-6H8m0-3h4.5V4m-9-3v7\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","new-document":"<path d=\\"M10 .5h6.5v11.77c0 2.888-2.28 5.23-5.09 5.23H2.5V8M2 3.5h7M5.5 0v7\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","new-expense-report":"<path d=\\"M9 .5h7.5V17l-3.182-2.496L9.5 17l-3.818-2.615L2.5 17V7m2-7v5M2 2.5h5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","new-payment-request":"<path d=\\"M1 12.182c0 2.148 1.87 3.889 4.179 3.889 2.307 0 4.178-1.74 4.178-3.89C9.357 9 5.18 8.295 5.18 8.295s-3.42-.708-3.42-3.184c0-1.756 1.53-3.182 3.42-3.182 1.888 0 3.535 1.457 3.535 3.214v.643M5.5 0v18m9-18v7M11 3.5h7\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","new-schedule":"<path d=\\"M9 .5A8.5 8.5 0 0117.5 9 8.5 8.5 0 019 17.5 8.5 8.5 0 01.5 9m8-5v7l4-1.5M3.5 0v7M0 3.5h7\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","new-solid":"<path clip-rule=\\"evenodd\\" d=\\"M0 9a9 9 0 1118 0A9 9 0 010 9zm9 3.214l3.214 1.929-.321-3.857 2.893-2.572-3.857-.643L9 3.214 7.071 7.071l-3.857.643 2.893 2.572-.321 3.857L9 12.214z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","new-time-sheet":"<path d=\\"M7 .5h7.51V9m-2.677 8.5H.5V8.056m11.963 2.518v3.148h1.889M3.5 0v7M0 3.5h7M17.5 13a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","new-travel-plan":"<path d=\\"M.5 9v7.5h11.461c3.06 0 5.539-2.377 5.539-5.31V4.5H8m4.5 0v-3H8M3.5 1v7M0 4.5h7\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","new":"<path clip-rule=\\"evenodd\\" d=\\"M17.5 9A8.5 8.5 0 019 17.5 8.5 8.5 0 01.5 9 8.5 8.5 0 019 .5 8.5 8.5 0 0117.5 9z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" vector-effect=\\"non-scaling-stroke\\"></path><path clip-rule=\\"evenodd\\" d=\\"M11.778 13.5L9 11.735 6.222 13.5 6.5 9.97 4 7.619l3.333-.589L9 3.5l1.667 3.53L14 7.617 11.5 9.97l.278 3.529z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" vector-effect=\\"non-scaling-stroke\\"></path>","next-page":"<path clip-rule=\\"evenodd\\" d=\\"M4.5 16.5L13 9 4.5 1.5v15z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","no-attachment":"<path d=\\"M17.5.5l-17 17m7-5.5V7.5s-.31-2 1.5-2c1.78 0 1.5 2.088 1.5 2.088v5.72S10.72 17.5 7 17.5s-3.484-4.192-3.484-4.192V5.923S3.074.5 8.5.5c5.425 0 5 5.423 5 5.423V11\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","no-comment":"<path d=\\"M17.5.5l-17 17m17-15H.5v4.667c0 2.945 2.342 5.333 5.23 5.333h7.193L17.5 16V2.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","no-filter":"<path d=\\"M0 3.5h18m-12 12h6m-9-6h12m2.5-9l-17 17\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","notes":"<path d=\\"M3.5 0v3m10-3v3M4 9.5h6m-6-3h9m-11.5-4h14v9.546c0 3.012-2.28 5.454-5.09 5.454H1.5v-15z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","notification":"<path d=\\"M16.5 13.5v-2.708C16.5 6.764 13.141 3.5 9 3.5m0 0c-4.141 0-7.5 3.264-7.5 7.292V13.5M9 3.5V0M0 13.5h18M5.5 14a3.5 3.5 0 107 0\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","number-list":"<path d=\\"M6.133 9.5h12m-12 6h12m-12-12h12m-18-1h2.5V8m-2.5 2.5h1.748c.855 0 1.366 1.062.89 1.852L.884 15.5h3.25\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","open-folder":"<g clip-path=\\"url(#open-folder-clip0)\\"><path d=\\"M14.5 6.077V3.5H9l-3.27-2H.5v14m0 0h6.538M.5 15.5l3-9h14l-1.531 5.591c-.642 2.245-2.694 3.409-5.03 3.409H.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path></g>","orderedlist":"<path d=\\"M6 9.5h12m-12 6h12M6 3.5h12m-18-1h2.5V8M0 10.5h1.748c.855 0 1.366 1.062.89 1.852L1 15.5h3\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","overlay-line":"<path d=\\"M.5 0v12.463A5.037 5.037 0 005.537 17.5H18M.5 9.944l5.037-5.037 10.074 10.075m-13.852 0l3.778-3.778 2.519 2.518 7.555-7.555\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","parameter":"<path clip-rule=\\"evenodd\\" d=\\"M9 0a1 1 0 100 2 1 1 0 100-2zM1 16a1 1 0 100 2 1 1 0 100-2zM17 16a1 1 0 100 2 1 1 0 100-2z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","paste":"<path d=\\"M4.256 13.5H.5V.5h13v3.756m4 8.044V4.5h-13v13h7.8a5.2 5.2 0 005.2-5.2z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","pause":"<path clip-rule=\\"evenodd\\" d=\\"M.5 17.5h6V.5h-6v17zM11.5 17.5h6V.5h-6v17z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","paused-schedule":"<path d=\\"M9 .5A8.5 8.5 0 0117.5 9 8.5 8.5 0 019 17.5 8.5 8.5 0 01.5 9m8-4v6.5l4-1.5M.5 0v7m4-7v7\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","payment-request":"<path d=\\"M5 12.182c0 2.148 1.903 3.889 4.25 3.889s4.25-1.74 4.25-3.89C13.5 9 9.25 8.295 9.25 8.295S5.773 7.586 5.773 5.11c0-1.756 1.556-3.182 3.477-3.182 1.921 0 3.596 1.457 3.596 3.214v.643M9.5 0v18\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","pdf-file":"<path d=\\"M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6M16 11.5h-3.5m4.5-3h-4.5V15m-2.143-5.3v3.6c0 .664-.575 1.2-1.286 1.2H6.5v-6h2.571c.711 0 1.286.536 1.286 1.2zM.5 15V8.5h2.71c.71 0 1.29.575 1.29 1.284v.516c0 .71-.58 1.2-1.29 1.2H.5V15z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","pending-alert":"<path clip-rule=\\"evenodd\\" d=\\"M9 18a9 9 0 009-9 9 9 0 00-9-9 9 9 0 00-9 9 9 9 0 009 9z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path><path d=\\"M8.5 4.5V11l4-1.5\\" stroke=\\"#fff\\" vector-effect=\\"non-scaling-stroke\\"></path>","pending-solid":"<path clip-rule=\\"evenodd\\" d=\\"M18 9a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9zM8 11.674V4.423h1v5.827l3.253-1.176.34.942L8 11.674z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","pending":"<path d=\\"M8.5 4v7l4-1.5m5-.5A8.5 8.5 0 019 17.5 8.5 8.5 0 01.5 9 8.5 8.5 0 019 .5 8.5 8.5 0 0117.5 9z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","phone-linear":"<path clip-rule=\\"evenodd\\" d=\\"M14.267 10.29a1.455 1.455 0 00-2.061 0l-1.127 1.127c-1.746 1.745-6.39-2.898-4.645-4.644l1.13-1.15a1.45 1.45 0 00-.008-2.044L4.906.93a1.467 1.467 0 00-2.076 0l-.688.686-.433.432c-5.42 5.422 8.82 19.662 14.24 14.24l.432-.43.69-.69a1.468 1.468 0 000-2.075l-2.804-2.803z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","phone":"<path clip-rule=\\"evenodd\\" d=\\"M13.767 10.79a1.455 1.455 0 00-2.061 0l-1.127 1.127c-1.746 1.745-6.39-2.898-4.645-4.644l1.13-1.15a1.45 1.45 0 00-.008-2.044L4.406 1.43a1.467 1.467 0 00-2.076 0l-.688.686-.433.432c-5.42 5.422 8.82 19.662 14.24 14.24l.432-.43.69-.69a1.468 1.468 0 000-2.075l-2.804-2.803z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","pie-chart":"<path d=\\"M9 9.315h-.5v.127l.061.112.439-.24zm8.5-.815H9v1h8.5v-1zm-4.283 7.501L9.439 9.075l-.878.48 3.778 6.925.878-.479zM9.5 9.315V.5h-1v8.815h1zM17 9a8 8 0 01-8 8v1a9 9 0 009-9h-1zm-8 8a8 8 0 01-8-8H0a9 9 0 009 9v-1zM1 9a8 8 0 018-8V0a9 9 0 00-9 9h1zm8-8a8 8 0 018 8h1a9 9 0 00-9-9v1z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","play":"<path clip-rule=\\"evenodd\\" d=\\"M15.5 9l-6 3.75-6 3.75v-15l6 3.75 6 3.75z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","plusminus-folder-closed":"<path d=\\"M8.5 0v17M17 8.5H0\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","plusminus-folder-open":"<path d=\\"M0 8.5h18\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","previous-page":"<path clip-rule=\\"evenodd\\" d=\\"M13.5 16.5L5 9l8.5-7.5v15z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","print-preview":"<path d=\\"M3.5 7.5v-7h14v11.77c0 2.888-2.279 5.23-5.091 5.23H3.5v-3m-.96-.494L.5 16m9-5a4 4 0 11-8 0 4 4 0 018 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","print":"<path d=\\"M3.115 12.5H.5v-7h17v7h-2.615m-4.846 4H3.5V9.485h11v2.135c0 2.94-1.573 4.88-4.461 4.88zM3.5 5.5h11v-4h-11v4z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","process":"<path d=\\"M4.154 9.692l9.692 5.539M4.5 7.5l9.346-4.73M4.5 8.5a2 2 0 11-4.001-.001A2 2 0 014.5 8.5zm13-6a2 2 0 11-4.001-.001A2 2 0 0117.5 2.5zm0 13a2 2 0 11-4.001-.001 2 2 0 014.001.001z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","profile":"<path d=\\"M14.492 14.658l.435-.247-.435.247zm-10.984 0l-.434-.248.434.248zm8.261-8.273c0 1.53-1.24 2.769-2.769 2.769v1a3.769 3.769 0 003.77-3.77h-1zM9 9.154c-1.53 0-2.77-1.24-2.77-2.77h-1A3.769 3.769 0 009 10.155v-1zm-2.77-2.77c0-1.53 1.24-2.769 2.77-2.769v-1a3.769 3.769 0 00-3.77 3.77h1zM9 3.616c1.53 0 2.77 1.24 2.77 2.77h1A3.769 3.769 0 009 2.615v1zm6.36 11.766a5.387 5.387 0 00-.433-.97l-.869.495c.142.249.26.514.352.79l.95-.315zm-.434-.97c-.9-1.577-2.582-2.642-4.514-2.642v1c1.553 0 2.913.855 3.646 2.138l.868-.497zm-4.514-2.642H7.588v1h2.824v-1zm-2.824 0c-1.932 0-3.613 1.065-4.514 2.641l.868.497c.733-1.283 2.093-2.138 3.646-2.138v-1zm-4.515 2.642a5.38 5.38 0 00-.432.97l.949.315c.092-.276.21-.541.352-.79l-.869-.495zM17 9a8 8 0 01-8 8v1a9 9 0 009-9h-1zm-8 8a8 8 0 01-8-8H0a9 9 0 009 9v-1zM1 9a8 8 0 018-8V0a9 9 0 00-9 9h1zm8-8a8 8 0 018 8h1a9 9 0 00-9-9v1z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","project":"<path d=\\"M10.5 13.5h-8v-11h13v6c0 2.823-2.188 5-5 5zm0 0l4 4M9 0v2.5m-9 0h18m-11 11l-3.5 4m.5-12h9m-9 3h6\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","purchasing":"<path d=\\"M.5 6.5h17M3 12.5h5m4.27 2H.5v-12h17v6.75c0 2.898-2.342 5.25-5.23 5.25z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","quality":"<path d=\\"M5.5 9.5v8L9 14.885l3.5 2.615v-8M14 6A5 5 0 114 6a5 5 0 0110 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","queries":"<path d=\\"M11 15l-3.5-3.5m3.5-7h7m-6 3h6M9.5 8a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","quick-access":"<path d=\\"M.5 7.061V17.5h12c2.889 0 5-2.428 5-5.3V.5H8.056M8 3.5h9.5M3 1l3 2.5m0 0L3 6m3-2.5H0\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","quick-edit":"<path d=\\"M10.893 2.979l3.894 3.894M8 17.5h9m-5-3h5m-16.5 3v-4.055L12.945 1 17 5.055 4.555 17.5H.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","quick-reference":"<path clip-rule=\\"evenodd\\" d=\\"M15 0H4C2.346 0 1 1.346 1 3v12c0 1.654 1.346 3 3 3h12a1 1 0 001-1V2c0-1.103-.897-2-2-2zM6 4c0-.55.45-1 1-1h5c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1V4zM4 16h11v-2H4a1 1 0 000 2z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","quote":"<path clip-rule=\\"evenodd\\" d=\\"M0 15h7V8H0v7zM11 15h7V8h-7v7zM0 8a6.5 6.5 0 016.5-6.5v1A5.5 5.5 0 001 8H0zM11 8a6.5 6.5 0 016.5-6.5v1A5.5 5.5 0 0012 8h-1z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","record":"<path clip-rule=\\"evenodd\\" d=\\"M9 2a7 7 0 100 14A7 7 0 009 2zM1 9a8 8 0 1116 0A8 8 0 011 9zm8 4.5a4.5 4.5 0 110-9 4.5 4.5 0 010 9z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","recycle":"<path d=\\"M10.692 17.5L8.27 15.071l2.423-2.428m4.286-8.72l-.871 3.26-3.252-.874m-6.37-.32l-3.162 5.503c-.917 1.59.228 3.579 2.061 3.579h1.92m-.819-9.082l-3.252.874m3.252-.874l.87 3.26m8.752-2.06l-3.174-5.496c-.916-1.59-3.207-1.59-4.123 0L5.85 3.36m2.179 11.711l6.337-.007c1.833 0 2.978-1.988 2.062-3.579l-.96-1.666\\" stroke=\\"currentColor\\" stroke-width=\\".982\\" vector-effect=\\"non-scaling-stroke\\"></path>","redo":"<path d=\\"M17 3.5H7.5c-3.84 0-7 3.16-7 7s3.16 7 7 7H17m0-14l-2.5 3m2.5-3l-2.5-3\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","refresh-current":"<path d=\\"M19 16.367h-4.74v-4.74m.234 4.48a8.7 8.7 0 003.316-6.85c0-4.8-3.86-8.69-8.621-8.69-4.762 0-8.622 3.89-8.622 8.69 0 4.8 3.86 8.69 8.622 8.69\\" stroke=\\"currentColor\\" stroke-width=\\"1.077\\" vector-effect=\\"non-scaling-stroke\\"></path>","refresh":"<path d=\\"M18 15.5h-4.5V11m.222 4.254A8.26 8.26 0 0016.87 8.75C16.87 4.193 13.206.5 8.685.5 4.165.5.5 4.193.5 8.75.5 13.306 4.164 17 8.685 17\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","reject":"<path d=\\"M12.443 5.557l-6.904 6.904m6.922-.018L5.558 5.539M.5 17.5h11.77a5.231 5.231 0 005.23-5.23V.5H.5v17z\\" stroke=\\"currentColor\\" stroke-width=\\".997\\" vector-effect=\\"non-scaling-stroke\\"></path>","rejected-outline":"<path d=\\"M17 9a8 8 0 01-8 8v1a9 9 0 009-9h-1zm-8 8a8 8 0 01-8-8H0a9 9 0 009 9v-1zM1 9a8 8 0 018-8V0a9 9 0 00-9 9h1zm8-8a8 8 0 018 8h1a9 9 0 00-9-9v1zm4.277 11.57L5.43 4.722l-.707.707 7.846 7.847.708-.707zm-7.847.707l7.847-7.847-.707-.707-7.847 7.846.707.708z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","rejected-solid":"<path clip-rule=\\"evenodd\\" d=\\"M0 9a9 9 0 019-9 9 9 0 019 9 9 9 0 01-9 9 9 9 0 01-9-9zm5.43-4.277L9 8.293l3.57-3.57.707.708L9.707 9l3.57 3.57-.707.707L9 9.707l-3.57 3.57-.707-.707L8.293 9l-3.57-3.57.707-.707z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","rename":"<path d=\\"M14.808 12.27c0 2.888-2.33 5.23-5.203 5.23H.5V1M11 3l3 3m-9.5 6.5V10l9-9L16 3.5l-9 9H4.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","reply-all":"<path d=\\"M4.5 7.5h6.818c3.414 0 6.182 2.749 6.182 6.139V15m-13-7.5L9 12M4.5 7.5L9 3m-3 9L1.5 7.5 6 3\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","reply":"<path d=\\"M.707 7.5h10.818c3.414 0 6.182 2.749 6.182 6.139V15m-17-7.5l4.5 4.5m-4.5-4.5l4.5-4.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","report":"<path d=\\"M1 8.5h3m-3 6h3m-3-11h3M2.5.5h14v11.77c0 2.888-2.09 5.23-4.667 5.23H2.5V.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","reset":"<path d=\\"M.527 16.326h4.74v-4.74m-.76 4.52a8.7 8.7 0 01-3.317-6.85C1.19 4.458 5.05.568 9.812.568c4.761 0 8.62 3.89 8.62 8.69 0 4.799-3.859 8.69-8.62 8.69\\" stroke=\\"currentColor\\" stroke-width=\\"1.077\\" vector-effect=\\"non-scaling-stroke\\"></path>","restore-user":"<path d=\\"M0 16.367h4.74v-4.74m-.234 4.48a8.7 8.7 0 01-3.316-6.85c0-4.8 3.86-8.69 8.621-8.69 4.762 0 8.622 3.89 8.622 8.69 0 4.8-3.86 8.69-8.622 8.69\\" stroke=\\"currentColor\\" stroke-width=\\"1.077\\" vector-effect=\\"non-scaling-stroke\\"></path>","right-align-text":"<path d=\\"M18 9.5H6m12 6H0m18-12H0\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","right-align":"<path d=\\"M17.5 18V0M7 3.5h8m-.5 12H.5v-7h14v7z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","right-arrow":"<path d=\\"M16.87 8.5H.5M9.944 16L17.5 8.5 9.944 1\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","right-text-align":"<path d=\\"M18 8.5H6m12 6H0m18-12H0\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","rocket":"<path d=\\"M6.5 7L3 14.5h3.5m5-7.5l3.5 7.5h-3.5M8 17.54h2m1-.04h1m-6 .04h1m4.5-2.04h-5V4.676C6.5 3.323 9 1 9 1s2.5 2.323 2.5 3.676V15.5zM9.5 7a.5.5 0 11-1 0 .5.5 0 011 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","roles":"<path clip-rule=\\"evenodd\\" d=\\"M17.5 4.5H.5v12h11.46c3.059 0 5.54-2.512 5.54-5.611V4.5zM5.5 4.5h7v-3h-7v3z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","run-job":"<path d=\\"M12 9.5H0m12 6H3m9-12.045H3M17.5 14V1m0 15v2\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","run-quick-access":"<path d=\\"M.5 8v9.5h12c2.889 0 5-2.442 5-5.33V.5H8m0 3h9.5m-14-2.4L6 3.5m0 0L3.5 6M6 3.5H0\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","save-as":"<path clip-rule=\\"evenodd\\" d=\\"M2 1h6c.55 0 1 .45 1 1s-.45 1-1 1H2.5a.5.5 0 00-.5.5V12c0 .55-.45 1-1 1s-1-.45-1-1V3c0-1.1.9-2 2-2zm7 6h2c.55 0 1-.45 1-1s-.45-1-1-1H9c-.55 0-1 .45-1 1s.45 1 1 1zm5 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1V5H5c-.55 0-1 .45-1 1v9a2 2 0 002 2h9a2 2 0 002-2v-5s0-3-3-3zm.5 4h-8a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h8a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","save-close":"<path clip-rule=\\"evenodd\\" d=\\"M16.707 1.293a.999.999 0 00-1.414 0L13.5 3.086l-1.793-1.793a.999.999 0 10-1.414 1.414L12.086 4.5l-1.793 1.793a.999.999 0 101.414 1.414L13.5 5.914l1.793 1.793a.997.997 0 001.414 0 .999.999 0 000-1.414L14.914 4.5l1.793-1.793a.999.999 0 000-1.414zM7 6H5c-.55 0-1-.45-1-1s.45-1 1-1h2c.55 0 1 .45 1 1s-.45 1-1 1zm4 5a1 1 0 012 0v3a2 2 0 01-2 2H2a2 2 0 01-2-2V5c0-.55.45-1 1-1h1v3a1 1 0 001 1h4a1 1 0 010 2H2v4h9v-3z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","save-new":"<path d=\\"M0 14.5h7M3.5 11v7m11-.5v-7H9M8.5 3v4m-4-4v4m-4 2V.5h12a5 5 0 015 5v12H9\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","save-options":"<path clip-rule=\\"evenodd\\" d=\\"M10.5 3h-5a.5.5 0 01-.5-.5v-2a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v2a.5.5 0 01-.5.5zM14 9.99a.99.99 0 00-.99-.99H9a.99.99 0 00-.99.99v.02c0 .546.444.99.99.99h4.01a.99.99 0 00.99-.99v-.02zm-6.4 3.339l-.618-.127a.161.161 0 01-.123-.112 2.819 2.819 0 00-.195-.468.162.162 0 01.007-.167l.348-.527a.5.5 0 00-.063-.629l-.255-.255a.498.498 0 00-.629-.063l-.527.348a.166.166 0 01-.168.007 2.773 2.773 0 00-.467-.195.164.164 0 01-.113-.124l-.126-.617a.5.5 0 00-.49-.4h-.362a.5.5 0 00-.49.4l-.126.617a.164.164 0 01-.113.124 2.773 2.773 0 00-.467.195.166.166 0 01-.168-.007l-.527-.348a.498.498 0 00-.629.063l-.255.255a.5.5 0 00-.063.629l.348.527c.034.05.035.114.007.167-.079.15-.144.306-.195.468a.161.161 0 01-.123.112l-.618.127a.5.5 0 00-.4.49v.362a.5.5 0 00.4.49l.618.126a.164.164 0 01.123.113c.051.161.116.318.195.467a.163.163 0 01-.007.168l-.348.526a.5.5 0 00.063.63l.255.254a.5.5 0 00.629.064l.527-.349a.166.166 0 01.168-.006c.149.079.305.143.467.195a.163.163 0 01.113.122l.126.618a.5.5 0 00.49.401h.362a.5.5 0 00.49-.401l.126-.618a.163.163 0 01.113-.122c.162-.052.318-.116.467-.195a.166.166 0 01.168.006l.527.349a.5.5 0 00.629-.064l.255-.254a.5.5 0 00.063-.63l-.348-.526a.163.163 0 01-.007-.168c.079-.149.144-.306.195-.467a.164.164 0 01.123-.113l.618-.126a.5.5 0 00.4-.49v-.362a.5.5 0 00-.4-.49zm6.4-.339a.99.99 0 00-.99-.99H11a.99.99 0 00-.99.99v.02c0 .546.444.99.99.99h2.01a.99.99 0 00.99-.99v-.02zM2.667 14a1.333 1.333 0 102.667 0 1.333 1.333 0 00-2.667 0zM0 5V2.5A2.5 2.5 0 012.5 0h.649c-.013.065-.04.132-.068.2C3.041.297 3 .397 3 .5v1.901A2.606 2.606 0 005.599 5H10.5A2.5 2.5 0 0013 2.5v-2c0-.159-.019-.314-.047-.464.394.072.757.26 1.047.55l3.442 3.736c.35.349.558.851.558 1.385V15.5a2.5 2.5 0 01-2.5 2.5H10a1 1 0 010-2h5.5a.5.5 0 00.5-.5V7H2V5c0-.55-.45-1-1-1s-1 .45-1 1zm0 0v3c0 .55.45 1 1 1s1-.45 1-1V7a2 2 0 01-2-2z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","save":"<path d=\\"M3.5 3v3m5-3v3m-5 11.5h11v-7h-11v7zM.5.5v17h17V6.682A6.133 6.133 0 0011.318.5H.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","scale":"<path d=\\"M5.5 13.5a2.5 2.5 0 01-5 0m5 0h-5m5 0L3 5.5l-2.5 8m17-3a2.5 2.5 0 01-5 0h5zm0 0L15 3M2.5 5.4l13-2.9m-3 7.9L14.75 3M8.5 4.297V1\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","schedule":"<path d=\\"M1 7.5h16M3.5 0v3m11-3v3m-14 .5h17v8.727c0 2.912-2.342 5.273-5.23 5.273H.5v-14z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","screen":"<path d=\\"M16 16.5H2m5-5h4m1.27 3H.5v-12h17v6.667c0 2.945-2.342 5.333-5.23 5.333zm-5.77 2h5v-2h-5v2z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","script":"<path d=\\"M5 13L1 8.5 5 4m8 9l4-4.5L13 4M12.5.5L5 17.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","search-folder":"<path d=\\"M17.5 16.5l-3-3m-4.34 0H.5v-12h4.508L8 3.5h6.5v5m1.5 2.75a3.25 3.25 0 11-6.499.001A3.25 3.25 0 0116 11.25z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","search-list":"<path d=\\"M13.5 15.5L8 10m3-5.5h7m-6 3h6M9.5 7a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","search-results-history":"<path d=\\"M8.99 5.257l-.015 6.835 3.676-1.577M1.623 0v4.732m0 0H6.35m-4.726 0l.834-.639A8.949 8.949 0 019.5.688c4.934 0 8.934 3.964 8.934 8.853 0 4.89-4 8.852-8.934 8.852-4.934 0-8.934-3.963-8.934-8.852\\" stroke=\\"currentColor\\" stroke-width=\\"1.077\\" vector-effect=\\"non-scaling-stroke\\"></path>","search":"<path d=\\"M13.065 13.065L17.5 17.5m-2-9.5a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","sec-menu-collapse":"<path d=\\"M0 8.5h18\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","sec-menu-expand":"<path d=\\"M8.5 0v17M17 8.5H0\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","security-off":"<path d=\\"M13.957 10.804c-2.117 3.508-5.412 5.819-5.412 5.819s-3.293-2.311-5.41-5.819C.96 7.202.546 2.5.546 2.5c1.654 0 5.475 0 8-1.877 2.53 1.877 6.347 1.877 8 1.877 0 0-.415 4.702-2.589 8.304z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","security-on":"<path d=\\"M5.546 7.623l2.5 2.5 4.5-4.5m-4 11s3.295-2.311 5.411-5.819c2.174-3.602 2.59-8.304 2.59-8.304-1.654 0-5.47 0-8-1.877C6.02 2.5 2.2 2.5.547 2.5c0 0 .414 4.702 2.588 8.304 2.117 3.508 5.41 5.819 5.41 5.819z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","select-all":"<path d=\\"M.56 4.24L.531.533 4.24.559m14.2 3.682l.027-3.71H14.76M.56 14.76l-.027 3.71H4.24M.53 6.344v6.31M6.345.56h6.312m1.195 13.292l4.589 4.59m-8.94-.5L17.94 9.5 5.808 5.807 9.5 17.941z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","select":"<path d=\\"M11.182 11.182L17 17M5.364 17L17 5.364 1 1l4.364 16z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","send-submit":"<path clip-rule=\\"evenodd\\" d=\\"M9 17.9c-4.963 0-9-3.79-9-8.45C0 4.79 4.037 1 9 1s9 3.79 9 8.45c0 .519-.447.939-1 .939-.553 0-1-.42-1-.94 0-3.622-3.141-6.571-7-6.571-3.86 0-7 2.949-7 6.572s3.14 6.572 7 6.572c.553 0 1 .42 1 .939 0 .519-.447.939-1 .939zm2-5.633s0-.94 1-.94l4 .94s1 .029 1 .939l-1.242 1.166 1.949 1.845c.39.367.39.96 0 1.328l-.086.08a1.046 1.046 0 01-1.414 0l-1.95-1.844L13 16.96s-.692-.03-1-.938c-.344-1.012-1-3.756-1-3.756zm-3.253 1.729l.25.029v.002c.446 0 .853-.281.969-.704.137-.503-.185-1.014-.72-1.145C6.925 11.857 6 10.736 6 9.45c0-1.553 1.346-2.817 3-2.817 1.368 0 2.563.867 2.904 2.107.138.502.685.808 1.218.674.535-.13.856-.643.718-1.144C13.27 6.2 11.279 4.756 9 4.756c-2.757 0-5 2.105-5 4.694 0 2.142 1.54 4.01 3.747 4.546z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","send":"<path d=\\"M17 7.5H6.682C3.268 7.5.5 10.249.5 13.639V15M17 7.5L13 12m4-4.5L13 3\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","server":"<path d=\\"M.5 8.5h17m-17 0v-8h17v8m-17 0v8h17v-8M6 13.5h1m-4 0h1m2-8h1m-4 0h1\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","service":"<path clip-rule=\\"evenodd\\" d=\\"M18.262 15.533L10.95 8.22c.308-.685.49-1.44.49-2.24A5.459 5.459 0 005.98.522c-.8 0-1.554.181-2.239.49l3.604 3.604-2.73 2.729-3.603-3.604a5.437 5.437 0 00-.49 2.24 5.459 5.459 0 005.458 5.458c.8 0 1.555-.182 2.24-.49l7.313 7.313 2.73-2.73z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","settings":"<path clip-rule=\\"evenodd\\" d=\\"M13.325 1.5h-8.5L.575 9l4.25 7.5h8.5l4.25-7.5-4.25-7.5z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path><path clip-rule=\\"evenodd\\" d=\\"M12.325 9c0 1.857-1.455 3.362-3.25 3.362-1.796 0-3.25-1.505-3.25-3.362 0-1.857 1.454-3.362 3.25-3.362 1.795 0 3.25 1.505 3.25 3.362z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","share":"<path d=\\"M4.423 9.654l9.154 5.23M4.423 8.347l9.154-5.23M4.5 9.037a2 2 0 11-4.001 0 2 2 0 014.001 0zm13-6.538a2 2 0 11-4.001-.001A2 2 0 0117.5 2.5zm0 13a2 2 0 11-4.001-.001 2 2 0 014.001.001z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","shared-folder-closed":"<path d=\\"M.5 12.5H0v.5h.5v-.5zm0-12V0H0v.5h.5zm4.577 0l.33-.376L5.264 0h-.188v.5zm3.423 3l-.33.376.142.124H8.5v-.5zm7 0h.5V3h-.5v.5zM4.75 12H.5v1h4.25v-1zM1 12.5V.5H0v12h1zM.5 1h4.577V0H.5v1zM4.747.876l3.423 3 .66-.752-3.424-3-.659.752zM8.5 4h7V3h-7v1zm6.5-.5v2h1v-2h-1zm-7.154 8.115c0 .807-.655 1.462-1.461 1.462v1a2.462 2.462 0 002.461-2.462h-1zm-1.461 1.462a1.462 1.462 0 01-1.462-1.462h-1a2.462 2.462 0 002.462 2.462v-1zm-1.462-1.462c0-.806.655-1.461 1.462-1.461v-1a2.462 2.462 0 00-2.462 2.461h1zm1.462-1.461c.806 0 1.461.655 1.461 1.461h1a2.462 2.462 0 00-2.461-2.461v1zM17 7.692c0 .807-.655 1.462-1.461 1.462v1A2.462 2.462 0 0018 7.692h-1zm-1.461 1.462a1.462 1.462 0 01-1.462-1.462h-1a2.462 2.462 0 002.462 2.462v-1zm-1.462-1.462c0-.806.655-1.461 1.462-1.461v-1a2.462 2.462 0 00-2.462 2.461h1zm1.462-1.461c.806 0 1.461.655 1.461 1.461h1a2.462 2.462 0 00-2.461-2.461v1zM17 15.539c0 .806-.655 1.461-1.461 1.461v1A2.462 2.462 0 0018 15.539h-1zM15.539 17a1.462 1.462 0 01-1.462-1.461h-1A2.462 2.462 0 0015.539 18v-1zm-1.462-1.461c0-.807.655-1.462 1.462-1.462v-1a2.462 2.462 0 00-2.462 2.462h1zm1.462-1.462c.806 0 1.461.655 1.461 1.462h1a2.462 2.462 0 00-2.461-2.462v1zM7.85 10.782l5.885-1.962-.316-.948-5.885 1.961.316.949zm-.316 2.615l5.885 1.962.316-.949L7.85 12.45l-.316.948z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","shared-folder-open":"<path d=\\"M.5 12.5H0v.5h.5v-.5zm0-12V0H0v.5h.5zm4.577 0l.33-.376L5.264 0h-.188v.5zm3.423 3l-.33.376.142.124H8.5v-.5zm8.5 0l.437.243L17.85 3H17v.5zm-13.5 0V3H3.15l-.12.327.469.173zm1 8.5h-4v1h4v-1zm-3.5.5V.5H0v12h1zM.5 1h4.577V0H.5v1zM4.747.876l3.423 3 .66-.752-3.424-3-.659.752zM8.5 4H15V3H8.5v1zM17 3H3.5v1H17V3zm-13.97.327L.032 11.44l.938.347 3-8.115-.938-.346zm4.816 8.288c0 .807-.655 1.462-1.461 1.462v1a2.462 2.462 0 002.461-2.462h-1zm-1.461 1.462a1.462 1.462 0 01-1.462-1.462h-1a2.462 2.462 0 002.462 2.462v-1zm-1.462-1.462c0-.806.655-1.461 1.462-1.461v-1a2.462 2.462 0 00-2.462 2.461h1zm1.462-1.461c.806 0 1.461.655 1.461 1.461h1a2.462 2.462 0 00-2.461-2.461v1zM17 7.692c0 .807-.655 1.462-1.462 1.462v1A2.462 2.462 0 0018 7.692h-1zm-1.462 1.462a1.462 1.462 0 01-1.461-1.462h-1a2.462 2.462 0 002.461 2.462v-1zm-1.461-1.462c0-.806.655-1.461 1.461-1.461v-1a2.462 2.462 0 00-2.461 2.461h1zm1.461-1.461c.807 0 1.462.655 1.462 1.461h1a2.462 2.462 0 00-2.462-2.461v1zM17 15.538c0 .807-.655 1.462-1.462 1.462v1A2.462 2.462 0 0018 15.538h-1zM15.538 17a1.462 1.462 0 01-1.461-1.462h-1A2.462 2.462 0 0015.538 18v-1zm-1.461-1.462c0-.806.655-1.461 1.461-1.461v-1a2.462 2.462 0 00-2.461 2.461h1zm1.461-1.461c.807 0 1.462.655 1.462 1.461h1a2.462 2.462 0 00-2.462-2.461v1zM7.85 10.782l5.885-1.962-.316-.948-5.885 1.961.316.949zm-.316 2.615l5.885 1.962.316-.949-5.885-1.962-.316.95zm8.653-7.404l1.25-2.25-.874-.486-1.25 2.25.874.486z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","show-item":"<path d=\\"M17 9s-3 5.5-7.9 5.5-8-5.5-8-5.5 3-5.5 7.9-5.5S17 9 17 9z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path><path d=\\"M12.1 9c0 1.7-1.4 3.1-3.1 3.1-1.7 0-3-1.4-3-3.1 0-1.7 1.4-3.1 3.1-3.1 1.7 0 3 1.4 3 3.1z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","show-last-x-days":"<path d=\\"M8.553 4.96v6.142l3.882-1.33M1.545 0l-.007 4.5m0 0h4.5m-4.5 0l.8-.717C3.894 1.868 6.317.637 9.038.637c4.695 0 8.5 3.663 8.5 8.182 0 4.518-3.805 8.181-8.5 8.181-4.694 0-8.5-3.663-8.5-8.181\\" stroke=\\"currentColor\\" stroke-width=\\"1.077\\" vector-effect=\\"non-scaling-stroke\\"></path>","sohoxi":"<g clip-path=\\"url(#sohoxi-clip0)\\"><path d=\\"M0 27.1l3.5-5c2.2 2.2 5.5 4.1 9.7 4.1 3.6 0 5.3-1.6 5.3-3.4C18.6 17.5 1 21.2 1 9.7 1 4.6 5.4.4 12.6.4c4.9 0 8.9 1.5 11.9 4.3l-3.6 4.8c-2.5-2.3-5.8-3.3-8.9-3.3-2.8 0-4.4 1.2-4.4 3.1 0 4.9 17.6 1.6 17.6 13 0 5.6-4 9.8-12.2 9.8-5.9-.1-10.2-2.1-13-5zM38.4 8.8c-7.3 0-11.7 5.3-11.7 11.6S31.1 32 38.4 32c7.3 0 11.7-5.3 11.7-11.6S45.7 8.8 38.4 8.8zm0 18c-3.6 0-5.6-3-5.6-6.5 0-3.4 2-6.4 5.6-6.4 3.6 0 5.7 3 5.7 6.4 0 3.5-2.1 6.5-5.7 6.5zM74.3 31.5V18.6H59.9v12.8h-6.5V.9h6.5v12h14.4V.9h6.6v30.6h-6.6zM95.8 8.8c-7.3 0-11.7 5.3-11.7 11.6S88.5 32 95.8 32c7.3 0 11.7-5.3 11.7-11.6S103.1 8.8 95.8 8.8zm0 18c-3.6 0-5.6-3-5.6-6.5 0-3.4 2-6.4 5.6-6.4 3.6 0 5.7 3 5.7 6.4 0 3.5-2.1 6.5-5.7 6.5zM142.3 31.5l-7.7-11.2-7.7 11.2h-7.7l11.1-15.7L119.9.9h7.7l7 10.5L141.5.9h7.8L139 15.7l11.1 15.7-7.8.1zM151 3.4c0-1.9 1.6-3.4 3.5-3.4s3.5 1.5 3.5 3.4-1.6 3.5-3.5 3.5-3.5-1.5-3.5-3.5zM151.6 31.5V9.3h5.8v22.1h-5.8v.1z\\"></path></g>","sort-a-to-z":"<path d=\\"M16.5 11.5l.384.32L16.5 11v.5zm-5 6l-.384-.32.384.82v-.5zm5-11V7h.5v-.5h-.5zm-5-3V3H11v.5h.5zM4.5 17l-.376.33.376.43.376-.43L4.5 17zm6.5-5h5.5v-1H11v1zm5.116-.82l-5 6 .768.64 5-6-.768-.64zM11.5 18H17v-1h-5.5v1zM11 1h4V0h-4v1zm4 0a1 1 0 011 1h1a2 2 0 00-2-2v1zm1 1v1.5h1V2h-1zm0 1.5v3h1v-3h-1zm-4 2v-2h-1v2h1zM11.5 4h5V3h-5v1zm1 3h4V6h-4v1zM11 5.5A1.5 1.5 0 0012.5 7V6a.5.5 0 01-.5-.5h-1zm-6 11V0H4v16.5h1zm2.624-3.83l-3.5 4 .752.66 3.5-4-.752-.66zm-2.748 4l-3.5-4-.752.66 3.5 4 .752-.66z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","sort-down":"<path d=\\"M18 9.5H8m10-6H8m10 12h-7m-6.5 1V0M8 13l-3.5 4L1 13\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","sort-up":"<path d=\\"M18 8.5H8m10 6H8m10-12h-7M4.5 1v17m0-17L8 5M4.5 1L1 5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","sort-z-to-a":"<path d=\\"M4.5 17l-.376.33.376.43.376-.43L4.5 17zM16.5.5l.384.32L16.5 0v.5zm-5 6l-.384-.32.384.82v-.5zm5 11v.5h.5v-.5h-.5zm-5-3V14H11v.5h.5zm-6.5 2V0H4v16.5h1zm2.624-3.83l-3.5 4 .752.66 3.5-4-.752-.66zm-2.748 4l-3.5-4-.752.66 3.5 4 .752-.66zM11 1h5.5V0H11v1zm5.116-.82l-5 6 .768.64 5-6-.768-.64zM11.5 7H17V6h-5.5v1zm-.5 5h4v-1h-4v1zm4 0a1 1 0 011 1h1a2 2 0 00-2-2v1zm1 1v1.5h1V13h-1zm0 1.5v3h1v-3h-1zm-4 2v-2h-1v2h1zm-.5-1.5h5v-1h-5v1zm1 3h4v-1h-4v1zM11 16.5a1.5 1.5 0 001.5 1.5v-1a.5.5 0 01-.5-.5h-1z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","special-item":"<path clip-rule=\\"evenodd\\" d=\\"M9.5 1.168l2.584 5.163 5.78.827-4.182 4.019.987 5.675-5.169-2.68-5.17 2.68.988-5.675-4.183-4.019 5.78-.827L9.5 1.168z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","spreadsheet":"<path d=\\"M3 3.5h4m3 0h4m-4 3h4m-4 3h4m-11-3h4m-4 3h4m-4 3h4m3 0h4M1.5.5h14v11.77c0 2.888-2.28 5.23-5.09 5.23H1.5V.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","stacked":"<path clip-rule=\\"evenodd\\" d=\\"M3.5 7.5h11v-7h-11v7zM.5 17.5h17v-8H.5v8z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","star-filled":"<path clip-rule=\\"evenodd\\" d=\\"M9 1l2.471 5.267L17 7.11l-4 4.1.944 5.789L9 14.267 4.056 17l.945-5.79L1 7.11l5.529-.843L9 1z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","star-half":"<path clip-rule=\\"evenodd\\" d=\\"M9 2L7 7 2 8l3.5 3.5-1 5L9 14V2z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path><path clip-rule=\\"evenodd\\" d=\\"M9 1.323l2.502 5.331 5.536.845-4.005 4.104.952 5.833L9 14.68l-4.985 2.756.951-5.833L.962 7.499l5.536-.845L9 1.323zm0 2.354L7.177 7.562l-4.14.632 2.998 3.072-.702 4.298L9 13.537l3.667 2.027-.702-4.298 2.997-3.072-4.139-.632L9 3.677z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","star-outlined":"<path clip-rule=\\"evenodd\\" d=\\"M9 2l2.162 4.608L16 7.347l-3.5 3.587.826 5.066L9 13.608 4.674 16l.827-5.066L2 7.347l4.838-.739L9 2z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","stethoscope":"<path d=\\"M14.5 12.7v1.2c0 1.988-1.567 3.6-3.5 3.6s-3.5-1.612-3.5-3.6v-2.4m0 0a5 5 0 005-5v-5H10m-2.5 10a5 5 0 01-5-5v-5H5m9.5 11a1 1 0 100-2 1 1 0 100 2z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","stop":"<path clip-rule=\\"evenodd\\" d=\\"M12.83 16.5H1.5v-15h15v11.33a3.67 3.67 0 01-3.67 3.67z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","strike-through":"<path d=\\"M6.252 16.388c.868.408 1.81.612 2.825.612.766 0 1.45-.114 2.053-.341a4.603 4.603 0 001.545-.941c.427-.4.755-.867.983-1.4A4.321 4.321 0 0014 12.6c0-.565-.077-1.063-.232-1.494-.15-.421-.354-.79-.61-1.106H15V9h-3.012a8.669 8.669 0 00-.968-.518l-2.053-.94a11.013 11.013 0 01-.861-.413 4.54 4.54 0 01-.773-.517 2.314 2.314 0 01-.563-.683c-.14-.258-.21-.576-.21-.953 0-.705.247-1.258.74-1.658.493-.4 1.144-.6 1.954-.6.677 0 1.284.13 1.821.388a5.163 5.163 0 011.468 1.07l.993-1.27a6.045 6.045 0 00-1.876-1.377A5.49 5.49 0 009.254 1c-.662 0-1.27.102-1.821.306-.552.204-1.03.49-1.435.859a3.968 3.968 0 00-.95 1.306 3.878 3.878 0 00-.342 1.623c0 .565.089 1.063.265 1.494.177.432.405.804.685 1.118.28.314.596.58.949.8.302.187.598.352.889.494H3v1h6.642l.075.035c.339.173.655.338.95.494.294.157.548.334.761.53.214.196.383.431.508.706.125.274.188.607.188 1 0 .753-.265 1.36-.795 1.823-.53.463-1.273.694-2.23.694-.75 0-1.475-.176-2.174-.53a6.069 6.069 0 01-1.821-1.4L4 14.719a6.972 6.972 0 002.252 1.67z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","submit":"<path d=\\"M8.5 17.846v-13.5m5.5 5l-5.5-5.5-5.5 5.5M17.5 8V5.98c0-2.888-2.111-5.48-5-5.48H.5V8\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","subscribe":"<path d=\\"M7.038 12.923l-.401.298.37.5.409-.47-.378-.328zM17 9a8 8 0 01-8 8v1a9 9 0 009-9h-1zm-8 8a8 8 0 01-8-8H0a9 9 0 009 9v-1zM1 9a8 8 0 018-8V0a9 9 0 00-9 9h1zm8-8a8 8 0 018 8h1a9 9 0 00-9-9v1zM4.098 9.798l2.539 3.423.803-.596-2.538-3.423-.804.596zm3.318 3.453l6.461-7.423-.754-.656-6.462 7.423.755.656z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","success-alert":"<path clip-rule=\\"evenodd\\" d=\\"M0 9a9 9 0 019-9 9 9 0 019 9c0 4.972-4.028 9-9 9a9 9 0 01-9-9z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path><path d=\\"M5 9.5l2.5 3 6.5-7\\" stroke=\\"#fff\\" vector-effect=\\"non-scaling-stroke\\"></path>","success-solid":"<path clip-rule=\\"evenodd\\" d=\\"M0 9a9 9 0 019-9c4.972 0 9 4.029 9 9 0 4.972-4.028 9-9 9-4.971 0-9-4.028-9-9zm4.032.966l2.982 3.726 6.933-7.625-.74-.673-6.144 6.76-2.25-2.813-.78.625z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","success":"<path d=\\"M7.038 12.923l-.39.312.366.458.394-.434-.37-.336zM17 9a8 8 0 01-8 8v1a9 9 0 009-9h-1zm-8 8a8 8 0 01-8-8H0a9 9 0 009 9v-1zM1 9a8 8 0 018-8V0a9 9 0 00-9 9h1zm8-8a8 8 0 018 8h1a9 9 0 00-9-9v1zM4.033 9.966l2.615 3.27.78-.625-2.614-3.27-.781.625zm3.375 3.293l6.539-7.192-.74-.673-6.538 7.193.74.672z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","tack":"<path d=\\"M5.73 12.27L.5 17.5M10.962 1.808L7.039 5.73m9.154 1.308l-3.923 3.923M9.405.5L17.5 8.595m-7.137 8.252l-9.21-9.21a6.513 6.513 0 019.21 0 6.513 6.513 0 010 9.21z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","technology":"<path d=\\"M5.5 3.214V0m7 3.214V0m0 18v-3.857M5.5 18v-3.857M0 5.5h3.857m10.286 0H18m-18 7h3.857m10.286 0H18m-14.5 2h11v-11h-11v11zm3-3h5v-5h-5v5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","thumbs-down":"<path d=\\"M6.5.5h4.818A6.182 6.182 0 0117.5 6.682V11.5h-6v1.364c0 2.56-2.44 4.636-5 4.636V.5zm0 0h-6v11h6V.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","thumbs-up":"<path d=\\"M6.5 17.5h4.818a6.182 6.182 0 006.182-6.182V6.5h-6V5.136C11.5 2.576 9.06.5 6.5.5v17zm0 0h-6v-11h6v11z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tile":"<path clip-rule=\\"evenodd\\" d=\\"M.5 6.5h6v-6h-6v6zM11.5 6.5h6v-6h-6v6zM.5 17.5h6v-6h-6v6zM11.5 17.5h6v-6h-6v6z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","timer":"<path d=\\"M5.614 8l3.954 4M8.5 3V.5m-2 0h4M16 10a7.5 7.5 0 01-15 0 7.501 7.501 0 0115 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","timesheet":"<path d=\\"M12 17.5H.5V.5h14.01V9m-2.047 1.574v3.148h1.889M17.5 13a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tools-addons":"<path d=\\"M13.566 2.609h5.218M16.175 0v5.218m2.087 10.315L10.95 8.22c.308-.685.49-1.44.49-2.24A5.459 5.459 0 005.98.522c-.8 0-1.554.181-2.239.49l3.604 3.604-2.73 2.729-3.603-3.604a5.437 5.437 0 00-.49 2.24 5.459 5.459 0 005.458 5.458c.8 0 1.555-.182 2.24-.49l7.313 7.313 2.73-2.73z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tools":"<path clip-rule=\\"evenodd\\" d=\\"M18.262 15.533L10.95 8.22c.308-.685.49-1.44.49-2.24A5.459 5.459 0 005.98.522c-.8 0-1.554.181-2.239.49l3.604 3.604-2.73 2.729-3.603-3.604a5.437 5.437 0 00-.49 2.24 5.459 5.459 0 005.458 5.458c.8 0 1.555-.182 2.24-.49l7.313 7.313 2.73-2.73z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","top-align":"<path d=\\"M0 .5h18M14.5 13V3m-12 14.5h7v-14h-7v14z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","transfer":"<path d=\\"M15 5.5H1.393M5.32 10L1 5.5 5.321 1M3 12.5h13.607M12.68 17L17 12.5 12.679 8\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","translate":"<path d=\\"M13.647 10.554l-.077 1.005c0 2.179-1.843 4.021-4.02 4.021H4.522l-4.02 2.513V6.533h4.02m9.124 4.021H8.544c-2.178 0-4.02-1.842-4.02-4.02m9.123 4.02l3.944 3.016V1.508H4.523v5.026\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","travel-plan":"<path clip-rule=\\"evenodd\\" d=\\"M17.5 4.5H.5v12h11.46c3.059 0 5.54-2.512 5.54-5.611V4.5zM5.5 4.5h7v-3h-7v3z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-audio":"<path clip-rule=\\"evenodd\\" d=\\"M8.5 12.5h-6v-7h6l7-4.5v16l-7-4.5z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-avi":"<path d=\\"M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6m.5 8.5h-5m0-6h5m-2.5 0v6M6.5 8v5.5L9 15l2.5-1.5V8m-7 7V9.5L2.5 8l-2 1.5V15m0-2.5h4\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-bmp":"<path d=\\"M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6m-11 9V8m5 0v7m-5-6.5L9 11l2.5-2.5m-11 2.571h2.578c.707 0 1.28.573 1.28 1.28v.869a1.28 1.28 0 01-1.28 1.28H.5v-6h2.571a1.285 1.285 0 110 2.571H1.786M13.5 15V8.5h2.71c.71 0 1.29.575 1.29 1.284v.516c0 .71-.58 1.2-1.29 1.2H13.5V15z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-chart":"<path d=\\"M9 9.315h-.5v.127l.061.112.439-.24zm8.5-.815H9v1h8.5v-1zm-4.283 7.501L9.439 9.075l-.878.48 3.778 6.925.878-.479zM9.5 9.315V.5h-1v8.815h1zM17 9a8 8 0 01-8 8v1a9 9 0 009-9h-1zm-8 8a8 8 0 01-8-8H0a9 9 0 009 9v-1zM1 9a8 8 0 018-8V0a9 9 0 00-9 9h1zm8-8a8 8 0 018 8h1a9 9 0 00-9-9v1z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","tree-code":"<path d=\\"M5 13L1 8.5 5 4m8 9l4-4.5L13 4M12.5.5L5 17.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-csv":"<path d=\\"M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6m-4 2v5.5l1.929 1.5 1.928-1.5V8M4.5 13.643c0 .71-.575 1.286-1.286 1.286H1.93c-.71 0-1.286-.576-1.286-1.286V9.786c0-.71.576-1.286 1.286-1.286h1.285c.711 0 1.286.575 1.286 1.286m6.429 0c0-.711-.575-1.286-1.286-1.286H8.357c-.71 0-1.286.575-1.286 1.286v.643c0 .71.575 1.285 1.286 1.285h1.286c.71 0 1.286.575 1.286 1.286v.643c0 .71-.575 1.286-1.286 1.286H8.357a1.285 1.285 0 01-1.286-1.286\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-doc":"<path d=\\"M4 8.5h6m-6-3h9M1.5.5h14v11.77c0 2.888-2.28 5.23-5.09 5.23H1.5V.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-excel":"<path d=\\"M3 3.5h4m3 0h4m-4 3h4m-4 3h4m-11-3h4m-4 3h4m-4 3h4m3 0h4M1.5.5h14v11.77c0 2.888-2.28 5.23-5.09 5.23H1.5V.5z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-expenses":"<g clip-path=\\"url(#tree-expenses-clip0)\\"><path d=\\"M4 8.5h6m-6-3h9m2.5 12l-3-1.5-4 1.5-4-1.5-3 1.5V5.73C1.5 2.843 3.78.5 6.59.5h8.91v17z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path></g>","tree-gif":"<path d=\\"M16 11.5h-3.5m4.5-3h-4.5V15M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6M11 14.5H6m0-6h5m-2.5 0v6m-4-4.714c0-.711-.596-1.286-1.333-1.286H1.829C1.095 8.5.5 9.073.5 9.782v3.438c0 .708.595 1.28 1.33 1.28h1.34c.735 0 1.33-.57 1.33-1.28v-.72h-2\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-html":"<path d=\\"M11 8.5H6m6.5 6.5V8m5 0v7m-17 0V8m4 7V8M0 17.5h18M.5 6V.5h12c2.84 0 5 2.303 5 5.143V6m-5 2.5L15 11l2.5-2.5m-9 0V15M.643 11.5H4.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-image":"<path d=\\"M.5 15.379l3.923-3.864 3.923 2.576L17.5 8.939m0-6.439H.5v14h11.77c2.92 0 5.23-2.248 5.23-5.09V2.5zM6.893 6.965a1.889 1.889 0 11-3.777 0 1.889 1.889 0 013.777 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-jpg":"<path d=\\"M4.5 8v5.305c0 .7-.767 1.195-1.5 1.195H2c-.733 0-1.5-.495-1.5-1.195v-.643M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6m-1 3.786c0-.711-.596-1.286-1.333-1.286h-1.338c-.734 0-1.329.573-1.329 1.282v3.438c0 .708.595 1.28 1.33 1.28h1.34c.735 0 1.33-.57 1.33-1.28v-.72h-2m-8 2.5V8.5h2.71c.71 0 1.29.575 1.29 1.284v.516c0 .71-.58 1.2-1.29 1.2H6.5V15z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-link":"<path d=\\"M4 9.5h10m-6.5-4H4.9C2.746 5.5 1 7.29 1 9.5s1.746 4 3.9 4h2.6m3-8h2.6c2.154 0 3.9 1.79 3.9 4s-1.746 4-3.9 4h-2.6\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-linked-report":"<path d=\\"M1 8.5h3m-3 6h3m-3-11h3m9 14h-1.5a2 2 0 010-4H13m-1 4H2.5V.5h14V12M12 15.5h3m-1-2h1.5a2 2 0 010 4H14\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-mail":"<path d=\\"M.5 2.5v13h11.77c2.888 0 5.23-2.328 5.23-5.2V2.5m-17 0h17m-17 0L9 9.542 17.5 2.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-mhtml":"<path d=\\"M18 8.5h-5M.5 15V8m5 0v7m2 0V8m4 7V8M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6M.5 8.586L3 11l2.5-2.5m10-.286v7.072m-8-4.5h4\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-mp3":"<path d=\\"M1.5 15V8m5 0v7M0 17.5h18m-16.5-9L4 11l2.5-2.5M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6m-4 8.5h2.578a1.28 1.28 0 001.28-1.28v-.44c0-.708-.573-1.28-1.28-1.28H14.5h1.4c.711 0 1.457-.67 1.457-1.5s-.746-1.5-1.457-1.5h-2.4m-5 6.5V8.5h2.71c.71 0 1.29.575 1.29 1.284v.516c0 .71-.58 1.2-1.29 1.2H8.5V15z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-msg":"<path d=\\"M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6m-17 9V8m5 0v7m12-5.214c0-.711-.596-1.286-1.333-1.286h-1.338c-.734 0-1.329.573-1.329 1.282v3.438c0 .708.595 1.28 1.33 1.28h1.34c.735 0 1.33-.57 1.33-1.28v-.72h-2m-15-4L3 11l2.5-2.5m5.857 1.2c0-.664-.575-1.2-1.286-1.2H8.786c-.711 0-1.286.536-1.286 1.2v.6c0 .664.575 1.2 1.286 1.2h1.285c.711 0 1.286.536 1.286 1.2v.6c0 .664-.575 1.2-1.286 1.2H8.786c-.711 0-1.286-.536-1.286-1.2\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-node":"<path clip-rule=\\"evenodd\\" d=\\"M1.5.5h14v11.77c0 2.888-2.28 5.23-5.09 5.23H1.5V.5z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-other-file":"<path d=\\"M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6M5 14.5H.5v-6H5m-5 3h3.857M6 8.5h6m-2.5 0V15m8-1.7c0 .664-.596 1.2-1.333 1.2h-1.334c-.736 0-1.333-.538-1.333-1.2V9.7c0-.662.597-1.2 1.333-1.2h1.334c.737 0 1.333.536 1.333 1.2\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-pdf":"<path d=\\"M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6M16 11.5h-3.5m4.5-3h-4.5V15m-2.143-5.3v3.6c0 .664-.575 1.2-1.286 1.2H6.5v-6h2.571c.711 0 1.286.536 1.286 1.2zM.5 15V8.5h2.71c.71 0 1.29.575 1.29 1.284v.516c0 .71-.58 1.2-1.29 1.2H.5V15z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-png":"<path d=\\"M11.5 8v7m-5 0V8m0 .5l5 6M0 17.5h18M.5 6V.5h11.714a5.143 5.143 0 015.143 5.143V6m.143 3.786c0-.711-.596-1.286-1.333-1.286h-1.338c-.734 0-1.329.573-1.329 1.282v3.438c0 .708.595 1.28 1.33 1.28h1.34c.735 0 1.33-.57 1.33-1.28v-.72h-2M.5 15V8.5h2.71c.71 0 1.29.575 1.29 1.284v.516c0 .71-.58 1.2-1.29 1.2H.5V15z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-ppt":"<path d=\\"M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6M17 8.5h-5m2.5 6.5V8.5M.5 15V8.5h2.71c.71 0 1.29.575 1.29 1.284v.516c0 .71-.58 1.2-1.29 1.2H.5V15zm6 0V8.5h2.71c.71 0 1.29.575 1.29 1.284v.516c0 .71-.58 1.2-1.29 1.2H6.5V15z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-prj":"<path d=\\"M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6M9 11.5l2 3.5m5.5-7v5.305c0 .7-.593 1.266-1.327 1.266h-1.346c-.734 0-1.327-.566-1.327-1.266v-.643M.5 15V8.5h2.71c.71 0 1.29.575 1.29 1.284v.516c0 .71-.58 1.2-1.29 1.2H.5V15zm6 0V8.5h2.71c.71 0 1.29.575 1.29 1.284v.516c0 .71-.58 1.2-1.29 1.2H6.5V15z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-psd":"<path d=\\"M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6m-7.143 3.7c0-.664-.575-1.2-1.286-1.2H7.786c-.711 0-1.286.536-1.286 1.2v.6c0 .664.575 1.2 1.286 1.2H9.07c.711 0 1.286.536 1.286 1.2v.6c0 .664-.575 1.2-1.286 1.2H7.786c-.711 0-1.286-.536-1.286-1.2M.5 15V8.5h2.71c.71 0 1.29.575 1.29 1.284v.516c0 .71-.58 1.2-1.29 1.2H.5V15zm15.857-5.3v3.6c0 .664-.575 1.2-1.286 1.2H12.5v-6h2.571c.711 0 1.286.536 1.286 1.2z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-pub":"<path d=\\"M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6m-11 2v5.299a1.28 1.28 0 001.286 1.272H9.07c.71 0 1.286-.57 1.286-1.272V8m2.143 3.071h2.578c.707 0 1.28.573 1.28 1.28v.869a1.28 1.28 0 01-1.28 1.28H12.5v-6h2.571a1.285 1.285 0 110 2.571h-1.285M.5 15V8.5h2.71c.71 0 1.29.575 1.29 1.284v.516c0 .71-.58 1.2-1.29 1.2H.5V15z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-rar":"<path d=\\"M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6M3 11.5L5 15m10-3.5l2 3.5m-6.5 0V9.5L8.5 8l-2 1.5V15m0-2.5h4M.5 15V8.5h2.71c.71 0 1.29.575 1.29 1.284v.516c0 .71-.58 1.2-1.29 1.2H.5V15zm12 0V8.5h2.71c.71 0 1.29.575 1.29 1.284v.516c0 .71-.58 1.2-1.29 1.2H12.5V15z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-rdl":"<path d=\\"M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6m-5 2v6.5H17m-14-3L5 15M.5 15V8.5h2.71c.71 0 1.29.575 1.29 1.284v.516c0 .71-.58 1.2-1.29 1.2H.5V15zm9.857-5.3v3.6c0 .664-.575 1.2-1.286 1.2H6.5v-6h2.571c.711 0 1.286.536 1.286 1.2z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-text":"<path d=\\"M3.5 0v3m10-3v3M4 9.5h6m-6-3h9m-11.5-4h14v9.546c0 3.012-2.28 5.454-5.09 5.454H1.5v-15z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-tif":"<path d=\\"M5 8.5H0m16 3h-3.5m4.5-3h-4.5V15M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6M11 14.5H6m0-6h5m-2.5 0v6m-6-6V15\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-video":"<path clip-rule=\\"evenodd\\" d=\\"M17.5 2.5H.5v14h11.77c2.92 0 5.23-2.248 5.23-5.09V2.5z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path><path clip-rule=\\"evenodd\\" d=\\"M7.5 6.5v6l4-3-4-3z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-vis":"<path d=\\"M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6M11 14.5H6m0-6h5m-2.5 0v6M4.5 8v5.5l-2 1.5-2-1.5V8m15.857 1.7c0-.664-.575-1.2-1.286-1.2h-1.285c-.711 0-1.286.536-1.286 1.2v.6c0 .664.575 1.2 1.286 1.2h1.285c.711 0 1.286.536 1.286 1.2v.6c0 .664-.575 1.2-1.286 1.2h-1.285c-.711 0-1.286-.536-1.286-1.2\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-word":"<path d=\\"M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6m0 7.3c0 .664-.596 1.2-1.333 1.2h-1.334c-.736 0-1.333-.538-1.333-1.2V9.7c0-.662.597-1.2 1.333-1.2h1.334c.737 0 1.333.536 1.333 1.2m-13.143 0v3.6c0 .664-.575 1.2-1.286 1.2H.5v-6h2.571c.711 0 1.286.536 1.286 1.2zM11 9.7c0-.664-.718-1.2-1.429-1.2H8.286C7.575 8.5 7 9.036 7 9.7v3.6c0 .664.575 1.2 1.286 1.2H9.57c.711 0 1.429-.536 1.429-1.2V9.7z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-xls":"<path d=\\"M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6M.5 8.5l5 6m-5 0l5-6m2-.5v6.5H11m5.357-4.8c0-.664-.575-1.2-1.286-1.2h-1.285c-.711 0-1.286.536-1.286 1.2v.6c0 .664.575 1.2 1.286 1.2h1.285c.711 0 1.286.536 1.286 1.2v.6c0 .664-.575 1.2-1.286 1.2h-1.285c-.711 0-1.286-.536-1.286-1.2\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-xml":"<path d=\\"M.5 6V.5h11.714c2.84 0 5.143 2.322 5.143 5.185V6M0 17.5h18M14.5 8v6.5H18m-16.5-6l4 6m-4 0l4-6m2 6.5V8m5 0v7m-5-6.5l2.571 2.593L12.643 8.5\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","tree-zip":"<path d=\\"M0 17.5h18M.5 6V.5h11.714c2.84 0 5.286 2.303 5.286 5.143V6M0 8.5h5m-5 6h5m-.5-6.286V9l-4 5v.5m13 .5V8.5h2.71c.71 0 1.29.575 1.29 1.284v.516c0 .71-.58 1.2-1.29 1.2H13.5M6 8.5h6m-5.5 6H12m-2.5-6v6\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","truck":"<path d=\\"M4 10.5a2 2 0 110 4 2 2 0 010-4zm0 0A2 2 0 015.937 12h5.126a2.003 2.003 0 011.436-1.437M4 10.5A2 2 0 002.063 12H.5V3h12v7.563m.5-.063a2 2 0 110 4 2 2 0 010-4zm0 0a2 2 0 011.937 1.5H17.5V7h-5v3.563m.5-.063c-.173 0-.34.022-.5.063\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","underline":"<path clip-rule=\\"evenodd\\" d=\\"M8.5 15c-.743 0-1.677-.108-2.323-.326a3.993 3.993 0 01-1.672-1.077c-.468-.502-.836-1.157-1.104-1.965C3.134 10.823 3 9.828 3 8.645V0h2v8.69c0 .883-.06 1.624.118 2.223.178.599.42 1.078.724 1.437.305.36.665.618 1.082.775.416.157 1.1.236 1.576.236.49 0 .992-.079 1.408-.236.416-.157.78-.415 1.092-.775.312-.359.557-.838.736-1.437.178-.599.267-1.34.267-2.223V0H14v8.645c0 1.183-.134 2.178-.401 2.987-.268.808-.636 1.463-1.104 1.965a4.002 4.002 0 01-1.66 1.077c-.64.218-1.592.326-2.335.326zM2 17v-1h13v1H2z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","undo":"<path d=\\"M.68 3.59h9.572a6.955 6.955 0 010 13.91H1.707m2-11l-3-3 3-3\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","unlink":"<path d=\\"M3.99 9.683H14.34m-6.21-4.14H4.92c-2.23 0-4.037 1.853-4.037 4.14s1.807 4.14 4.037 4.14h3.21m2.07-8.28h3.209c2.23 0 4.037 1.853 4.037 4.14s-1.807 4.14-4.037 4.14H10.2M17.966.367L.366 17.965\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","unlocked":"<path d=\\"M8.5 12.5V15m0-2.5a2 2 0 100-4 2 2 0 000 4zm4-6v-2a4 4 0 00-4-4c-2.21 0-4 1.622-4 3.5m-4 2.5h16v6a5 5 0 01-5 5H.5v-11z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","unorderedlist":"<path clip-rule=\\"evenodd\\" d=\\"M.75 2a.75.75 0 100 1.5.75.75 0 000-1.5zM.75 14a.75.75 0 100 1.5.75.75 0 000-1.5zM.778 8a.778.778 0 100 1.556.778.778 0 000-1.556zM18 3H3V2h15v1zm0 6H3V8h15v1zm0 6H3v-1h15v1z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","unsubscribe":"<path d=\\"M17.46 9.243a8.216 8.216 0 01-8.217 8.216v1.027a9.243 9.243 0 009.243-9.243H17.46zM9.242 17.46a8.216 8.216 0 01-8.216-8.216H0a9.243 9.243 0 009.243 9.243V17.46zM1.027 9.243a8.216 8.216 0 018.216-8.216V0A9.243 9.243 0 000 9.243h1.027zm8.216-8.216a8.216 8.216 0 018.216 8.216h1.027A9.243 9.243 0 009.243 0v1.027zm4.393 11.882L5.577 4.851l-.726.726 8.058 8.059.726-.727zm-8.059.726l8.059-8.058-.727-.726-8.058 8.058.726.726z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","up-arrow":"<path d=\\"M9 .71v17m0-17l7.5 7.555M9 .71L1.5 8.265\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","update-preview":"<path d=\\"M18.488 16.398h-4.612v-4.612m.227 4.36A8.465 8.465 0 0017.33 9.48c0-4.67-3.756-8.455-8.39-8.455C4.309 1.025.553 4.81.553 9.48s3.756 8.456 8.389 8.456\\" stroke=\\"currentColor\\" stroke-width=\\"1.077\\" vector-effect=\\"non-scaling-stroke\\"></path>","upload-adv":"<path d=\\"M12.5 15l4-5 4 5m-4 7V10.5M27.465 8c-1.287 0-2.49.35-3.528.95C23.822 4.54 20.2 1 15.74 1 11.21 1 7.534 4.656 7.534 9.167l.002.029a6.972 6.972 0 00-.588-.03C3.388 9.167.5 12.04.5 15.584.5 19.126 3.388 22 6.948 22h20.517c3.885 0 7.035-3.135 7.035-7s-3.15-7-7.035-7z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","upload":"<path d=\\"M9.5 18.074V3.722M4 9.074l5.5-5.5 5.5 5.5M17.5 7.5V5.59C17.5 2.78 15.158.5 12.27.5H.5v7\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","url":"<path d=\\"M12.24 16.76l-1.43-1a2.71 2.71 0 01-1.16-1.21c-.1-.29-.12-.63-.35-.83a1.08 1.08 0 00-.67-.16 3.77 3.77 0 00-1.42.15c-1.09.42-1.6 1.74-2.66 2.23M10.62.57c.41.74 2 1.55 1.2 3.26-.29.59-1.11.72-1.72 1-.61.28-1.22.81-1.14 1.43.11.8 1.21 1.1 2.1 1.1a9.44 9.44 0 003-.52 1.77 1.77 0 010 1.9c-.33.59-.82 1.1-1.12 1.71a1.64 1.64 0 00.14 1.88c.26.218.563.379.89.47.766.25 1.564.392 2.37.42M4.15 2.1a12 12 0 00-.1 2.32c.001.15.029.299.08.44.16.36.6.47.91.72a2 2 0 01.27 2.22 6.48 6.48 0 00-.69 2.27c0 .36.08.79-.19 1-.49.41-1.18-.47-1.79-.3-.33.09-.51.46-.64.78-.22.5-.44 1-.68 1.48M17.5 9a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","user-avatar-dark":"<path fill=\\"#97979B\\" d=\\"M0 0h32v32H0z\\" stroke=\\"none\\"></path><path d=\\"M19 19h-5c-4.418 0-8 4.082-8 8.5V32h21v-4.5c0-4.418-3.582-8.5-8-8.5zM23.037 9.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z\\" fill=\\"#2F2F32\\" stroke=\\"none\\"></path>","user-avatar":"<path fill=\\"#D7D7D8\\" d=\\"M0 0h32v32H0z\\" stroke=\\"none\\"></path><path d=\\"M19 19h-5c-4.418 0-8 4.082-8 8.5V32h21v-4.5c0-4.418-3.582-8.5-8-8.5zM23.037 9.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","user-clock":"<path d=\\"M12.765 9.846v3.077l1.846-.666m-5.556-1.133A5.045 5.045 0 006.61 10.5H5.39C2.689 10.5.5 12.59.5 15.167V17.5h11v-1.761M9.5 4a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zm7.5 8a4 4 0 11-8 0 4 4 0 018 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","user-folder-closed":"<path d=\\"M.5 12.5H0v.5h.5v-.5zm0-12V0H0v.5h.5zm4.577 0l.282-.413L5.231 0h-.154v.5zM8 2.5l-.282.413.127.087H8v-.5zm6.5 0h.5V2h-.5v.5zm-4.846 15h-.5v.5h.5v-.5zm7.846 0v.5h.5v-.5h-.5zM12.923 12H.5v1h12.423v-1zM1 12.5V.5H0v12h1zM.5 1h4.577V0H.5v1zM4.794.913l2.924 2 .564-.826-2.923-2-.565.826zM8 3h6.5V2H8v1zm6-.5V6h1V2.5h-1zm1.365 5.519c0 .988-.801 1.788-1.789 1.788v1a2.788 2.788 0 002.789-2.788h-1zm-1.789 1.788c-.987 0-1.788-.8-1.788-1.788h-1c0 1.54 1.25 2.788 2.788 2.788v-1zM11.788 8.02c0-.988.801-1.788 1.788-1.788v-1a2.788 2.788 0 00-2.788 2.788h1zm1.788-1.788c.988 0 1.789.8 1.789 1.788h1c0-1.54-1.25-2.788-2.789-2.788v1zM14.012 12h-.872v1h.872v-1zm-.872 0c-2.18 0-3.986 1.696-3.986 3.834h1c0-1.545 1.315-2.834 2.986-2.834v-1zm-3.986 3.834V17.5h1v-1.666h-1zm.5 2.166H17.5v-1H9.654v1zM18 17.5v-1.666h-1V17.5h1zm0-1.666C18 13.695 16.193 12 14.012 12v1C15.684 13 17 14.29 17 15.834h1z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","user-folder-open":"<path d=\\"M.5 12.5H0v.5h.5v-.5zm0-12V0H0v.5h.5zm4.577 0l.282-.413L5.231 0h-.154v.5zM8 2.5l-.282.413.127.087H8v-.5zm9 0l.434.248.428-.748H17v.5zm-7.346 15h-.5v.5h.5v-.5zm7.846 0v.5h.5v-.5h-.5zm-13-15V2h-.339l-.125.314.464.186zm8.423 9.5H.5v1h12.423v-1zM1 12.5V.5H0v12h1zM.5 1h4.577V0H.5v1zM4.794.913l2.924 2 .564-.826-2.923-2-.565.826zM8 3h9V2H8v1zm8.566-.748l-2 3.5.868.496 2-3.5-.868-.496zm-1.201 5.767c0 .988-.801 1.788-1.789 1.788v1a2.788 2.788 0 002.789-2.788h-1zm-1.789 1.788c-.987 0-1.788-.8-1.788-1.788h-1c0 1.54 1.25 2.788 2.788 2.788v-1zM11.788 8.02c0-.988.801-1.788 1.788-1.788v-1a2.788 2.788 0 00-2.788 2.788h1zm1.788-1.788c.988 0 1.789.8 1.789 1.788h1c0-1.54-1.25-2.788-2.789-2.788v1zM14.012 12h-.872v1h.872v-1zm-.872 0c-2.18 0-3.986 1.696-3.986 3.834h1c0-1.545 1.315-2.834 2.986-2.834v-1zm-3.986 3.834V17.5h1v-1.666h-1zm.5 2.166H17.5v-1H9.654v1zM18 17.5v-1.666h-1V17.5h1zm0-1.666C18 13.695 16.193 12 14.012 12v1C15.684 13 17 14.29 17 15.834h1zM.964 12.686l4-10-.928-.372-4 10 .928.372zM4.5 3H9V2H4.5v1z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","user-profile":"<path d=\\"M14.6 14.192l.422-.267-.422.267zm-11.2 0l-.422-.268.422.268zM11 6a2 2 0 01-2 2v1a3 3 0 003-3h-1zM9 8a2 2 0 01-2-2H6a3 3 0 003 3V8zM7 6a2 2 0 012-2V3a3 3 0 00-3 3h1zm2-2a2 2 0 012 2h1a3 3 0 00-3-3v1zm6.47 10.827a4.764 4.764 0 00-.448-.902l-.844.535c.142.225.261.465.353.713l.938-.346zm-.448-.903C14.155 12.56 12.532 11 10.5 11v1c1.52 0 2.879 1.202 3.678 2.46l.844-.536zM10.5 11h-3v1h3v-1zm-3 0c-2.032 0-3.655 1.56-4.522 2.924l.844.537C4.622 13.201 5.98 12 7.5 12v-1zm-4.522 2.925a4.77 4.77 0 00-.447.902l.938.346c.092-.248.21-.488.353-.713l-.844-.535zM17 9a8 8 0 01-8 8v1a9 9 0 009-9h-1zm-8 8a8 8 0 01-8-8H0a9 9 0 009 9v-1zM1 9a8 8 0 018-8V0a9 9 0 00-9 9h1zm8-8a8 8 0 018 8h1a9 9 0 00-9-9v1z\\" fill=\\"currentColor\\" stroke=\\"none\\"></path>","user-status-available":"<path clip-rule=\\"evenodd\\" d=\\"M0 9a9 9 0 019-9 9 9 0 019 9c0 4.972-4.028 9-9 9a9 9 0 01-9-9zm6.994 4.703l6.872-7.362-.732-.682-6.051 6.484-2.181-2.94-.804.595 2.896 3.905z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","user-status-away":"<path clip-rule=\\"evenodd\\" d=\\"M9 18a9 9 0 009-9 9 9 0 00-9-9 9 9 0 00-9 9 9 9 0 009 9zM9 4H8v7.258l4.197-1.798-.394-.92L9 9.742V4z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","user-status-busy":"<path clip-rule=\\"evenodd\\" d=\\"M18 9a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","user-status-do-not-disturb":"<path clip-rule=\\"evenodd\\" d=\\"M0 9a9 9 0 1118 0A9 9 0 010 9zm5 0h8V8H5v1z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","user-status-unknown":"<path clip-rule=\\"evenodd\\" d=\\"M18 9a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","user":"<path clip-rule=\\"evenodd\\" d=\\"M9.111 10.5H7.89C5.189 10.5 3 12.59 3 15.167V17.5h11v-2.333c0-2.578-2.189-4.667-4.889-4.667zM12 4a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\" vector-effect=\\"non-scaling-stroke\\"></path>","utilities":"<path d=\\"M.5 8.5h17M4.5 9v2m9-2v2m4-6.5H.5v12h11.46c3.059 0 5.54-2.512 5.54-5.611V4.5zm-12 0h7v-3h-7v3z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","vertical-align-center":"<path d=\\"M8.5 8V0m0 18v-3M4 3.5h10m-11.5 11h13v-7h-13v7z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","visual":"<path clip-rule=\\"evenodd\\" d=\\"M0 1h2.234l2.674 8.65c.582 1.881.98 3.407 1.596 5.284h.1c.613-1.877 1.021-3.403 1.595-5.285L10.853 1H13L7.737 17H5.293L0 1zm16 16h2V1h-2v16zm5-2.291l1.213-1.348c1.147 1.153 2.739 1.913 4.394 1.913 2.09 0 3.33-1.01 3.33-2.509 0-1.576-1.154-2.08-2.657-2.715l-2.288-.979c-1.484-.614-3.225-1.704-3.225-3.973 0-2.36 2.12-4.098 5.014-4.098 1.887 0 3.57.792 4.69 1.912l-1.074 1.262c-.977-.893-2.144-1.447-3.616-1.447-1.786 0-2.97.872-2.97 2.253 0 1.487 1.389 2.043 2.637 2.555l2.271.951C30.562 9.254 32 10.319 32 12.614 32 15.052 29.92 17 26.572 17c-2.235 0-4.18-.884-5.572-2.291zM35 1h2v9.224c0 3.776 1.503 5.018 3.503 5.018C42.532 15.242 44 14 44 10.224V1h2v9.224C46 15.266 43.628 17 40.503 17 37.377 17 35 15.266 35 10.224V1zm26 16h-2.3l-1.624-4.874h-6.225L49.211 17H47l5.774-16h2.452L61 17zm-8.78-8.936l-.821 2.437h5.136l-.812-2.437a130.17 130.17 0 01-1.708-5.39h-.105a105.116 105.116 0 01-1.69 5.39zM63 1h2v14h8v2H63V1z\\" fill=\\"currentColor\\" fill-rule=\\"evenodd\\" stroke=\\"none\\"></path>","warehouse":"<path clip-rule=\\"evenodd\\" d=\\"M10.961 8.5L11 3 4.5 8.5v-8h-4v17h6.538v-3.27a1.962 1.962 0 013.923 0v3.27H17.5V3l-6.539 5.5z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","workflow":"<path d=\\"M3 13.5a2 2 0 110 4 2 2 0 010-4zm0 0v-5h12v5m0 0a2 2 0 110 4 2 2 0 010-4zM9 14V4m0 9.5a2 2 0 110 4 2 2 0 010-4zm0-13a2 2 0 110 4 2 2 0 010-4z\\" stroke=\\"currentColor\\" stroke-miterlimit=\\"10\\" vector-effect=\\"non-scaling-stroke\\"></path>","wrench":"<path clip-rule=\\"evenodd\\" d=\\"M18.262 15.533L10.95 8.22c.308-.685.49-1.44.49-2.24A5.459 5.459 0 005.98.522c-.8 0-1.554.181-2.239.49l3.604 3.604-2.73 2.729-3.603-3.604a5.437 5.437 0 00-.49 2.24 5.459 5.459 0 005.458 5.458c.8 0 1.555-.182 2.24-.49l7.313 7.313 2.73-2.73z\\" fill-rule=\\"evenodd\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","zoom-100":"<path d=\\"M6 4.5h1.5V11m5 1.5l5 5m-3-10a7 7 0 11-14 0 7 7 0 0114 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","zoom-fit":"<path d=\\"M.5 4.015V.5h3.515M17.5 4.015V.5h-3.515M17.5 13.985V17.5h-3.515M.5 13.985V17.5h3.515m7.976-5.51l1.994 1.995m-.997-5.483a4.486 4.486 0 11-8.972 0 4.486 4.486 0 018.972 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","zoom-in":"<path d=\\"M12.5 12.5l5 5M11 7.5H4M7.5 4v7m7-3.5a7 7 0 11-14 0 7 7 0 0114 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>","zoom-out":"<path d=\\"M12.5 12.5l5 5M11 7.5H4m10.5 0a7 7 0 11-14 0 7 7 0 0114 0z\\" stroke=\\"currentColor\\" vector-effect=\\"non-scaling-stroke\\"></path>"}');

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
/*!*****************************************!*\
  !*** ./src/components/enterprise-wc.js ***!
  \*****************************************/
/* harmony import */ var _ids_rating_ids_rating__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ids-rating/ids-rating */ "./src/components/ids-rating/ids-rating.js");
/* harmony import */ var _ids_icon_ids_icon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ids-icon/ids-icon */ "./src/components/ids-icon/ids-icon.js");


})();

/******/ })()
;
//# sourceMappingURL=enterprise-wc.js.map