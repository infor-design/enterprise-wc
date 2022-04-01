import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsModal from '../ids-modal/ids-modal';

const Base = IdsThemeMixin(
  IdsKeyboardMixin(
    IdsEventsMixin(
      IdsModal
    )
  )
);

export default Base;
