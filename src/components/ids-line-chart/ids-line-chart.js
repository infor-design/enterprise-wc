import { attributes } from '../../core/ids-attributes';
import { customElement, scss } from '../../core/ids-decorators';
import Base from './ids-line-chart-base';

import styles from './ids-line-chart.scss';

/**
 * IDS Line Chart Component
 * @type {IdsLineChart}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @part container - the outside container element
 */
@customElement('ids-line-chart')
@scss(styles)
export default class IdsLineChart extends Base {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    this.#attachEventHandlers();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.TITLE
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<div class="ids-line-chart-container" part="container">
      <svg class="ids-line-chart">
        <title id="title">${this.title}</title>
        <g class="grid x-grid">
          <line x1="113" x2="113" y1="10" y2="380"></line>
          <line x1="259" x2="259" y1="10" y2="380"></line>
          <line x1="405" x2="405" y1="10" y2="380"></line>
          <line x1="551" x2="551" y1="10" y2="380"></line>
          <line x1="697" x2="697" y1="10" y2="380"></line>
        </g>
        <g class="grid y-grid">
          <line x1="86" x2="697" y1="10" y2="10"></line>
          <line x1="86" x2="697" y1="68" y2="68"></line>
          <line x1="86" x2="697" y1="126" y2="126"></line>
          <line x1="86" x2="697" y1="185" y2="185"></line>
          <line x1="86" x2="697" y1="243" y2="243"></line>
          <line x1="86" x2="697" y1="301" y2="301"></line>
          <line x1="86" x2="697" y1="360" y2="360"></line>
        </g>
        <g class="areas">
          <path d="M113,360 L113,192 L259,171 L405,179 L551,200 L697,204 L697,360 Z"></path>
        </g>
        <g class="data-lines">
          <polyline class="data-line" points="113,192 259,171 405,179 551,200 697,204"/>
        </g>
        <g class="dots" data-setname="Component One">
          <circle cx="113" cy="192" data-value="7.2" r="5"></circle>
          <circle cx="259" cy="171" data-value="8.1" r="5"></circle>
          <circle cx="405" cy="179" data-value="7.7" r="5"></circle>
          <circle cx="551" cy="200" data-value="6.8" r="5"></circle>
          <circle cx="697" cy="204" data-value="6.7" r="5"></circle>
        </g>
        <g class="labels x-labels">
          <text x="113" y="400">2008</text>
          <text x="259" y="400">2009</text>
          <text x="405" y="400">2010</text>
          <text x="551" y="400">2011</text>
          <text x="697" y="400">2012</text>
        </g>
        <g class="labels y-labels">
          <text x="80" y="15">15</text>
          <text x="80" y="131">10</text>
          <text x="80" y="248">5</text>
          <text x="80" y="365">0</text>
          <text x="50" y="15" class="axis-label">Weeks</text>
        </g>
      </svg>
    </div>`;
  }

  /**
   * Setup the Event Handling
   * @private
   */
  #attachEventHandlers() {
    // TODO: Add event handlers for click/selection/mouseevents ect...
  }

  /**
   * Set the line chart title
   * @param {string} value The title value
   */
  set title(value) {
    this.setAttribute('title', value);
    this.container.querySelector('title').textContent = value;
  }

  get color() { return this.getAttribute('title'); }
}
