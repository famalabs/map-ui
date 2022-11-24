import { useFormState } from "../../../components/forms";
import { Survey, SurveyItem } from "../../../core/schema";
import React from "react";
import { INavState, useNavState } from "../Navigation";

export interface IFormCompiler {
  getValue: (id:string) => any;
  setValue: (id:string) => any;
  getRequired: (id:string) => boolean;
  getShowError: (id:string) => boolean;
  getValid: (id:string) => boolean;
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
    survey.toUseFormState()
  );
  const onSubmit = (answers, allValid) => console.log(answers);
  const nav = useNavState(survey.root);
  // const formCompiler = new FormCompiler(survey);

  const getObjectValue = (obj:any, id:string):any => {
    const ids = nav.getIdsToId(id);
    let val = obj;
    for (let i = 0; i < ids.length; i++) {
      val = val[ids[i]]
    }
    return val[id];
    // console.log(obj, id);
    // if (Object.keys(obj).includes(id)) {
    //   return obj[id]
    // }
    // if (Object.keys(obj[nav.getFolderId()]).includes(id)) {
    //   return obj[nav.getFolderId()][id]
    // }
    // return obj[nav.getFolderId()][nav.getPageId()][id];
  }

  return {
    form:{
      getValue: (id:string) => getObjectValue(Value, id),
      setValue: (id:string) => getObjectValue(setValue, id),
      getRequired: (id:string) => getObjectValue(requires, id),
      getShowError: (id:string) => showAllErrors,
      getValid: (id:string) => {
        if (typeof Valid === 'boolean') {
          return Valid;
        }
        const ids = nav.getIdsToId(id);
        let val = Valid;
        for (let i = 0; i < ids.length; i++) {
          val = val.children[ids[i]];
        }
        return val.children[id].allValid;
      },

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