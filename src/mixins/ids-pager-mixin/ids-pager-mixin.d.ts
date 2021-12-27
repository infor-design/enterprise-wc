import IdsDataSource from '../../core/ids-data-source';
import IdsPager from '../../components/ids-pager/ids-pager';

/**
/**
 * A mixin that adds pager functionality to components
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
export class IdsPagerMixin {
  datasource: IdsDataSource;

  pager: IdsPager;

  pageNumber: number;

  pageSize: number;

  pageTotal: number;

  pagination: 'none' | 'client-side' | 'server-side' | 'standalone';
}
