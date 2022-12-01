import React, { useState } from 'react'
import {Survey, SurveyMap, fromMapToDefault, SurveyItem, QuestionTextMap, QuestionNumberMap, QuestionSelectMap, QuestionDateMap, QuestionCheckMap, Question, QuestionText, QuestionNumber, QuestionSelect, QuestionDate, QuestionCheck,GroupMap, QuestionMap, FnMap, ItemFunction} from '../../../core/schema'
import { useFormState } from '@src/components/forms';
import { INavState, SurveyNav, useNavState } from '../Navigation';
import { getQuestionMenuType, QuestionMenuTypesMap } from '../../../core/schema/config-types';

export interface IEditorState {
  getSurvey: () => Survey;
  getRoot: () => SurveyItem;
  addFolder: () => void;
  addPage: (folder: SurveyItem) => void;
  addQuestion: (type:string, parentId?:string) => SurveyItem;
  changeQuestionType: (item: SurveyItem, newType: string) => void;
  removeItem: (item:SurveyItem) => void;
  moveItemUp: (item:SurveyItem) => void;
  moveItemDown: (item:SurveyItem) => void;
  onChangeValue: (itemId:string, key:string, value:any) => void;
  hasPendingChanges: () => boolean;
  saveChanges: () => void;
  cancelChanges: () => void;
  // onChangeOptions: (itemId:string, key:string, value:any) => void;
}

const defaultPage = {
  id: "3",
  type: GroupMap.type,
  text: "Page 3",
  items: [],
  layout: {
    style: GroupMap.layout.style.card
  }
}

const defaultFolder = {
  id: "2",
  type: GroupMap.type,
  text: "Folder 2",
  items: [defaultPage]
}

const defaultQuestion = (type:string) => {
  return {
    id: "",
    type: type,
    // text: "New " + type,
    // description: "Description",
    text: "",
    description: "",
    options: {
      required: false
    }
  };
}

const defaultFn = () => {
  return {
    id: "778",
    type: FnMap.type,
    text: "New Function",
    parameters: [
    ],
    fnCompute: FnMap.fnCompute.sum,
}
}

const defaultQuestionTableSelect = () => {
  return {
    id: "",
    type: GroupMap.type,
    text: "",
    description: "",
    options: {
      required: false
    },
    items: [],
    layout: {
      style: GroupMap.layout.style.table
    }
  };
}

const defaultSection = () => {
  return {
    id: "",
    type: GroupMap.type,
    text: "",
    description: "",
    options: {
      required: false
    },
    items: [],
    layout: {
      style: GroupMap.layout.style.section
    }
  };
}

export class EditorBuilder implements IEditorState {

    private survey:Survey;
    private root:SurveyItem;

