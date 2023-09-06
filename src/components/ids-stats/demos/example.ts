/* eslint-disable import/no-duplicates */
import '../../ids-home-page/ids-home-page';
import '../ids-stats';
import IdsStats from '../ids-stats';

document.querySelector<IdsStats>('#stat-ac-two')!.kpiFormat = {
  notation: 'compact',
  compactDisplay: 'short',
  style: 'currency',
  currency: 'USD'
};

document.querySelector<IdsStats>('#stat-ac-three')!.trendFormat = {
  style: 'percent',
  signDisplay: 'exceptZero',
  minimumFractionDigits: 2
};

document.querySelector<IdsStats>('#stat-nac-one')!.kpiFormat = {
  style: 'percent',
  minimumFractionDigits: 2
};

document.querySelector<IdsStats>('#stat-nac-two')!.kpiFormat = {
  notation: 'compact',
  compactDisplay: 'short',
  style: 'currency',
  currency: 'USD'
};

document.querySelector<IdsStats>('#stat-int-one')!.kpiFormat = {
  notation: 'compact',
  compactDisplay: 'short',
  style: 'currency',
  currency: 'USD'
};

document.querySelector<IdsStats>('#stat-int-three')!.trendFormat = {
  style: 'percent',
  signDisplay: 'exceptZero',
  minimumFractionDigits: 2
};

document.querySelector<IdsStats>('#stat-card-one')!.trendFormat = {
  style: 'percent',
  signDisplay: 'exceptZero',
  minimumFractionDigits: 2
};

document.querySelector<IdsStats>('#stat-card-two')!.kpiFormat = {
  notation: 'compact',
  compactDisplay: 'short',
  style: 'currency',
  currency: 'USD'
};

document.querySelector<IdsStats>('#stat-card-four')!.trendFormat = {
  style: 'percent',
  signDisplay: 'exceptZero',
  minimumFractionDigits: 2
};
