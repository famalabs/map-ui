/**
 * This function returns the function registered with fnName
 * @param fnName the name used to register the function
 * @returns the function registered with fnName or null if none is found
 */
export declare function getFn(fnName: string): Function;
/**
 * This function registers a new function with the specified name
 * @param fn the function to register
 * @param fnName the name to use
 */
export declare function registerFn(fn: Function, ...fnName: string[]): void;