    public constructor(survey: Survey) {
      this.survey = survey;
      this.root = survey.root;
    }
    private getValidIdRec(item:SurveyItem, acc:string[]) {
      for (let i = 0; i < item.items.length; i++) {
        const accRec = this.getValidIdRec(item.items[i], acc);
        acc = acc.concat(accRec);
      }
      acc.push(item.id);
      return acc;
    }
    private getValidId(): string {
      var ids = this.getValidIdRec(this.root, []);
    
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
      // DFS
      const queue:SurveyItem[] = [this.root]
      while (queue.length !== 0) {
        const item = queue.shift()
        if (item.id === id) { return item; }
        for (let i = 0; i < item.items.length; i++) {
          queue.push(item.items[i]);
        }
      }

      // if (id === this.root.id) { return this.root; }
      // for (let f = 0; f < this.root.items.length; f++) {
      //   const folder = this.root.items[f];
      //   if (folder.id === id) { return folder; }
      //   for (let p = 0; p < folder.items.length; p++) {
      //     const page = folder.items[p];
      //     if (page.id === id) { return page; }
      //     for (let q = 0; q < page.items.length; q++) {
      //       if (page.items[q].id === id) { return page.items[q]; }
      //     }
      //   }
      // }
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
    
    public addQuestionGeneral(type:string, nav: INavState, parentId?:string):SurveyItem {
      if (type === QuestionMenuTypesMap.text.type) {
        return this.addQuestionText(nav, parentId);
      } else if (type === QuestionMenuTypesMap.textMulti.type) {
        return this.addQuestionTextArea(nav, parentId);
      } else if (type === QuestionMenuTypesMap.number.type) {
        return this.addQuestionNumber(nav, parentId);
      } else if (type === QuestionMenuTypesMap.range.type) {
        return this.addQuestionNumberSlider(nav, parentId);
      } else if (type === QuestionMenuTypesMap.select.type) {
        return this.addQuestionSelect(nav, parentId);
      } else if (type === QuestionMenuTypesMap.dropdown.type) {
        return this.addQuestionSelectDropdown(nav, parentId);
      } else if (type === QuestionMenuTypesMap.check.type) {
        return this.addQuestionCheck(nav, parentId);
      } else if (type === QuestionMenuTypesMap.switch.type) {
        return this.addQuestionSwitch(nav, parentId);
      } else if (type === QuestionMenuTypesMap.date.type) {
        return this.addQuestionDate(nav, parentId);
      } else if (type === QuestionMenuTypesMap.selectTable.type) {
        return this.addQuestionSelectTable(nav, parentId);
      } else if (type === QuestionMenuTypesMap.fn.type) {
        return this.addFnItem(nav, parentId);
      } else if (type === QuestionMenuTypesMap.section.type) {
        return this.addSection(nav);
      }
      return undefined;
    }
    public addQuestion(type:string, parentId?:string):SurveyItem {
      return undefined;
    }
    private addInitQuestion(question:SurveyItem, type:string, nav:INavState, parentId?:string):SurveyItem {
      question.id = this.getValidId();
      // question.text = type + " " +question.id.toString();
      const folderIdx = nav.getFolderIdx();
      const pageIdx = nav.getPageIdx();
      if (typeof parentId !== 'undefined') {
        this.root.items[folderIdx].items[pageIdx].items[nav.getItemIdx(parentId)].insertItem(question);
        return question
      }
      this.root.items[folderIdx].items[pageIdx].insertItem(question);
      return question;
    }
    public addQuestionText(nav: INavState, parentId?:string):SurveyItem {
      const type = QuestionTextMap.type;
      const question = new QuestionText(defaultQuestion(type));
      question.layout = {
        style: QuestionTextMap.layout.style.default
      }
      return this.addInitQuestion(question, type, nav, parentId) as SurveyItem;
    }
    public addQuestionTextArea(nav: INavState, parentId?:string):SurveyItem {
      const type = QuestionTextMap.type;
      const question = new QuestionText(defaultQuestion(type));
      question.layout = {
        style: QuestionTextMap.layout.style.area
      }
      return this.addInitQuestion(question, type, nav, parentId) as SurveyItem;
    }
    public addQuestionNumber(nav: INavState, parentId?:string):SurveyItem {
      const type = QuestionNumberMap.type;
      const question = new QuestionNumber(defaultQuestion(type));
      question.options = {
        minValue: 0,
        maxValue: 10,
        step: 1,
        unit: QuestionNumberMap.options.unit.none
      }
      question.layout = {
        style: QuestionNumberMap.layout.style.default
      }
      return this.addInitQuestion(question, type, nav, parentId) as SurveyItem;
    }
    public addQuestionNumberSlider(nav: INavState, parentId?:string):SurveyItem {
      const type = QuestionNumberMap.type;
      const question = new QuestionNumber(defaultQuestion(type));
      question.options = {
        minValue: 0,
        maxValue: 10,
        step: 1,
        unit: QuestionNumberMap.options.unit.none
      }
      question.layout = {
        style: QuestionNumberMap.layout.style.range
      }
      return this.addInitQuestion(question, type, nav, parentId) as SurveyItem;
        
    }
    public addQuestionSelect(nav: INavState, parentId?:string):SurveyItem {
      const type = QuestionSelectMap.type;
      const question = new QuestionSelect(defaultQuestion(type));
      question.selectOptions = [{text:"Radio 1",score:0},{text:"Radio 2",score:1}];
      question.layout = { style: QuestionSelectMap.layout.style.radio };
      return this.addInitQuestion(question, type, nav, parentId) as SurveyItem;
    }
    public addQuestionSelectDropdown(nav: INavState, parentId?:string):SurveyItem {
      const type = QuestionSelectMap.type;
      const question = new QuestionSelect(defaultQuestion(type));
      question.selectOptions = [{text:"Dropdown 1",score:0},{text:"Dropdown 2",score:1}];
      question.layout = { style: QuestionSelectMap.layout.style.dropdown };
      return this.addInitQuestion(question, type, nav, parentId) as SurveyItem;
    }
    public addQuestionSelectTable(nav: INavState, parentId?:string):SurveyItem {
      const type = QuestionSelectMap.type+GroupMap.layout.style.table;
      const group = new SurveyItem(defaultQuestionTableSelect());
      for (let i = 0; i < 2; i++) {
        const question = new QuestionSelect(defaultQuestion(QuestionSelectMap.type));
        question.selectOptions = [{text:"Radio 1",score:0},{text:"Radio 2",score:1}];
        question.layout = { style: QuestionSelectMap.layout.style.radio };
        this.addInitQuestion(question, QuestionSelectMap.type, nav, undefined);
      }
      const toReturn = this.addInitQuestion(group, type, nav, parentId) as SurveyItem;
      const length = this.root.items[nav.getFolderIdx()].items[nav.getPageIdx()].items.length;
      const lastIsTable = typeof parentId === 'undefined'? 2:1;
      for (let i = 0; i < 2; i++) {
        const item = this.root.items[nav.getFolderIdx()].items[nav.getPageIdx()].items[length-i-lastIsTable]
        this.root.items[nav.getFolderIdx()].items[nav.getPageIdx()].removeItem(item);
        toReturn.insertItem(item);
      }
      return toReturn
    }
    public addQuestionDate(nav: INavState, parentId?:string):SurveyItem {
      const type = QuestionDateMap.type;
      const question = new QuestionDate(defaultQuestion(type));
      return this.addInitQuestion(question, type, nav, parentId) as SurveyItem;
        
    }
    public addQuestionCheck(nav: INavState, parentId?:string):SurveyItem {
      const type = QuestionCheckMap.type;
      const question = new QuestionCheck(defaultQuestion(type));
      question.layout = { style: QuestionCheckMap.layout.style.default };
      return this.addInitQuestion(question, type, nav, parentId) as SurveyItem;
        
    }
    public addQuestionSwitch(nav: INavState, parentId?:string):SurveyItem {
      const type = QuestionCheckMap.type;
      const question = new QuestionCheck(defaultQuestion(type));
      question.layout = { style: QuestionCheckMap.layout.style.switch };
      return this.addInitQuestion(question, type, nav, parentId) as SurveyItem;
        
    }
    public addFnItem<T>(nav: INavState, parentId?:string):SurveyItem {
      const type = FnMap.type;
      const question = new ItemFunction<T>(defaultFn());
      return this.addInitQuestion(question, type, nav, parentId) as SurveyItem;
    }
    public addSection(nav: INavState):SurveyItem {
      const group = new SurveyItem(defaultSection());
      return this.addInitQuestion(group, group.type, nav, undefined) as SurveyItem;
    }

    public changeQuestionType: (item: SurveyItem, newType: string) => void;
    public changeQuestionTypeGeneral (item:SurveyItem, newType:string, nav:INavState) {
      const id = item.id;
      const text = item.text;
      const descr = item.description;
      const idx = nav.getItemIdx(id);
      const newItem = this.addQuestionGeneral(newType, nav);
      const folderIdx = nav.getFolderIdx();
      const pageIdx = nav.getPageIdx();
      this.root.items[folderIdx].items[pageIdx].removeItem(newItem);
      newItem.id = id;
      newItem.text = text;
      newItem.description = descr;

      if (newItem instanceof QuestionNumber && item instanceof QuestionNumber) {
        newItem.options.minValue = item.options.minValue;
        newItem.options.step = item.options.step;
        newItem.options.maxValue = item.options.maxValue;
        newItem.options.unit = item.options.unit;
      } else if (newItem instanceof QuestionSelect && item instanceof QuestionSelect) {
        newItem.selectOptions = item.selectOptions;
      }

      this.root.items[folderIdx].items[pageIdx].items[idx] = newItem;
      return newItem;
    }

    public removeItem(qs:SurveyItem) {
    }
    public removeItemGeneral(item:SurveyItem, nav: INavState):number {
      const itemType = nav.getItemType(item.id);
      const folderIdx = nav.getFolderIdx();
      const pageIdx = nav.getPageIdx();
      if (itemType === GroupMap.layout.style.folder) { 
        if (nav.getFolders().length > 1 && this.root.removeItem(item)) {
          return folderIdx-1 >= 0 ? folderIdx-1 : 0;
        }
        return folderIdx;
      } else if (itemType === GroupMap.layout.style.page) { 
        if (nav.getPages().length > 1 && this.root.items[folderIdx].removeItem(item)) {
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
    /**
     * 
     * @param itemId 
     * @param key could have multiple like \'layout.style\'
     * @param value 
     * @returns 
     */
    public onChangeValue(itemId:string, key:string, value:any) {
      // console.log('before change value', itemId, key, value)
      const item = this.findItemById(itemId);
      if (typeof item === 'undefined') { throw Error('cant change value: question not in questions'); }
      if (key === 'parameters' && item instanceof ItemFunction) {
        item.parameters = value;
        console.log('change fn parameters',item, value);
        return
      } else if (key === 'fnCompute' && item instanceof ItemFunction) {
        item.setFnCompute(value);
        console.log('change fn compute',item, value);
        return
      }
      if (key.includes(".")) {
        const keys = key.split(".")
        if (keys.length == 2) {
          item[keys[0]][keys[1]] = value;
        } else if (keys.length == 3) {
          item[keys[0]][keys[1]][keys[2]] = value;
        } else if (keys.length == 4) {
          item[keys[0]][keys[1]][keys[2]][keys[3]] = value;
        } else {
          throw Error('cant change value multiple keys')
        }
      } else {
        item[key] = value;
      }
      // console.log('change value',item)
      return 
    }
    public hasPendingChanges: () => boolean;
    public saveChanges() {

    }
    public cancelChanges() {

    }
    // public onChangeOptions(itemId:string, key:string, value:any) {
    //   const item = this.findItemById(itemId);
    //   if (typeof item === 'undefined') { throw Error('cant change value: question not in questions'); }
    //   let val = item.options;
    //   val[key] = value
    //   item.options = val;
    //   return 
    // }
}

export interface IUseEditorState {
    editor: IEditorState;
    nav: INavState;
}

export function useEditorState(initSurvey:any): IUseEditorState {

    const initValue = initSurvey ?? {
        id: "1",
        type: "Survey",
        text: "Survey 1",
        items: [defaultFolder],
        options: fromMapToDefault(SurveyMap.options),
        layout: fromMapToDefault(SurveyMap.layout)
    }
    // console.log('initValue',initValue);
    const [value, setValue] = React.useState(initValue);

    // takes saved the survey before changes, if not save, restore prev values
    // must control other actions 
    const [hasChanges, setHasChanges] = React.useState(false);
    const [changesValue, setChangesValue] = React.useState(initValue);

    const surveyNav = useNavState(new Survey(value).root);
    
    return {
      editor: {
        getSurvey: () => new Survey(value),
        getRoot: () => new Survey(value).root,
        addFolder: () => { 
          const editorBuilder = new EditorBuilder(new Survey(value)); 
          const folder = editorBuilder.addFolder();
          setValue(editorBuilder.getValue());
          surveyNav.updateAndSet(editorBuilder.getRoot(), folder);
        },
        addPage: (folder: SurveyItem) => { 
          const editorBuilder = new EditorBuilder(new Survey(value)); 
          const page = editorBuilder.addPage(folder); 
          setValue(editorBuilder.getValue()); 
          surveyNav.updateAndSet(editorBuilder.getRoot(), folder, page);
        },
        addQuestion: (type: string, parentId?: any) => {
          const editorBuilder = new EditorBuilder(new Survey(value)); 
          const question = editorBuilder.addQuestionGeneral(type, surveyNav, parentId);
          setValue(editorBuilder.getValue());
          surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), surveyNav.getPageIdx());
          return question;
        },
        changeQuestionType(item:SurveyItem, newType:string) {
          if (newType === getQuestionMenuType(item)) {
            return
          }
          const editorBuilder = new EditorBuilder(new Survey(value)); 
          const question = editorBuilder.changeQuestionTypeGeneral(item, newType, surveyNav);
          setValue(editorBuilder.getValue());
          surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), surveyNav.getPageIdx());
        },
        removeItem: (item:SurveyItem) => {
          const itemType = surveyNav.getItemType(item.id);
          const editorBuilder = new EditorBuilder(new Survey(value)); 
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
          const editorBuilder = new EditorBuilder(new Survey(value)); 
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
          const editorBuilder = new EditorBuilder(new Survey(value)); 
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
        onChangeValue: (itemId:string, key:string, newValue:any) => {
          if (!hasChanges) {
            const editorBuilder = new EditorBuilder(new Survey(value)); 
            setChangesValue(editorBuilder.getValue());
            setHasChanges(true);
          }
          const editorBuilder = new EditorBuilder(new Survey(value)); 
          editorBuilder.onChangeValue(itemId, key, newValue);
          setValue(editorBuilder.getValue());
          surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), surveyNav.getPageIdx());
        },
        hasPendingChanges: () => hasChanges,
        saveChanges: () => {
          setHasChanges(false);
        },
        cancelChanges: () => {
          if (!hasChanges) {
            return
          }
          const changesSurvey = new Survey(changesValue);
          const editorBuilder = new EditorBuilder(changesSurvey); 
          setValue(changesValue);
          surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), surveyNav.getPageIdx());
          setHasChanges(false);
        },
        // onChangeOptions: (itemId:string, key:string, value:any) => {
        //   const editorBuilder = new EditorBuilder(survey, root); 
        //   editorBuilder.onChangeOptions(itemId, key, value);
        //   setValue(editorBuilder.getValue());
        //   surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), surveyNav.getPageIdx());
        // }
      } as IEditorState,
      nav: surveyNav as INavState,
    } as IUseEditorState;
}