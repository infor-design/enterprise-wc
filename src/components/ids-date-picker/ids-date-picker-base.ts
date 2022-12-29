import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLabelStateParentMixin from '../../mixins/ids-label-state-mixin/ids-label-state-parent-mixin';
import IdsDateAttributeMixin from '../../mixins/ids-date-attribute-mixin/ids-date-attribute-mixin';
import IdsMonthViewAttributeMixin from '../ids-month-view/ids-month-view-attribute-mixin';
import IdsDirtyTrackerMixin from '../../mixins/ids-dirty-tracker-mixin/ids-dirty-tracker-mixin';
import IdsFieldHeightMixin from '../../mixins/ids-field-height-mixin/ids-field-height-mixin';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsValidationInputMixin from '../../mixins/ids-validation-mixin/ids-validation-input-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsThemeMixin(
  IdsDirtyTrackerMixin(
    IdsLabelStateParentMixin(
      IdsFieldHeightMixin(
        IdsColorVariantMixin(
          IdsValidationInputMixin(
            IdsMonthViewAttributeMixin(
              IdsDateAttributeMixin(
                IdsLocaleMixin(
                  IdsKeyboardMixin(
                    IdsEventsMixin(
                      IdsElement
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
);

export default Base;
