import IdsAccordion from '../ids-accordion/ids-accordion';
import IdsAccordionHeader from '../ids-accordion/ids-accordion-header';
import IdsDrawer from '../ids-drawer/ids-drawer';

export default class IdsAppMenu extends IdsDrawer {
  /** reference to an optionally-slotted IdsAccordion element */
  readonly accordion?: IdsAccordion;

  /** true if there is currently a filter applied to the inner navigation accordion */
  readonly isFiltered: boolean;

  /** performs a filter operation on the navigation accordion's headers */
  filterAccordion(value?: string): Array<IdsAccordionHeader>;

  /** clears the navigation accordion's previous filter result */
  clearFilterAccordion(): void;
}
