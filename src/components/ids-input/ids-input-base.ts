import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsDirtyTrackerMixin from '../../mixins/ids-dirty-tracker-mixin/ids-dirty-tracker-mixin';
import IdsClearableMixin from '../../mixins/ids-clearable-mixin/ids-clearable-mixin';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsFieldHeightMixin from '../../mixins/ids-field-height-mixin/ids-field-height-mixin';
import IdsLabelStateMixin from '../../mixins/ids-label-state-mixin/ids-label-state-mixin';
import IdsMaskMixin from '../../mixins/ids-mask-mixin/ids-mask-mixin';
import IdsValidationMixin from '../../mixins/ids-validation-mixin/ids-validation-mixin';
import IdsTooltipMixin from '../../mixins/ids-tooltip-mixin/ids-tooltip-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsAutoComplete from './ids-autocomplete';
import IdsElement from '../../core/ids-element';

const Base = IdsTooltipMixin(
  IdsLocaleMixin(
    IdsLabelStateMixin(
      IdsFieldHeightMixin(
        IdsDirtyTrackerMixin(
          IdsClearableMixin(
            IdsColorVariantMixin(
              IdsMaskMixin(
                IdsValidationMixin(
                  IdsKeyboardMixin(
                    IdsThemeMixin(
                      IdsEventsMixin(
                        IdsAutoComplete(
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
    )
  )
);

export default Base;
