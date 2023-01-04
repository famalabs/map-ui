"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Age = void 0;
const functions_1 = require("./functions");
/**
 * Computes the age at a given date
 * @param birth_date
 * @param at given date, defaults to now
 * @returns the age
 */
function Age(birth_date, at) {
    birth_date = new Date(birth_date);
    at = at === undefined ? new Date() : new Date(at);
    return new Date(at.getTime() - birth_date.getTime()).getFullYear() - 1970;
}
exports.Age = Age;
functions_1.registerFn(Age, 'age');
//# sourceMappingURL=common.js.map