/** prevents a function that runs on intervals from running too frequently */
declare function debounce(func: CallableFunction, duration?: number, execAsap?: boolean): void;

export default debounce;
