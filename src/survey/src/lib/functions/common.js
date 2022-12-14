"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Age = void 0;
const functions_1 = require("./functions");
/**
 * This function returns the age, given the birth date
 * @param birth_date, the birth date
 * @returns the age
 */
function Age(birth_date) {
    if (birth_date) {
        let age = 0;
        const today = new Date();
        age = today.getFullYear() - birth_date.getFullYear();
        const m = today.getMonth() - birth_date.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth_date.getDate())) {
            age--;
        }
        return age;
    }
}
exports.Age = Age;
functions_1.registerFn(Age, 'age');
//# sourceMappingURL=common.js.map