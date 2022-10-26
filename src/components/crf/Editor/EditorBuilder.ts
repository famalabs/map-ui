import React, { useState } from 'react'
import {Survey, SurveyMap, fromMapToDefault, SurveyItem, QuestionTextMap, QuestionNumberMap, QuestionSelectMap, QuestionDateMap, QuestionCheckMap, Question, QuestionText, QuestionNumber, QuestionSelect, QuestionDate, QuestionCheck} from '../../../core/schema'
import { useFormState } from '@src/components/forms';
import { INavState, SurveyNav, useNavState } from '../Navigation';
import { QuestionMap } from '@src/core/schema/config-map';

export interface IQuestionState {

	setNormal:(question:Question) => void;
	setHover:(question:Question) => void;
	setEdit:(question:Question) => void;
	setOptions:(question:Question) => void;
	setLayout:(question:Question) => void;

	onSave:(question:Question) => void;
	onExit:(question:Question) => void;

	getQuestionState:(question:Question) => IQuestionStateValue;

	updateQuestions:(questions:Question[]) => void;
}

export interface IQuestionStateValue {
	isInNormal: boolean;
	isInHover: boolean;
	isInEdit: boolean;
	isInOptions: boolean;
	isInLayout: boolean;
}

const initObj = {
  isInNormal: true,
  isInHover: false,
  isInEdit: false,
  isInOptions: false,
  isInLayout: false,
} as IQuestionStateValue;

// export function useQuestionState(questions:Question[]): IQuestionState {


// 	const createInitValue = (qs:Question[]) => {
// 		var initValue = {};
// 		for (let i = 0; i < qs.length; i++) {
// 			initValue[qs[i].id] = initObj;
// 		}
// 		return initValue;
// 	}
// 	const [value, setValue] = React.useState(createInitValue(questions));

// 	const setQuestionState = (questionId:string, state:string) => {
// 		const newValue = value;
// 		newValue[questionId] = initObj;
// 		newValue[questionId].isInNormal = false;
// 		newValue[questionId][state] = true;
// 		setValue(newValue);
// 		console.log('new', newValue);
// 	}
//   console.log("question state");
// 	return {
// 		setNormal:(question:Question) => {
// 			setQuestionState(question.id, 'isInNormal');
// 		},
// 		setHover:(question:Question) => {
// 			setQuestionState(question.id, 'isInHover');
// 		},
// 		setEdit:(question:Question) => {
// 			setQuestionState(question.id, 'isInEdit');

// 		},
// 		setOptions:(question:Question) => {
// 			setQuestionState(question.id, 'isInOptions');

// 		},
// 		setLayout:(question:Question) => {
// 			setQuestionState(question.id, 'isInLayout');

// 		},
// 		onSave:(question:Question) => {

// 		},
// 		onExit:(question:Question) => {

// 		},
// 		getQuestionState(question:Question):IQuestionStateValue {
// 			if (!Object.keys(value).includes(question.id)) throw Error('question not in QuestionState');
// 			return value[question.id] as IQuestionStateValue;
// 		},
// 		updateQuestions(qs:Question[]) {
// 			setValue(createInitValue(qs));
// 		},
// 	} as IQuestionState;
// }

export interface IEditorState {
  getSurvey: () => Survey;
  getRoot: () => SurveyItem;
  addFolder: () => void;
  addPage: (folder: SurveyItem) => void;
  addQuestion: (type:string, nav: INavState, questionState:IQuestionState) => void;
  // addQuestionText: (nav: INavState) => void;
  // addQuestionNumber: (nav: INavState) => void;
  // addQuestionSelect: (nav: INavState) => void;
  // addQuestionDate: (nav: INavState) => void;
  // addQuestionCheck: (nav: INavState) => void;
}

const defaultPage = {
  id: "3",
  type: "Group",
  text: "Page 3",
  items: []
}

const defaultFolder = {
  id: "2",
  type: "Group",
  text: "Folder 2",
  items: [defaultPage]
}

const defaultQuestion = (type:string) => {
  return {
    id: "",
    type: type,
    text: "New " + type
  };
}

export class EditorBuilder implements IEditorState {

