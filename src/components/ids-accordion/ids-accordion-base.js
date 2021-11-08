import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsAttributeProviderMixin from '../../mixins/ids-attribute-provider-mixin/ids-attribute-provider-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsColorVariantMixin(
  IdsThemeMixin(
    IdsKeyboardMixin(
      IdsEventsMixin(
        IdsElement
      )
    )
  )
)

export default Base;
