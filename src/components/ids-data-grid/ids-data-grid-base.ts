import IdsElement from '../../core/ids-element';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsPagerMixin from '../../mixins/ids-pager-mixin/ids-pager-mixin';
import IdsDataGridTooltipMixin from './ids-data-grid-tooltip-mixin';

const Base = IdsThemeMixin(
  IdsPagerMixin(
    IdsDataGridTooltipMixin(
      IdsKeyboardMixin(
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
