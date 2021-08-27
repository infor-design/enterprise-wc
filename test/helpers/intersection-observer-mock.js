/**
 * mocks IntersectionObserver to use within our Jest environment
 */
class IntersectionObserver {
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

export default IntersectionObserver;