    private survey:Survey;
    private root:SurveyItem;

    public constructor(survey: Survey, root: SurveyItem) {
      this.survey = survey;
      this.root = root;
    }
    private getValidId(): string {
      var ids = ["1"]
      for (let f = 0; f < this.root.items.length; f++) {
        const folder = this.root.items[f];
        ids.push(folder.id);
        for (let p = 0; p < folder.items.length; p++) {
          const page = folder.items[p];
          ids.push(page.id);
          for (let q = 0; q < page.items.length; q++) {
            ids.push(page.items[q].id);
          }
        }
      }
      for (let i = 1; i < +Infinity; i++) {
        if (!ids.includes(i.toString())) return i.toString();
      }
      return "";
    }
    public getValue(): any {
      return this.root.getSchema();
    }
    public getSurvey(): Survey {
      return this.survey;
    }
    public getRoot(): SurveyItem{
      return this.root;
    }
    public getQuestions(folderIdx:number,pageIdx:number):Question[] {
      return this.root.items[folderIdx].items[pageIdx].items as Question[];
    }
    public addFolder(): SurveyItem {
      const folder = new SurveyItem(defaultFolder);
      folder.id = this.getValidId();
      folder.items = [];
      folder.text = "Folder "+folder.id.toString();
      this.root.insertItem(folder);
      const page = new SurveyItem(defaultPage);
      page.id = this.getValidId();
      page.text = "Page "+page.id.toString();
      this.root.items[this.root.items.length-1].insertItem(page);
      return folder;
    }
    public addPage(folder: SurveyItem): SurveyItem {
      const page = new SurveyItem(defaultPage);
      page.id = this.getValidId();
      page.text = "Page "+page.id.toString();
      for (let i = 0; i < this.root.items.length; i++) {
        if (folder.id === this.root.items[i].id) {
          this.root.items[i].insertItem(page);
          return page;
        }
      }
      return null
    }

    public addQuestion(type:string, nav: INavState, questionState:IQuestionState):Question {
      if (type === QuestionTextMap.type) {
        return this.addQuestionText(nav);
      } else if (type === QuestionNumberMap.type) {
        return this.addQuestionNumber(nav);
      } else if (type === QuestionSelectMap.type) {
        return this.addQuestionSelect(nav);
      } else if (type === QuestionCheckMap.type) {
        return this.addQuestionCheck(nav);
      } else if (type === QuestionDateMap.type) {
        return this.addQuestionDate(nav);
      }
      return undefined;
    }
    public addQuestionText(nav: INavState):QuestionText {
      const type = QuestionTextMap.type;
      const question = new QuestionText(defaultQuestion(type));
      question.id = this.getValidId();
      question.text = type + " " +question.id.toString();
      const folderIdx = nav.getFolderIdx();
      const pageIdx = nav.getPageIdx();
      this.root.items[folderIdx].items[pageIdx].insertItem(question);
      return question;
    }
    public addQuestionNumber(nav: INavState):QuestionNumber {
      const type = QuestionNumberMap.type;
      const question = new QuestionNumber(defaultQuestion(type));
      question.id = this.getValidId();
      question.text = type + " " +question.id.toString();
      const folderIdx = nav.getFolderIdx();
      const pageIdx = nav.getPageIdx();
      this.root.items[folderIdx].items[pageIdx].insertItem(question);
      return question;
        
    }
    public addQuestionSelect(nav: INavState):QuestionSelect {
      const type = QuestionSelectMap.type;
      const question = new QuestionSelect(defaultQuestion(type));
      question.id = this.getValidId();
      question.text = type + " " +question.id.toString();
      const folderIdx = nav.getFolderIdx();
      const pageIdx = nav.getPageIdx();
      this.root.items[folderIdx].items[pageIdx].insertItem(question);
      return question;
        
    }
    public addQuestionDate(nav: INavState):QuestionDate {
      const type = QuestionDateMap.type;
      const question = new QuestionDate(defaultQuestion(type));
      question.id = this.getValidId();
      question.text = type + " " +question.id.toString();
      const folderIdx = nav.getFolderIdx();
      const pageIdx = nav.getPageIdx();
      this.root.items[folderIdx].items[pageIdx].insertItem(question);
      return question;
        
    }
    public addQuestionCheck(nav: INavState):QuestionCheck {
      const type = QuestionCheckMap.type;
      const question = new QuestionCheck(defaultQuestion(type));
      question.id = this.getValidId();
      question.text = QuestionTextMap.type + " " +question.id.toString();
      const folderIdx = nav.getFolderIdx();
      const pageIdx = nav.getPageIdx();
      this.root.items[folderIdx].items[pageIdx].insertItem(question);
      return question;
        
    }
}

