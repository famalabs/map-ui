import React from 'react';
import {Survey, GroupMap, Question, QuestionText, QuestionNumber, QuestionNumberMap, QuestionSelect, QuestionSelectMap, QuestionDate, QuestionDateMap, QuestionCheckMap, QuestionCheck, SurveyItem} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails, Stack, Box, Tabs, Tab, Checkbox } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import PinIcon from '@mui/icons-material/Pin';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import LinearScaleRoundedIcon from '@mui/icons-material/LinearScaleRounded';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import { OptionsEditorForm } from './OptionsEditor';
import { QuestionMap, QuestionTextMap } from '../../../core/schema';
import { INavState } from '../Navigation';
import { IEditorState, IUseEditorState } from './EditorBuilder';
import { QuestionTextEditorForm } from './QuestionTextEditor';
import { QuestionNumberEditorForm } from './QuestionNumberEditor';
import { QuestionSelectEditorForm } from './QuestionSelectEditor';
import { QuestionDateEditorForm } from './QuestionDateEditor';
import { TabList } from '@mui/lab';

export const QuestionStateMap = {
  normal:"normal",
  hover:"hover",
  edit:"edit",
  options:"options",
  layout:"layout"
}

export interface QuestionEditorFormProps {
  editorState: IUseEditorState;
  question: Question;
}

export function QuestionGeneralEdit(item:SurveyItem, editor:IEditorState) {
  return (
    <div>
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
      {/* <OptionsEditorForm
        title="General options"
        options={QuestionMap.options}
        useAccordion={false}
      /> */}
      <Typography>General options</Typography>
      <Stack spacing={1}>
      <FormControlLabel control={
        <Checkbox checked={question.options.required} onChange={(e)=>{editor.onChangeValue(question.id, 'options.required', e.target.checked)}} />
      } label={'Required'}/> 
      </Stack>
      
      {/* {typeof questionOptions !== 'undefined' && (<OptionsEditorForm
        title={title}
        options={questionOptions}
        useAccordion={false}
      />)} */}
      
    </Stack>
  );
}

export function QuestionEditorForm({
  editorState,
  question,
  }: QuestionEditorFormProps) {
  const editor = editorState.editor;
  const nav = editorState.nav;

	const [questionState, setQuestionState] = React.useState(QuestionStateMap.normal);

	const handleSetQuestionState = (state:string) => {
		setQuestionState(state);
		console.log('new', state);
	}

  const setNormal = () => {
    handleSetQuestionState(QuestionStateMap.normal);
  };
  const setHover = () => {
    handleSetQuestionState(QuestionStateMap.hover);
  };
  const setEdit = () => {
    handleSetQuestionState(QuestionStateMap.edit);

  };
  const setOptions = () => {
    handleSetQuestionState(QuestionStateMap.options);

  };
  const setLayout = () => {
    handleSetQuestionState(QuestionStateMap.layout);
  };
  const onSave = () => {

  };
  const onExit = () => {

  };

  const renderIcon = () => {
    if (question.type === QuestionTextMap.type) {
      return (<TextFieldsIcon/>);
    } else if (question.type === QuestionNumberMap.type) {
      if (question.layout.style === QuestionNumberMap.layout.style.range) {
        return (<LinearScaleRoundedIcon/>);
      }
      return (<PinIcon/>);
    } else if (question.type === QuestionSelectMap.type) {
      if (question.layout.style === QuestionSelectMap.layout.style.dropdown) {
        return (<ArrowDropDownCircleOutlinedIcon/>);
      }
      return (<RadioButtonCheckedIcon/>);
    } else if (question.type === QuestionCheckMap.type) {
      return (<CheckBoxIcon/>);
    } else if (question.type === QuestionDateMap.type) {
      return (<CalendarMonthIcon/>);
    }
    return null;
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
    } else if (question instanceof QuestionSelect) {
      return (
        <QuestionSelectEditorForm
          editorState={editorState}
          question={question}
          questionState={questionState}
        />
      );
    }
    return null;
  }

  const renderNormal = () => {
    return (
      <Stack>
        <Stack direction="row" spacing={1}>
          {question.options.required && <Typography variant="h5">*</Typography>}
          <Typography variant="h5">{renderIcon()}</Typography>
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
          {question.options.required && <Typography variant="h5">*</Typography>}
          <Typography variant="h5">{renderIcon()}</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {setEdit()}}>
            <EditIcon/>
            </Button>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {editor.moveItemUp(question)}}>
            <ArrowUpwardIcon/>
            </Button>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {editor.moveItemDown(question)}}>
            <ArrowDownwardIcon/>
            </Button>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {editor.removeItem(question)}}>
            <DeleteIcon/>
            </Button>
          </Stack>
        </Box>
        <div
          onClick={(e) => {if (questionState === QuestionStateMap.hover) {setEdit()}}}
        >
          {renderQuestion()}
        </div>
      </Stack>
      
    );
  }

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    handleSetQuestionState(newValue);
  };

  const renderMenu = () => {
    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        {question.options.required && <Typography variant="h5">*</Typography>}
        <Typography variant="h5">{renderIcon()}</Typography> 
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={questionState} onChange={handleChangeTab}>
            <Tab icon={<EditIcon />} value={QuestionStateMap.edit} />
            <Tab icon={<SettingsIcon />} value={QuestionStateMap.options} />
            <Tab icon={<PreviewIcon />} value={QuestionStateMap.layout} />
          </Tabs>
        </Box>
        <Box>
          <Button variant="outlined" color="secondary"
          onClick={(e) => {setHover()}}>
          <CheckCircleIcon/>
          </Button>
        </Box>
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
      </Stack>
    );
  }
  console.log('render question', questionState);
  return (
    <div
    onMouseEnter={() =>  {if (questionState === QuestionStateMap.normal){setHover()}}}
    onMouseLeave={() => {if (questionState === QuestionStateMap.hover) {setNormal()}}}
    style={{padding:'24px'}}
    >
      {questionState === QuestionStateMap.normal ? (
        renderNormal()
      ) : questionState === QuestionStateMap.hover ? (
        renderHover()
      ) : questionState === QuestionStateMap.edit ? (
        renderEdit()
      ) : questionState === QuestionStateMap.options ? (
        renderOptions()
      ) : questionState === QuestionStateMap.layout ? (
        renderLayout()
      ) : null}
    </div>
  );
}