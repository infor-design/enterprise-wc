import '../../ids-text/ids-text';
import '../ids-tabs';

document.addEventListener('DOMContentLoaded', () => {
  const tabContents = [
    `<ids-tab-content value="contracts">
      <ids-layout-grid auto-fit="true" padding="sm">
        <ids-text font-size="16" type="p">Facilitate cultivate monetize, seize e-services peer-to-peer content integrateAJAX-enabled user-centric strategize. Mindshare; repurpose integrate global addelivery leading-edge frictionless, harness real-time plug-and-play standards-compliant 24/7 enterprise strategize robust infomediaries: functionalities back-end. Killer disintermediate web-enabled ubiquitous empower relationships, solutions, metrics architectures.</ids-text>
      </ids-layout-grid>
    </ids-tab-content>`,
    `<ids-tab-content value="opportunities">
      <div class="tab-content">
        <ids-layout-grid auto-fit="true" padding="sm">
          <ids-text font-size="16" type="p">
            Bricks-and-clicks? Evolve ubiquitous matrix B2B 24/365 vertical 24/365 platforms standards-compliant global leverage dynamic 24/365 intuitive ROI seamless rss-capable. Cutting-edge grow morph web services leverage; ROI, unleash reinvent innovative podcasts citizen-media networking.
          </ids-text>
        </ids-layout-grid>
      </div>
    </ids-tab-content>`
  ];

  tabContents.forEach((tabContent) => {
    const tabContext = document.querySelector('ids-tabs-context');
    tabContext?.insertAdjacentHTML('beforeend', tabContent);
  });
});
