import React from 'react'
import { Item } from '../../../survey'
import { IUseEditorState } from './EditorBuilder';

export interface QuestionCommonEditorProps<T extends Item> {
  index: string;
  editorState: IUseEditorState;
  question: T;
  questionState: string;
}