import React from 'react';
import {QuestionSelect, Item} from '../../../survey'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Radio, Typography, FormLabel, RadioGroup, FormControl } from '@mui/material';
import { IUseFormCompiler, useQuestionHandler } from './FormCompiler';

export interface QuestionTableCompilerFormProps {
  formCompiler: IUseFormCompiler;
  question: Item;
  index?: number;
}

export function QuestionTableCompilerForm({
  formCompiler,
  question,
  index,
  }: QuestionTableCompilerFormProps) {
  const form = formCompiler.form;
  const nav = formCompiler.nav;

  const selects = question.items as QuestionSelect[];
  const select = question.items[0] as QuestionSelect;
  const options = select.getSchema().options.select;

  return (
    <TableContainer>
      {/* <Typography>{question.text}</Typography>
      <Typography>{question.description}</Typography> */}
      <FormLabel component="legend">{index && (index + '.')} {question.text}</FormLabel>
      <FormLabel component="legend">{question.description}</FormLabel>
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

            const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(sel, formCompiler);
            
            return (
            // <FormControl>
            //   <RadioGroup
            //   value={value}
            //   onChange={(e,v)=>handleOnChange(v)}
            //   >
              <TableRow
                key={idx}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {sel.text}
                </TableCell>
                {options.map((opt, idx) => {
                return (
                  <TableCell align="center">
                    {/* <FormControlLabel value={opt.text} control={<Radio />} /> */}
                    <Radio
                      checked={value === opt.text}
                      value={opt.text}
                      onChange={(e,v) => {
                        if (v) { handleOnChange(opt.text) }
                      }}
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
  );
}