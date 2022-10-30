import React from 'react';
import {Survey, GroupMap, Question, QuestionText, QuestionNumber, QuestionNumberMap, QuestionSelect, QuestionSelectMap, QuestionDate, QuestionDateMap, QuestionCheckMap, QuestionCheck, TextScore} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails, Stack, RadioGroup, Radio } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import PinIcon from '@mui/icons-material/Pin';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { OptionsEditorForm } from './OptionsEditor';
import { QuestionMap, QuestionTextMap } from '../../../core/schema';
import { INavState } from '../Navigation';
import { IEditorState, IUseEditorState } from './EditorBuilder';
import { QuestionGeneralEdit, QuestionStateMap, renderGeneralOptions } from './QuestionEditor';

export interface QuestionSelectEditorFormProps {
  editorState: IUseEditorState;
  question: QuestionSelect;
  questionState: string;
}

export function QuestionSelectEditorForm({
  editorState,
  question,
  questionState,
  }: QuestionSelectEditorFormProps) {
  const editor = editorState.editor;
  const nav = editorState.nav;

  const renderIcon = () => {
    return (<PinIcon/>);
  }

  const selects = question.selectOptions;
  const addSelect = () => {
    selects.push({text:"New Radio",score:selects.length} as TextScore);
    editor.onChangeValue(question.id, 'selectOptions', selects);
  } 
  const removeSelect = (idx:number) => {
    var newSelects = [];
    for (let i = 0; i < selects.length; i++) {
      if (i < idx) {
        newSelects.push(selects[i]);
      } else if (i > idx) {
        var newSelect = selects[i];
        newSelect.score -= 1;
        newSelects.push(newSelect)
      }
    }
    editor.onChangeValue(question.id, 'selectOptions', newSelects);
  } 
  const textSelect = (idx:number, value:string) => {
    selects[idx].text = value;
    editor.onChangeValue(question.id, 'selectOptions', selects);
  }

  const renderNormal = () => {
    return (
      <div>
      <FormControl
        // component="fieldset"
        // error={showError && !!error}
        // margin={margin}
        // fullWidth={fullWidth}
        // {...props}
      >
        <FormLabel component="legend">{question.text}</FormLabel>
        <FormLabel component="legend">{question.description}</FormLabel>
        <RadioGroup
          name={question.id}
          aria-label={question.id}
          // value={idxValue}
          // onChange={(e, v) => {
          //   setValue(options[v].value);
          // }}
        >
          {selects.length > 0 ? selects.map((opt, idx) => (
            <FormControlLabel disabled key={idx} value="disabled" 
            control={<Radio />} label={opt.text} />
          )) : <Typography>No Radio Element</Typography>}
        </RadioGroup>
        {/* <FormHelperText>{showError ? error : ''}</FormHelperText> */}
      </FormControl>
      </div>
    );
  }
  const renderHover = () => {
    return renderNormal();
  }
  const renderEdit = () => {
    return (
      <div>
        {QuestionGeneralEdit(question, editor)}
        <FormControl
          // component="fieldset"
          // error={showError && !!error}
          // margin={margin}
          // fullWidth={fullWidth}
          // {...props}
        >
          {/* <FormLabel component="legend">{question.text}</FormLabel> */}
          <RadioGroup
            name={question.id}
            aria-label={question.id}
            // value={idxValue}
            // onChange={(e, v) => {
            //   setValue(options[v].value);
            // }}
          >
            {selects.map((opt, idx) => (
              <Stack direction="row" spacing={1}>
                <FormControlLabel disabled 
                key={idx} value="disabled" 
                control={<Radio />} label=""
                />
                <TextField
                  value={opt.text}
                  onChange={(e) => {textSelect(idx, e.target.value)}}
                />
                <Button 
                variant="outlined" 
                color="inherit" 
                onClick={(e) => {}}>
                <ArrowUpwardIcon />
                </Button>
                <Button 
                variant="outlined" 
                color="inherit" 
                onClick={(e) => {}}>
                <ArrowDownwardIcon />
                </Button>
                <Button 
                variant="outlined" 
                color="inherit" 
                onClick={(e) => {removeSelect(idx)}}>
                <DeleteIcon />
                </Button>
              </Stack> 
            ))}
          </RadioGroup>
          <Typography></Typography>
          <Button 
          variant="outlined" 
          color="inherit" 
          onClick={(e) => {addSelect()}}>
          <AddCircleIcon />
          </Button>
          {/* <FormHelperText>{showError ? error : ''}</FormHelperText> */}
        </FormControl>
      </div>
    );
  }
  const renderLayout = () => {
    return null;
  }
  console.log('render Select', questionState);
  return (
    <div>
    {questionState === QuestionStateMap.normal ? (
      renderNormal()
    ) : questionState === QuestionStateMap.hover ? (
      renderHover()
    ) : questionState === QuestionStateMap.edit ? (
      renderEdit()
    ) : questionState === QuestionStateMap.options ? (
      renderGeneralOptions(QuestionSelectMap.options,"Select options")
    ) : questionState === QuestionStateMap.layout ? (
      renderLayout()
    ) : null}
    </div>
  );
}