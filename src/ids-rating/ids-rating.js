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
      this.updateHalfStar(this.ratingArr);
    }
    super.connectedCallback();
  }

    ratingArr = [...this.container.children];

    /**
     * Create the remplate for the rating contents
     * @returns {string} The template
     */
    template() {
      let html = '<div id="rating">';
      for (let i = 0; i < this.stars; i++) {
        html += `<ids-icon class="star star-${i}" role-"button" icon="star-outlined" tabindex="0" size="${this.size}"></ids-icon>`;
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
        this.ratingArr.forEach((element) => {
          element.setAttribute('icon', 'star-outlined');
          element.classList.remove('is-half');
          element.classList.remove('active');
        });
        const valueArray = this.ratingArr;
        const starArray = valueArray.slice(0, parseInt(val));
        starArray.forEach((element) => {
          element.setAttribute('icon', 'star-filled');
          element.classList.add('active');
        });
        this.setAttribute('value', val.toString());
      }

      if (val && isReadonly) {
        this.ratingArr.forEach((element) => {
          element.setAttribute('icon', 'star-outlined');
          element.classList.remove('active');
          element.classList.remove('is-half');
        });
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
        this.ratingArr.forEach((element) => element.setAttribute('size', s.toString()));
        this.setAttribute('size', s.toString());
      }
    }

    get size() {
      return this.getAttribute('size') || 'large';
    }

    handleEvents() {
      this.onEvent('click', this.container, (e) => this.updateStars(e));
      this.onEvent('keyup', this.container, (e) => {
        if (e.key === 'Enter') {
          this.updateStars(e);
        }
      });
    }

    updateStars(event) {
      const activeElements = this.ratingArr.filter((item) => item.classList.contains('active'));
      let attrName = 'star-filled';
      let action = 'add';
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

    updateValue(arr) {
      const val = [...arr];
      const value = val.filter((el) => el.classList.contains('active'));
      this.setAttribute('value', value.length);
    }

    updateHalfStar(arr) {
      const value = this.getAttribute('value');
      const roundValue = Math.round(value);
      for (let i = 0; i < roundValue; i++) {
        arr[i].classList.add('active');
        arr[i].setAttribute('icon', 'star-filled');
      }
      if (value < roundValue) {
        const activeArr = arr.filter((act) => act.classList.contains('active'));
        const lastItem = activeArr[activeArr.length - 1];
        lastItem.classList.add('is-half');
        lastItem.setAttribute('icon', 'star-half');
      }
    }
}

export default IdsRating;
