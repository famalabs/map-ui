import React from 'react';
import {ItemConditional} from '../../../survey'
import { Chip, FormLabel, MenuItem, Modal, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import { IUseEditorState } from './EditorBuilder';
import { QuestionStateMap } from './PageEditor';
import { QuestionCommonEditorForm, QuestionCommonEditorProps, QuestionGeneralEdit, renderGeneralOptions } from './CommonEditor';
import { Parameter, Expression, Literal, Operator, Identifier, CallExpression, ExpressionValue } from '../../../survey/src/lib/form/ast';
import { ItemConditionalMap } from '../../../core/schema';
import { IHierarchyValue, RenderHierarchy } from './HierarchyEditor';

export function ItemConditionalEditorForm({
  index,
  editorState,
  question,
  questionState,
  }: QuestionCommonEditorProps<ItemConditional>) {

  const editor = editorState.editor;
  const nav = editorState.nav;

  const renderExpressionValue = (ev:ExpressionValue):JSX.Element => {
    // if ('name' in ev) {
    //   return <Chip disabled label={"[ " + ev.type + " ] " + ev.name}/>;
    // }
    return null;
  }
  const renderOperator = (op:Operator):JSX.Element => {
    return (<Chip disabled label={question.expression.operator}/>);
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
    <Stack direction={'row'}><Typography>Operator:</Typography>{renderOperator(question.expression.operator)}</Stack>
    <Stack direction={'row'}><Typography>Right:</Typography>{renderExpressionValue(question.expression.right)}</Stack>
    </>)}
    </Stack>
    );
  }


  const [exprValModal, setExprValModal] = React.useState<boolean>(false);
  const handleExprVal = (ihv:IHierarchyValue) => {};
  const renderTopExprVal = () => null;
  const renderInsideExprVal = () => null;
  const renderExprValModal = () => (
    <RenderHierarchy 
    question={question}
    editorState={editorState}
    activeModal={exprValModal}
    setActiveModal={setExprValModal}
    handleConfirm={handleExprVal}
    topHierarchy={renderTopExprVal()}
    insideHierarchy={renderInsideExprVal()}
    insideHierarchyPos={'sq'}
    />
  )

  const renderEdit = () => {
    return (
      <Stack direction={'row'} spacing={2}>
        <Stack spacing={1}>
          <Typography>Left:</Typography>
          <Select
            value={question.expression.operator}
            onChange={(e,v) => {editor.onChangeValue(question.id, 'expression.operator', e.target.value)}}
          >
              {Object.values(ItemConditionalMap.expression.operator).map((op, idx) => { 
                if (op !== "") return (
                <MenuItem key={idx} value={op}>{op}</MenuItem>
              )})}
          </Select>
        </Stack>
        <Stack spacing={1}>
          <Typography>Operator:</Typography>
          <Select
            value={question.expression.operator}
            onChange={(e,v) => {editor.onChangeValue(question.id, 'expression.operator', e.target.value)}}
          >
              {Object.values(ItemConditionalMap.expression.operator).map((op, idx) => { 
                if (op !== "") return (
                <MenuItem key={idx} value={op}>{op}</MenuItem>
              )})}
          </Select>
        </Stack>
        <Stack spacing={1}>
          <Typography>Right:</Typography>
          <Select
            value={question.expression.operator}
            onChange={(e,v) => {editor.onChangeValue(question.id, 'expression.operator', e.target.value)}}
          >
              {Object.values(ItemConditionalMap.expression.operator).map((op, idx) => { 
                if (op !== "") return (
                <MenuItem key={idx} value={op}>{op}</MenuItem>
              )})}
          </Select>
        </Stack>
      </Stack>
    );
  }
  const renderLayout = () => {
    return null;
  }
  // console.log('render Date', questionState);
  return (
    <>{renderExprValModal()}
    <QuestionCommonEditorForm 
      contentNormal={renderNormal()} 
      contentEdit={renderEdit()} 
      contentLayout={renderLayout()} 
      index={index} 
      editorState={editorState} 
      question={question} 
      questionState={questionState}    
    /></>
  );
}