import React from 'react';
import {Item, QuestionSelect} from '../../../survey'
import { Radio, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { QuestionCommonProps, QuestionHeaderCommon } from './QuestionCommon';
import { IUseFormCompiler, useQuestionHandler } from '../Compiler';

export interface QuestionTableCommonProps extends QuestionCommonProps<Item> {
  formCompiler?: IUseFormCompiler;
}

export function QuestionTableCommon({
  index,
  question,
  required,
  value,
  handleOnChange,
  handleOnBlur,
  error,
  helperText,
  disabled,
  formCompiler,
  }: QuestionTableCommonProps) {
  
  const selects = question.items as QuestionSelect[];
  const select = question.items[0] as QuestionSelect;
  const options = select.getSchema().options.select;

  return (
    <Stack spacing={1}>
      <QuestionHeaderCommon
        index={index}
        question={question}
        required={required}
      />
      <TableContainer>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell>Questions</TableCell>
              {options.map((opt, idx) => {
                return (
                  <TableCell align="center">{opt.text}</TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {selects.map((sel,idx) => {
              return (
                <TableRow
                  key={idx}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {sel.text}
                  </TableCell>
                  {options.map((opt, idx) => {
                    if (typeof formCompiler !== 'undefined') {
                      const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(sel, formCompiler);  
                      return (
                        <TableCell align="center">
                          <Radio
                            disabled={disabled}
                            checked={value === opt.text}
                            value={opt.text}
                            onChange={(e,v) => {
                              if (v) { handleOnChange(opt.text) }
                            }}
                          />
                        </TableCell>
                      );
                    }
                  return (
                    <TableCell align="center">
                      <Radio
                        disabled={disabled}
                      />
                    </TableCell>
                  );
                })}
                </TableRow>
              //   </RadioGroup>
              // </FormControl>
              );
            })}
          </TableBody>
      </Table>
    </TableContainer>
    </Stack>
  );
}