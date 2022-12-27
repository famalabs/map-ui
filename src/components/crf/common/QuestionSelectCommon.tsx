import React from 'react';
import {QuestionSelectMap} from '../../../core/schema'
import {QuestionSelect} from '../../../survey'
import { FormControlLabel, FormControl, Typography, FormLabel, RadioGroup, Radio, Select, MenuItem, FormHelperText } from '@mui/material';
import { QuestionCommonProps, QuestionHeaderCommon } from './QuestionCommon';

export function QuestionSelectCommon({
  index,
  question,
  required,
  value,
  handleOnChange,
  handleOnBlur,
  error,
  helperText,
  disabled
  }: QuestionCommonProps<QuestionSelect>) {

  const selects = question.getSchema().options.select;
  
  return (
    <div>
    <FormControl
    fullWidth
    >
      <QuestionHeaderCommon
        index={index}
        question={question}
        required={required}
      />
      {question.layout.style === QuestionSelectMap.layout.style.radio ? (
        <RadioGroup
          name={question.id}
          value={value ?? ''}
          onChange={(e,v) => handleOnChange(v)}
          onBlur={handleOnBlur}
        >
          {selects.length > 0 ? selects.map((opt, idx) => (
            <FormControlLabel key={idx} disabled={disabled} value={opt.text} 
            control={<Radio />} label={opt.text} />
          )) : <Typography>No Radio Element</Typography>}
        </RadioGroup>
      ):(
        <Select
          disabled={disabled}
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