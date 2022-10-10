import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsLabelStateMixin from '../../mixins/ids-label-state-mixin/ids-label-state-mixin';
import IdsDirtyTrackerMixin from '../../mixins/ids-dirty-tracker-mixin/ids-dirty-tracker-mixin';
import IdsValidationMixin from '../../mixins/ids-validation-mixin/ids-validation-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsThemeMixin(
  IdsValidationMixin(
    IdsLabelStateMixin(
      IdsDirtyTrackerMixin(
        IdsLocaleMixin(
          IdsEventsMixin(
            IdsElement
          )
        )
      )
    )
  )
);

export default Base;
