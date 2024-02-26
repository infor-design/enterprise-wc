import '../ids-month-year-picklist';
import type IdsMonthYearPicklist from '../ids-month-year-picklist';

const monthYearPicklist = document.querySelector<IdsMonthYearPicklist>('ids-month-year-picklist');

monthYearPicklist?.activatePicklist();
// Just to make the picklist taller for the standalone example
monthYearPicklist?.style.setProperty('height', '300px');
