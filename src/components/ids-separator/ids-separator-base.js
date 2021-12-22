import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsColorVariantMixin(
  IdsEventsMixin(
    IdsThemeMixin(
      IdsElement
    )
  )
);

export default Base;
