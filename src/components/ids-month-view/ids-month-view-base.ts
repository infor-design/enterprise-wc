import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsDateAttributeMixin from '../../mixins/ids-date-attribute-mixin/ids-date-attribute-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsCalendarEventsMixin from '../../mixins/ids-calendar-events-mixin/ids-calendar-events-mixin';
import IdsElement from '../../core/ids-element';
import IdsMonthViewAttributeMixin from './ids-month-view-attribute-mixin';

const Base = IdsMonthViewAttributeMixin(
  IdsDateAttributeMixin(
    IdsCalendarEventsMixin(
      IdsThemeMixin(
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
