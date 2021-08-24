import { IdsRenderLoop } from './ids-render-loop';

// Stores the global RenderLoop instance.
// If access to the RenderLoop directly is needed, app developers should use this
// single instance and NOT construct another RenderLoop.
/** @type {any} */
const renderLoop = new IdsRenderLoop();

export default renderLoop;
export { IdsRenderLoop };
