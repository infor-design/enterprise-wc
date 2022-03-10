import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsTooltipMixin from '../../mixins/ids-tooltip-mixin/ids-tooltip-mixin';
import IdsElement from '../../core/ids-element';
import IdsRippleMixin from '../../mixins/ids-ripple-mixin/ids-ripple-mixin';

const Base = IdsTooltipMixin(
  IdsThemeMixin(
    IdsLocaleMixin(
      IdsRippleMixin(
        IdsColorVariantMixin(
          IdsEventsMixin(
            IdsElement
          )
        )
      )
    )
  )
);

export default Base;
