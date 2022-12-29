import { TextField, FormControl, Select, MenuItem, Typography, Stack, FormControlLabel, Checkbox } from '@mui/material';
import { Box } from '@mui/system';
import { QuestionMenuTypesMap, getQuestionMenuType } from '../../../core/schema';
import { locale } from 'moment';
import React from 'react'
import { Item, Question } from '../../../survey'
import { IEditorState, IUseEditorState } from './EditorBuilder';

export interface QuestionCommonEditorProps<T extends Item> {
  index: string;
  editorState: IUseEditorState;
  question: T;
  questionState: string;
}

export function QuestionGeneralEdit(item:Item, editor:IEditorState) {
  return (
    <Box>
      <Box sx={{m:'2rem 0.25rem 1rem 0.25rem', width: '100%', display: 'flex'}}>
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
      </Box>
      <Box sx={{margin:'0.25rem'}}>
        <TextField
        fullWidth
        variant='outlined'
        label='Description'
          value={item.description}
          onChange={(e) => {editor.onChangeValue(item.id,'description', e.target.value)}}
        />
      </Box>
    </Box>
  );
}

export const renderGeneralOptions = (question:Item, editorState:IUseEditorState) => {
  const editor = editorState.editor;
  return (
    <Stack spacing={1}>
      <Typography>General options</Typography>
      <Stack spacing={1}>
      {question instanceof Question && <FormControlLabel control={
        <Checkbox checked={question.required} onChange={(e)=>{editor.onChangeValue(question.id, 'options.required', e.target.checked)}} />
      } label={'Required'}/>}
      </Stack>
    </Stack>
  );
}