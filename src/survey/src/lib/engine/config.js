"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefault = exports.isValidField = exports.isValidName = exports.isId = exports.MAX_ITEMS_DEPTH = exports.MAX_ITEMS_COUNT = exports.MAX_FIELD_SIZE = void 0;
const NAME_REGEX = /^[\w-]{1,16}$/;
exports.MAX_FIELD_SIZE = 512;
exports.MAX_ITEMS_COUNT = 1024;
exports.MAX_ITEMS_DEPTH = 128;
function isId(id) {
    return !isNaN(Number(id)) && Number(id) % 1 === 0;
}
exports.isId = isId;
function isValidName(name) {
    return NAME_REGEX.test(name);
}
exports.isValidName = isValidName;
function isValidField(field) {
    return field.length < exports.MAX_FIELD_SIZE;
}
exports.isValidField = isValidField;
function isDefault(value, defaultValue = undefined) {
    return typeof defaultValue === 'function'
        ? defaultValue(value)
        : value === defaultValue;
}
exports.isDefault = isDefault;
//# sourceMappingURL=config.js.map