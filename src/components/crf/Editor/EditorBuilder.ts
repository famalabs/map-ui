import React, { useState } from 'react'
import {Survey, SurveyMap, fromMapToDefault, SurveyItem, QuestionTextMap, QuestionNumberMap, QuestionSelectMap, QuestionDateMap, QuestionCheckMap} from '../../../core/schema'
import { useFormState } from '@src/components/forms';
import { INavState, useNavState } from '../Navigation';

export interface IEditorState {
    getSurvey: () => Survey;
    getRoot: () => SurveyItem;
    addFolder: () => void;
    addPage: (folder: SurveyItem) => void;
    addQuestionText: (page: SurveyItem) => void;
    addQuestionNumber: (page: SurveyItem) => void;
    addQuestionSelect: (page: SurveyItem) => void;
    addQuestionDate: (page: SurveyItem) => void;
    addQuestionCheck: (page: SurveyItem) => void;
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
    public addQuestionText(page: SurveyItem) {
        
    }
    public addQuestionNumber(page: SurveyItem) {
        
    }
    public addQuestionSelect(page: SurveyItem) {
        
    }
    public addQuestionDate(page: SurveyItem) {
        
    }
    public addQuestionCheck(page: SurveyItem) {
        
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
            addQuestionText: (page: SurveyItem) => console.log(defaultQuestion(QuestionTextMap.type)),
            addQuestionNumber: (page: SurveyItem) => console.log(defaultQuestion(QuestionNumberMap.type)),
            addQuestionSelect: (page: SurveyItem) => console.log(defaultQuestion(QuestionSelectMap.type)),
            addQuestionDate: (page: SurveyItem) => console.log(defaultQuestion(QuestionDateMap.type)),
            addQuestionCheck: (page: SurveyItem) => console.log(defaultQuestion(QuestionCheckMap.type)),
        } as IEditorState,
        nav: surveyNav as INavState
    } as IUseEditorState;
}