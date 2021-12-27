import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsClearableMixin from '../../mixins/ids-clearable-mixin/ids-clearable-mixin';
import IdsDirtyTrackerMixin from '../../mixins/ids-dirty-tracker-mixin/ids-dirty-tracker-mixin';
import IdsValidationMixin from '../../mixins/ids-validation-mixin/ids-validation-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsThemeMixin(
  IdsValidationMixin(
    IdsDirtyTrackerMixin(
      IdsClearableMixin(
        IdsEventsMixin(
          IdsElement
        )
      )
    )
  )
);

export default Base;
