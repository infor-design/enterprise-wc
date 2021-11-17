import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsOrientationMixin from '../../mixins/ids-orientation-mixin/ids-orientation-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsColorVariantMixin(
  IdsOrientationMixin(
    IdsEventsMixin(
      IdsElement
    )
  )
);

export default Base;
