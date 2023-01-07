import React from 'react';
import { GroupMap, QuestionSelectMap } from '../../../core/schema'
import { Question, QuestionText, QuestionNumber, QuestionSelect, QuestionDate, QuestionCheck, Item, ItemFunction } from '../../../survey'
import { Button, TextField, FormControlLabel, FormControl, Typography, Select, MenuItem, FormLabel, Stack, Box, Tabs, Tab, Checkbox, Divider, Paper, Accordion, AccordionDetails, AccordionSummary, Modal, Chip } from '@mui/material';
import {Edit, Expand, CheckCircle, Cancel, Settings, ArrowUpward, ArrowDownward, Delete, Preview, SettingsAccessibilityOutlined, ExpandMore, VerticalAlignBottom, VerticalAlignTop} from '@mui/icons-material';
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
    } else if (question.type === Item.TYPE) {
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
      <Stack
      sx={{
        padding:'12px 12px'}}
      >
        <Stack direction="row" spacing={1} style={{minHeight:'36px',minWidth:'376px'}}>
         {/* <Typography variant="h5">{question.options.required && '*'} renderIcon()</Typography>*/}
        </Stack>
        <Box>
          {renderQuestion()}
        </Box>
      </Stack>
      
    );
  }

  const [moveModal, setMoveModal] = React.useState<boolean>(false);
  const handleOpenMoveModal = () => {
    setMoveModal(true);
    setMoveValue(defaultMoveValue());
  }
  const movePosition = ['before','after','inside'];
  const defaultMoveValue = () => {
    const isParentSection = getQuestionMenuType(question.parent()) === QuestionMenuTypesMap.section.type;
    return {
    folder: isParentSection ? question.parent().parent().parent().id : question.parent().parent().id,
    page: isParentSection ? question.parent().parent().id : question.parent().id,
    section: isParentSection ? question.parent().id : 'none',
    position:movePosition[0],question:''
  };
  }
  const [moveValue, setMoveValue] = React.useState(defaultMoveValue())
  const handleSetMoveValue = (folder:string, page:string, section:string, position:string, question:string) => {
    const val = defaultMoveValue();
    if (folder === '' && page === '' && section === '' && position === '' && question === '') { setMoveValue(val); return; }
    if (folder !== '') { val.folder = folder; } else { val.folder = moveValue.folder; }
    if (page !== '') { val.page = page; } else { val.page = moveValue.page; }
    if (section !== '') { val.section = section; } else { val.section = moveValue.section; }
    if (position !== '') { val.position = position; } else { val.position = moveValue.position; }
    if (question !== '') { val.question = question; } else { val.question = moveValue.question; }
    setMoveValue(val);
  }
  const moveSections = [{id:'none',text:'none'}];
  const movePageItems = nav.findItemById(moveValue.page).items
  for (let i = 0; i < movePageItems.length; i++) {
    if (getQuestionMenuType(movePageItems[i]) === QuestionMenuTypesMap.section.type) {
      moveSections.push({id:movePageItems[i].id,text:movePageItems[i].text});
    }
  }
  const movePages = nav.findItemById(moveValue.folder).items;
  const  moveQuestions = moveValue.section === 'none' ? movePageItems : nav.findItemById(moveValue.section).items;
  const handleMove = () => {
    const itemToMove = question;

    const survey = editor.getSurvey();
    let moveToFolder = null;
    try { moveToFolder = survey.get(moveValue.folder); } catch(e) {}
    let moveToPage = null;
    try { moveToPage = survey.get(moveValue.page); } catch(e) {}
    let moveToSection = null;
    try { moveToSection = survey.get(moveValue.section); } catch(e) {}
    let moveToQuestion = null;
    try { moveToQuestion = survey.get(moveValue.question); } catch(e) {}

    // edge cases
    // TODO: expand for moving pages and folders
    // if (moveValue.position === 'inside') {
    //   if (getQuestionMenuType(itemToMove) === QuestionMenuTypesMap.section.type) {
    //     if (moveToSection !== null || moveToQuestion !== null) {
    //       // not sections inside questions or sections
    //       return;
    //     }
    //   } else {
    //     if (moveToQuestion !== null && getQuestionMenuType(moveToQuestion) !== QuestionMenuTypesMap.section.type) {
    //       // not questions inside other questions (except inside sections)
    //       return;
    //     }
    //   }
    // }

    // move
    if (moveValue.position === 'inside') {
      let moveInside:Item = null;

      if (nav.getItemType(itemToMove.id) === GroupMap.layout.style.folder) {

      } else if (nav.getItemType(itemToMove.id) === GroupMap.layout.style.page) {

      } else if (getQuestionMenuType(itemToMove) === QuestionMenuTypesMap.section.type) {
        if (moveToQuestion !== null) { return; }
        if (moveToSection !== null) { return; }
        moveInside = moveToPage;
      } else {
        if (moveToQuestion !== null) { return; }
        moveInside = moveToSection !== null ? moveToSection : moveToPage;
      }

      if (moveInside === null) { return; }
      editor.moveItem(itemToMove, -1, moveInside.id);
      return;

    } else {
      let moveRef:Item = null;
      if (nav.getItemType(itemToMove.id) === GroupMap.layout.style.folder) {

      } else if (nav.getItemType(itemToMove.id) === GroupMap.layout.style.page) {

      } else if (getQuestionMenuType(itemToMove) === QuestionMenuTypesMap.section.type) {
        if (moveToSection !== null) { return; }
        moveRef = moveToQuestion;
      } else {
        moveRef = moveToQuestion;
      }

      if (moveRef === null) { return; }
      const moveToIndex = nav.getItemIdx(moveRef.id) + (moveValue.position === 'before' ? 0 : 1);
      editor.moveItem(itemToMove, moveToIndex, moveRef.parent().id);
      return;
    }

  }
  const renderMoveModal = (item:Item) => {

    // editor.cancelChanges(); 
    // editor.moveItemDown(question)


    return (
      <Modal
      open={moveModal}
      onClose={(e) => {setMoveModal(false)}}
      >
        <Paper sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: 520,
          p: '24px',
        }}>
          <Stack spacing={2}>
            <Typography>Moving <Chip disabled label={question.text}/> from <Chip disabled label={question.parent().text}/> to:</Typography>
            <Stack spacing={1} direction={'row'} sx={{justifyContent: 'space-between'}}>
              <Stack spacing={1}>
                <Typography>Folder:</Typography>
                <Select
                  value={moveValue.folder}
                  onChange={(e,v) => {handleSetMoveValue(e.target.value,'','','','')}}
                >
                    {nav.getFolders().map((f, idx1) => (
                      <MenuItem key={f.id} value={f.id}>{f.text}</MenuItem>
                    ))}
                </Select>
              </Stack>
              <Stack spacing={1}>
                <Typography>Page:</Typography>
                <Select
                  value={moveValue.page}
                  onChange={(e,v) => {handleSetMoveValue('',e.target.value,'','','')}}
                >
                    {movePages.map((f, idx1) => (
                      <MenuItem key={f.id} value={f.id}>{f.text}</MenuItem>
                    ))}
                </Select>
              </Stack>
              <Stack spacing={1}>
                <Typography>Section:</Typography>
                <Select
                  value={moveValue.section}
                  onChange={(e,v) => {handleSetMoveValue('','',e.target.value,'','')}}
                >
                    {moveSections.map((s, idx1) => (
                      <MenuItem key={s.id} value={s.id}>{s.text}</MenuItem>
                    ))}
                </Select>
              </Stack>
              <Stack spacing={1}>
                <Typography>Position:</Typography>
                <Select
                  value={moveValue.position}
                  onChange={(e,v) => {handleSetMoveValue('','','',e.target.value,'')}}
                >
                    {movePosition.map((p, idx1) => (
                      <MenuItem key={p} value={p}>{p}</MenuItem>
                    ))}
                </Select>
              </Stack>
              <Stack spacing={1}>
                <Typography>Question:</Typography>
                <Select
                  value={moveValue.question}
                  onChange={(e,v) => {handleSetMoveValue('','','','',e.target.value)}}
                >
                    {moveQuestions.map((f, idx1) => (
                      <MenuItem key={f.id} value={f.id}>{QuestionMenuTypesMap[getQuestionMenuType(f)].icon}{f.text}</MenuItem>
                    ))}
                </Select>
              </Stack>
            </Stack>
            <Stack direction='row' spacing={1} sx={{justifyContent: 'flex-end'}}>
              <Button variant="outlined" color="secondary"
              onClick={(e) => {handleMove(); setMoveModal(false)}}>
              <CheckCircle/>
              </Button>
              <Button variant="outlined" color="secondary"
              onClick={(e) => {setMoveModal(false)}}>
              <Cancel/>
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Modal>
    );
  }

  const renderHover = () => {
    return (
      <Stack 
      sx={{
        // '&:hover, &.Mui-focusVisible': {
        //   backgroundColor: 'rgba(61, 90, 128, 0.04)'
        // },
        padding:'12px 12px',
        backgroundColor: 'rgba(61, 90, 128, 0.04)'
      }}
      >
        <Box sx={{display:'flex', justifyContent: 'space-between'}}>
          <Typography variant="h5">{renderIcon()}</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {handleSetQuestionState(question.id, QuestionStateMap.edit)}}>
            <Edit/>
            </Button>
            {/* <Button variant="outlined" color="secondary"
            onClick={(e) => {editor.cancelChanges(); editor.moveItemUp(question)}}>
            <ArrowUpward/>
            </Button>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {editor.cancelChanges(); editor.moveItemDown(question)}}>
            <ArrowDownward/>
            </Button> */}
            <Button variant="outlined" color="secondary"
            onClick={(e) => {handleOpenMoveModal()}}>
            <Expand/>
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
  // console.log('render question', questionState, JSON.stringify(question.getSchema()));
  return (
    <div
    onMouseEnter={() =>  {if (thisQuestionState === QuestionStateMap.normal && !isSection){handleSetQuestionState(question.id, QuestionStateMap.hover)}}}
    onMouseLeave={() => {if (thisQuestionState === QuestionStateMap.hover && !isSection) {handleSetQuestionState(question.id, QuestionStateMap.normal)}}}
    style={{padding:'0px 12px'}}
    >
      {/* {moveModal ? renderMoveModal(question) : null} */}
      {renderMoveModal(question)}
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