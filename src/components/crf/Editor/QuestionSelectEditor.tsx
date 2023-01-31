import React from 'react';
import {QuestionSelect, TextScore} from '../../../survey'
import {QuestionSelectMap} from '../../forms'
import { Button, TextField, FormControlLabel, FormControl, Typography, FormLabel, Stack, RadioGroup, Radio, Divider, Select, MenuItem } from '@mui/material';
import { AddCircle, Delete, ArrowUpward, ArrowDownward, ArrowDropUp, ArrowDropDown, Add, Remove } from '@mui/icons-material';
import { IUseEditorState } from './EditorBuilder';
import { QuestionSelectCommon } from '../common';
import { QuestionCommonEditorForm, QuestionCommonEditorProps, QuestionGeneralEdit, renderGeneralOptions } from './CommonEditor';

export function QuestionSelectEditorForm({
  index,
  editorState,
  question,
  questionState,
  }: QuestionCommonEditorProps<QuestionSelect>) {
  const editor = editorState.editor;
  const nav = editorState.nav;

  const selects = question.options.select;
  if (typeof selects === 'undefined') { return null; }
  const nextScore = (add?:number):number => {
    const scores = selects.map((val)=>val.score);
    let i = 0;
    while (scores.includes(i)) {
      i += 1;
    }
    return i;
  }
  const addSelect = () => {
    selects.push({text:"",score:nextScore()} as TextScore);
    editor.onChangeValue(question.id, 'selectOptions', selects);
  } 
  const removeSelect = (idx:number) => {
    var newSelects = [];
    for (let i = 0; i < selects.length; i++) {
      if (i < idx) {
        newSelects.push(selects[i]);
      } else if (i > idx) {
        var newSelect = selects[i];
        // newSelect.score -= 1;
        newSelects.push(newSelect)
      }
    }
    editor.onChangeValue(question.id, 'selectOptions', newSelects);
  } 
  const moveSelect = (idx:number, move:number) => {
    if (idx+move < 0 || idx+move >= selects.length) { return; }
    const itemIdx = selects[idx];
    selects[idx] = selects[idx+move];
    selects[idx+move] = itemIdx;
    editor.onChangeValue(question.id, 'selectOptions', selects);
  } 
  const textSelect = (idx:number, value:string) => {
    selects[idx].text = value;
    editor.onChangeValue(question.id, 'selectOptions', selects);
  }
  const scoreSelect = (idx:number, value:number) => {
    const scores = selects.map((val)=>val.score);
    // if (scores.includes(value)) { return }
    selects[idx].score = value;
    editor.onChangeValue(question.id, 'selectOptions', selects);
  }

  const renderNormal = () => {
    return (
      <QuestionSelectCommon
      index={index}
      question={question}
      required={question.options.required}
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
                control={<Radio />} label=""
                />
                <TextField
                  value={opt.text}
                  onChange={(e) => {textSelect(idx, e.target.value)}}
                />
                <Stack direction={'row'}>
                <TextField
                  disabled={true}
                  type={'number'}
                  value={opt.score}
                  onChange={(e) => {scoreSelect(idx, Number(e.target.value))}}
                  sx={{width:'56px'}}
                />
                <Stack>
                <Button 
                variant="outlined" 
                color="inherit" 
                onClick={(e) => {scoreSelect(idx, selects[idx].score+1)}}
                sx={{height:'28px',minWidth:'28px',pl:'5px',pr:'5px'}}
                >
                <Add/>
                </Button>
                <Button 
                variant="outlined" 
                color="inherit" 
                onClick={(e) => {scoreSelect(idx, selects[idx].score-1)}}
                sx={{height:'28px',minWidth:'28px',pl:'5px',pr:'5px'}}
                >
                <Remove/>
                </Button>
                </Stack>
                </Stack>

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