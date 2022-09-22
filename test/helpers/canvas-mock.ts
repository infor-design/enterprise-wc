/**
 * Mocks Canvas getContext('2d') to use within our Jest environment
 */
const getContext2D: any = jest.fn(() => ({
  measureText: jest.fn(() => ({ width: 0 }))
}));

HTMLCanvasElement.prototype.getContext = getContext2D;

export default getContext2D;
