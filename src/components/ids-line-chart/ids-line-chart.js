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
    <svg class="ids-line-chart" aria-labelledby="title" role="img">
      <title id="title">${this.title}</title>
      <g class="grid x-grid">
        <line x1="90" x2="90" y1="5" y2="371"></line>
      </g>
      <g class="grid y-grid">
        <line x1="90" x2="705" y1="370" y2="370"></line>
      </g>
      <g class="labels x-labels">
        <text x="100" y="400">2008</text>
        <text x="246" y="400">2009</text>
        <text x="392" y="400">2010</text>
        <text x="538" y="400">2011</text>
        <text x="684" y="400">2012</text>
        <text x="400" y="440" class="label-title">Year</text>
      </g>
      <g class="labels y-labels">
        <text x="80" y="15">15</text>
        <text x="80" y="131">10</text>
        <text x="80" y="248">5</text>
        <text x="80" y="373">0</text>
        <text x="50" y="200" class="label-title">Price</text>
      </g>
      <g class="data" data-setname="Our first data set">
        <circle cx="90" cy="192" data-value="7.2" r="4"></circle>
        <circle cx="240" cy="141" data-value="8.1" r="4"></circle>
        <circle cx="388" cy="179" data-value="7.7" r="4"></circle>
        <circle cx="531" cy="200" data-value="6.8" r="4"></circle>
        <circle cx="677" cy="104" data-value="6.7" r="4"></circle>
      </g>
      <polyline
        fill="none"
        stroke="#1C86EF"
        stroke-width="1"
        points="
          90,192
          240,141
          388,179
          531,200
          677,104"/>
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
