import React from 'react';
import {QuestionSelect, SurveyItem} from '../../../core/schema'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Radio, Typography } from '@mui/material';
import { IUseFormCompiler, useQuestionHandler } from './FormCompiler';

export interface QuestionTableCompilerFormProps {
  formCompiler: IUseFormCompiler;
  question: SurveyItem;
}

export function QuestionTableCompilerForm({
  formCompiler,
  question,
  }: QuestionTableCompilerFormProps) {
  const form = formCompiler.form;
  const nav = formCompiler.nav;

  const { value, required, handleOnChange, handleOnBlur, error, helperText } = useQuestionHandler(question, formCompiler);

  const selects = question.items as QuestionSelect[];
  const select = question.items[0] as QuestionSelect;
  const options = select.selectOptions;

  return (
    <TableContainer>
      <Typography>{question.text}</Typography>
      <Typography>{question.description}</Typography>
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
          {selects.map((sel,idx) => (
            <TableRow
              key={idx}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {sel.text}
              </TableCell>
              {options.map((opt, idx) => {
              return (
                <TableCell align="right"><Radio disabled/></TableCell>
              );
            })}
            </TableRow>
          ))}
        </TableBody>
    </Table>
  </TableContainer>
  );
}