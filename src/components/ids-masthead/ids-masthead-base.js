import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsHeader from '../ids-header/ids-header';

const Base = IdsThemeMixin(
  IdsKeyboardMixin(
    IdsEventsMixin(
      IdsHeader
    )
  )
);

export default Base;
