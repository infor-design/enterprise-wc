import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsOrientationMixin from '../../mixins/ids-orientation-mixin/ids-orientation-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsHideFocusMixin from '../../mixins/ids-hide-focus-mixin/ids-hide-focus-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsColorVariantMixin(
  IdsOrientationMixin(
    IdsThemeMixin(
      IdsHideFocusMixin(
        IdsEventsMixin(
          IdsElement
        )
      )
    )
  )
);

export default Base;
