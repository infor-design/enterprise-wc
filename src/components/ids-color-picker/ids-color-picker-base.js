import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsPopupOpenEventsMixin from '../../mixins/ids-popup-open-events-mixin/ids-popup-open-events-mixin';
import IdsTriggerField from '../ids-trigger-field/ids-trigger-field';

const Base = IdsPopupOpenEventsMixin(
  IdsLocaleMixin(IdsTriggerField)
);

export default Base;
