import { TextField, FormControl, Select, MenuItem, Typography, Stack, FormControlLabel, Checkbox, Divider } from '@mui/material';
import { Box } from '@mui/system';
import { QuestionMenuTypesMap, getQuestionMenuType } from '../../../core/schema';
import React from 'react'
import { Item, Question } from '../../../survey'
import { IEditorState, IUseEditorState } from './EditorBuilder';
import { QuestionStateMap } from './PageEditor';

export interface QuestionCommonEditorProps<T extends Item> {
  index: string;
  editorState: IUseEditorState;
  question: T;
  questionState: string;
}

export function QuestionGeneralEdit(item:Item, editor:IEditorState) {
  const locale = 'it';
  return (
      <Stack spacing={2} sx={{pt:4}}>
        <Stack direction={'row'} spacing={2}>
        <TextField
          autoFocus
          fullWidth
          variant='outlined'
          label='Title'
          value={item.text}
          onChange={(e) => {editor.onChangeValue(item.id,'text', e.target.value)}}
        />
        {QuestionMenuTypesMap.section.type !== getQuestionMenuType(item) && (
          <FormControl fullWidth>
          <Select
            
            style={{width: '100%'}}
            value={getQuestionMenuType(item)}
            onChange={(e) => {editor.changeQuestionType(item, e.target.value)}}
          >
              {Object.keys(QuestionMenuTypesMap).map((key, idx) => (
                <MenuItem key={key} value={key}
                >
                  <div style={{display: 'flex'}}>
                    {QuestionMenuTypesMap[key].icon}
                    <Typography sx={{ml: 2}}>{QuestionMenuTypesMap[key].locale[locale]}</Typography>
                  </div>
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        )}
        {item instanceof Question && <FormControlLabel control={
        <Checkbox checked={item.required} onChange={(e)=>{editor.onChangeValue(item.id, 'options.required', e.target.checked)}} />
        } label={'Required'}/>}
        </Stack>
        <TextField
        fullWidth
        variant='outlined'
        label='Description'
          value={item.description}
          onChange={(e) => {editor.onChangeValue(item.id,'description', e.target.value)}}
        />
      </Stack>
  );
}

export const renderGeneralOptions = (question:Item, editorState:IUseEditorState) => {
  const editor = editorState.editor;
  return null;
}

export interface QuestionCommonEditorFormProps<T extends Item> extends QuestionCommonEditorProps<T> {
  contentNormal:JSX.Element;
  contentEdit:JSX.Element;
  contentLayout:JSX.Element;
}

export function QuestionCommonEditorForm<T extends Item>({
  index,
  editorState,
  question,
  questionState,
  contentNormal,
  contentEdit,
  contentLayout,
  }: QuestionCommonEditorFormProps<T>) {

  const editor = editorState.editor;
  const nav = editorState.nav;
  const locale = 'it';

  const renderNormal = () => {
    return (<>{contentNormal}</>);
  }
  const renderHover = () => {
    return renderNormal();
  }
  const renderEdit = () => {
    return (
      <Stack spacing={2}>
        {QuestionGeneralEdit(question, editor)}
        <Divider textAlign="left">{QuestionMenuTypesMap[getQuestionMenuType(question)].locale[locale]}</Divider>
        {contentEdit}
      </Stack>
    );
  }
  const renderLayout = () => {
    return (<>{contentLayout}</>);;
  }
  // console.log('render Date', questionState);
  return (
    <div>
    {questionState === QuestionStateMap.normal ? (
      renderNormal()
    ) : questionState === QuestionStateMap.hover ? (
      renderHover()
    ) : questionState === QuestionStateMap.edit ? (
      renderEdit()
    ) : questionState === QuestionStateMap.options ? (
      // renderGeneralOptions(QuestionDateMap.options,"Date options")
      renderGeneralOptions(question, editorState)
    ) : questionState === QuestionStateMap.layout ? (
      renderLayout()
    ) : renderNormal()}
    </div>
  );
}