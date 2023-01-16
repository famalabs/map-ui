import React, { useState } from 'react'
// import {Survey, SurveyMap, fromMapToDefault, SurveyItem, QuestionTextMap, QuestionNumberMap, QuestionSelectMap, QuestionDateMap, QuestionCheckMap, Question, QuestionText, QuestionNumber, QuestionSelect, QuestionDate, QuestionCheck,GroupMap, QuestionMap, FnMap, ItemFunction} from '../../../core/schema'
import { SurveyMap, fromMapToDefault, QuestionTextMap, QuestionNumberMap, QuestionSelectMap, QuestionDateMap,GroupMap, QuestionMap, FnMap, QuestionCheckMap} from '../../../core/schema'
import { INavState, SurveyNav, useNavState } from '../Navigation';
import { getQuestionMenuType, QuestionMenuTypesMap } from '../../../core/schema/config-types';
import { Survey, Item, DBSchema, SurveyMode, Question, QuestionCheck, QuestionNumber, QuestionNumberOptions, QuestionDate, QuestionSelect, QuestionText, TextScore, ItemFunction, ItemConditional } from '../../../survey'
import { Expression } from '../../../survey/src/lib/form/ast';
import { ComputableData } from '../../../survey/src/lib/form/computable';
import { QuestionList, QuestionListOptions} from '../../../survey/src/lib/form/question-list';

