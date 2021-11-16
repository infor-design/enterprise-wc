import IdsEventsMixin from "../../mixins/ids-events-mixin/ids-events-mixin";
import IdsThemeMixin from "../../mixins/ids-theme-mixin/ids-theme-mixin";
import IdsElement from "../../core/ids-element";

const Base = IdsEventsMixin(
  IdsThemeMixin(
    IdsElement
  )
)

export default Base;
