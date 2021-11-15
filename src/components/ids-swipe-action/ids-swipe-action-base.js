import IdsEventsMixin from "../../mixins/ids-events-mixin/ids-events-mixin";
import IdsThemeMixin from "../../mixins/ids-theme-mixin/ids-theme-mixin";
import IdsElement from "../../core/ids-element";
import IdsValidationMixin from "../../mixins/ids-validation-mixin/ids-validation-mixin";

const Base = IdsValidationMixin(
  IdsThemeMixin(
    IdsElement
  )
)

export default Base
