/**
 * Extremely minimal controller for testing
 * standalone-css on selections as items change;
 * this is not meant as production ready example
 * or indicative of best practices for your
 * application
 */
class TabController {
  constructor(idsTabsElement) {
    this.tabContainers = [...idsTabsElement.querySelectorAll('.ids-tab-container')];
    this.tabContainers?.[0]?.focus();

    this.tabContainers?.forEach?.((t, i) => {
      t.addEventListener('click', () => { this.selectedIndex = i; });
    });

    this.selectedIndex = 0;
  }

  tabContainers = [];

  #selectedIndex = -1;

  set selectedIndex(value) {
    this.#selectedIndex = Math.max(0, Math.min(parseInt(value), this.tabContainers.length - 1));

    const prevValue = this.tabContainers.findIndex(
      (t) => t.children[0].classList.contains('selected')
    );

    if (prevValue === this.#selectedIndex) {
      return;
    }

    if (prevValue > -1) {
      const tabContainer = this.tabContainers[prevValue];
      tabContainer.children[0].classList.remove('selected');
      if (this.tabContainers[0].parentElement.getAttribute('orientation') !== 'vertical') {
        const underlineDiv = tabContainer.querySelector('.selection-underline');
        if (underlineDiv) {
          tabContainer.children[0].removeChild(underlineDiv);
        }
      }
    }

    this.tabContainers[this.#selectedIndex].children[0].focus?.();
    this.tabContainers[this.#selectedIndex].children[0].classList.add('selected');

    if (this.tabContainers[0].parentElement.getAttribute('orientation') === 'vertical') {
      return;
    }

    const underlineDiv = document.createElement('div');
    underlineDiv.classList.add('selection-underline');
    this.tabContainers[this.#selectedIndex].children[0].appendChild(underlineDiv);
  }

  get selectedIndex() {
    return this.#selectedIndex;
  }
}

window.addEventListener('load', () => {
  [...document.querySelectorAll('.ids-tabs-container')]
    .forEach((tC) => new TabController(tC));
});
