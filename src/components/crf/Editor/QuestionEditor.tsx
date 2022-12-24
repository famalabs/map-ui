import React from 'react';
import { GroupMap, QuestionSelectMap } from '../../../core/schema'
import { Question, QuestionText, QuestionNumber, QuestionSelect, QuestionDate, QuestionCheck, Item, ItemFunction, Group } from '../../../survey'
import { Button, TextField, FormControlLabel, FormControl, Typography, Select, MenuItem, FormLabel, Stack, Box, Tabs, Tab, Checkbox, Divider, Paper } from '@mui/material';
import {Edit, CheckCircle, Cancel, Settings, ArrowUpward, ArrowDownward, Delete, Preview, SettingsAccessibilityOutlined} from '@mui/icons-material';
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
import { SectionEditorForm } from './SectionEditor';

export interface QuestionEditorFormProps {
  index?: any;
  editorState: IUseEditorState;
  question: Item;
  questionState: any;
  handleSetQuestionState: (id:string, state:string) => void;
}

const locale = "en";

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

export function QuestionEditorForm({
  index,
  editorState,
  question,
  questionState,
  handleSetQuestionState,
  }: QuestionEditorFormProps) {
  const editor = editorState.editor;
  const nav = editorState.nav;

  const isSection = getQuestionMenuType(question) === QuestionMenuTypesMap.section.type;
  const thisQuestionState = isSection ? questionState[question.id] : questionState;
  // const thisQuestionState = questionState;

  const renderIcon = () => {
    return QuestionMenuTypesMap[getQuestionMenuType(question)].icon;
  }

  const renderQuestion = () => {
    if (question instanceof QuestionText) {
      return (
        <QuestionTextEditorForm
          index={index}
          editorState={editorState}
          question={question}
          questionState={thisQuestionState}
        />
      );
    } else if (question instanceof QuestionNumber) {
      return (
        <QuestionNumberEditorForm
          index={index}
          editorState={editorState}
          question={question}
          questionState={thisQuestionState}
        />
      );
    } else if (question instanceof QuestionDate) {
      return (
        <QuestionDateEditorForm
          index={index}
          editorState={editorState}
          question={question}
          questionState={thisQuestionState}
        />
      );
    } else if (question instanceof QuestionCheck) {
      return (
        <QuestionCheckEditorForm
          index={index}
          editorState={editorState}
          question={question}
          questionState={thisQuestionState}
        />
      );
    } else if (question instanceof QuestionSelect) {
      return (
        <QuestionSelectEditorForm
          index={index}
          editorState={editorState}
          question={question}
          questionState={thisQuestionState}
        />
      );
    } else if (question instanceof ItemFunction) {
      return (
        <ItemFunctionEditorForm
          index={index}
          editorState={editorState}
          question={question}
          questionState={thisQuestionState}
        />
      );
    } else if (question.type === Group.TYPE) {
      if (QuestionMenuTypesMap.selectTable.type === getQuestionMenuType(question)) {
        return (
          <QuestionTableEditorForm
            index={index}
            editorState={editorState}
            question={question}
            questionState={thisQuestionState}
          />
        );
      } else if (QuestionMenuTypesMap.section.type === getQuestionMenuType(question)) {
        return (
          <SectionEditorForm
          key={question.id}
					index={index}
					editorState={editorState}
					section={question}
					questionState={questionState}
					handleSetQuestionState={handleSetQuestionState}
          />
        );
      }
    }
    return null;
  }

  const renderNormal = () => {
    return (
      <Stack>
        <Stack direction="row" spacing={1} style={{minHeight:'36px',minWidth:'376px'}}>
         {/* <Typography variant="h5">{question.options.required && '*'} renderIcon()</Typography>*/}
        </Stack>
        <Box>
          {renderQuestion()}
        </Box>
      </Stack>
      
    );
  }
  const renderHover = () => {
    return (
      <Stack>
        <Box sx={{display:'flex', justifyContent: 'space-between'}}>
          <Typography variant="h5">{renderIcon()}</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {handleSetQuestionState(question.id, QuestionStateMap.edit)}}>
            <Edit/>
            </Button>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {editor.cancelChanges(); editor.moveItemUp(question)}}>
            <ArrowUpward/>
            </Button>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {editor.cancelChanges(); editor.moveItemDown(question)}}>
            <ArrowDownward/>
            </Button>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {editor.cancelChanges(); editor.removeItem(question)}}>
            <Delete/>
            </Button>
          </Stack>
        </Box>
        <div
          onClick={(e) => {if (thisQuestionState === QuestionStateMap.hover && !isSection) {handleSetQuestionState(question.id, QuestionStateMap.edit)}}}
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
      <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={thisQuestionState} onChange={handleChangeTab}>
              <Tab icon={<Edit />} value={QuestionStateMap.edit} />
              {!isSection && (
              <Tab icon={<Settings />} value={QuestionStateMap.options} />
              )}
              {!isSection && (
              <Tab icon={<Preview />} value={QuestionStateMap.layout} />
              )}
            </Tabs>
      </Box>
    );
  }

  const renderSaveOrCancel = () => {
    return (
      <Box sx={{mt: '1rem', display: 'flex', justifyContent: 'flex-end'}}>
        <Stack direction='row' spacing={1}>
        <Button variant="outlined" color="secondary"
          onClick={(e) => {handleSetQuestionState(question.id, QuestionStateMap.hover); editor.cancelChanges()}}>
          <Cancel/>
          </Button>
          <Button variant="contained" color="primary"
          onClick={(e) => {handleSetQuestionState(question.id, QuestionStateMap.hover); editor.saveChanges()}}>
          <CheckCircle/>
          </Button>
        </Stack>
      </Box>
    );
  }

  //TODO: usare un unico template per le 3 tab
  const renderEdit = () => {
    return (
      <Stack sx={{ borderRadius: 3, border: '1px solid black', p: '1rem', minHeight: '20vh'}}>
        {renderMenu()}
        <Box>
        {renderQuestion()}
        </Box>
        {renderSaveOrCancel()}
      </Stack>
    );
  }
  const renderOptions = () => {
    return (
      <Stack sx={{ borderRadius: 3, border: '1px solid black', p: '1rem', minHeight: '20vh'}}>
        {renderMenu()}
        <Box>
        {renderQuestion()}
        </Box>
        {renderSaveOrCancel()}
      </Stack>
    );
  }
  const renderLayout = () => {
    return (
      <Stack sx={{ borderRadius: 3, border: '1px solid black', p: '1rem', minHeight: '20vh'}}>
        {renderMenu()}
        <Box>
        {renderQuestion()}
        </Box>
        {renderSaveOrCancel()}
      </Stack>
    );
  }
  console.log('render question', questionState, JSON.stringify(question.getSchema()));
  return (
    <div
    onMouseEnter={() =>  {if (thisQuestionState === QuestionStateMap.normal && !isSection){handleSetQuestionState(question.id, QuestionStateMap.hover)}}}
    onMouseLeave={() => {if (thisQuestionState === QuestionStateMap.hover && !isSection) {handleSetQuestionState(question.id, QuestionStateMap.normal)}}}
    style={{padding:'18px'}}
    >
      {thisQuestionState === QuestionStateMap.normal ? (
        renderNormal()
      ) : thisQuestionState === QuestionStateMap.hover ? (
        renderHover()
      ) : (thisQuestionState === QuestionStateMap.edit) ? (
        renderEdit()
      ) : (thisQuestionState === QuestionStateMap.options) ? (
        renderOptions()
      ) : (thisQuestionState === QuestionStateMap.layout) ? (
        renderLayout()
      ) : renderNormal()}
    </div>
  );
}