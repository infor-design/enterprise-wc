import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsDirtyTrackerMixin from '../../mixins/ids-dirty-tracker-mixin/ids-dirty-tracker-mixin';
import IdsValidationMixin from '../../mixins/ids-validation-mixin/ids-validation-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsEventsMixin(
  IdsDirtyTrackerMixin(
    IdsValidationMixin(
      IdsThemeMixin(
        IdsElement
      )
    )
  )
);

export default Base;
