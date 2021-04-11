import {
  IdsElement,
  customElement,
  // mix,
  scss,
  // props
} from '../ids-base/ids-element';

// @ts-ignore
import styles from './ids-counts.scss';

@customElement('ids-counts')
@scss(styles)
class IdsCounts extends IdsElement {
  constructor() {
    super();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    const notActionable = this.attributes?.class?.nodeValue?.match('not-actionable');
    const short = this.attributes?.class?.nodeValue?.match('short') ? ' class="short"' : '';
    const opener = notActionable ? `<span class="ids-counts not-actionable">` : `<a class="ids-counts hyperlink" href="#">`;
    const second = notActionable ? '<span><slot name="addl-text"></slot></span>' : `<span${short}><slot name="xl-text"></slot></span>`;
    const third = notActionable ? `<span${short}><slot name="xl-text"></slot></span>` : '<span><slot name="addl-text"></slot></span>';
    const closer = notActionable ? '</span>' : '</a>';

    return `${opener}
     ${second}
     ${third}
     ${closer}`;
  }
}

export { IdsCounts };
