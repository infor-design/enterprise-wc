import IdsDateAttributeMixin from '../../mixins/ids-date-attribute-mixin/ids-date-attribute-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsPickerPopup from '../ids-picker-popup/ids-picker-popup';

const Base = IdsDateAttributeMixin(
  IdsLocaleMixin(
    IdsKeyboardMixin(
      IdsPickerPopup
    )
  )
);

export default Base;
