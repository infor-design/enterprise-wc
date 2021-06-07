import wait from './wait';
import processAnimFrame from './process-anim-frame';

const MOUSE_LEFT = 0b001;

/**
 * simulate a 'mousedown' followed by 'mouseup' with optional time delay
 * (considers a marginal extra for natural callback/anim frame cycle between
 * events)
 *
 * @param {HTMLElement} element increment or decrement button
 */
export default async function simulateMouseDownEvents({
  element,
  buttons = MOUSE_LEFT,
  mouseDownTime = 0
}) {
  const downEvent = new MouseEvent('mousedown', { view: window, buttons });
  const upEvent = new MouseEvent('mouseup', { view: window });

  element.dispatchEvent(downEvent);
  await processAnimFrame();
  await wait(mouseDownTime);

  element.dispatchEvent(upEvent);
  await processAnimFrame();
}
