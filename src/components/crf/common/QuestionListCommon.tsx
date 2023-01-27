import React from 'react';
import {QuestionSelectMap} from '../../forms'
import {QuestionSelect} from '../../../survey'
import { FormControlLabel, FormControl, Typography, FormLabel, RadioGroup, Radio, Select, MenuItem, FormHelperText } from '@mui/material';
import { QuestionCommonProps, QuestionHeaderCommon } from './QuestionCommon';
import { QuestionList } from '../../../survey/src/lib/form/question-list';

export function QuestionListCommon({
  index,
  question,
  required,
  value,
  handleOnChange,
  handleOnBlur,
  error,
  helperText,
  disabled
  }: QuestionCommonProps<QuestionList>) {

  const selects = question.values();
  
  return (
    <div>
      <QuestionHeaderCommon
        index={index}
        question={question}
        required={required}
      />
    <FormControl
    fullWidth
    >
        <RadioGroup
          name={question.id}
          value={value ?? ''}
          onChange={(e,v) => handleOnChange(v)}
          onBlur={handleOnBlur}
        >
          {selects && selects.length > 0 ? selects.map((opt, idx) => (
            <FormControlLabel key={idx} disabled={disabled} value={opt} 
            control={<Radio />} label={opt} 
            sx={{
              '&:hover, &.Mui-focusVisible': {
                backgroundColor: 'rgba(61, 90, 128, 0.04)'
              }
            }}
            />
          )) : <Typography>No Element</Typography>}
        </RadioGroup>
      <FormHelperText>{error && helperText}</FormHelperText>
    </FormControl>
    </div>
  );
}