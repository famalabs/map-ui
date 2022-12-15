"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefault = exports.isValidField = exports.isValidName = exports.isId = exports.MAX_ITEMS_DEPTH = exports.MAX_FIELD_SIZE = void 0;
const ALLOW_CUSTOM_ID = false;
const NAME_REGEX = /^[\w-]{1,16}$/;
exports.MAX_FIELD_SIZE = 16384;
exports.MAX_ITEMS_DEPTH = 1024;
function isId(id) {
    return ((!isNaN(Number(id)) && Number(id) % 1 === 0) ||
        (ALLOW_CUSTOM_ID && typeof id === 'string' && id.match(NAME_REGEX)));
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
function isDefault(value, defaultValue) {
    return (value === undefined ||
        (typeof defaultValue === 'function'
            ? defaultValue(value)
            : value === defaultValue));
}
exports.isDefault = isDefault;
//# sourceMappingURL=config.js.map