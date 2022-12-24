import React from 'react';
import {QuestionDate} from '../../../survey'
import { FormLabel, TextField, Typography } from '@mui/material';
import { IUseEditorState } from './EditorBuilder';
import { QuestionGeneralEdit, renderGeneralOptions } from './QuestionEditor';
import { QuestionStateMap } from './PageEditor';
import { DatePicker } from '@mui/x-date-pickers';

export interface QuestionDateEditorFormProps {
  index?: number;
  editorState: IUseEditorState;
  question: QuestionDate;
  questionState: string;
}

export function QuestionDateEditorForm({
  index,
  editorState,
  question,
  questionState,
  }: QuestionDateEditorFormProps) {
  const editor = editorState.editor;
  const nav = editorState.nav;

  const renderNormal = () => {
    return (
        <div>
          <FormLabel component="legend">
          <Typography>{index && (index + '.')} {question.text}{question.options.required && '*'}</Typography>  
          </FormLabel>
          <FormLabel component="legend">{question.description}</FormLabel>
          {/* <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={editor.getRoot().options.locale}> */}
            <DatePicker
            disabled
            views={['year', 'month', 'day']}
            // value={question.description ?? question.text}
            // label={question.description ?? question.text}
            // required={question.options.required}
            renderInput={(params) => <TextField {...params} />} 
            onChange={(v,k)=> {}}
            value={undefined}
            />
          {/* </LocalizationProvider> */}
        </div>
    );
  }
  const renderHover = () => {
    return renderNormal();
  }
  const renderEdit = () => {
    return (
      <div>
        {QuestionGeneralEdit(question, editor)}
      </div>
    );
  }
  const renderLayout = () => {
    return null;
  }
  // console.log('render Date', questionState);
  return (
    <div>
    {questionState === QuestionStateMap.normal ? (
      renderNormal()
    ) : questionState === QuestionStateMap.hover ? (
      renderHover()
    ) : questionState === QuestionStateMap.edit ? (
      renderEdit()
    ) : questionState === QuestionStateMap.options ? (
      // renderGeneralOptions(QuestionDateMap.options,"Date options")
      renderGeneralOptions(question, editorState)
    ) : questionState === QuestionStateMap.layout ? (
      renderLayout()
    ) : renderNormal()}
    </div>
  );
}