export interface IEditorState {
  getSurvey: () => Survey;
  getRoot: () => Item;
  addFolder: () => void;
  addPage: (folder: Item) => void;
  addQuestion: (type:string, parentId?:string) => Item;
  changeQuestionType: (item: Item, newType: string) => void;
  removeItem: (item:Item) => void;
  duplicateItem: (item:Item) => void;
  moveItemUp: (item:Item) => void;
  moveItemDown: (item:Item) => void;
  /**
   * !USE ONLY FOR QUESTION OR SECTION
   * 
   * TODO: make it for ecerything
   * @param item 
   * @param idx 
   * @param parentId 
   * @returns 
   */
  moveItem: (item:Item, idx:number, parentId?:string) => void;
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
      this.root = survey.root;
    }
    public getSchema():DBSchema {
      return this.root.toJSON();
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
    public addFolder(): Item {
      const defaultFolder = {
        type: Item.TYPE,
        text: "Folder",
        items: [],
      }  as Partial<DBSchema>;
      const folder = this.survey.add(this.root.id, defaultFolder, -1);
      const defaultPage = {
        type: Item.TYPE,
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
        type: Item.TYPE,
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
      } else if (type === QuestionMenuTypesMap.multipleSelect.type) {
        return this.addQuestionMultipleSelect(nav, parentId, index ?? -1);
      } else if (type === QuestionMenuTypesMap.check.type) {
        return this.addQuestionCheck(nav, parentId, index ?? -1);
      } else if (type === QuestionMenuTypesMap.switch.type) {
        return this.addQuestionSwitch(nav, parentId, index ?? -1);
      } else if (type === QuestionMenuTypesMap.date.type) {
        return this.addQuestionDate(nav, parentId, index ?? -1);
      // } else if (type === QuestionMenuTypesMap.list.type) {
      //   return this.addQuestionList(nav, parentId, index ?? -1);
      } else if (type === QuestionMenuTypesMap.selectTable.type) {
        return this.addQuestionSelectTable(nav, parentId, index ?? -1);
      } else if (type === QuestionMenuTypesMap.fn.type) {
        return this.addFnItem(nav, parentId, index ?? -1);
      } else if (type === QuestionMenuTypesMap.cond.type) {
        return this.addCondItem(nav, parentId, index ?? -1);
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
      sel.addSelect({text:"",score:0} as TextScore, -1);
      sel.addSelect({text:"",score:1} as TextScore, -1);
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
      sel.addSelect({text:"",score:0} as TextScore, -1);
      sel.addSelect({text:"",score:1} as TextScore, -1);
      return sel;
    }

    public addQuestionMultipleSelect(nav: INavState, parentId?:string, index?:number):Item {
      const data = {
        type:Item.TYPE,
        layout:{style:'',},
        options: {}
        // options: {
        //   required: true,
        // }
      } as Partial<DBSchema>;
      const multi = this.survey.add(parentId ?? nav.getPageId(), data, index ?? -1) as Item;
      for (let i = 0; i < 2; i++) {
        const sel = this.addQuestionCheck(nav, multi.id);
        sel.text = "";
      }
      // sel.addSelect({text:"",score:0} as TextScore, -1);
      // sel.addSelect({text:"",score:1} as TextScore, -1);
      return multi;
    }
    
    public addQuestionSelectTable(nav: INavState, parentId?:string, index?:number):Item {
      const data = {
        type:Item.TYPE,
        items:[],
        layout: {
          style: GroupMap.layout.style.table
        }
      } as Partial<DBSchema>;
      const table = this.survey.add(parentId ?? nav.getPageId(), data, index ?? -1);

      for (let i = 0; i < 2; i++) {
        const sel = this.addQuestionSelect(nav, table.id);
        sel.text = "";
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
    public addQuestionList(nav: INavState, parentId?:string, index?:number):Item {
      const data = {
        type:QuestionList.TYPE,
        options: {
          required: false,
          source: '',
          min: 0,
          max: 0,
        }
      } as Partial<QuestionListOptions>;
      const qs = this.survey.add(parentId ?? nav.getPageId(), data, index ?? -1) as QuestionList;
      return qs;
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
      fn.setFn(FnMap.fn.BodyMassIndex);
      return fn;
    }
    public addCondItem(nav: INavState, parentId?:string, index?:number):Item {
      const data = {
        type:ItemConditional.TYPE,
        expression: {
          type: 'exp',
          operator: null,
          left: null,
          right: null,
        } as Expression
      } as Partial<ComputableData>;
      const cond = this.survey.add(parentId ?? nav.getPageId(), data, index ?? -1) as ItemConditional;
      return cond;
    }
    public addSection(nav: INavState):Item {
      const data = {
        type:Item.TYPE,
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
        const selects = removed.toJSON().options.select;
        added.setOption("select",selects);
      } else if ((removed instanceof QuestionSelect) && (getQuestionMenuType(added) === QuestionMenuTypesMap.cond.type)) {
          const selects = removed.toJSON().options.select;
          for (let i = 0; i < selects.length; i++) {
            if (i < added.items.length) {
              added.items[i].text = selects[i].text;
            } else {
              const sel = this.addQuestionCheck(nav, added.id);
              sel.text = selects[i].text;
            }
          }

        } else if ((added instanceof QuestionSelect) && (getQuestionMenuType(removed) === QuestionMenuTypesMap.cond.type)) {

          for (let i = 0; i < removed.items.length; i++) {
            added.addSelect({score:i,text:removed.items[i].text} as TextScore, -1);
          }

        }
    }

    public duplicateItem (item: Item) {
      const duplSchema:DBSchema = duplicateDBSchema(item.toJSON());
      delete duplSchema.id;
      delete duplSchema.items;
      console.log("recursive", duplSchema, item.items);
      this.survey.add(item.parent().id, duplSchema, -1);

      for (let i = 0; i < item.items.length; i++) {
        this.duplicateItem(item.items[i]);
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
      // this.survey.update(item.id, item.getSchema(), curIdx-1);
      this.survey.move(item.id, curIdx-1)
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
      // this.survey.update(item.id, item.toJSON(), curIdx+1);
      this.survey.move(item.id, curIdx+1)
      return curIdx+1;
    }

    public moveItem (item:Item, idx:number, parentId:string) {
      this.survey.move(item.id, idx, parentId);
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
      const newData = this.createDBSchemaFromPath(key, newValue, item.toJSON());
      const newSchema = Object.assign({}, item.toJSON(), newData) as DBSchema;
      this.survey.update(itemId, newSchema);
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

const removeKeys = (obj:DBSchema, keys:string[]) => Object.keys(obj)
          .filter((k) => !keys.includes(k))
          .reduce(
            (acc, x) => Object.assign(acc, { [x]: removeKeys(obj[x], keys) }),
            {}
          )

function duplicateDBSchema(schema:DBSchema):DBSchema {
  return JSON.parse(JSON.stringify(schema)) as DBSchema;
}

export function useEditorState(initSchema:DBSchema): IUseEditorState {

    const initValue = duplicateDBSchema(initSchema);

    // const initValue = {
    //   id: "0",
    //   type: Item.TYPE,
    //   text: "Survey",
    //   items: [{
    //     id: "1",
    //     type: Item.TYPE,
    //     text: "Folder",
    //     items: [{
    //       id: "2",
    //       type: Item.TYPE,
    //       text:"Page",
    //       items:[],
    //       layout: {
    //         style: "card",
    //       }
    //     }]
    //   }],
    // } as DBSchema;

    console.log("editorBuilder initValue", initValue);
    const initSurvey = new Survey(initValue);

    const [survey, setSurvey] = React.useState<Survey>(initSurvey);
    console.log('editorBuilder initSurvey initSurvey.root survey root json', initSurvey, initSurvey.root, survey, survey.root, survey.toJSON());
    // const [surveySchema, setSurveySchema] = React.useState<DBSchema>(initValue);
    // const survey = new Survey(surveySchema);
    // const setSurvey = (survey:Survey) => {setSurveySchema(survey.toJSON())};
    const getRoot = (s:Survey) => s.root;


    // takes saved the survey before changes, if not save, restore prev values
    // must control other actions 
    const [hasChanges, setHasChanges] = React.useState<boolean>(false);
    const [changesValueSurvey, setChangesValueSurvey] = React.useState<Survey>(survey);

    const surveyNav = useNavState(getRoot(survey));

    console.log('editorBuilder survey', survey);
    
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
        duplicateItem: (item:Item) => {
          const editorBuilder = new EditorBuilder(survey); 
          editorBuilder.duplicateItem(item);
          surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), surveyNav.getPageIdx());
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
        moveItem: (item:Item, idx:number, parentId?:string) => {
          const editorBuilder = new EditorBuilder(survey);
          // editorBuilder.moveItem(item, idx, parentId);
          survey.move(item.id, idx, parentId);
          setSurvey(survey);
          surveyNav.updateAndSetWithIds(editorBuilder.getRoot(), surveyNav.getFolderIdx(), surveyNav.getPageIdx());
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