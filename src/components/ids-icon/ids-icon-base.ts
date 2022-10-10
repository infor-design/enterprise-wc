import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';

const Base = IdsLocaleMixin(
  IdsColorVariantMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

export default Base;
