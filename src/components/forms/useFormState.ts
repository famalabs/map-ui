import React from 'react';

//type FormType = 'node' | 'group' | 'array';
//type FormNodeValue = 'string' | 'number' | 'bool';
export type FormNodeType = string | number | boolean;

export type FormNodeValidator<T extends FormNodeType> = {
  id?: string;
  f: (value?: T) => boolean;
  message?: string;
};

interface FormNodeBase<T extends FormNodeType> {
  validators?: FormNodeValidator<T>[];
  type: 'node';
  required?: boolean;
}
interface FormNodeString extends FormNodeBase<string> {
  value: 'string';
}
interface FormNodeNumber extends FormNodeBase<number> {
  value: 'number';
}
interface FormNodeBool extends FormNodeBase<boolean> {
  value: 'bool';
}
type FormNode = FormNodeString | FormNodeNumber | FormNodeBool;

interface FormGroup {
  type: 'group';
  value: {
    [id: string]: FormNode | FormGroup | FormArray;
  };
}

interface FormArrayBase<T extends FormNode | FormGroup> {
  type: 'array';
  value: T;
}
type FormArrayNode = FormArrayBase<FormNode>;
type FormArrayGroup = FormArrayBase<FormGroup>;
type FormArray = FormArrayNode | FormArrayGroup;

export type Form = FormNode | FormArray | FormGroup;

type InferFormNodeValue<T extends FormNode> = T extends FormNodeString
  ? string
  : T extends FormNodeNumber
  ? number
  : T extends FormNodeBool
  ? boolean
  : never;
type InferFormNodePartialValue<T extends FormNode> = InferFormNodeValue<T> | undefined;

type InferFormGroupValue<T extends FormGroup> = {
  [Prop in keyof T['value']]: InferFormValue<T['value'][Prop]>;
};
type InferFormGroupPartialValue<T extends FormGroup> = {
  [Prop in keyof T['value']]+?: InferFormPartialValue<T['value'][Prop]>;
};

type InferFormArrayValue<T extends FormArray> = Array<InferFormValue<T['value']>>;
type InferFormArrayPartialValue<T extends FormArray> = Array<InferFormPartialValue<T['value']>>;

type InferFormValue<T extends Form> = T extends FormNode
  ? InferFormNodeValue<T>
  : T extends FormGroup
  ? InferFormGroupValue<T>
  : T extends FormArray
  ? InferFormArrayValue<T>
  : never;

type InferFormPartialValue<T extends Form> = T extends FormNode
  ? InferFormNodePartialValue<T>
  : T extends FormGroup
  ? InferFormGroupPartialValue<T>
  : T extends FormArray
  ? InferFormArrayPartialValue<T>
  : never;

type InferFormNodeValidator<T extends FormNode> = T extends FormNodeString
  ? FormNodeValidator<string>[]
  : T extends FormNodeNumber
  ? FormNodeValidator<number>[]
  : T extends FormNodeBool
  ? FormNodeValidator<boolean>[]
  : never;

type InferFormValidator<T extends Form> = T extends FormNode
  ? InferFormNodeValidator<T>
  : T extends FormGroup
  ? {
      [Prop in keyof T['value']]: InferFormValidator<T['value'][Prop]>;
    }
  : T extends FormArray
  ? InferFormValidator<T['value']>
  : never;

type InferFormRequired<T extends Form> = T extends FormNode
  ? boolean
  : T extends FormGroup
  ? {
      [Prop in keyof T['value']]: InferFormRequired<T['value'][Prop]>;
    }
  : T extends FormArray
  ? InferFormRequired<T['value']>
  : never;

type InferFormSetValue<T extends Form> = T extends FormNode
  ? (value: InferFormNodeValue<T>) => void
  : T extends FormGroup
  ? {
      [Prop in keyof T['value']]: InferFormSetValue<T['value'][Prop]>;
    }
  : T extends FormArray
  ? {
      setAll: (value: InferFormArrayPartialValue<T>) => void;
      set: (index: number) => InferFormSetValue<T['value']>;
      add: (value?: InferFormPartialValue<T['value']>) => void;
      remove: (index: number) => void;
    }
  : never;

type InferFormIsValid<T extends Form> = T extends FormNode
  ? boolean
  : T extends FormGroup
  ? { allValid: boolean; children: { [Prop in keyof T['value']]: InferFormIsValid<T['value'][Prop]> } }
  : T extends FormArray
  ? { allValid: boolean; children: { [index: number]: InferFormIsValid<T['value']> } }
  : never;

function formIsNode(form: Form): form is FormNode {
  return form.type === 'node';
}
function nodeIsString(form: FormNode): form is FormNodeString {
  return form.value === 'string';
}
function formIsArray(form: Form): form is FormArray {
  return form.type === 'array';
}
function formIsGroup(form: Form): form is FormGroup {
  return form.type === 'group';
}

function initFormValidator<T extends Form>(form: T): InferFormValidator<T> {
  if (formIsNode(form)) return form.validators || ([] as any);
  if (formIsArray(form)) return initFormValidator(form.value) as any;
  if (formIsGroup(form))
    return Object.entries(form.value).reduce(
      (state, [key, subform]) => ({ ...state, [key]: initFormValidator(subform) }),
      {}
    ) as any;
  throw Error('Wrong form type');
}

