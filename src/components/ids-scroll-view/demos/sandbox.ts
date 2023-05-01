import '../../ids-button/ids-button';
import '../../ids-checkbox/ids-checkbox';
import '../../ids-layout-flex/ids-layout-flex';

import camera1 from '../../../assets/images/camera-1.png';
import camera2 from '../../../assets/images/camera-2.png';
import camera3 from '../../../assets/images/camera-3.png';
import camera4 from '../../../assets/images/camera-4.png';
import camera5 from '../../../assets/images/camera-5.png';
import camera6 from '../../../assets/images/camera-6.png';

document.addEventListener('DOMContentLoaded', () => {
  const qs = (sel: string) => document.querySelector(sel);

  qs('.camera-1')?.setAttribute('src', camera1);
  qs('.camera-2')?.setAttribute('src', camera2);
  qs('.camera-3')?.setAttribute('src', camera3);
  qs('.camera-4')?.setAttribute('src', camera4);
  qs('.camera-5')?.setAttribute('src', camera5);
  qs('.camera-6')?.setAttribute('src', camera6);

  const demoEl: any = qs('#scroll-view-api-demo');
  if (demoEl) {
    qs('#btn-first')?.addEventListener('click', () => demoEl.first());
    qs('#btn-previous')?.addEventListener('click', () => demoEl.previous());
    qs('#btn-next')?.addEventListener('click', () => demoEl.next());
    qs('#btn-last')?.addEventListener('click', () => demoEl.last());
    qs('#btn-toggle')?.addEventListener('click', () => demoEl.toggle());

    qs('#cb-auto')?.addEventListener('change', (e: any) => {
      demoEl.autoPlay = e?.detail?.checked;
    });
    qs('#cb-loop')?.addEventListener('change', (e: any) => {
      demoEl.loop = e?.detail?.checked;
    });
    qs('#cb-loop-reverse')?.addEventListener('change', (e: any) => {
      demoEl.loopReverse = e?.detail?.checked;
    });
    qs('#cb-suppress-controls')?.addEventListener('change', (e: any) => {
      demoEl.suppressControls = e?.detail?.checked;
    });
    qs('#cb-show-tooltip')?.addEventListener('change', (e: any) => {
      demoEl.showTooltip = e?.detail?.checked;
    });
  }
});