export interface IUseEditorState {
    editor: IEditorState;
    nav: INavState;
    questionState: IQuestionState;
}

export function useEditorState(): IUseEditorState {

    const initValue = {
        id: "1",
        type: "Survey",
        text: "Survey 1",
        items: [defaultFolder],
        options: fromMapToDefault(SurveyMap.options),
        layout: fromMapToDefault(SurveyMap.layout)
    }

    const [value, setValue] = React.useState(initValue);
    const survey = new Survey(value);
    const root = survey.root;

    const surveyNav = useNavState(root);
    // const questionState = useQuestionState(surveyNav.getPage().items as Question[]);
    
    const createInitValue = (qs:Question[]) => {
      var initValue = {};
      for (let i = 0; i < qs.length; i++) {
        initValue[qs[i].id] = initObj;
      }
      return initValue;
    }
    const [questionState, setQuestionState] = React.useState(createInitValue(surveyNav.getPage().items as Question[]));
    const handleSetQuestionState = (questionId:string, state:string) => {
      const newValue = questionState;
      newValue[questionId] = initObj;
      newValue[questionId].isInNormal = false;
      newValue[questionId][state] = true;
      setQuestionState(newValue);
      console.log('new', newValue);
    }
    
    console.log("editor state");
    return {
        editor: {
            getSurvey: () => survey,
            getRoot: () => root,
            addFolder: () => { 
                const editorBuilder = new EditorBuilder(survey, root); 
                const folder = editorBuilder.addFolder();
                setValue(editorBuilder.getValue());
                surveyNav.updateAndSet(editorBuilder.getRoot(), folder);
                // surveyNav.setFolder(folder);
            },
            addPage: (folder: SurveyItem) => { 
                const editorBuilder = new EditorBuilder(survey, root); 
                const page = editorBuilder.addPage(folder); 
                setValue(editorBuilder.getValue()); 
                surveyNav.updateAndSet(editorBuilder.getRoot(), folder, page);
                // surveyNav.setPage(page);
            },
            addQuestion: (type: string, nav:INavState, questionState:IQuestionState) => {
                const editorBuilder = new EditorBuilder(survey, root); 
                const question = editorBuilder.addQuestion(type, nav, questionState);
                setValue(editorBuilder.getValue());
                surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), nav.getFolderIdx(), nav.getPageIdx());
                questionState.updateQuestions(editorBuilder.getQuestions(nav.getFolderIdx(), nav.getPageIdx()));
              }
        } as IEditorState,
        nav: surveyNav as INavState,
        questionState: {
          setNormal:(question:Question) => {
            handleSetQuestionState(question.id, 'isInNormal');
          },
          setHover:(question:Question) => {
            handleSetQuestionState(question.id, 'isInHover');
          },
          setEdit:(question:Question) => {
            handleSetQuestionState(question.id, 'isInEdit');
      
          },
          setOptions:(question:Question) => {
            handleSetQuestionState(question.id, 'isInOptions');
      
          },
          setLayout:(question:Question) => {
            handleSetQuestionState(question.id, 'isInLayout');
      
          },
          onSave:(question:Question) => {
      
          },
          onExit:(question:Question) => {
      
          },
          getQuestionState(question:Question):IQuestionStateValue {
            if (!Object.keys(questionState).includes(question.id)) throw Error('question not in QuestionState');
            return questionState[question.id] as IQuestionStateValue;
          },
          updateQuestions(qs:Question[]) {
            setQuestionState(createInitValue(qs));
          },
        } as IQuestionState,
    } as IUseEditorState;
}