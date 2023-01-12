import React from 'react';
import {ItemConditional} from '../../../survey'
import { Button, Checkbox, Chip, FormControlLabel, FormLabel, MenuItem, Modal, Paper, Select, Stack, TextField, Typography } from '@mui/material';
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
    if (ev !== null) {
      if (ev.type === 'id') {
        return <Chip disabled label={ev.name}/>;
      } else if (ev.type === 'v') {
        return <Chip disabled label={ev.value}/>;
      }
    }
    return (<Chip disabled label={'null'}/>);
  }
  const renderOperator = (op:Operator):JSX.Element => {
    if (op !== null) {
      return (<Chip disabled label={question.expression.operator}/>);
    }
    return (<Chip disabled label={'null'}/>);
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

  const params = ['id','v'] as const;
  const [paramModal, setParamModal] = React.useState({active:false,param:'',value:null});
  const renderParamModal = ():JSX.Element => {
    const literals = ['boolean','number','string'] as const;
    return (
      <Modal
      open={paramModal.active}
      onClose={(e) => {setParamModal({active:false,param:paramModal.param,value:paramModal.value})}}
      >
      <Paper sx={{
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: 520,
        p: '24px',
      }}>
        <Stack spacing={2} direction={'row'}>
          <Stack spacing={1}>
            <Typography>Type:</Typography>
            <Select
                value={paramModal.param}
                onChange={(e,v) => {
                  setParamModal({active:paramModal.active,param:e.target.value,value:paramModal.value});
                  if (e.target.value === 'id') setIdentifierModal(true);
                }}
              >
              {params.map((op, idx) => (
                <MenuItem key={idx} value={op}>{op}</MenuItem>
              ))}
            </Select>
          </Stack>
          {paramModal.param === 'id' && (<Stack spacing={1}>
            <Typography>Identifier:</Typography>
            <Button 
            variant={"text"} 
            color={"inherit"}
            onClick={(e)=>{setIdentifierModal(true)}}>
              {renderExpressionValue(question.expression.left)}</Button>
            </Stack>)}
          {paramModal.param === 'v' && (<Stack spacing={1}>
            <Typography>Literal:</Typography>
            <Select
                // value={paramModal.param}
                onChange={(e,v) => {setParamModal({active:paramModal.active,param:paramModal.param,value:e.target.value})
                }}
              >
              {literals.map((lit, idx) => (
                <MenuItem key={idx} value={lit}>{lit}</MenuItem>
              ))}
            </Select>
          </Stack>)}
          {paramModal.param === 'v' && paramModal.value !== null &&
          paramModal.value === 'boolean' ? (<Stack spacing={1}>
            <Typography>Boolean:</Typography>
            <FormControlLabel control={
            <Checkbox 
            // checked={item.required} 
            onChange={(e)=>{}} />
            } label={''}/>
          </Stack>) : paramModal.value === 'number' ? (<Stack spacing={1}>
            <Typography>Number:</Typography>
            <TextField
            autoFocus
            variant='outlined'
            // value={item.text}
            onChange={(e) => {}}
          />
          </Stack>) : paramModal.value === 'string' ? (<Stack spacing={1}>
            <Typography>String:</Typography>
            <TextField
              autoFocus
              variant='outlined'
              // value={item.text}
              onChange={(e) => {}}
            />
          </Stack>) : null}
        </Stack>
      </Paper>
    </Modal>
    );
  }

  const [identifierModal, setIdentifierModal] = React.useState<boolean>(false);
  const handleidentifier = (ihv:IHierarchyValue) => {setParamModal({active:false,param:'',value:null})};
  const renderTopidentifier = () => null;
  const renderInsideidentifier = () => null;
  const renderIdentifierModal = () => (
    <RenderHierarchy 
    question={question}
    editorState={editorState}
    activeModal={identifierModal}
    setActiveModal={setIdentifierModal}
    handleConfirm={handleidentifier}
    topHierarchy={renderTopidentifier()}
    insideHierarchy={renderInsideidentifier()}
    insideHierarchyPos={'sq'}
    />
  )

  const renderEdit = () => {
    return (
      <Stack direction={'row'} spacing={2}>
        <Stack spacing={1}>
          <Typography>Left:</Typography>
          <Button 
          variant={"text"} 
          color={"inherit"}
          onClick={(e)=>{setParamModal({active:true,param:'',value:null})}}>
            {renderExpressionValue(question.expression.left)}</Button>
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
          <Button 
          variant={"text"} 
          color={"inherit"}
          onClick={(e)=>{setParamModal({active:true,param:'',value:null})}}>
            {renderExpressionValue(question.expression.left)}</Button>
        </Stack>
      </Stack>
    );
  }
  const renderLayout = () => {
    return null;
  }
  // console.log('render Date', questionState);
  return (
    <>{renderParamModal()}{renderIdentifierModal()}
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