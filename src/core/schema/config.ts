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

// Layout
export const DEFAULT_LAYOUT_STYLE = "";

// Question
export const DEFAULT_OPTIONS_REQUIRED = false;

// QuestionCheck
export const DEFAULT_OPTIONS_INVERTED = false;
export const DEFAULT_OPTIONS_TOGGLE = false;

// QuestionText
export const DEFAULT_OPTIONS_TEXT_MIN = 0;
export const DEFAULT_OPTIONS_TEXT_MAX = MAX_FIELD_SIZE;

// QuestionNumber
export const DEFAULT_OPTIONS_NUM_MIN = -Infinity;
export const DEFAULT_OPTIONS_NUM_MAX = +Infinity;
export const DEFAULT_OPTIONS_NUM_STEP = 0;

// QuestionDate
export const DEFAULT_OPTIONS_DATE_MIN = -Infinity;
export const DEFAULT_OPTIONS_DATE_MAX = +Infinity;

// QuestionSelect
// export const DEFAULT_OPTIONS_CUSTOM = false;
export function DEFAULT_OPTIONS_ACTIVATE(value) {
  return !(value instanceof Array && value.length > 0);
}

export function isDefault(value, defaultValue) {
  return value === undefined || (typeof defaultValue === 'function' ? defaultValue(value) : (value === defaultValue));
}
