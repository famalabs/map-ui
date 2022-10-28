import React from 'react';
import {Survey, GroupMap, Question, QuestionText, QuestionNumber, QuestionNumberMap, QuestionSelect, QuestionSelectMap, QuestionDate, QuestionDateMap, QuestionCheckMap, QuestionCheck, SurveyItem} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails, Stack } from '@mui/material';
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
import { OptionsEditorForm } from './OptionsEditor';
import { QuestionMap, QuestionTextMap } from '../../../core/schema';
import { INavState } from '../Navigation';
import { IEditorState, IUseEditorState } from './EditorBuilder';
import { QuestionTextEditorForm } from './QuestionTextEditor';
import { QuestionNumberEditorForm } from './QuestionNumberEditor';
import { QuestionSelectEditorForm } from './QuestionSelectEditor';
import { QuestionDateEditorForm } from './QuestionDateEditor';

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
      <div>
        <FormLabel component="legend">Title</FormLabel>
        <TextField
          value={item.text}
          onChange={(e) => {editor.onChangeValue(item.id,'text', e.target.value)}}
        />
      </div>
      <div>
        <FormLabel component="legend">Description</FormLabel>
        <TextField
          value={item.description}
          onChange={(e) => {editor.onChangeValue(item.id,'description', e.target.value)}}
        />
      </div>
    </div>
  );
}

export const renderGeneralOptions = (questionOptions:any,title:string) => {
  return (
    <div>
      <OptionsEditorForm
        title="General options"
        options={QuestionMap.options}
        useAccordion={false}
      />
      <OptionsEditorForm
        title={title}
        options={questionOptions}
        useAccordion={false}
      />
    </div>
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
      return (<PinIcon/>);
    } else if (question.type === QuestionSelectMap.type) {
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
          {<Typography variant="h5">{renderIcon()}</Typography> }
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
        <Stack direction="row" spacing={1}>
          {<Typography variant="h5">{renderIcon()}</Typography> }
          {/* <Button variant="outlined" color="secondary"
          onClick={(e) => {setNormal()}}>
          Exit
          </Button> */}
          <Button variant="outlined" color="secondary"
          onClick={(e) => {setEdit()}}>
          <EditIcon/>
          </Button>
          <Button variant="outlined" color="secondary"
          onClick={(e) => {}}>
          <ArrowUpwardIcon/>
          </Button>
          <Button variant="outlined" color="secondary"
          onClick={(e) => {}}>
          <ArrowDownwardIcon/>
          </Button>
          <Button variant="outlined" color="secondary"
          onClick={(e) => {}}>
          <DeleteIcon/>
          </Button>
        </Stack>
        <div>
          {renderQuestion()}
        </div>
      </Stack>
      
    );
  }
  const renderMenu = () => {
    return (
      <Stack direction="row" spacing={1}>
      {<Typography variant="h5">{renderIcon()}</Typography> }
      <Button variant={questionState === QuestionStateMap.edit ? "contained" : "outlined"} color="secondary"
      onClick={(e) => {setEdit()}}>
      <EditIcon/>
      </Button>
      <Button variant={questionState === QuestionStateMap.options ? "contained" : "outlined"} color="secondary"
      onClick={(e) => {setOptions()}}>
      <SettingsIcon/>
      </Button>
      <Button variant={questionState === QuestionStateMap.layout ? "contained" : "outlined"} color="secondary"
      onClick={(e) => {setLayout()}}>
      <PreviewIcon/>
      </Button>
      <Button variant="outlined" color="secondary"
      onClick={(e) => {setHover()}}>
      <CheckCircleIcon/>
      </Button>
      </Stack>
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
    onMouseEnter={() => setHover()}
    onMouseLeave={() => setNormal()}
    >
    <Paper style={{padding:'24px'}}>
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
    </Paper>
    </div>
  );
}