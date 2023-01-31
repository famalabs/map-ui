import React from 'react';
import {Item, QuestionCheck, QuestionSelect, TextScore} from '../../../survey'
import {QuestionMenuTypesMap, QuestionSelectMap} from '../../forms'
import { Button, TextField, FormControlLabel, FormControl, Typography, FormLabel, Stack, RadioGroup, Radio, Divider, Select, MenuItem, Checkbox } from '@mui/material';
import { AddCircle, Delete, ArrowUpward, ArrowDownward, Check } from '@mui/icons-material';
import { IUseEditorState } from './EditorBuilder';
import { QuestionMultipleSelectCommon, QuestionSelectCommon } from '../common';
import { QuestionCommonEditorForm, QuestionCommonEditorProps, QuestionGeneralEdit, renderGeneralOptions } from './CommonEditor';

export function QuestionMultipleSelectEditorForm({
  index,
  editorState,
  question,
  questionState,
  }: QuestionCommonEditorProps<Item>) {
  const editor = editorState.editor;
  const nav = editorState.nav;

  const selects = question.items as QuestionCheck[];

  const addSelect = () => {
    editor.addQuestion(QuestionMenuTypesMap.check.type, question.id);
    // selects.push({text:"",score:selects.length} as TextScore);
    // editor.onChangeValue(question.id, 'selectOptions', selects);
  } 
  const removeSelect = (idx:number) => {
    const itm = selects[idx];
    editor.removeItem(itm);
    // var newSelects = [];
    // for (let i = 0; i < selects.length; i++) {
    //   if (i < idx) {
    //     newSelects.push(selects[i]);
    //   } else if (i > idx) {
    //     var newSelect = selects[i];
    //     newSelect.score -= 1;
    //     newSelects.push(newSelect)
    //   }
    // }
    // editor.onChangeValue(question.id, 'selectOptions', newSelects);
  } 
  const moveSelect = (idx:number, move:number) => {
    const itm = selects[idx];
    // if (idx+move < 0 || idx+move >= selects.length) { return; }
    // const itemIdx = selects[idx];
    // selects[idx] = selects[idx+move];
    // selects[idx+move] = itemIdx;
    // editor.onChangeValue(question.id, 'selectOptions', selects);
    if (move > 0) { editor.moveItemDown(itm) } else { editor.moveItemUp(itm) }
  } 
  const textSelect = (idx:number, value:string) => {
    // selects[idx].text = value;
    editor.onChangeValue(selects[idx].id, 'text', value);
  }

  const renderNormal = () => {
    return (
      <QuestionMultipleSelectCommon
      index={index}
      question={question}
      required={false}
      // required={question.options.required}
      disabled={true}
      />
    );
  }
  const renderEdit = () => {
    return (
        <FormControl
        >
          <RadioGroup
            name={question.id}
            aria-label={question.id}
            style={{margin:'0.25rem'}}
          >
            {selects.map((opt, idx) => (
              <Stack direction="row" spacing={1} 
              key={idx}
              style={{margin:'0.25rem'}}>
                <FormControlLabel disabled 
                key={idx} value="disabled" 
                control={<Checkbox />} label=""
                />
                <TextField
                  value={opt.text}
                  onChange={(e) => {textSelect(idx, e.target.value)}}
                />
                <Button 
                variant="outlined" 
                color="inherit" 
                onClick={(e) => {moveSelect(idx,-1)}}>
                <ArrowUpward />
                </Button>
                <Button 
                variant="outlined" 
                color="inherit" 
                onClick={(e) => {moveSelect(idx,1)}}>
                <ArrowDownward />
                </Button>
                <Button 
                variant="outlined" 
                color="inherit" 
                onClick={(e) => {removeSelect(idx)}}>
                <Delete />
                </Button>
              </Stack> 
            ))}
          </RadioGroup>
          <Button 
          variant="outlined" 
          color="inherit" 
          onClick={(e) => {addSelect()}}>
          <AddCircle />
          </Button>
        </FormControl>
    );
  }
  const renderLayout = () => {
    return null;
  }
  // console.log('render Select', questionState);
  return (
    <QuestionCommonEditorForm 
      contentNormal={renderNormal()} 
      contentEdit={renderEdit()} 
      contentLayout={renderLayout()} 
      index={index} 
      editorState={editorState} 
      question={question} 
      questionState={questionState}    
    />
  );
}