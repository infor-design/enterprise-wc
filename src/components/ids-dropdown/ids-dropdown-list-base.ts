import IdsFieldHeightMixin from '../../mixins/ids-field-height-mixin/ids-field-height-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsPickerPopup from '../ids-picker-popup/ids-picker-popup';
import IdsDropdownAttributeMixin from './ids-dropdown-attributes-mixin';

const Base = IdsDropdownAttributeMixin(
  IdsLocaleMixin(
    IdsFieldHeightMixin(
      IdsPickerPopup
    )
  )
);

export default Base;
