import {Item, Question } from '../../../survey/src'
import React from 'react';
import { FormLabel, Stack, Typography } from '@mui/material';

export interface QuestionCommonProps<T extends Item> {
  index: string;
  question: T;
  required: boolean;
  disabled: boolean;
  // compiler
  value?: any;
  handleOnChange?: any;
  handleOnBlur?: any;
  error?: any;
  helperText?: any;
  // editor
}

export interface QuestionHeaderCommonPros {
  index: string;
  question: Item;
  required: boolean;
}

export function QuestionHeaderCommon({
  index,
  question,
  required,
  }: QuestionHeaderCommonPros) {
    
  return (
    <Stack spacing={1}>
    <FormLabel component="legend">
    <Typography>{index}{question.text}{required && '*'}</Typography>
    </FormLabel>
    <FormLabel component="legend">{question.description}</FormLabel>
    </Stack>
  );
}