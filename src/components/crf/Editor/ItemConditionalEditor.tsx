import React from 'react';
import {ItemConditional} from '../../../survey'
import { Chip, FormLabel, Modal, Paper, Stack, TextField, Typography } from '@mui/material';
import { IUseEditorState } from './EditorBuilder';
import { QuestionStateMap } from './PageEditor';
import { QuestionCommonEditorForm, QuestionCommonEditorProps, QuestionGeneralEdit, renderGeneralOptions } from './CommonEditor';
import { Parameter, Expression, Literal, Identifier, CallExpression, ExpressionValue } from '../../../survey/src/lib/form/ast';

export function ItemConditionalEditorForm({
  index,
  editorState,
  question,
  questionState,
  }: QuestionCommonEditorProps<ItemConditional>) {

  const editor = editorState.editor;
  const nav = editorState.nav;

  const [modal, setModal] = React.useState<boolean>(false);

  const renderModal = () => {
    return (
      <Modal
      open={modal}
      onClose={(e) => {setModal(false)}}
      >
        <Paper sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: 520,
          p: '24px',
        }}>
          <Stack spacing={2}>
          </Stack>
        </Paper>
      </Modal>
    );
  }

  const renderExpressionValue = (ev:ExpressionValue):JSX.Element => {
    if ('name' in ev) {
      return <Chip disabled label={"[ " + ev.type + " ] " + ev.name}/>;
    }
    return null;
  }

  const renderNormal = () => {
    return (
    <Stack spacing={1}>
    <FormLabel component="legend">
    <Typography>{index}{question.text}</Typography>
    </FormLabel>
    <FormLabel component="legend">{question.description}</FormLabel>
    {question.expression !== null && (<>
    <Stack direction={'row'}><Typography>Left:</Typography>{renderExpressionValue(question.expression.left)}</Stack>
    <Stack direction={'row'}><Typography>Operator:</Typography><Chip disabled label={question.expression.operator.toString()}/></Stack>
    <Stack direction={'row'}><Typography>Right:</Typography>{renderExpressionValue(question.expression.right)}</Stack>
    </>)}
    </Stack>
    );
  }
  const renderEdit = () => {
    return (
      <Stack direction={'row'}>
        <Stack>
          <Typography>Left:</Typography>
          <Chip disabled label={""}/>
        </Stack>
      </Stack>
    );
  }
  const renderLayout = () => {
    return null;
  }
  // console.log('render Date', questionState);
  return (
    <QuestionCommonEditorForm 
      contentNormal={renderNormal()} 
      contentEdit={renderEdit()} 
      contentLayout={renderLayout()} 
      index={index} 
      editorState={editorState} 
      question={question} 
      questionState={questionState}    
    />
  );
}