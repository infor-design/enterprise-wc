import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsDirtyTrackerMixin from '../../mixins/ids-dirty-tracker-mixin/ids-dirty-tracker-mixin';
import IdsValidationMixin from '../../mixins/ids-validation-mixin/ids-validation-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsValidationMixin(
  IdsDirtyTrackerMixin(
    IdsLocaleMixin(
      IdsKeyboardMixin(
        IdsThemeMixin(
          IdsEventsMixin(
            IdsElement
          )
        )
      )
    )
  )
);

export default Base;
