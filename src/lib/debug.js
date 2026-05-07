const isDev = import.meta.env.DEV;

export const debug = isDev ? console.log.bind(console, '[festify]') : () => {};
export const debugWarn = isDev ? console.warn.bind(console, '[festify]') : () => {};
export const debugError = console.error.bind(console, '[festify]');