function initFormRequired<T extends Form>(form: T): InferFormRequired<T> {
  if (formIsNode(form)) return !!form.required as any;
  if (formIsArray(form)) return initFormRequired(form.value) as any;
  if (formIsGroup(form))
    return Object.entries(form.value).reduce(
      (state, [key, subform]) => ({ ...state, [key]: initFormRequired(subform) }),
      {}
    ) as any;
  throw Error('Wrong form type');
}

function initFormSetValue<T extends Form>(
  form: T,
  updateValues: (update: (old: InferFormValue<T>) => InferFormValue<T>) => void
): InferFormSetValue<T> {
  if (formIsNode(form))
    return ((value: InferFormNodeValue<typeof form>) => updateValues(() => value as any)) as any;
  if (formIsArray(form))
    return {
      setAll: (value: InferFormArrayPartialValue<typeof form>) => updateValues(() => value as any),
      set: (index: number) =>
        initFormSetValue(form.value, (update) =>
          updateValues(
            (old: InferFormValue<typeof form>) =>
              [].concat(old.slice(0, index), update(old[index]), old.slice(index + 1)) as any
          )
        ),
      add: (value?: InferFormPartialValue<typeof form.value>) =>
        updateValues(
          (old: InferFormValue<typeof form>) =>
            [].concat(old, mergeValueUpdates<typeof form.value>(initFormValues(form.value), value)) as any
        ),
      remove: (index: number) =>
        updateValues(
          (old: InferFormValue<typeof form>) => [].concat(old.slice(0, index), old.slice(index + 1)) as any
        ),
    } as any; //initFormSetValue(form.value) as any;
  if (formIsGroup(form))
    return Object.entries(form.value).reduce(
      (state, [key, subform]) => ({
        ...state,
        [key]: initFormSetValue(subform, (update) =>
          updateValues((old: InferFormValue<typeof form>) => ({ ...(old as any), [key]: update(old[key]) }))
        ),
      }),
      {}
    ) as any;
  throw Error('Wrong form type');
}

function initFormIsValid<T extends Form>(
  form: T,
  value: InferFormValue<T>,
  requires: InferFormRequired<T>,
  validators: InferFormValidator<T>
): InferFormIsValid<T> {
  if (formIsNode(form) && Array.isArray(validators))
    return (
      (!requires || (value != null && value !== '')) &&
      (validators.map((validator) => validator.f(value)).every((val) => val) as any)
    );
  if (formIsArray(form) && Array.isArray(value)) {
    const children = value.map((v) => initFormIsValid(form.value, v, requires, validators));
    return {
      allValid: formIsNode(form.value)
        ? children.every((valid: any) => valid)
        : formIsGroup(form.value)
        ? children.every((group: any) => group.allValid)
        : null,
      children,
    } as any;
  }
  if (formIsGroup(form)) {
    const children = Object.entries(form.value).reduce(
      (state, [key, subform]) => ({
        ...state,
        [key]: initFormIsValid(subform, value[key], requires[key], validators[key]),
      }),
      {}
    ) as any;
    return {
      allValid: Object.entries(children).every(([key, valid]: [string, any]) =>
        typeof valid === 'boolean' ? valid : valid.allValid
      ),
      children,
    } as any;
  }
  throw Error('Wrong form or value type');
}

function initFormValues<T extends Form>(form: T): InferFormValue<T> {
  if (formIsNode(form)) {
    if (nodeIsString(form)) return '' as any;
    return null;
  }
  if (formIsArray(form)) return [] as any;
  if (formIsGroup(form))
    return Object.entries(form.value).reduce(
      (state, [key, subform]) => ({ ...state, [key]: initFormValues(subform) }),
      {}
    ) as any;
  throw Error('Wrong form type');
}

function mergeValueUpdates<T extends Form>(
  state: InferFormValue<T>,
  changes: InferFormPartialValue<T>
): InferFormValue<T> {
  if (changes === undefined) return state;
  if (changes === null) return null;
  if (Array.isArray(changes)) return changes as any;
  if (typeof changes === 'string' || typeof changes === 'number' || typeof changes === 'boolean')
    return changes as any;
  if (typeof changes === 'object' && typeof state === 'object')
    return Object.entries(changes).reduce(
      (old, [key, value]) => ({ ...(old as any), [key]: mergeValueUpdates(old[key], value as any) }),
      state
    );
  throw Error('Wrong changes');
}

/**
 * Use this hook for complex form data management
 */
export default function useFormState<T extends Form>(form: T, initValue?: InferFormPartialValue<T>) {
  const validators: InferFormValidator<T> = React.useMemo(() => initFormValidator(form), []);
  const requires: InferFormRequired<T> = React.useMemo(() => initFormRequired(form), []);
  const [Value, setValueDict] = React.useState<InferFormValue<T>>(
    mergeValueUpdates(initFormValues(form), initValue)
  );

  const updatePartial = React.useCallback(
    (changes: InferFormPartialValue<T>) => setValueDict((old) => mergeValueUpdates(old, changes)),
    []
  );
  const setValue = React.useMemo(() => initFormSetValue(form, setValueDict), []);

  const Valid = React.useMemo(() => initFormIsValid(form, Value, requires, validators), [Value]);

  return {
    Value,
    Valid,
    updatePartial,
    setValue,
    validators,
    requires,
  };
}
