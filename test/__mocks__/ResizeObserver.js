/**
 * mocks ResizeObserver to use within our Jest environment
 */
class ResizeObserver {
  observe() {
    // do nothing
  }

  unobserve() {
    // do nothing
  }

  disconnect() {
    // do nothing
  }
}

window.ResizeObserver = ResizeObserver;

export default ResizeObserver;
