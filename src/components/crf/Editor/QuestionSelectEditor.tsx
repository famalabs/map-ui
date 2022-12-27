import React from 'react';
import {QuestionSelect, TextScore} from '../../../survey'
import {QuestionSelectMap} from '../../../core/schema'
import { Button, TextField, FormControlLabel, FormControl, Typography, FormLabel, Stack, RadioGroup, Radio, Divider, Select, MenuItem } from '@mui/material';
import { AddCircle, Delete, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { IUseEditorState } from './EditorBuilder';
import { QuestionGeneralEdit, renderGeneralOptions } from './QuestionEditor';
import { QuestionStateMap } from './PageEditor';
import { QuestionSelectCommon } from '../common';
import { QuestionCommonEditorProps } from './CommonEditor';

export function QuestionSelectEditorForm({
  index,
  editorState,
  question,
  questionState,
  }: QuestionCommonEditorProps<QuestionSelect>) {
  const editor = editorState.editor;
  const nav = editorState.nav;

  const selects = question.options.select;
  const addSelect = () => {
    selects.push({text:"New Radio",score:selects.length} as TextScore);
    editor.onChangeValue(question.id, 'selectOptions', selects);
  } 
  const removeSelect = (idx:number) => {
    var newSelects = [];
    for (let i = 0; i < selects.length; i++) {
      if (i < idx) {
        newSelects.push(selects[i]);
      } else if (i > idx) {
        var newSelect = selects[i];
        newSelect.score -= 1;
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
  const renderHover = () => {
    return renderNormal();
  }
  const renderEdit = () => {
    return (
      <div>
        {QuestionGeneralEdit(question, editor)}
        <Divider textAlign="left">Options</Divider>
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
      </div>
    );
  }
  const renderLayout = () => {
    return null;
  }
  // console.log('render Select', questionState);
  return (
    <div>
    {questionState === QuestionStateMap.normal ? (
      renderNormal()
    ) : questionState === QuestionStateMap.hover ? (
      renderHover()
    ) : questionState === QuestionStateMap.edit ? (
      renderEdit()
    ) : questionState === QuestionStateMap.options ? (
      // renderGeneralOptions(QuestionSelectMap.options,"Select options")
      renderGeneralOptions(question, editorState)
    ) : questionState === QuestionStateMap.layout ? (
      renderLayout()
    ) : renderNormal()}
    </div>
  );
}