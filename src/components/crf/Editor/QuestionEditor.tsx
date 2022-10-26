import React from 'react';
import {Survey, GroupMap, Question, QuestionText, QuestionNumber, QuestionNumberMap, QuestionSelect, QuestionSelectMap, QuestionDate, QuestionDateMap, QuestionCheckMap, QuestionCheck} from '../../../core/schema'
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
import { OptionsEditorForm } from './OptionsEditor';
import { QuestionMap, QuestionTextMap } from '../../../core/schema';
import { INavState } from '../Navigation';
import { IEditorState, IQuestionState } from './EditorBuilder';

export interface QuestionEditorFormProps {
  editor: IEditorState;
  nav: INavState;
  question: Question;
  questionState: IQuestionState;
}

export function QuestionEditorForm({
  editor,
  nav,
  question,
  questionState,
  }: QuestionEditorFormProps) {

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

  const renderNormal = () => {
    return (
      <Stack>
        <Stack direction="row" spacing={1}>
          {<Typography variant="h5">{renderIcon()}</Typography> }
          <Button variant="outlined" color="secondary"
          onClick={(e) => {questionState.setHover(question)}}
          // startIcon={<SettingsIcon/>}
          >
            Modify
          </Button>
        </Stack>
        <div>
          <div>
            <FormLabel component="legend">Title</FormLabel>
            <TextField
              value="Title"
              required={true}
            />
          </div>
        </div>
      </Stack>
      
    );
  }
  const renderHover = () => {
    return (
      <Stack>
        <Stack direction="row" spacing={1}>
          {<Typography variant="h5">{renderIcon()}</Typography> }
          <Button variant="outlined" color="secondary"
          onClick={(e) => {questionState.setNormal(question)}}>
          Exit
          </Button>
          <Button variant="outlined" color="secondary"
          onClick={(e) => {questionState.setEdit(question)}}>
          Edit
          </Button>
          <Button variant="outlined" color="secondary"
          onClick={(e) => {}}>
          Move Up
          </Button>
          <Button variant="outlined" color="secondary"
          onClick={(e) => {}}>
          Move Down
          </Button>
          <Button variant="outlined" color="secondary"
          onClick={(e) => {}}>
          Delete
          </Button>
        </Stack>
        <div>
          <div>
            <FormLabel component="legend">Title</FormLabel>
            <TextField
              value="Title"
              required={true}
            />
          </div>
        </div>
      </Stack>
      
    );
  }
  const renderMenu = () => {
    return (
      <Stack direction="row" spacing={1}>
      {<Typography variant="h5">{renderIcon()}</Typography> }
      <Button variant="outlined" color="secondary"
      onClick={(e) => {}}>
      Save
      </Button>
      <Button variant="outlined" color="secondary"
      onClick={(e) => {}}>
      Edit
      </Button>
      <Button variant="outlined" color="secondary"
      onClick={(e) => {}}>
      Options
      </Button>
      <Button variant="outlined" color="secondary"
      onClick={(e) => {}}>
      Layout
      </Button>
      </Stack>
    );
  }
  const renderEdit = () => {
    return (
      <Stack>
        {renderMenu()}
        <div>
          <div>
            <FormLabel component="legend">Title</FormLabel>
            <TextField
              value="Title"
              required={true}
            />
          </div>
        </div>
      </Stack>
    );
  }
  const renderOptions = () => {
    return (
      <Stack>
        {renderMenu()}
        <div>
          <div>
            <FormLabel component="legend">Title</FormLabel>
            <TextField
              value="Title"
              required={true}
            />
          </div>
        </div>
      </Stack>
    );
  }
  const renderLayout = () => {
    return (
      <Stack>
        {renderMenu()}
        <div>
          <div>
            <FormLabel component="legend">Title</FormLabel>
            <TextField
              value="Title"
              required={true}
            />
          </div>
        </div>
      </Stack>
    );
  }
  const questionStateValue = questionState.getQuestionState(question);
  console.log('render question', questionStateValue);
  return (
    <Paper style={{padding:'24px'}}>
      {questionStateValue.isInNormal ? (
        renderNormal()
      ) : questionStateValue.isInHover ? (
        renderHover()
      ) : questionStateValue.isInEdit ? (
        renderEdit()
      ) : questionStateValue.isInOptions ? (
        renderOptions()
      ) : questionStateValue.isInLayout ? (
        renderLayout()
      ) : null}
    {/* <Accordion>
      <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="pane21a-content"
      id="panel2a-header"
      >
      <Typography sx={{ width: '33%', flexShrink: 0 }}>Title 1</Typography>
      <Typography sx={{ color: 'text.secondary' }}>Text Question</Typography>
      </AccordionSummary>
      <AccordionDetails>
      <div>
        <FormLabel component="legend">Title</FormLabel>
        <TextField
          value="Title"
          required={true}
        />
      </div>
      <div>
        <FormLabel component="legend">Description</FormLabel>
        <TextField
          value=""
          required={false}
        />
      </div>
      <OptionsEditorForm
        title="General options"
        options={QuestionMap.options}
      />
      {question instanceof QuestionText ? (
        <OptionsEditorForm
          title="Text options"
          options={QuestionTextMap.options}
        />
      ) : question instanceof QuestionNumber ? (
        <OptionsEditorForm
          title="Number options"
          options={QuestionNumberMap.options}
        />
      ) : question instanceof QuestionSelect ? (
        <OptionsEditorForm
          title="Select options"
          options={QuestionSelectMap.options}
        />
      ) : question instanceof QuestionDate ? (
        <OptionsEditorForm
          title="Date options"
          options={QuestionDateMap.options}
        />
      ) : question instanceof QuestionCheck ? (
        <OptionsEditorForm
          title="Check options"
          options={QuestionCheckMap.options}
        />
      ) : null}
      
      </AccordionDetails>
    </Accordion> */}
    </Paper>
  );
}