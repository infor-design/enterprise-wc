import '../../ids-accordion/ids-accordion';
import '../../ids-button/ids-button';
import '../../ids-header/ids-header';
import '../../ids-toolbar/ids-toolbar';
import '../../ids-module-nav/ids-module-nav';
import '../ids-loading-indicator';
import type IdsButton from '../../ids-button/ids-button';
import type IdsLoadingIndicator from '../ids-loading-indicator';
import css from '../../../assets/css/ids-loading-indicator/index.css';

// Setup demo styles
const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head')?.insertAdjacentHTML('afterbegin', cssLink);

// Setup App Nav and Headser
const moduleNav: any = document.querySelector('ids-module-nav');
const appMenuTriggerBtn: IdsButton | null = document.querySelector<IdsButton>('#module-nav-trigger');

appMenuTriggerBtn?.addEventListener('click', () => {
  moduleNav.displayMode = moduleNav.displayMode === 'collapsed' ? 'expanded' : 'collapsed';
});

document.querySelector('#stop-button')?.addEventListener('click', () => {
  document.querySelector<IdsLoadingIndicator>('ids-loading-indicator')?.toggleAttribute('stopped');
});
