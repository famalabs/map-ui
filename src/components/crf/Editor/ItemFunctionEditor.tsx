import React from 'react';
import {ItemFunction, FnMap} from '../../../core/schema'
import { TextField, FormLabel, Typography } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { IUseEditorState } from './EditorBuilder';
import { QuestionGeneralEdit, QuestionStateMap, renderGeneralOptions } from './QuestionEditor';

export interface ItemFunctionEditorFormProps<T> {
  editorState: IUseEditorState;
  question: ItemFunction<T>;
  questionState: string;
}

export function ItemFunctionEditorForm<T>({
  editorState,
  question,
  questionState,
  }: ItemFunctionEditorFormProps<T>) {
  const editor = editorState.editor;
  const nav = editorState.nav;

  const renderIcon = () => {
    return (<TextFieldsIcon/>);
  }

  const renderNormal = () => {
    return (
      <div>
        <div>
          <Typography>{question.text}</Typography>
          <Typography>{question.description}</Typography>
          <Typography>{question.fnCompute.fnName}</Typography>
          {/* <TextField
            disabled
            value={question.description ?? question.text}
            label={question.description ?? question.text}
            required={question.options.required}
          /> */}
        </div>
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
  console.log('render fn', questionState);
  return (
    <div>
    {questionState === QuestionStateMap.normal ? (
      renderNormal()
    ) : questionState === QuestionStateMap.hover ? (
      renderHover()
    ) : questionState === QuestionStateMap.edit ? (
      renderEdit()
    ) : questionState === QuestionStateMap.options ? (
      null
    ) : questionState === QuestionStateMap.layout ? (
      renderLayout()
    ) : null}
    </div>
  );
}