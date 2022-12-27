import React, { useState } from 'react'
// import {Survey, SurveyMap, fromMapToDefault, SurveyItem, QuestionTextMap, QuestionNumberMap, QuestionSelectMap, QuestionDateMap, QuestionCheckMap, Question, QuestionText, QuestionNumber, QuestionSelect, QuestionDate, QuestionCheck,GroupMap, QuestionMap, FnMap, ItemFunction} from '../../../core/schema'
import { SurveyMap, fromMapToDefault, QuestionTextMap, QuestionNumberMap, QuestionSelectMap, QuestionDateMap,GroupMap, QuestionMap, FnMap, QuestionCheckMap} from '../../../core/schema'
import { INavState, SurveyNav, useNavState } from '../Navigation';
import { getQuestionMenuType, QuestionMenuTypesMap } from '../../../core/schema/config-types';
import { Survey, Item, Group, DBSchema, SurveyMode, Question, QuestionCheck, QuestionNumber, QuestionNumberOptions, QuestionDate, QuestionSelect, QuestionText, TextScore, ItemFunction, FunctionType } from '../../../survey'

export interface IEditorState {
  getSurvey: () => Survey;
  getRoot: () => Item;
  addFolder: () => void;
  addPage: (folder: Item) => void;
  addQuestion: (type:string, parentId?:string) => Item;
  changeQuestionType: (item: Item, newType: string) => void;
  removeItem: (item:Item) => void;
  moveItemUp: (item:Item) => void;
  moveItemDown: (item:Item) => void;
  onChangeValue: (itemId:string, key:string, value:any) => void;
  hasPendingChanges: () => boolean;
  saveChanges: () => void;
  cancelChanges: () => void;
  // onChangeOptions: (itemId:string, key:string, value:any) => void;
}

export class EditorBuilder implements IEditorState {

    private survey:Survey;
    private root:Item;

