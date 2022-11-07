import React, { useState } from 'react'
import {Survey, SurveyMap, fromMapToDefault, SurveyItem, QuestionTextMap, QuestionNumberMap, QuestionSelectMap, QuestionDateMap, QuestionCheckMap, Question, QuestionText, QuestionNumber, QuestionSelect, QuestionDate, QuestionCheck,GroupMap, QuestionMap, FnMap, ItemFunction} from '../../../core/schema'
import { useFormState } from '@src/components/forms';
import { INavState, SurveyNav, useNavState } from '../Navigation';

export interface IEditorState {
  getSurvey: () => Survey;
  getRoot: () => SurveyItem;
  addFolder: () => void;
  addPage: (folder: SurveyItem) => void;
  addQuestion: (type:string) => void;
  removeItem: (item:SurveyItem) => void;
  moveItemUp: (item:SurveyItem) => void;
  moveItemDown: (item:SurveyItem) => void;
  onChangeValue: (itemId:string, key:string, value:any) => void;
  onChangeOptions: (itemId:string, key:string, value:any) => void;
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
    text: "New " + type,
    description: "Description",
    options: {
      required: false
    }
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
    public getQuestions(folderIdx:number,pageIdx:number):SurveyItem[] {
      return this.root.items[folderIdx].items[pageIdx].items;
    }
    public findItemById(id:string):SurveyItem {
      if (id === this.root.id) { return this.root; }
      for (let f = 0; f < this.root.items.length; f++) {
        const folder = this.root.items[f];
        if (folder.id === id) { return folder; }
        for (let p = 0; p < folder.items.length; p++) {
          const page = folder.items[p];
          if (page.id === id) { return page; }
          for (let q = 0; q < page.items.length; q++) {
            if (page.items[q].id === id) { return page.items[q]; }
          }
        }
      }
      return undefined;
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
    
    public addQuestionGeneral(type:string, nav: INavState):Question {
      if (type === QuestionTextMap.type) {
        return this.addQuestionText(nav);
      } else if (type === QuestionTextMap.layout.style.area) {
        return this.addQuestionTextArea(nav);
      } else if (type === QuestionNumberMap.type) {
        return this.addQuestionNumber(nav);
      } else if (type === QuestionNumberMap.layout.style.range) {
        return this.addQuestionNumberSlider(nav);
      } else if (type === QuestionSelectMap.type) {
        return this.addQuestionSelect(nav);
      } else if (type === QuestionSelectMap.layout.style.dropdown) {
        return this.addQuestionSelectDropdown(nav);
      }
      else if (type === QuestionCheckMap.type) {
        return this.addQuestionCheck(nav);
      } else if (type === QuestionDateMap.type) {
        return this.addQuestionDate(nav);
      }
      return undefined;
    }
    public addQuestion(type:string):Question {
      return undefined;
    }
    private addInitQuestion(question:Question, type:string, nav:INavState):Question {
      question.id = this.getValidId();
      question.text = type + " " +question.id.toString();
      const folderIdx = nav.getFolderIdx();
      const pageIdx = nav.getPageIdx();
      this.root.items[folderIdx].items[pageIdx].insertItem(question);
      return question;
    }
    public addQuestionText(nav: INavState):QuestionText {
      const type = QuestionTextMap.type;
      const question = new QuestionText(defaultQuestion(type));
      question.layout = {
        style: QuestionTextMap.layout.style.default
      }
      return this.addInitQuestion(question, type, nav) as QuestionText;
    }
    public addQuestionTextArea(nav: INavState):QuestionText {
      const type = QuestionTextMap.type;
      const question = new QuestionText(defaultQuestion(type));
      question.layout = {
        style: QuestionTextMap.layout.style.area
      }
      return this.addInitQuestion(question, type, nav) as QuestionText;
    }
    public addQuestionNumber(nav: INavState):QuestionNumber {
      const type = QuestionNumberMap.type;
      const question = new QuestionNumber(defaultQuestion(type));
      question.options = {
        minValue: 0,
        maxValue: 10,
        step: 1
      }
      question.layout = {
        style: QuestionNumberMap.layout.style.default
      }
      return this.addInitQuestion(question, type, nav) as QuestionNumber;
    }
    public addQuestionNumberSlider(nav: INavState):QuestionNumber {
      const type = QuestionNumberMap.type;
      const question = new QuestionNumber(defaultQuestion(type));
      question.options = {
        minValue: 0,
        maxValue: 10,
        step: 1
      }
      question.layout = {
        style: QuestionNumberMap.layout.style.range
      }
      return this.addInitQuestion(question, type, nav) as QuestionNumber;
        
    }
    public addQuestionSelect(nav: INavState):QuestionSelect {
      const type = QuestionSelectMap.type;
      const question = new QuestionSelect(defaultQuestion(type));
      question.selectOptions = [{text:"Radio 1",score:0},{text:"Radio 2",score:1}];
      question.layout = { style: QuestionSelectMap.layout.style.radio };
      return this.addInitQuestion(question, type, nav) as QuestionSelect;
    }
    public addQuestionSelectDropdown(nav: INavState):QuestionSelect {
      const type = QuestionSelectMap.type;
      const question = new QuestionSelect(defaultQuestion(type));
      question.selectOptions = [{text:"Dropdown 1",score:0},{text:"Dropdown 2",score:1}];
      question.layout = { style: QuestionSelectMap.layout.style.dropdown };
      return this.addInitQuestion(question, type, nav) as QuestionSelect;
    }
    public addQuestionDate(nav: INavState):QuestionDate {
      const type = QuestionDateMap.type;
      const question = new QuestionDate(defaultQuestion(type));
      return this.addInitQuestion(question, type, nav) as QuestionDate;
        
    }
    public addQuestionCheck(nav: INavState):QuestionCheck {
      const type = QuestionCheckMap.type;
      const question = new QuestionCheck(defaultQuestion(type));
      return this.addInitQuestion(question, type, nav) as QuestionCheck;
        
    }
    public addFnItem<T>(nav: INavState):ItemFunction<T> {
      const type = FnMap.type;
      const question = new ItemFunction<T>(defaultQuestion(type));
      question.id = this.getValidId();
      question.text = FnMap.type + " " +question.id.toString();
      const folderIdx = nav.getFolderIdx();
      const pageIdx = nav.getPageIdx();
      this.root.items[folderIdx].items[pageIdx].insertItem(question);
      return question;
        
    }
    public removeItem(qs:SurveyItem) {
    }
    public removeItemGeneral(item:SurveyItem, nav: INavState):number {
      const itemType = nav.getItemType(item.id);
      const folderIdx = nav.getFolderIdx();
      const pageIdx = nav.getPageIdx();
      if (itemType === GroupMap.layout.style.folder && nav.getFolders().length > 1) { 
        if (this.root.removeItem(item)) {
          return folderIdx-1 >= 0 ? folderIdx-1 : 0;
        }
        return folderIdx;
      } else if (itemType === GroupMap.layout.style.page && nav.getPages().length > 1) { 
        if (this.root.items[folderIdx].removeItem(item)) {
          return pageIdx-1 >= 0 ? pageIdx-1 : 0;
        }
        return pageIdx;
      } else {
        this.root.items[folderIdx].items[pageIdx].removeItem(item);
        return -1;
      }
    }
    public moveItemUp (item:SurveyItem) {}
    /**
     * move item prev and returns his new index
     * @param item 
     * @param nav 
     * @returns 
     */
    public moveItemUpGeneral (item:SurveyItem, nav:INavState):number {
      const curIdx = nav.getItemIdx(item.id);
      const parent = this.findItemById(item.id).parent;
      if (parent.moveItemToPosition(item, curIdx-1)){
        return curIdx-1;
      }
      return curIdx;
    }
    public moveItemDown (item:SurveyItem) {}
    /**
     * moves item next and returns his new index
     * @param item 
     * @param nav 
     * @returns 
     */
    public moveItemDownGeneral (item:SurveyItem, nav:INavState):number {
      const curIdx = nav.getItemIdx(item.id);
      const parent = this.findItemById(item.id).parent;
      if (parent.moveItemToPosition(item, curIdx+1)){
        return curIdx+1;
      }
      return curIdx;
    }
    public onChangeValue(itemId:string, key:string, value:any) {
      const item = this.findItemById(itemId);
      if (typeof item === 'undefined') { throw Error('cant change value: question not in questions'); }
      item[key] = value;
      return 
    }
    public onChangeOptions(itemId:string, key:string, value:any) {
      const item = this.findItemById(itemId);
      if (typeof item === 'undefined') { throw Error('cant change value: question not in questions'); }
      let val = item.options;
      val[key] = value
      item.options = val;
      return 
    }
}

export interface IUseEditorState {
    editor: IEditorState;
    nav: INavState;
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
        },
        addPage: (folder: SurveyItem) => { 
          const editorBuilder = new EditorBuilder(survey, root); 
          const page = editorBuilder.addPage(folder); 
          setValue(editorBuilder.getValue()); 
          surveyNav.updateAndSet(editorBuilder.getRoot(), folder, page);
        },
        addQuestion: (type: string, params?: any) => {
          const editorBuilder = new EditorBuilder(survey, root); 
          const question = editorBuilder.addQuestionGeneral(type, surveyNav);
          setValue(editorBuilder.getValue());
          // surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), nav.getFolderIdx(), nav.getPageIdx());
          surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), surveyNav.getPageIdx());
        },
        removeItem: (item:SurveyItem) => {
          const itemType = surveyNav.getItemType(item.id);
          const editorBuilder = new EditorBuilder(survey, root); 
          const newIdx = editorBuilder.removeItemGeneral(item, surveyNav);
          setValue(editorBuilder.getValue());
          if (itemType === GroupMap.layout.style.folder) { 
            surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), newIdx, 0);
          } else if (itemType === GroupMap.layout.style.page) { 
            surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), newIdx);
          } else {
            surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), surveyNav.getPageIdx());
          }
        },
        moveItemUp: (item:SurveyItem) => {
          const itemType = surveyNav.getItemType(item.id);
          const editorBuilder = new EditorBuilder(survey, root); 
          const newIdx = editorBuilder.moveItemUpGeneral(item, surveyNav);
          setValue(editorBuilder.getValue());
          if (itemType === GroupMap.layout.style.folder) { 
            surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), newIdx, surveyNav.getPageIdx());
          } else if (itemType === GroupMap.layout.style.page) { 
            surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), newIdx);
          } else {
            surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), surveyNav.getPageIdx());
          }
        },
        moveItemDown: (item:SurveyItem) => {
          const itemType = surveyNav.getItemType(item.id);
          const editorBuilder = new EditorBuilder(survey, root); 
          const newIdx = editorBuilder.moveItemDownGeneral(item, surveyNav);
          setValue(editorBuilder.getValue());
          if (itemType === GroupMap.layout.style.folder) { 
            surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), newIdx, surveyNav.getPageIdx());
          } else if (itemType === GroupMap.layout.style.page) { 
            surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), newIdx);
          } else {
            surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), surveyNav.getPageIdx());
          }
        },
        onChangeValue: (itemId:string, key:string, value:any) => {
          const editorBuilder = new EditorBuilder(survey, root); 
          editorBuilder.onChangeValue(itemId, key, value);
          setValue(editorBuilder.getValue());
          surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), surveyNav.getPageIdx());
        },
        onChangeOptions: (itemId:string, key:string, value:any) => {
          const editorBuilder = new EditorBuilder(survey, root); 
          editorBuilder.onChangeOptions(itemId, key, value);
          setValue(editorBuilder.getValue());
          surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), surveyNav.getPageIdx());
        }
      } as IEditorState,
      nav: surveyNav as INavState,
    } as IUseEditorState;
}