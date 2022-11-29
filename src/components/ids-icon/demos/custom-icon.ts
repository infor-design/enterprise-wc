import IdsIcon from '../ids-icon';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('ids-container');

  // Add custom icons
  IdsIcon.addIcon('custom-binoculars', [{
    shape: 'path',
    d: 'M6.682 8.59h4.636m-4.636 0a3.092 3.092 0 0 1-6.182 0 3.092 3.092 0 0 1 6.182 0zm10.818 0a3.092 3.092 0 0 1-6.182 0 3.092 3.092 0 0 1 6.182 0z',
    stroke: 'currentColor',
    fill: 'none',
    'fill-rule': 'evenodd',
    'stroke-width': '1',
    'vector-effect': 'non-scaling-stroke'
  }]);

  IdsIcon.addIcon('custom-airplane', [{
    shape: 'path',
    d: 'm7 16.81-1.57-1 .49-9L.83 3.37s-.51-1.51 1-1.56c1 .63 5.09 3.33 5.09 3.33l7.8-4.33 1.62 1-5.87 5.64 3.36 2.14 2.11-.9 1.31.85-.44.72-1.56 1-.39.63-.19 1.82-.45.73-1.31-.86-.07-2.36L9.45 9.1Z',
    transform: 'translate(-0.25 -0.23)'
  }]);

  IdsIcon.addIcon('custom-cargoship', [{
    shape: 'path',
    d: 'm17.54 12.23-1.42 1H3.1l-2-2.6h16.42ZM3.32 8.85h2.74V7H3.32Zm4.78 0h2.74V7H8.1Zm8.56 1.62V5.19h-3.4v5.21',
    transform: 'translate(-0.12 -4.69)'
  }]);

  IdsIcon.addIcon('custom-popup-media', [{
    shape: 'path',
    d: 'M22.5,2.5H.5V20.618H15.732A6.628,6.628,0,0,0,22.5,14.031ZM8.773,8.278A2.445,2.445,0,1,1,6.329,5.89,2.445,2.445,0,0,1,8.773,8.278ZM.5,19.167l5.077-5L10.654,17.5,22.5,10.833',
    transform: 'translate(0 -2)'
  }]);

  IdsIcon.addIcon('custom-data-source', [{
    shape: 'g',
    transform: 'translate(-0.87)',
    contents: [
      {
        shape: 'ellipse',
        cx: 7.054,
        cy: 2.98,
        rx: 7.054,
        ry: 2.98,
        transform: 'translate(1.38 0.5)'
      },
      {
        shape: 'path',
        d: 'M15.489 3.348v3.55c0 1.64-3.16 2.98-7.054 2.98S1.38 8.548 1.38 6.898v-3.71',
      },
      {
        shape: 'path',
        d: 'M1.37 6.514v4.03c0 1.64 3.16 2.98 7.054 2.98s7.054-1.33 7.054-2.98v-4.03',
      },
      {
        shape: 'path',
        d: 'M1.37 10.22v3.3c0 1.64 3.16 2.98 7.054 2.98s7.054-1.33 7.054-2.98v-3.3',
      }
    ]
  }]);

  /**
   * Append custom icon to dom in different sizes
   * @param {string} iconName icon name
   * @param {string} viewbox viewbox setting for IdsIcon
   */
  function appendCustomIcon(iconName: string, viewbox = '') {
    const sizes = ['small', 'medium', 'large', 'xl', 'xxl'];
    const viewBox = viewbox ? `viewbox="${viewbox}"` : '';
    const icons = sizes.map((s) => `<ids-icon icon="${iconName}" size="${s}" ${viewBox}></ids-icon>`).join('');
    container?.insertAdjacentHTML('beforeend', `<ids-layout-grid>${icons}</ids-layout-grid>`);
  }

  appendCustomIcon('custom-binoculars');
  appendCustomIcon('custom-cargoship');
  appendCustomIcon('custom-airplane');
  appendCustomIcon('custom-popup-media', '0 0 25 25');
  appendCustomIcon('custom-data-source');
});
