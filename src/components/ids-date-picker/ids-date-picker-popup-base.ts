import IdsMonthViewAttributeMixin from '../ids-month-view/ids-month-view-attribute-mixin';
import IdsDateAttributeMixin from '../../mixins/ids-date-attribute-mixin/ids-date-attribute-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsPickerPopup from '../ids-picker-popup/ids-picker-popup';

const Base = IdsMonthViewAttributeMixin(
  IdsDateAttributeMixin(
    IdsLocaleMixin(
      IdsPickerPopup
    )
  )
);

export default Base;
