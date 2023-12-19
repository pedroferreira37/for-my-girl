export const compose =
	(...fns) =>
	(...args) =>
		fns.reduce((acc, fn) => fn(acc), ...args);
