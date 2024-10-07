import { checkRegEx } from '../../validators';

/**
 * Check if the password has at least a maiusc letter, a minusc letter and a number (we're not checking length here)
 */
export const checkStrongPsw = (psw: string) => checkRegEx(/^\d*[a-zA-Z](?=.*\d)[a-zA-Z0-9]*$/)(psw);

/**
 * Check if the password as at least 8 characters
 */
export const checkPswLength = (psw: string) => psw.length >= 8;
