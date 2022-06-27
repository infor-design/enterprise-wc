import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';
import IdsPagerMixin from '../../mixins/ids-pager-mixin/ids-pager-mixin';

const Base = IdsLocaleMixin(
  IdsThemeMixin(
    IdsPagerMixin(
      IdsKeyboardMixin(
        IdsEventsMixin(
          IdsElement
        )
      )
    )
  )
);

export default Base;
