import IdsDataSource from '../../core/ids-data-source';
import IdsPager from '../../components/ids-pager/ids-pager';

/**
/**
 * A mixin that adds pager functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
export class IdsPagerMixin {
  /**
   * Gets the internal IdsDataSource object
   */
  datasource: IdsDataSource;

  /**
   * Gets the interal IdsPager component
   */
  pager: IdsPager;

  /**
   * Get the page-number attribute
   */
  pageNumber: number;

  /**
   * Get the page-size attribute
   */
  pageSize: number;

  /**
   * Get the page-total attribute
   */
  pageTotal: number;

  /**
   * Gets the pagination attribute
   */
  pagination: 'none' | 'client-side' | 'server-side' | 'standalone';
}
