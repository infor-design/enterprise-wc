import { attributes } from '../../core/ids-attributes';
import { buildClassAttrib } from '../../utils/ids-string-utils/ids-string-utils';

const getPercentageTextHtml = ({ progress, type = 'circular' }:{ progress:any, type?:string }) => (
  `<div class="progress-percentage ${type}" part="percentage-text">
    <ids-text font-size="14" font-weight="semi-bold" color="unset" label>${progress}</ids-text>
  </div>`
);

const getInnerIndicatorHtml = ({
  progress, type, percentageVisible, inline
}:{ progress:any, type:string, percentageVisible:boolean | string, inline:boolean | string }) => {
  const isDeterminate = !Number.isNaN(parseInt(progress));

  switch (type) {
    case attributes.STICKY:
    case attributes.LINEAR: {
      const overallYOffset = `y="${type === 'sticky' ? '0' : '12.5'}%"`;

      const classStr = buildClassAttrib(
        'linear-indicator',
        type === 'sticky' && 'sticky',
        `${!isDeterminate ? 'in' : ''}determinate`
      );

      return (
        `<svg
        xmlns="http://www.w3.org/2000/svg"
        ${classStr}
        part="container"
        class="ids-loading-indicator"
      >
        <rect
          width="100%"
          height="75%"
          ${overallYOffset}
          class="circle"
          part="circle"
        />
        <rect
          width="100%"
          height="100%"
          class="progress"
          part="progress"
        />
      </svg>
      ${!(percentageVisible && type !== 'sticky') ? ''
          : getPercentageTextHtml({ progress, type })}`
      );
    }
    // circular
    default: {
      const classStr = buildClassAttrib(
        'circular-indicator',
        `${!isDeterminate ? 'in' : ''}determinate`,
        inline && 'inline'
      );

      return (
        `<svg
        viewbox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        ${classStr}
        part="container"
        class="ids-loading-indicator"
      >
        <circle cx="50" cy="50" r="45" stroke-width="${inline ? 8 : 4}" class="circle" part="circle" />
        <circle cx="50" cy="50" r="45" stroke-width="${inline ? 18 : 7}" class="progress" part="progress" />
      </svg>
      ${!percentageVisible ? '' : getPercentageTextHtml({ progress })}`
      );
    }
  }
};

export { getPercentageTextHtml, getInnerIndicatorHtml };
