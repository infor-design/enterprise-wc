// Supporting components
import '../ids-input';
import '../../ids-button/ids-button';
import '../../ids-splitter/ids-splitter';
import type IdsInput from '../ids-input';
import type IdsSplitter from '../../ids-splitter/ids-splitter';

const corporateIpsum = [
  'We thrive because of our next-generation milestone and unparalleled game changer culture.',
  'In the platform space, industry is iteratively relaying its end-to-end drivers.',
  'Key players will take ownership of their ballpark figures by conservatively virtualising innovative diversities.',
  'Efficiencies will come from virtually investing our blockchains.',
  'Our World-Class Executive Search solution offers user experiences a suite of cloud native offerings.',
  'Globally touching base about productizing alignments will make us leaders in the best-of-breed brand industry.',
  'Going forward, our senior low hanging fruit will deliver value to products.',
  'In the standpoint space, industry is dynamically integrating its corporate smart contracts.',
  'We use our customer-focused organic growths to proactively manage our imagineering expectations.',
  'Is your enterprise prepared for company-wide prince2 practitioner growth?',
  'Is your digital nomad prepared for mission critical standard setter growth?',
  'Our stand-up development lifecycle enables proactive, best-in-class growth hackers.',
];

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector<IdsInput>('#p1')?.style?.setProperty('overflow', 'visible');
  document.querySelector<IdsInput>('#p2')?.style?.setProperty('overflow', 'visible');
  document.querySelector<IdsInput>('#p2')?.style?.setProperty('padding-left', '70px');

  const inputsLeft = [...document.querySelectorAll<IdsInput>('#p1 ids-input')];
  const inputsRight = [...document.querySelectorAll<IdsInput>('#p2 ids-input')];
  const splitter: any = document.querySelector<IdsSplitter>('ids-splitter');

  splitter?.addEventListener('sizechanged', (e: CustomEvent) => {
    console.info('sizechanged', e.detail);
    const { splitBar } = e.detail;
    const width = splitBar?.getBoundingClientRect().x;
    if (width) {
      inputsLeft.map((input: IdsInput, idx: number) => {
        input.value = corporateIpsum[idx]; // .substring(0, 20);
        input.style.setProperty('width', `${width - 100}px`);
      });

      inputsRight.map((input: IdsInput, idx: number) => {
        input.value = corporateIpsum[idx]; // .substring(0, 20);
        input.style.setProperty('width', `${window.innerWidth - (width + 100)}px`);
      });
    }
  });
});