    public constructor(survey:Survey) {
      this.survey = survey;
      this.root = survey.get(survey.getSchema().id);
    }
    private getValidIdRec(item:Item, acc:string[]) {
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
    public getRoot(): Item{
      return this.root;
    }
    public getQuestions(folderIdx:number,pageIdx:number):Item[] {
      return this.root.items[folderIdx].items[pageIdx].items;
    }
    // public findItemById(id:string):Item {
    //   // DFS
    //   const queue:Item[] = [this.root]
    //   while (queue.length !== 0) {
    //     const item = queue.shift()
    //     if (item.id === id) { return item; }
    //     for (let i = 0; i < item.items.length; i++) {
    //       queue.push(item.items[i]);
    //     }
    //   }
    //   return undefined;
    // }
    public addFolder(): Item {
      const defaultFolder = {
        type: Group.TYPE,
        text: "Folder",
        items: [],
      }  as Partial<DBSchema>;
      const folder = this.survey.add(this.root.id, defaultFolder, -1);
      const defaultPage = {
        type: Group.TYPE,
        text: "Page",
        items: [],
        layout: {
          style: GroupMap.layout.style.card
        }
      } as Partial<DBSchema>;
      const page = this.survey.add(folder.id, defaultPage, -1);
      return folder;
    }
    public addPage(folder: Item): Item {
      const defaultPage = {
        type: Group.TYPE,
        text: "Page",
        items: [],
        layout: {
          style: GroupMap.layout.style.card
        }
      } as Partial<DBSchema>;
      return this.survey.add(folder.id, defaultPage, -1);
    }
    
    public addQuestionGeneral(type:string, nav: INavState, parentId?:string, index?:number):Item {
      if (type === QuestionMenuTypesMap.text.type) {
        return this.addQuestionText(nav, parentId, index ?? -1);
      } else if (type === QuestionMenuTypesMap.textMulti.type) {
        return this.addQuestionTextArea(nav, parentId, index ?? -1);
      } else if (type === QuestionMenuTypesMap.number.type) {
        return this.addQuestionNumber(nav, parentId, index ?? -1);
      } else if (type === QuestionMenuTypesMap.range.type) {
        return this.addQuestionNumberSlider(nav, parentId, index ?? -1);
      } else if (type === QuestionMenuTypesMap.select.type) {
        return this.addQuestionSelect(nav, parentId, index ?? -1);
      } else if (type === QuestionMenuTypesMap.dropdown.type) {
        return this.addQuestionSelectDropdown(nav, parentId, index ?? -1);
      } else if (type === QuestionMenuTypesMap.check.type) {
        return this.addQuestionCheck(nav, parentId, index ?? -1);
      } else if (type === QuestionMenuTypesMap.switch.type) {
        return this.addQuestionSwitch(nav, parentId, index ?? -1);
      } else if (type === QuestionMenuTypesMap.date.type) {
        return this.addQuestionDate(nav, parentId, index ?? -1);
      } else if (type === QuestionMenuTypesMap.selectTable.type) {
        return this.addQuestionSelectTable(nav, parentId, index ?? -1);
      } else if (type === QuestionMenuTypesMap.fn.type) {
        return this.addFnItem(nav, parentId, index ?? -1);
      } else if (type === QuestionMenuTypesMap.section.type) {
        return this.addSection(nav);
      }
      return undefined;
    }
    public addQuestion(type:string, parentId?:string):Item {
      return undefined;
    }

    public addQuestionText(nav: INavState, parentId?:string, index?:number):Item {
      const data = {
        type:QuestionText.TYPE, 
        layout: {
          style: QuestionTextMap.layout.style.default
        },
        options: {
          required: true,
        }
      } as Partial<DBSchema>;
      return this.survey.add(parentId ?? nav.getPageId(), data, index ?? -1);
    }
    public addQuestionTextArea(nav: INavState, parentId?:string, index?:number):Item {
      const data = {
        type:QuestionText.TYPE,
        layout: {
          style: QuestionTextMap.layout.style.area
        },
        options: {
          required: true,
        }
      } as Partial<DBSchema>;
      return this.survey.add(parentId ?? nav.getPageId(), data, index ?? -1);
    }
    public addQuestionNumber(nav: INavState, parentId?:string, index?:number):Item {
      const data = {
        type:QuestionNumber.TYPE,
        options: {
          min: QuestionNumberMap.options.minValue.default,
          max: QuestionNumberMap.options.maxValue.default,
          step: QuestionNumberMap.options.step.default,
          unit: undefined,
          required: true,
        },
        layout: {
          style: QuestionNumberMap.layout.style.default
        }
      } as Partial<DBSchema>;
      return this.survey.add(parentId ?? nav.getPageId(), data, index ?? -1);
    }
    public addQuestionNumberSlider(nav: INavState, parentId?:string, index?:number):Item {
      const data = {
        type:QuestionNumber.TYPE,
        options: {
          min: QuestionNumberMap.options.minValue.default,
          max: QuestionNumberMap.options.maxValue.default,
          step: QuestionNumberMap.options.step.default,
          unit: undefined,
          required: true,
        },
        layout: {
          style: QuestionNumberMap.layout.style.range
        }
      } as Partial<DBSchema>;
      return this.survey.add(parentId ?? nav.getPageId(), data, index ?? -1);
    }
    public addQuestionSelect(nav: INavState, parentId?:string, index?:number):Item {
      const data = {
        type:QuestionSelect.TYPE,
        layout: { style: QuestionSelectMap.layout.style.radio },
        options: {
          required: true,
        }
      } as Partial<DBSchema>;
      const sel = this.survey.add(parentId ?? nav.getPageId(), data, index ?? -1) as QuestionSelect;
      sel.addSelect({text:"Radio 1",score:0} as TextScore, -1);
      sel.addSelect({text:"Radio 2",score:1} as TextScore, -1);
      return sel;
    }
    public addQuestionSelectDropdown(nav: INavState, parentId?:string, index?:number):Item {
      const data = {
        type:QuestionSelect.TYPE,
        layout: { style: QuestionSelectMap.layout.style.dropdown },
        options: {
          required: true,
        }
      } as Partial<DBSchema>;
      const sel = this.survey.add(parentId ?? nav.getPageId(), data, index ?? -1) as QuestionSelect;
      sel.addSelect({text:"Radio 1",score:0} as TextScore, -1);
      sel.addSelect({text:"Radio 2",score:1} as TextScore, -1);
      return sel;
    }
    public addQuestionSelectTable(nav: INavState, parentId?:string, index?:number):Item {
      const data = {
        type:Group.TYPE,
        items:[],
        layout: {
          style: GroupMap.layout.style.table
        }
      } as Partial<DBSchema>;
      const table = this.survey.add(parentId ?? nav.getPageId(), data, index ?? -1);

      for (let i = 0; i < 2; i++) {
        const sel = this.addQuestionSelect(nav, table.id);
        sel.text = "Question "+ (i+1).toString();
      }
      return table
    }
    public addQuestionDate(nav: INavState, parentId?:string, index?:number):Item {
      const data = {
        type:QuestionDate.TYPE,
        options: {
          required: true,
        }
      } as Partial<DBSchema>;
      return this.survey.add(parentId ?? nav.getPageId(), data, index ?? -1);
    }
    public addQuestionCheck(nav: INavState, parentId?:string, index?:number):Item {
      const data = {
        type:QuestionCheck.TYPE,
        layout: { style: QuestionCheckMap.layout.style.default },
        options: {
          required: true,
        }
      } as Partial<DBSchema>;
      return this.survey.add(parentId ?? nav.getPageId(), data, index ?? -1);
    }
    public addQuestionSwitch(nav: INavState, parentId?:string, index?:number):Item {
      const data = {
        type:QuestionCheck.TYPE,
        layout: { style: QuestionCheckMap.layout.style.switch },
        options: {
          required: true,
        }
      } as Partial<DBSchema>;
      return this.survey.add(parentId ?? nav.getPageId(), data, index ?? -1);
    }
    public addFnItem(nav: INavState, parentId?:string, index?:number):Item {
      const data = {
        type:ItemFunction.TYPE,
        parameters: [
        ],
        options: {
          required: true,
        }
      } as Partial<DBSchema>;
      const fn = this.survey.add(parentId ?? nav.getPageId(), data, index ?? -1) as ItemFunction;
      fn.setFn(FunctionType.Compute, FnMap.fnCompute.BodyMassIndex);
      return fn;
    }
    public addSection(nav: INavState):Item {
      const data = {
        type:Group.TYPE,
        items: [],
        layout: {
          style: GroupMap.layout.style.section
        }
      } as Partial<DBSchema>;
      return this.survey.add(nav.getPageId(), data, -1);
    }

    public changeQuestionType: (item: Item, newType: string) => void;
    public changeQuestionTypeGeneral (item:Item, newType:string, nav:INavState) {
      const idx = nav.getItemIdx(item.id);
      const parentId = this.survey.parent(item.id).id;
      const removed = this.survey.remove(item.id);
      const added = this.addQuestionGeneral(newType, nav, parentId, idx);
      added.name = removed.name;
      added.text = removed.text;
      if (added instanceof QuestionNumber && removed instanceof QuestionNumber) {
        added.options.min = removed.options.min;
        added.options.step = removed.options.step;
        added.options.max = removed.options.max;
        added.options.unit = removed.options.unit;
      } else if (added instanceof QuestionSelect && removed instanceof QuestionSelect) {
        const selects = removed.getSchema().options.select;
        added.setOption("select",selects);
        // added.removeSelect(0);
        // added.removeSelect(0);
        // for (let i = 0; i < selects.length; i++) {
        //   added.addSelect(selects[i], -1);
        // }
      }
    }

    public removeItem(qs:Item) {
    }
    public removeItemGeneral(item:Item, nav: INavState):number {
      const itemType = nav.getItemType(item.id);
      const folderIdx = nav.getFolderIdx();
      const pageIdx = nav.getPageIdx();
      if (itemType === GroupMap.layout.style.folder) { 
        if (nav.getFolders().length > 1) {
          const removed = this.survey.remove(item.id);
          return folderIdx-1 >= 0 ? folderIdx-1 : 0;
        }
        return folderIdx;
      } else if (itemType === GroupMap.layout.style.page) { 
        if (nav.getPages().length > 1) {
          const removed = this.survey.remove(item.id);
          return pageIdx-1 >= 0 ? pageIdx-1 : 0;
        }
        return pageIdx;
      } else {
        const removed = this.survey.remove(item.id);
        return -1;
      }
    }
    public moveItemUp (item:Item) {}
    /**
     * move item prev and returns his new index
     * @param item 
     * @param nav 
     * @returns 
     */
    public moveItemUpGeneral (item:Item, nav:INavState):number {
      const curIdx = nav.getItemIdx(item.id);
      // const parent = this.survey.parent(this.survey.get(item.id).id);
      if (curIdx == 0) { return curIdx; }
      this.survey.update(item.id, item.getSchema(), curIdx-1);
      return curIdx-1;
    }
    public moveItemDown (item:Item) {}
    /**
     * moves item next and returns his new index
     * @param item 
     * @param nav 
     * @returns 
     */
    public moveItemDownGeneral (item:Item, nav:INavState):number {
      const curIdx = nav.getItemIdx(item.id);
      // const parent = this.survey.parent(this.survey.get(item.id).id);
      if (curIdx+1 == this.survey.parent(item.id).items.length) { return curIdx; }
      this.survey.update(item.id, item.getSchema(), curIdx+1);
      return curIdx+1;
    }
    private createDBSchemaFromPath(path:string, value:any, oldSchema:DBSchema):DBSchema {
      const schema = {};  
      const keys = path.split(".");
      //! must do this way better
      if (keys.length == 1) {
        schema[keys[0]] = value;
      } else if (keys.length == 2) {
        schema[keys[0]] = oldSchema[keys[0]];
        schema[keys[0]][keys[1]] = value;
      } else if (keys.length == 3) {
        schema[keys[0]] = oldSchema[keys[0]];
        schema[keys[0]][keys[1]] = oldSchema[keys[0]][keys[1]];
        schema[keys[0]][keys[1]][keys[2]] = value;
      } else if (keys.length == 4) {
        schema[keys[0]] = oldSchema[keys[0]];
        schema[keys[0]][keys[1]] = oldSchema[keys[0]][keys[1]];
        schema[keys[0]][keys[1]][keys[2]] = oldSchema[keys[0]][keys[1]][keys[2]];
        schema[keys[0]][keys[1]][keys[2]][keys[3]] = value;
      } else {
        throw Error('cant change value multiple keys')
      } 
      return schema as DBSchema;
    }
    /**
     * 
     * @param itemId 
     * @param key could have multiple like \'layout.style\'
     * @param value 
     * @returns 
     */
    public onChangeValue(itemId:string, key:string, newValue:any) {
      const item = this.survey.get(itemId);
      if (typeof item === 'undefined') { throw Error('cant change value: question not in questions'); }
      const newData = this.createDBSchemaFromPath(key, newValue, item.getSchema());
      const newSchema = Object.assign({}, item.getSchema(), newData) as DBSchema;
      this.survey.update(itemId, newSchema, -1);
      return 
    }
    public hasPendingChanges: () => boolean;
    public saveChanges() {

    }
    public cancelChanges() {

    }
}

export interface IUseEditorState {
    editor: IEditorState;
    nav: INavState;
}

export function useEditorState(initSchema:DBSchema): IUseEditorState {

    // const initValue = initSchema ?? {
    //   id: "1",
    //   type: Group.TYPE,
    //   text: "Survey",
    //   items: [{
    //     id: "2",
    //     type: Group.TYPE,
    //     text: "Folder",
    //     items: [{
    //       id: "3",
    //       type: Group.TYPE,
    //       text:"Page",
    //       items:[],
    //       layout: {
    //         style: "card",
    //       }
    //     }]
    //   }],
    // } as DBSchema;
    const initValue = {
      id: "1",
      type: "group",
      text: "Survey",
      items: [{
        id: "2",
        type: "group",
        text: "Folder",
        items: [{
          id: "3",
          type: "group",
          text:"Page",
          items:[
            {id:"4",type:"num",items:[],text:"number",layout:{style:"default"},options:{required:true,min:0,max:10,step:1,unit:"kg"}},
            {id:"5",type:"num",items:[],text:"slider",layout:{style:"range"},options:{required:true,min:10,max:100,step:10,unit:"m"}},
            {id:"6",type:"txt",items:[],text:"text",layout:{style:"default"},options:{required:true}},
            {id:"7",type:"select",items:[],text:"radio",layout:{style:"radio"},options:{required:true,select:[{text:"Radio 1",score:0},{text:"New Radio",score:2},{text:"Radio 2",score:1}]}},
            {id:"8",type:"select",items:[],text:"dropdown",layout:{style:"dropdown"},options:{required:true,select:[{text:"Radio 1",score:0},{text:"New Radio",score:2},{text:"Radio 2",score:1}]}},
            {id:"9",type:"group",items:[
              {id:"10",type:"check",items:[],text:"checkbox",layout:{style:"check"},options:{required:true}},
              {id:"11",type:"check",items:[],text:"switch",layout:{style:"switch"},options:{required:true}},
              {id:"12",type:"date",items:[],text:"date",options:{required:true}},
              {id:"13",type:"fn",items:[],text:"fn bmi",parameters:["4","5"],fnCompute:"BMI"}
            ],text:"section",layout:{style:"section"}}
          ],
          layout: {
            style: "card"
          }
        }]
      }]
    } as DBSchema;

    const initSurvey = new Survey();
    initSurvey.load(initValue);
    const [survey, setSurvey] = React.useState<Survey>(initSurvey);
    const getRoot = (s:Survey) => s.get(s.getSchema().id);
    // const value:DBSchema = survey.getSchema();
    // const setValue = (a:any) => {}



    // takes saved the survey before changes, if not save, restore prev values
    // must control other actions 
    const [hasChanges, setHasChanges] = React.useState<boolean>(false);
    const [changesValueSurvey, setChangesValueSurvey] = React.useState<Survey>(initSurvey);

    const surveyNav = useNavState(getRoot(survey));

    console.log('editor survey', survey);
    
    return {
      editor: {
        getSurvey: () => survey,
        getRoot: () => getRoot(survey),
        addFolder: () => { 
          const editorBuilder = new EditorBuilder(survey); 
          const folder = editorBuilder.addFolder();
          setSurvey(editorBuilder.getSurvey());
          surveyNav.updateAndSet(editorBuilder.getRoot(), folder);
        },
        addPage: (folder: Item) => { 
          const editorBuilder = new EditorBuilder(survey); 
          const page = editorBuilder.addPage(folder); 
          setSurvey(editorBuilder.getSurvey()); 
          surveyNav.updateAndSet(editorBuilder.getRoot(), folder, page);
        },
        addQuestion: (type: string, parentId?: any) => {
          const editorBuilder = new EditorBuilder(survey); 
          const question = editorBuilder.addQuestionGeneral(type, surveyNav, parentId);
          setSurvey(editorBuilder.getSurvey());
          surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), surveyNav.getPageIdx());
          return question;
        },
        changeQuestionType(item:Item, newType:string) {
          if (newType === getQuestionMenuType(item)) {
            return
          }
          const editorBuilder = new EditorBuilder(survey); 
          const question = editorBuilder.changeQuestionTypeGeneral(item, newType, surveyNav);
          setSurvey(editorBuilder.getSurvey());
          surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), surveyNav.getPageIdx());
        },
        removeItem: (item:Item) => {
          const itemType = surveyNav.getItemType(item.id);
          const editorBuilder = new EditorBuilder(survey); 
          const newIdx = editorBuilder.removeItemGeneral(item, surveyNav);
          setSurvey(editorBuilder.getSurvey());
          if (itemType === GroupMap.layout.style.folder) { 
            surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), newIdx, 0);
          } else if (itemType === GroupMap.layout.style.page) { 
            surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), newIdx);
          } else {
            surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), surveyNav.getPageIdx());
          }
        },
        moveItemUp: (item:Item) => {
          const itemType = surveyNav.getItemType(item.id);
          const editorBuilder = new EditorBuilder(survey); 
          const newIdx = editorBuilder.moveItemUpGeneral(item, surveyNav);
          setSurvey(editorBuilder.getSurvey());
          if (itemType === GroupMap.layout.style.folder) { 
            surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), newIdx, surveyNav.getPageIdx());
          } else if (itemType === GroupMap.layout.style.page) { 
            surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), newIdx);
          } else {
            surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), surveyNav.getPageIdx());
          }
        },
        moveItemDown: (item:Item) => {
          const itemType = surveyNav.getItemType(item.id);
          const editorBuilder = new EditorBuilder(survey); 
          const newIdx = editorBuilder.moveItemDownGeneral(item, surveyNav);
          setSurvey(editorBuilder.getSurvey());
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
            // const editorBuilder = new EditorBuilder(survey); 
            setChangesValueSurvey(survey);
            setHasChanges(true);
          }
          const editorBuilder = new EditorBuilder(survey); 
          editorBuilder.onChangeValue(itemId, key, newValue);
          setSurvey(editorBuilder.getSurvey());
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
          const editorBuilder = new EditorBuilder(changesValueSurvey); 
          setSurvey(changesValueSurvey);
          surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), surveyNav.getPageIdx());
          setHasChanges(false);
        },
      } as IEditorState,
      nav: surveyNav as INavState,
    } as IUseEditorState;
}