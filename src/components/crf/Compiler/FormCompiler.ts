import { Form, useFormState } from "../../../components/forms";
import { QuestionNumber, Survey, SurveyItem } from "../../../core/schema";
import React from "react";
import { INavState, useNavState } from "../Navigation";

export interface IFormCompiler {
  getValue: (id:string) => any;
  getSetValue: (id:string) => any;
  getRequired: (id:string) => boolean;
  getShowError: (id:string) => boolean;
  getValid: (id:string) => boolean;
  getValidObj: (id:string) => any;
  getRoot: () => SurveyItem;
  submitForm: (e: React.FormEvent<HTMLFormElement>) => void;
}

// export class FormCompiler implements IFormCompiler {
  
//   private survey:Survey;
//   private root:SurveyItem;

//   public constructor(survey:Survey) {
//     this.survey = survey;
//     this.root = survey.root;
//   }

//   public getRoot():SurveyItem { return this.root; }
//   submitForm: (e: React.FormEvent<HTMLFormElement>) => void;
// }

export interface IUseFormCompiler {
  form:IFormCompiler;
  nav:INavState; 
}

export function useFormCompiler(survey:Survey) {

  const [showAllErrors, setShowAllErrors] = React.useState(false);
  const { Value, setValue, validators, requires, Valid } = useFormState(
    survey.toUseFormState() as Form
  );
  const onSubmit = (answers, allValid) => console.log(answers);
  const nav = useNavState(survey.root);

  const getObjectValue = (obj:any, id:string):any => {
    const ids = nav.getIdsToId(id);
    let val = obj;
    for (let i = 0; i < ids.length; i++) {
      val = val[ids[i]]
    }
    return val[id];

  }

  const getValue = (id:string) => getObjectValue(Value, id);
  const getSetValue = (id:string) => getObjectValue(setValue, id);
  const getRequired = (id:string) => getObjectValue(requires, id);
  const getValid = (id:string) => {
    if (typeof Valid === 'boolean') {
      return Valid;
    }
    const ids = nav.getIdsToId(id);
    let val = Valid;
    for (let i = 0; i < ids.length; i++) {
      val = val.children[ids[i]];
    }
    return val.children[id].allValid;
  }
  const getValidObj = (id:string) => {
    if (typeof Valid === 'boolean') {
      return null;
    }
    const ids = nav.getIdsToId(id);
    let val = Valid;
    for (let i = 0; i < ids.length; i++) {
      val = val.children[ids[i]];
    }
    return val.children[id];
  }
  const getShowError = (id:string) => showAllErrors;

  return {
    form:{
      getValue: (id:string) => getValue(id),
      getSetValue: (id:string) => getSetValue(id),
      getRequired: (id:string) => getRequired(id),
      getShowError: (id:string) => getShowError(id),
      getValid: (id:string) => getValid(id),
      getValidObj: (id:string) => getValidObj(id),
      getRoot: () => survey.root,
      submitForm: (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowAllErrors(true);
        onSubmit(Value as any, Valid);
      },
    } as IFormCompiler,
    nav:nav as INavState,
  } as IUseFormCompiler;
}

export function useQuestionHandler(item:SurveyItem, formCompiler:IUseFormCompiler) {
  const form = formCompiler.form;

  const handleOnChange = (value:any) => {
    const mySetValue = (val:any) => form.getSetValue(item.id)(val)
    if (item instanceof QuestionNumber) {
      mySetValue(value === '' ? null : Number(value))
    } else {
      mySetValue(value === '' ? null : value)
    }
  }
  // SETUP
  const showError = form.getShowError(item.id);
  const required = form.getRequired(item.id);
  const value = form.getValue(item.id);
  const validators: any = [];
  const emptyMessage = 'You cannot leave this field empty';
  const defaultErrorMessage = 'Invalid input';
  const setValid:(valid: boolean) => void = null;
  const onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void = null;
  console.log(value, required, item);

  const [error, setError] = React.useState(required ? emptyMessage : '');
  const [showErr, setShowErr] = React.useState(false);
  React.useEffect(() => {
    if (showError) setShowErr(true);
  }, [showError]);
  const validate = React.useCallback(
    (input: any): boolean => {
      if (required && (input == null || input == '')) {
        setError(emptyMessage);
        return false;
      }
      for (const validator of validators) {
        if (!validator.f(input)) {
          setError(validator.message ?? defaultErrorMessage);
          return false;
        }
      }
      setError('');
      return true;
    },
    [required, emptyMessage, validators, defaultErrorMessage]
  );
  React.useEffect(() => {
    if (setValid) setValid(validate(value));
    else validate(value);
  }, [value, validate, setValid]);
  const handleOnBlur = (e: any) => {
    setShowErr(true);
    if (onBlur) onBlur(e);
  }

  // const finalValue = value ?? '';
  const finalError = showErr && !!error;
  const helperText = showErr ? error : '';
  return { value, required, handleOnChange, handleOnBlur, error:finalError, helperText };
}