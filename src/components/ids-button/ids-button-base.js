import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsTooltipMixin from '../../mixins/ids-tooltip-mixin/ids-tooltip-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsEventsMixin(
  IdsTooltipMixin(
    IdsThemeMixin(
      IdsColorVariantMixin(
        IdsElement
      )
    )
  )
);

export default Base;
