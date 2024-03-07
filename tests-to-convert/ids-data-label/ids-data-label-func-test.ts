/**
 * @jest-environment jsdom
 */
import IdsDataLabel from '../../src/components/ids-data-label/ids-data-label';
import IdsContainer from '../../src/components/ids-container/ids-container';
import waitForTimeout from '../helpers/wait-for-timeout';
import frMessages from '../../src/components/ids-locale/data/fr-messages.json';

describe('IdsDataLabel Component', () => {
  let dataLabel: IdsDataLabel;
  let container: IdsContainer;

  beforeEach(async () => {
    container = new IdsContainer();
    container.localeAPI.loadedLanguages.set('fr', frMessages);

    dataLabel = new IdsDataLabel();
    dataLabel.innerHTML = `Los Angeles, California 90001 USA`;
    dataLabel.label = 'Address';
    container.appendChild(dataLabel);
    document.body.appendChild(container);
    await container.localeAPI.setLanguage('en');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });
});
