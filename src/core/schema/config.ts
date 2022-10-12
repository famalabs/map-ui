const ALLOW_CUSTOM_ID = false;

export function isId(id) {
  return (!isNaN(Number(id)) && (Number(id) % 1 === 0))
    || (ALLOW_CUSTOM_ID && typeof id === 'string' && id.match(NAME_REGEX));
}

const NAME_REGEX = /^[\w-]{1,16}$/;

export function isValidName(name) {
  return isNaN(name) && typeof name === 'string' && name.match(NAME_REGEX);
}

export const MAX_FIELD_SIZE = 16384;

export function isValidField(field) {
  return typeof field === 'string' && field.length < MAX_FIELD_SIZE;
}

export const MAX_ITEMS_DEPTH = 1024;

export function isDefault(value, defaultValue) {
  return value === undefined || (typeof defaultValue === 'function' ? defaultValue(value) : (value === defaultValue));
}
