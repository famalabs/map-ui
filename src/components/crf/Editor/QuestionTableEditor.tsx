import React from 'react';
import {QuestionSelect, QuestionText, SurveyItem, TextScore} from '../../../core/schema'
import { TextField, FormLabel, Stack, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Radio, Typography, Divider, FormControl, Button, RadioGroup, FormControlLabel } from '@mui/material';
import TocRoundedIcon from '@mui/icons-material/TocRounded';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import { QuestionTextMap } from '../../../core/schema';
import { EditorBuilder, IUseEditorState } from './EditorBuilder';
import { QuestionGeneralEdit, renderGeneralOptions } from './QuestionEditor';
import { QuestionStateMap } from './PageEditor';

export interface QuestionTableEditorFormProps {
  editorState: IUseEditorState;
  question: SurveyItem;
  questionState: string;
}

export function QuestionTableEditorForm({
  editorState,
  question,
  questionState,
  }: QuestionTableEditorFormProps) {
  const editor = editorState.editor;
  const nav = editorState.nav;

  const selects = question.items as QuestionSelect[];
  const select = question.items[0] as QuestionSelect;
  const options = select.selectOptions;

  const renderIcon = () => {
    return (<TocRoundedIcon/>);
  }

  const renderNormal = () => {

    return (
      <TableContainer>
        <Typography>{question.text}</Typography>
        <Typography>{question.description}</Typography>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell>Questions</TableCell>
              {options.map((opt, idx) => {
                return (
                  <TableCell align="center">{opt.text}</TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {selects.map((sel,idx) => (
              <TableRow
                key={idx}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {sel.text}
                </TableCell>
                {options.map((opt, idx) => {
                return (
                  <TableCell align="right"><Radio disabled/></TableCell>
                );
              })}
              </TableRow>
            ))}
          </TableBody>
      </Table>
    </TableContainer>
    );
  }
  const renderHover = () => {
    return renderNormal();
  }

  const addOption = () => {
    options.push({text:"New Radio",score:options.length} as TextScore);
    for (let i = 0; i < selects.length; i++) {
      selects[i].selectOptions = options;
    }
    editor.onChangeValue(question.id, 'items', selects);
  } 
  const removeOption = (idx:number) => {
    var newoptions = [];
    for (let i = 0; i < options.length; i++) {
      if (i < idx) {
        newoptions.push(options[i]);
      } else if (i > idx) {
        var newSelect = options[i];
        newSelect.score -= 1;
        newoptions.push(newSelect)
      }
    }
    for (let i = 0; i < selects.length; i++) {
      selects[i].selectOptions = newoptions;
    }
    editor.onChangeValue(question.id, 'items', selects);
  } 
  const moveOption = (idx:number, move:number) => {
    if (idx+move < 0 || idx+move >= options.length) { return; }
    const itemIdx = options[idx];
    options[idx] = options[idx+move];
    options[idx+move] = itemIdx;
    for (let i = 0; i < selects.length; i++) {
      selects[i].selectOptions = options;
    }
    editor.onChangeValue(question.id, 'items', selects);
  } 
  const textOption = (idx:number, value:string) => {
    options[idx].text = value;
    for (let i = 0; i < selects.length; i++) {
      selects[i].selectOptions = options;
    }
    editor.onChangeValue(question.id, 'items', selects);
  }

  const addSelect = () => {
    const editorBuilder = new EditorBuilder(editor.getSurvey()); 
    const newSelect = editorBuilder.addQuestionSelect(nav) as QuestionSelect;
    editorBuilder.getRoot().items[nav.getFolderIdx()].items[nav.getPageIdx()].removeItem(newSelect);
    newSelect.selectOptions = options;
    question.insertItem(newSelect);
    editor.onChangeValue(question.id, 'items', question.items);
  } 
  const removeSelect = (idx:number) => {
    const editorBuilder = new EditorBuilder(editor.getSurvey()); 
    editorBuilder.getRoot().items[nav.getFolderIdx()].items[nav.getPageIdx()].removeItemByIdx(idx);
    question.items = editorBuilder.getRoot().items[nav.getFolderIdx()].items[nav.getPageIdx()].items;
    editor.onChangeValue(question.id, 'items', question.items);
  } 
  const moveSelect = (idx:number, move:number) => {
    if (idx+move < 0 || idx+move >= selects.length) { return; }
    const itemIdx = selects[idx];
    selects[idx] = selects[idx+move];
    selects[idx+move] = itemIdx;
    editor.onChangeValue(question.id, 'items', selects);
  } 
  const textSelect = (idx:number, value:string) => {
    selects[idx].text = value;
    editor.onChangeValue(question.id, 'items', selects);
  }

  const renderSelectOption = (opt:TextScore, idx:number) => {
    return (
      <TableCell align="center">
        {/* {opt.text} */}
        <TextField
          value={opt.text}
          onChange={(e) => {textOption(idx, e.target.value)}}
        />
      </TableCell>
    );
  }

  const renderSelectQuestion = (sel:QuestionSelect, idx:number) => {
    return (
      <TableCell component="th" scope="row">
        {/* {sel.text} */}
        <Stack spacing={2}>
        <TextField
          value={sel.text}
          onChange={(e) => {textSelect(idx, e.target.value)}}
        />
        {/* <Stack direction='row' style={{justifyContent: 'space-between'}}>
          <Button 
          variant="outlined" 
          color="inherit" 
          onClick={(e) => {moveSelect(idx,-1)}}>
          <ArrowUpwardIcon />
          </Button>
          <Button 
          variant="outlined" 
          color="inherit" 
          onClick={(e) => {moveSelect(idx,1)}}>
          <ArrowDownwardIcon />
          </Button>
          <Button 
          variant="outlined" 
          color="inherit" 
          onClick={(e) => {removeSelect(idx)}}>
          <DeleteIcon />
          </Button>
        </Stack> */}
        </Stack>
      </TableCell>
    );
  }
  
  const renderEdit = () => {
    return (
      <div>
        {QuestionGeneralEdit(question, editor)}
        <Divider textAlign="left"></Divider>
        <TableContainer>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell>Questions</TableCell>
              {options.map((opt, idx) => renderSelectOption(opt,idx))}
              <TableCell>
              <Button 
              variant="outlined" 
              color="inherit" 
              onClick={(e) => {addOption()}}>
              <AddCircleIcon />
              </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selects.map((sel,idx) => (
              <TableRow
                key={idx}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {renderSelectQuestion(sel,idx)}
                {options.map((opt, idx) => {
                  return (
                    <TableCell align="right"><Radio disabled/></TableCell>
                  );
                })}
              </TableRow>
            ))}
            <TableRow>
            <TableCell>
            <Button 
            variant="outlined" 
            color="inherit" 
            onClick={(e) => {addSelect()}}>
            <AddCircleIcon />
            </Button>
            </TableCell>
            </TableRow>
          </TableBody>
      </Table>
    </TableContainer>
        {/* <Divider textAlign="left">Radio Buttons</Divider>
        <FormControl
        >
          <RadioGroup
            name={question.id}
            aria-label={question.id}
            style={{margin:'0.25rem'}}
          >
            {options.map((opt, idx) => (
              <Stack direction="row" spacing={1} 
              style={{margin:'0.25rem'}}>
                <FormControlLabel disabled 
                key={idx} value="disabled" 
                control={<Radio />} label=""
                />
                <TextField
                  value={opt.text}
                  onChange={(e) => {textOption(idx, e.target.value)}}
                />
                <Button 
                variant="outlined" 
                color="inherit" 
                onClick={(e) => {moveOption(idx,-1)}}>
                <ArrowUpwardIcon />
                </Button>
                <Button 
                variant="outlined" 
                color="inherit" 
                onClick={(e) => {moveOption(idx,1)}}>
                <ArrowDownwardIcon />
                </Button>
                <Button 
                variant="outlined" 
                color="inherit" 
                onClick={(e) => {removeOption(idx)}}>
                <DeleteIcon />
                </Button>
              </Stack> 
            ))}
          </RadioGroup>
          <Button 
          variant="outlined" 
          color="inherit" 
          onClick={(e) => {addOption()}}>
          <AddCircleIcon />
          </Button>
        </FormControl>
        <Divider textAlign="left">Questions</Divider>
        <FormControl
        >
          <RadioGroup
            name={question.id}
            aria-label={question.id}
            style={{margin:'0.25rem'}}
          >
            {selects.map((opt, idx) => (
              <Stack direction="row" spacing={1} 
              style={{margin:'0.25rem'}}>
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
                onClick={(e) => {moveSelect(idx,-1)}}>
                <ArrowUpwardIcon />
                </Button>
                <Button 
                variant="outlined" 
                color="inherit" 
                onClick={(e) => {moveSelect(idx,1)}}>
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
          <Button 
          variant="outlined" 
          color="inherit" 
          onClick={(e) => {addSelect()}}>
          <AddCircleIcon />
          </Button>
        </FormControl> */}

      </div>
    );
  }
  const renderLayout = () => {
    return null;
  }
  // console.log('render text', questionState);
  return (
    <div>
    {questionState === QuestionStateMap.normal ? (
      renderNormal()
    ) : questionState === QuestionStateMap.hover ? (
      renderHover()
    ) : questionState === QuestionStateMap.edit ? (
      renderEdit()
    ) : questionState === QuestionStateMap.options ? (
      // renderGeneralOptions(QuestionTextMap.options,"Text options")
      renderGeneralOptions(question, editorState)
    ) : questionState === QuestionStateMap.layout ? (
      renderLayout()
    ) : renderNormal()}
    </div>
  );
}