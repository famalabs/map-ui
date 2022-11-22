import React from 'react';
import {GroupMap, Question, QuestionText, QuestionNumber, QuestionSelect, QuestionSelectMap, QuestionDate, QuestionCheck, SurveyItem, ItemFunction } from '../../../core/schema'
import { Button, TextField, FormControlLabel, FormControl, Typography, Select, MenuItem, FormLabel, Stack, Box, Tabs, Tab, Checkbox, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import { IEditorState, IUseEditorState } from './EditorBuilder';
import { QuestionTextEditorForm } from './QuestionTextEditor';
import { QuestionNumberEditorForm } from './QuestionNumberEditor';
import { QuestionSelectEditorForm } from './QuestionSelectEditor';
import { QuestionDateEditorForm } from './QuestionDateEditor';
import { QuestionTableEditorForm } from './QuestionTableEditor';
import { ItemFunctionEditorForm } from './ItemFunctionEditor';
import { QuestionCheckEditorForm } from './QuestionCheckEditor';
import { QuestionStateMap } from './PageEditor';
import { getQuestionMenuType, QuestionMenuTypesMap } from '../../../core/schema/config-types';

export interface QuestionEditorFormProps {
  editorState: IUseEditorState;
  question: Question;
  questionState: any;
  handleSetQuestionState: (id:string, state:string) => void;
}

export function QuestionGeneralEdit(item:SurveyItem, editor:IEditorState) {
  return (
    <div>
      <div style={{margin:'0.25rem', width: '100%'}}>
        <FormControl>
        <FormLabel component="legend">Type</FormLabel>
        <Select
          fullWidth
          style={{width: '100%'}}
          value={getQuestionMenuType(item)}
          onChange={(e) => {editor.changeQuestionType(item, e.target.value)}}
        >
            {Object.keys(QuestionMenuTypesMap).map((key, idx) => (
              <MenuItem key={key} value={key}
              >
                <div style={{display: 'flex'}}>
                  {QuestionMenuTypesMap[key].icon}
                  <Typography mr={2}>{QuestionMenuTypesMap[key].locale[editor.getRoot().options.locale]}</Typography>
                </div>
              </MenuItem>
            ))}
        </Select>
        </FormControl>
      </div>
      <div style={{margin:'0.25rem'}}>
        <FormLabel component="legend">Title</FormLabel>
        <TextField
          value={item.text}
          onChange={(e) => {editor.onChangeValue(item.id,'text', e.target.value)}}
        />
      </div>
      <div style={{margin:'0.25rem'}}>
        <FormLabel component="legend">Description</FormLabel>
        <TextField
          value={item.description}
          onChange={(e) => {editor.onChangeValue(item.id,'description', e.target.value)}}
        />
      </div>
    </div>
  );
}

export const renderGeneralOptions = (question:SurveyItem, editorState:IUseEditorState) => {
  const editor = editorState.editor;
  return (
    <Stack spacing={1}>
      <Typography>General options</Typography>
      <Stack spacing={1}>
      <FormControlLabel control={
        <Checkbox checked={question.options.required} onChange={(e)=>{editor.onChangeValue(question.id, 'options.required', e.target.checked)}} />
      } label={'Required'}/> 
      </Stack>
    </Stack>
  );
}

export function QuestionEditorForm({
  editorState,
  question,
  questionState,
  handleSetQuestionState,
  }: QuestionEditorFormProps) {
  const editor = editorState.editor;
  const nav = editorState.nav;

  const renderIcon = () => {
    return QuestionMenuTypesMap[getQuestionMenuType(question)].icon;
  }

  const renderQuestion = () => {
    if (question instanceof QuestionText) {
      return (
        <QuestionTextEditorForm
          editorState={editorState}
          question={question}
          questionState={questionState}
        />
      );
    } else if (question instanceof QuestionNumber) {
      return (
        <QuestionNumberEditorForm
          editorState={editorState}
          question={question}
          questionState={questionState}
        />
      );
    } else if (question instanceof QuestionDate) {
      return (
        <QuestionDateEditorForm
          editorState={editorState}
          question={question}
          questionState={questionState}
        />
      );
    } else if (question instanceof QuestionCheck) {
      return (
        <QuestionCheckEditorForm
          editorState={editorState}
          question={question}
          questionState={questionState}
        />
      );
    } else if (question instanceof QuestionSelect) {
      return (
        <QuestionSelectEditorForm
          editorState={editorState}
          question={question}
          questionState={questionState}
        />
      );
    } else if (question instanceof ItemFunction) {
      return (
        <ItemFunctionEditorForm
          editorState={editorState}
          question={question}
          questionState={questionState}
        />
      );
    } else if (question.type === GroupMap.type) {
      if (question.layout.style === GroupMap.layout.style.table) {
        if (question.items[0].type === QuestionSelectMap.type) {
          return (
            <QuestionTableEditorForm
              editorState={editorState}
              question={question}
              questionState={questionState}
            />
          );
        }
      }
    }
    return null;
  }

  const renderNormal = () => {
    return (
      <Stack>
        <Stack direction="row" spacing={1} style={{minHeight:'36px',minWidth:'376px'}}>
          <Typography variant="h5">{question.options.required && '*'}{renderIcon()}</Typography>
        </Stack>
        <div>
          {renderQuestion()}
        </div>
      </Stack>
      
    );
  }
  const renderHover = () => {
    return (
      <Stack>
        <Box sx={{display:'flex', justifyContent: 'space-between'}}>
          <Typography variant="h5">{question.options.required && '*'}{renderIcon()}</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {handleSetQuestionState(question.id, QuestionStateMap.edit)}}>
            <EditIcon/>
            </Button>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {editor.cancelChanges(); editor.moveItemUp(question)}}>
            <ArrowUpwardIcon/>
            </Button>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {editor.cancelChanges(); editor.moveItemDown(question)}}>
            <ArrowDownwardIcon/>
            </Button>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {editor.cancelChanges(); editor.removeItem(question)}}>
            <DeleteIcon/>
            </Button>
          </Stack>
        </Box>
        <div
          onClick={(e) => {if (questionState === QuestionStateMap.hover) {handleSetQuestionState(question.id, QuestionStateMap.edit)}}}
        >
          {renderQuestion()}
        </div>
      </Stack>
      
    );
  }

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    handleSetQuestionState(question.id, newValue);
  };

  const renderMenu = () => {
    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
          {/* <Typography variant="h5">
            {question.options.required && '*'}
          </Typography>  */}
          <Button variant="outlined" color="secondary"
            onClick={(e) => {}}>
            {renderIcon()}
          </Button>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={questionState} onChange={handleChangeTab}>
              <Tab icon={<EditIcon />} value={QuestionStateMap.edit} />
              <Tab icon={<SettingsIcon />} value={QuestionStateMap.options} />
              <Tab icon={<PreviewIcon />} value={QuestionStateMap.layout} />
            </Tabs>
          </Box>
          <Stack direction='row' spacing={1}>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {handleSetQuestionState(question.id, QuestionStateMap.hover); editor.saveChanges()}}>
            <CheckCircleIcon/>
            </Button>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {handleSetQuestionState(question.id, QuestionStateMap.hover); editor.cancelChanges()}}>
            <CancelIcon/>
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  }
  const renderEdit = () => {
    return (
      <Stack>
        {renderMenu()}
        <div>
        {renderQuestion()}
        </div>
        <Divider style={{margin:'1rem'}} variant="middle"></Divider>
      </Stack>
    );
  }
  const renderOptions = () => {
    return (
      <Stack>
        {renderMenu()}
        <div>
        {renderQuestion()}
        </div>
        <Divider style={{margin:'1rem'}} variant="middle"></Divider>
      </Stack>
    );
  }
  const renderLayout = () => {
    return (
      <Stack>
        {renderMenu()}
        <div>
        {renderQuestion()}
        </div>
        <Divider style={{margin:'1rem'}} variant="middle"></Divider>
      </Stack>
    );
  }
  // console.log('render question', questionState);
  return (
    <div
    onMouseEnter={() =>  {if (questionState === QuestionStateMap.normal){handleSetQuestionState(question.id, QuestionStateMap.hover)}}}
    onMouseLeave={() => {if (questionState === QuestionStateMap.hover) {handleSetQuestionState(question.id, QuestionStateMap.normal)}}}
    style={{padding:'24px'}}
    >
      {questionState === QuestionStateMap.normal ? (
        renderNormal()
      ) : questionState === QuestionStateMap.hover ? (
        renderHover()
      ) : (questionState === QuestionStateMap.edit) ? (
        renderEdit()
      ) : (questionState === QuestionStateMap.options) ? (
        renderOptions()
      ) : (questionState === QuestionStateMap.layout) ? (
        renderLayout()
      ) : renderNormal()}
    </div>
  );
}