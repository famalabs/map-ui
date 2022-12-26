import React from 'react';
import {QuestionNumberMap, QuestionDateMap} from '../../../core/schema'
import {Item} from '../../../survey'
import { FormLabel, Stack, Typography, Slider, InputAdornment, TextField } from '@mui/material';
import { IUseFormCompiler, useQuestionHandler } from './FormCompiler';
// import * as dayjs from 'dayjs'
// import 'dayjs/locale/it';
// import 'dayjs/locale/en';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

export interface QuestionDateCompilerFormProps {
  index?: number;
  formCompiler: IUseFormCompiler;
  question: Item;
}

export function QuestionDateCompilerForm({
  index,
  formCompiler,
  question,
  }: QuestionDateCompilerFormProps) {
  const form = formCompiler.form;
  const nav = formCompiler.nav;

  const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(question, formCompiler);

  // console.log('render number', questionState);
  return (
    <Stack spacing={1}>
      <Stack spacing={1}>
        <FormLabel component="legend">
        <Typography>{index && (index + '.')} {question.text}{question.options.required && '*'}</Typography>
        </FormLabel>
        <FormLabel component="legend">{question.description}</FormLabel>
          {/* <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={nav.getFolder().parent.options.locale}> */}
          <DatePicker
          // disableFuture
          label={question.text}
          openTo="year"
          views={['year', 'month', 'day']}
          value={value ?? ''}
          onChange={(newValue) => {handleOnChange(newValue)}}
          renderInput={(params) => <TextField {...params} />}
        />
          {/* </LocalizationProvider> */}
      </Stack>
    </Stack>
  );
}