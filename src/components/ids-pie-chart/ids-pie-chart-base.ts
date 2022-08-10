import IdsChartLegendMixin from '../../mixins/ids-chart-legend-mixin/ids-chart-legend-mixin';
import IdsChartSelectionMixin from '../../mixins/ids-chart-selection-mixin/ids-chart-selection-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsChartLegendMixin(
  IdsChartSelectionMixin(
    IdsThemeMixin(
      IdsLocaleMixin(
        IdsEventsMixin(
          IdsElement
        )
      )
    )
  )
);

export default Base;
