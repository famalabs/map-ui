import React from 'react';
import {QuestionSelect, QuestionSelectMap} from '../../../core/schema'
import { FormControlLabel, FormControl, Typography, FormLabel, RadioGroup, Radio, Select, MenuItem, FormHelperText } from '@mui/material';
import { IUseFormCompiler, useQuestionHandler } from './FormCompiler';

export interface QuestionSelectCompilerFormProps {
  index: number;
  formCompiler: IUseFormCompiler;
  question: QuestionSelect;
}

export function QuestionSelectCompilerForm({
  index,
  formCompiler,
  question,
  }: QuestionSelectCompilerFormProps) {
  const form = formCompiler.form;
  const nav = formCompiler.nav;

  const selects = question.selectOptions;

  const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(question, formCompiler);

  // console.log('render Select', questionState);
  return (
    <div>
    <FormControl
    fullWidth
    >
      
      <FormLabel component="legend">
      <Typography>{index && (index + '.')} {question.text}{question.options.required && '*'}</Typography>  
      </FormLabel>
      <FormLabel component="legend">{question.description}</FormLabel>
      {question.layout.style === QuestionSelectMap.layout.style.radio ? (
        <RadioGroup
          name={question.id}
          value={value ?? ''}
          onChange={(e,v) => handleOnChange(v)}
          onBlur={handleOnBlur}
        >
          {selects.length > 0 ? selects.map((opt, idx) => (
            <FormControlLabel key={idx} value={opt.text} 
            control={<Radio />} label={opt.text} />
          )) : <Typography>No Radio Element</Typography>}
        </RadioGroup>
      ):(
        <Select
          value={value ?? ''}
          onChange={(e,v) => handleOnChange(e.target.value)}
          required={required}
          onBlur={handleOnBlur}
        >
            {selects.length > 0 ? selects.map((opt, idx1) => (
              <MenuItem key={opt.text} value={opt.text}>{opt.text}</MenuItem>
            )) : <Typography>No Dropdown Element</Typography>}
        </Select>
      )}
      <FormHelperText>{error && helperText}</FormHelperText>
    </FormControl>
    </div>
  );
}