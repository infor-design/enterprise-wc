import {
  IdsElement,
  customElement,
  scss,
  mix,
  stringUtils,
  props
} from '../ids-base/ids-element';

import { IdsEventsMixin } from '../ids-base/ids-events-mixin';
import { IdsKeyboardMixin } from '../ids-base/ids-keyboard-mixin';
import { IdsThemeMixin } from '../ids-base/ids-theme-mixin';

// @ts-ignore
import styles from './ids-rating.scss';

/**
 * IDS Rating Component
 * @type {IdsRating}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsThemeMixin
 */
@customElement('ids-rating')
@scss(styles)
class IdsRating extends mix(IdsElement).with(IdsEventsMixin, IdsKeyboardMixin, IdsThemeMixin) {
  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.readonly) {
      this.handleEvents();
    } else {
      /* istanbul ignore next */
      this.updateHalfStar(this.ratingArr);
    }
    super.connectedCallback();
  }

    ratingArr = [...this.container.children];

    /**
     * Create the template for the rating contents
     * @returns {string} The template
     */
    template() {
      let html = '<div id="rating">';
      for (let i = 0; i < this.stars; i++) {
        html += `<ids-icon class="star star-${i}" role-"button" icon="star-outlined" tabindex="0" size="${this.size}"></ids-icon><span class="audible">${i + 1} out of 5 Stars</span>`;
      }
      html += '</div>';
      return html;
    }

    /**
     * @returns {Array<string>} this component's observable properties
     */
    static get properties() {
      return [...props.MODE, props.VERSION, props.VALUE, 'stars', props.READONLY, props.CLICKABLE, props.COMPACT, props.SIZE];
    }

    set value(val) {
      const isReadonly = stringUtils.stringToBool(this.readonly);

      if (val && !isReadonly) {
        this.ratingArr.forEach(/* istanbul ignore next */(element) => {
          /* istanbul ignore next */
          element.setAttribute('icon', 'star-outlined');
          /* istanbul ignore next */
          element.classList.remove('is-half');
          /* istanbul ignore next */
          element.classList.remove('active');
        });
        const valueArray = this.ratingArr;
        const starArray = valueArray.slice(0, parseInt(val));
        starArray.forEach(/* istanbul ignore next */ (element) => {
          /* istanbul ignore next */
          element.setAttribute('icon', 'star-filled');
          /* istanbul ignore next */
          element.classList.add('active');
        });
        /* istanbul ignore next */
        this.setAttribute('value', val.toString());
      }

      if (val && isReadonly) {
        /* istanbul ignore next */
        this.ratingArr.forEach((element) => {
          /* istanbul ignore next */
          element.setAttribute('icon', 'star-outlined');
          /* istanbul ignore next */
          element.classList.remove('active');
          /* istanbul ignore next */
          element.classList.remove('is-half');
        });
        /* istanbul ignore next */
        this.updateHalfStar(this.ratingArr);
      }
    }

    get value() {
      return this.getAttribute('value') || '0';
    }

    set stars(num) {
      if (num) {
        this.setAttribute('stars', num.toString());
      }
    }

    get stars() {
      return this.getAttribute('stars') || 5;
    }

    set readonly(ro) {
      if (ro && this.readonly) {
        this.offEvent('click', this.container);
        this.updateHalfStar(this.ratingArr);
        this.setAttribute('readonly', ro.toString());
      }

      if (ro && !this.readonly) {
        this.handleEvents();
        this.setAttribute('readonly', ro.toString());
      }
    }

    get readonly() {
      return this.getAttribute('readonly') || false;
    }

    set size(s) {
      if (s) {
        /* istanbul ignore next */
        this.ratingArr.forEach((element) => element.setAttribute('size', s.toString()));
        this.setAttribute('size', s.toString());
      }
    }

    get size() {
      return this.getAttribute('size') || 'large';
    }

    /**
     * Handle events
     * @private
     * @returns {void}
     */
    handleEvents() {
      /* istanbul ignore next */
      this.onEvent('click', this.container, (e) => this.updateStars(e));
      /* istanbul ignore next */
      this.onEvent('keyup', this.container, (e) => {
        /* istanbul ignore next */
        if (e.key === 'Enter' && this.readonly === false) {
          /* istanbul ignore next */
          this.updateStars(e);
        }
      });
    }

    /**
     * Sets star state, active class and icon attribute
     * @param {any} event event target
     */
    /* istanbul ignore next */
    updateStars(event) {
      /* istanbul ignore next */
      const activeElements = this.ratingArr.filter((item) => item.classList.contains('active'));
      /* istanbul ignore next */
      let attrName = 'star-filled';
      /* istanbul ignore next */
      let action = 'add';
      /* istanbul ignore next */
      for (const ratingOption of this.ratingArr) {
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
      this.updateValue(this.ratingArr);
    }

    /**
     * Sets and updates value attribute
     * @param {any} arr NodeList
     */
    /* istanbul ignore next */
    updateValue(arr) {
      /* istanbul ignore next */
      const val = [...arr];
      /* istanbul ignore next */
      const value = val.filter((el) => el.classList.contains('active'));
      /* istanbul ignore next */
      this.setAttribute('value', value.length);
    }

    /**
     * Sets and updates value attribute for halfstar
     * @param {any} arr NodeList
     */
    updateHalfStar(arr) {
      const value = this.value;
      const roundValue = Math.round(value);
      for (let i = 0; i < roundValue; i++) {
        /* istanbul ignore next */
        arr[i].classList.add('active');
        /* istanbul ignore next */
        arr[i].setAttribute('icon', 'star-filled');
      }
      if (value < roundValue) {
        /* istanbul ignore next */
        const activeArr = arr.filter((act) => act.classList.contains('active'));
        /* istanbul ignore next */
        const lastItem = activeArr[activeArr.length - 1];
        /* istanbul ignore next */
        lastItem.classList.add('is-half');
        /* istanbul ignore next */
        lastItem.setAttribute('icon', 'star-half');
      }
    }
}

export default IdsRating;
