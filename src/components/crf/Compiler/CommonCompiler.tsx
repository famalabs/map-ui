import React from 'react'
import { IUseFormCompiler } from './FormCompiler';
import { Item } from '../../../survey'

export interface QuestionCommonCompilerProps<T extends Item> {
  formCompiler: IUseFormCompiler;
  question: T;
	index: string;
}