import IdsEventsMixin from "../../mixins/ids-events-mixin/ids-events-mixin";
import IdsClearableMixin from "../../mixins/ids-clearable-mixin/ids-clearable-mixin";
import IdsDirtyTrackerMixin from "../../mixins/ids-dirty-tracker-mixin/ids-dirty-tracker-mixin";
import IdsValidationMixin from "../../mixins/ids-validation-mixin/ids-validation-mixin";
import IdsElement from "../../core/ids-element";

const Base = IdsEventsMixin(
  IdsClearableMixin(
    IdsDirtyTrackerMixin(
      IdsValidationMixin(
        IdsElement
      )
    )
  )
)

export default Base;
