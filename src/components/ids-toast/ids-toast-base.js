import IdsEventsMixin from "../../mixins/ids-events-mixin/ids-events-mixin";
import IdsKeyboardMixin from "../../mixins/ids-keyboard-mixin/ids-keyboard-mixin";
import IdsThemeMixin from "../../mixins/ids-theme-mixin/ids-theme-mixin";
import IdsElement from "../../core/ids-element";

const Base = IdsEventsMixin(
  IdsKeyboardMixin(
    IdsThemeMixin(
      IdsElement
    )
  )
)

export default Base;
