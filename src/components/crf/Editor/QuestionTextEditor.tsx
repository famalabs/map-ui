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
import { IEditorState, IUseEditorState } from './EditorBuilder';
import { QuestionStateMap } from './QuestionEditor';

export interface QuestionTextEditorFormProps {
  editorState: IUseEditorState;
  question: QuestionText;
  questionState: string;
}

export function QuestionTextEditorForm({
  editorState,
  question,
  questionState,
  }: QuestionTextEditorFormProps) {
  const editor = editorState.editor;
  const nav = editorState.nav;

  const renderIcon = () => {
    return (<TextFieldsIcon/>);
  }

  const renderNormal = () => {
    return (
      <div>
        <div>
          <FormLabel component="legend">{question.text}</FormLabel>
          <TextField
            disabled
            value={question.description ?? question.text}
            label={question.description ?? question.text}
            required={question.options.required}
          />
        </div>
      </div>
    );
  }
  const renderHover = () => {
    return (
      <div>
        <div>
          <FormLabel component="legend">{question.text}</FormLabel>
          <TextField
            disabled
            value={question.description ?? question.text}
            label={question.description ?? question.text}
            required={question.options.required}
          />
        </div>
      </div>
    );
  }
  const renderEdit = () => {
    return (
      <div>
        <div>
          <FormLabel component="legend">Title</FormLabel>
          <TextField
            value={question.text}
            onChange={(e) => {editor.onChangeValue(question.id,'text', e.target.value)}}
          />
        </div>
        <div>
          <FormLabel component="legend">Description</FormLabel>
          <TextField
            value={question.description}
            onChange={(e) => {editor.onChangeValue(question.id,'description', e.target.value)}}
          />
        </div>
      </div>
    );
  }
  const renderOptions = () => {
    return (
      <div>
        <OptionsEditorForm
          title="General options"
          options={QuestionMap.options}
        />
        <OptionsEditorForm
          title="Text options"
          options={QuestionTextMap.options}
        />
      </div>
    );
  }
  const renderLayout = () => {
    return null;
  }
  console.log('render text', questionState);
  return (
    <div>
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