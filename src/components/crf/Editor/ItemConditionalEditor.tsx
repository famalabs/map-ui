import React from 'react';
import {DBSchema, ItemConditional, QuestionNumber, QuestionSelect} from '../../../survey'
import { Button, Checkbox, Chip, Divider, FormControlLabel, FormLabel, Menu, MenuItem, Modal, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import { IUseEditorState } from './EditorBuilder';
import { QuestionStateMap } from './PageEditor';
import { QuestionCommonEditorForm, QuestionCommonEditorProps, QuestionGeneralEdit, renderGeneralOptions } from './CommonEditor';
import { Parameter, Expression, Literal, Operator, Identifier, CallExpression, ExpressionValue } from '../../../survey/src/lib/form/ast';
import { ItemConditionalMap, QuestionMenuTypesMap } from '../../../core/schema';
import { IHierarchyValue, RenderHierarchy } from './HierarchyEditor';
import { AddCircle, Edit } from '@mui/icons-material';
import { QuestionEditorForm } from './QuestionEditor';

export interface ItemConditionalEditorProps extends QuestionCommonEditorProps<ItemConditional> {
  handleSetQuestionState: (id: string, state: string) => void;
}

export function ItemConditionalEditorForm({
  index,
  editorState,
  question,
  questionState,
  handleSetQuestionState,
  }: ItemConditionalEditorProps) {

  const editor = editorState.editor;
  const nav = editorState.nav;
  const locale = 'it';
  const thisQuestionState = typeof questionState[question.id] === 'undefined' ? questionState : questionState[question.id];

  const renderExpressionValue = (ev:ExpressionValue, other:ExpressionValue):JSX.Element => {
    if (ev !== null) {
      if (ev.type === 'id') {
        const condItem = nav.findItemById(ev.name)
        return <Chip disabled label={condItem.text}/>;
      } else if (ev.type === 'v') {
        if (other.type === 'id') {
          const condItem = nav.findItemById(other.name)
          if (condItem instanceof QuestionSelect) {
            return <Chip disabled label={condItem.options.select[ev.value].text}/>;
          }
        }
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

  const [anchorAddQuestion, setAnchorAddQuestion] = React.useState<null | HTMLElement>(null);
	const openAddQuestion = Boolean(anchorAddQuestion);
	const handleOpenAddQuestion = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorAddQuestion(event.currentTarget);
	};
	const handleAddQuestion = (type: string) => {
		setAnchorAddQuestion(null);
		if (typeof type !== 'undefined') {
			const qs = editor.addQuestion(type, question.id);
			handleSetQuestionState(qs.id, QuestionStateMap.edit);
		}
	};

  const renderChilren = () => {
    for (let i = 0; i < question.items.length; i++) {
      question.items[i].update({options:{required:false}} as Partial<DBSchema>)
    }
    return (
      <Stack spacing={2}>
      {question.items.map((question, idx) => {
				return(
          <QuestionEditorForm
					key={question.id}
					index={index[question.id]}
					editorState={editorState}
					question={question}
					questionState={questionState[question.id]}
					handleSetQuestionState={handleSetQuestionState}
					/>
				);
			})}
      <Button 
				color="inherit" 
				aria-controls={openAddQuestion ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={openAddQuestion ? 'true' : undefined}
				onClick={handleOpenAddQuestion}
        onMouseEnter={() =>  {if (thisQuestionState === QuestionStateMap.hover){handleSetQuestionState(question.id, QuestionStateMap.normal)}}}
			>
				<AddCircle />
			</Button>
			<Menu
				anchorEl={anchorAddQuestion}
				open={openAddQuestion}
				onClose={(e) =>handleAddQuestion(undefined)}
			>
				{Object.keys(QuestionMenuTypesMap).map((key,idx) => {
          // if (key !== QuestionMenuTypesMap.section.type) {
            return (
              <MenuItem key={key} onClick={(e) =>handleAddQuestion(key)}>
                {QuestionMenuTypesMap[key].icon}
                <Typography>{QuestionMenuTypesMap[key].locale[locale]}</Typography>
              </MenuItem>
            );
          // }
				})}
			</Menu>
      <Divider variant='middle'/>
      </Stack>
    );
  }

  const renderNormal = () => {
    return (
    <Stack spacing={2}>
      <Stack spacing={2}
      onMouseEnter={() =>  {if (thisQuestionState === QuestionStateMap.normal){handleSetQuestionState(question.id, QuestionStateMap.hover)}}}
      // onMouseLeave={() => {if (thisQuestionState === QuestionStateMap.hover) {handleSetQuestionState(section.id, QuestionStateMap.normal)}}}
      onClick={(e) => {if (thisQuestionState === QuestionStateMap.hover) {handleSetQuestionState(question.id, QuestionStateMap.edit)}}}
      >
      <Typography variant='h4'>{question.text}</Typography>
      <Typography>{question.description}</Typography>

      <Typography>{ItemConditionalMap.locale.condition[locale]}:</Typography>
      {question.expression !== null && (<>
      <Stack direction={'row'}>
      {renderExpressionValue(question.expression.left,question.expression.right)}
      {renderOperator(question.expression.operator)}
      {renderExpressionValue(question.expression.right,question.expression.left)}
      </Stack>
      </>)}
      </Stack>

      <Typography>{ItemConditionalMap.locale.activate[locale]}:</Typography>
      {renderChilren()}
    </Stack>
    );
  }

  enum guidedModalState {none,left,operator,right};
  const guidedModalDefault = () => {return {
    modal: guidedModalState.none,
    expression: {
      type: 'exp',
      operator: '',
      left: {type:'id',name:''},
      right: {type:'v',value:null},
    }
  }};
  const [guidedModal, setGuidedModal] = React.useState(guidedModalDefault)
  const renderGuidedModalItem = ():JSX.Element => {

    const setActiveModal = (b:boolean) => {}
    const handleConfirm = (ihv:IHierarchyValue) => {
      if (ihv.question !== null && ihv.question !== '') {
        guidedModal.expression.left = {
          type: 'id',
          name: ihv.question,
        }
        setGuidedModal({
          modal: guidedModalState.operator,
          expression: guidedModal.expression
        })
      }
    };
    const renderTop = () => (
      <Typography>{ItemConditionalMap.locale.selectQuestion[locale]}</Typography>
    );
    const renderInside = () => null;
    return (
      <RenderHierarchy 
        question={question}
        editorState={editorState}
        activeModal={guidedModal.modal===guidedModalState.left}
        setActiveModal={setActiveModal}
        handleConfirm={handleConfirm}
        topHierarchy={renderTop()}
        insideHierarchy={renderInside()}
        insideHierarchyPos={'sq'}
      />
    );
  } 
  const renderGuidedModalOperator = ():JSX.Element => {
    const conditionItem = nav.findItemById(guidedModal.expression.left.name);
    return (
      <Modal
      open={guidedModal.modal===guidedModalState.operator}
      onClose={(e) => {}}
      >
      <Paper sx={{
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: 360,
        p: '24px',
      }}>
        <Stack>
          <Typography>{ItemConditionalMap.locale.selectOperator[locale]}</Typography>
          <Select
            defaultValue={null}
            onChange={(e,v) => {
              guidedModal.expression.operator = e.target.value;
              setGuidedModal({
                modal: guidedModalState.right,
                expression: guidedModal.expression
              })
            }}
          >
            {Object.values(ItemConditionalMap.expression.operator).map((op, idx) => { 
              if (op !== "") {
                if (conditionItem instanceof QuestionSelect) {
                  if (["==","!="].includes(op))
                  return (<MenuItem key={idx} value={op}>{op}</MenuItem>)
                } else {
                  return (<MenuItem key={idx} value={op}>{op}</MenuItem>)
                }
              }
          })}
          </Select>
        </Stack>
      </Paper>
      </Modal>
    );
  } 
  const renderGuidedModalValue = ():JSX.Element => {

    const conditionItem = nav.findItemById(guidedModal.expression.left.name);

    return (
    <Modal
    open={guidedModal.modal===guidedModalState.right}
    onClose={(e) => {}}
    >
    <Paper sx={{
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      minWidth: 520,
      p: '24px',
    }}>
      <Stack>
        <Typography>{ItemConditionalMap.locale.selectValue[locale]}</Typography>
        {conditionItem instanceof QuestionSelect ? (
          <Select
          defaultValue={null}
          onChange={(e,v) => {
            guidedModal.expression.right.value = e.target.value;
            setGuidedModal({
              modal: guidedModalState.none,
              expression: guidedModal.expression
            })
            editor.onChangeValue(question.id, 'expression', guidedModal.expression);
          }}
          >
            {conditionItem.options.select.map((ts, idx) => (
            <MenuItem key={idx} value={ts.score}>{ts.text}</MenuItem>))}
          </Select>
        ) : conditionItem instanceof QuestionNumber ? (
          <TextField
            autoFocus
            type={'number'}
            variant='outlined'
            onChange={(e) => {
              guidedModal.expression.right.value = Number(e.target.value);
              setGuidedModal({
                modal: guidedModalState.none,
                expression: guidedModal.expression
              })
              editor.onChangeValue(question.id, 'expression', guidedModal.expression);
            }}
          />
        ) : (
          <TextField
            autoFocus
            variant='outlined'
            onChange={(e) => {
              guidedModal.expression.right.value = e.target.value;
              setGuidedModal({
                modal: guidedModalState.none,
                expression: guidedModal.expression
              })
              editor.onChangeValue(question.id, 'expression', guidedModal.expression);
            }}
          />
        )}
      </Stack>
    </Paper>
    </Modal>
    );
  }

  const renderEdit = () => {
    return (
      <Stack spacing={2}>
        <Typography>{ItemConditionalMap.locale.condition[locale]}:</Typography>
          <Stack direction={'row'} spacing={2}>
            <Button 
            variant={"outlined"} 
            color={"primary"}
            onClick={(e)=>{setGuidedModal({
              modal:guidedModalState.left,
              expression:guidedModalDefault().expression,
            })}}>
              <Edit/>
            </Button>
            {question.expression !== null && (<>
            {renderExpressionValue(question.expression.left,question.expression.right)}
            {renderOperator(question.expression.operator)}
            {renderExpressionValue(question.expression.right,question.expression.left)}
            </>)}
          </Stack>
        {/* <Typography>{ItemConditionalMap.locale.activate[locale]}:</Typography> */}
        {null}
      </Stack>
    );
  }
  const renderLayout = () => {
    return null;
  }
  // console.log('renderCond state this', questionState, thisQuestionState);
  return (
    <>
    {renderGuidedModalItem()}
    {renderGuidedModalOperator()}
    {renderGuidedModalValue()}
    <QuestionCommonEditorForm 
      contentNormal={renderNormal()} 
      contentEdit={renderEdit()} 
      contentLayout={renderLayout()} 
      index={index} 
      editorState={editorState} 
      question={question} 
      questionState={thisQuestionState}    
    /></>
  );
}