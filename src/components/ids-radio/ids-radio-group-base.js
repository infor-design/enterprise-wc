import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsDirtyTrackerMixin from '../../mixins/ids-dirty-tracker-mixin/ids-dirty-tracker-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsValidationMixin from '../../mixins/ids-validation-mixin/ids-validation-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsValidationMixin(
  IdsLocaleMixin(
    IdsDirtyTrackerMixin(
      IdsEventsMixin(
        IdsElement
      )
    )
  )
);

export default Base;
