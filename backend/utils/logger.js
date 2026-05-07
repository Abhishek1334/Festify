const isProd = process.env.NODE_ENV === 'production';

const noop = () => {};

export const log = isProd ? noop : console.log.bind(console, '[festify]');
export const warn = isProd ? noop : console.warn.bind(console, '[festify]');
export const error = console.error.bind(console, '[festify]');
