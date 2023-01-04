import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SurveyEditorForm, SurveyEditorProps } from '../../src/components/crf/Editor';
// import surveyFormExmple from './asdf.json'
// import crfForm from './crf.json'
import { DBSchema } from '../../src/survey';
import { crf } from './crf';

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'crf/Editor',
  component: SurveyEditorForm,
  argTypes: {},
} as Meta;


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

const Template: Story<SurveyEditorProps> = (args) => <SurveyEditorForm {...args} initSurvey={crf as DBSchema}/>;

export const Primary: Story<SurveyEditorProps> = Template.bind({});

Primary.args = {
  saveSurvey: (survey) => console.log(survey),
};
