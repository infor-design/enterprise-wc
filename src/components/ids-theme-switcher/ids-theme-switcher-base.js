import IdsEventsMixin from "../../mixins/ids-events-mixin/ids-events-mixin";
import IdsColorVariantMixin from "../../mixins/ids-color-variant-mixin/ids-color-variant-mixin";
import IdsThemeMixin from "../../mixins/ids-theme-mixin/ids-theme-mixin";
import IdsElement from "../../core/ids-element";

const Base = IdsEventsMixin(
  IdsColorVariantMixin(
    IdsThemeMixin(
      IdsElement
    )
  )
)

export default Base;
