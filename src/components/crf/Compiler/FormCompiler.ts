import { Form, useFormState, toUseFormState } from "../../../components/forms";
import { QuestionNumber, Survey, Item, DBSchema } from "../../../survey";
import { ValidatorsLocaleMap } from '../../forms'
import React from "react";
import { INavState, useNavState } from "../Navigation";

export interface IFormCompiler {
  getValue: (id:string) => any;
  getSetValue: (id:string) => any;
  getRequired: (id:string) => boolean;
  getShowError: (id:string) => boolean;
  getValid: (id:string) => boolean;
  getValidObj: (id:string) => any;
  getRoot: () => Item;
  submitForm: (e: React.FormEvent<HTMLFormElement>) => void;
}


export interface IUseFormCompiler {
  form:IFormCompiler;
  nav:INavState; 
}

function duplicateDBSchema(schema:DBSchema):DBSchema {
  return JSON.parse(JSON.stringify(schema)) as DBSchema;
}

export function useFormCompiler(initSurvey:DBSchema) {

  const initValue = duplicateDBSchema(initSurvey);
  // const initValue = {
  //   id: "0",
  //   type: "group",
  //   text: "Survey",
  //   items: [{
  //     id: "1",
  //     type: "group",
  //     text: "Folder",
  //     items: [{
  //       id: "2",
  //       type: "group",
  //       text:"Page",
  //       items:[
  //         {id:"4",type:"num",items:[],text:"number",layout:{style:"default"},options:{required:true,min:0,max:10,step:1,unit:"kg"}},
  //         {id:"5",type:"num",items:[],text:"slider",layout:{style:"range"},options:{required:true,min:10,max:100,step:10,unit:"m"}},
  //         {id:"6",type:"txt",items:[],text:"text",layout:{style:"default"},options:{required:true}},
  //         {id:"7",type:"select",items:[],text:"radio",layout:{style:"radio"},options:{required:true,select:[{text:"Radio 1",score:0},{text:"New Radio",score:2},{text:"Radio 2",score:1}]}},
  //         {id:"8",type:"select",items:[],text:"dropdown",layout:{style:"dropdown"},options:{required:true,select:[{text:"Radio 1",score:0},{text:"New Radio",score:2},{text:"Radio 2",score:1}]}},
  //         {id:"9",type:"group",items:[
  //           {id:"10",type:"check",items:[],text:"checkbox",layout:{style:"check"},options:{required:true}},
  //           {id:"11",type:"check",items:[],text:"switch",layout:{style:"switch"},options:{required:true}},
  //           {id:"12",type:"date",items:[],text:"date",options:{required:true}},
  //           {id:"13",type:"fn",items:[],text:"fn bmi",parameters:["4","5"],fnCompute:"BMI"}
  //         ],text:"section",layout:{style:"section"}}
  //       ],
  //       layout: {
  //         style: "card"
  //       }
  //     }]
  //   }]
  // } as DBSchema;

  const survey = new Survey(initValue);
  // survey.load(initValue);

  const [showAllErrors, setShowAllErrors] = React.useState(false);
  const root = survey.root;
  const { Value, setValue, validators, requires, Valid } = useFormState(
    toUseFormState(root)
  );
  const onSubmit = (answers, allValid) => console.log(answers);
  const nav = useNavState(root);

  const getObjectValue = (obj:any, id:string):any => {
    const ids = nav.getPathToId(id);
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
    const ids = nav.getPathToId(id);
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
    const ids = nav.getPathToId(id);
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
      getRoot: () => root,
      submitForm: (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setShowAllErrors(true);
        onSubmit(Value as any, Valid);
      },
    } as IFormCompiler,
    nav:nav as INavState,
  } as IUseFormCompiler;
}

export function useQuestionHandler(item:Item, formCompiler:IUseFormCompiler) {
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
  const locale = 'it';
  // const emptyMessage = 'You cannot leave this field empty';
  const emptyMessage = ValidatorsLocaleMap.emptyField[locale];
  // const defaultErrorMessage = 'Invalid input';
  const defaultErrorMessage = ValidatorsLocaleMap.invalidInput[locale];
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