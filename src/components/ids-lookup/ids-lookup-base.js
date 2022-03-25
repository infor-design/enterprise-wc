import IdsDirtyTrackerMixin from '../../mixins/ids-dirty-tracker-mixin/ids-dirty-tracker-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsTooltipMixin from '../../mixins/ids-tooltip-mixin/ids-tooltip-mixin';
import IdsAutocompleteMixin from '../../mixins/ids-autocomplete-mixin/ids-autocomplete-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsDirtyTrackerMixin(
  IdsLocaleMixin(
    IdsKeyboardMixin(
      IdsTooltipMixin(
        IdsThemeMixin(
          IdsAutocompleteMixin(
            IdsEventsMixin(
              IdsElement
            )
          )
        )
      )
    )
  )
);

export default Base;
