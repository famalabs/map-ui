import { CheckCircle, Cancel } from "@mui/icons-material";
import { Modal, Paper, Stack, Typography, Chip, Select, MenuItem, Button } from "@mui/material";
import React from "react";
import { getQuestionMenuType, QuestionMenuTypesMap, GroupMap } from "../../../core/schema";
import { Item, ItemConditional } from "../../../survey/src";
import { IEditorState, IUseEditorState } from "./EditorBuilder";

export interface IHierarchyValue {
  folder:string;
  page:string;
  section:string;
  question:string;
}

export interface RenderHierarchyProps {
  question:Item;
  editorState:IUseEditorState;
  activeModal:boolean;
  setActiveModal:(b:boolean)=>void;
  handleConfirm:(ihv:IHierarchyValue)=>void;
  topHierarchy:JSX.Element;
  insideHierarchy:JSX.Element;
  insideHierarchyPos:'f'|'fp'|'ps'|'sq'|'q';
}

export function RenderHierarchy({
  question,
  editorState,
  activeModal,
  setActiveModal,
  handleConfirm,
  topHierarchy,
  insideHierarchy,
  insideHierarchyPos,
  }: RenderHierarchyProps) {

  const editor = editorState.editor;
  const nav = editorState.nav;

  const handleOpenMoveModal = () => {
    setActiveModal(true);
    setHierarchyValue(defaulthierarchyValue());
  }
  const defaulthierarchyValue = () => {
    const isParentSection = getQuestionMenuType(question.parent()) === QuestionMenuTypesMap.section.type;
    const isParentCond = getQuestionMenuType(question.parent()) === QuestionMenuTypesMap.cond.type;
    return {
    folder: isParentSection ? question.parent().parent().parent().id : question.parent().parent().id,
    page: isParentSection ? question.parent().parent().id : question.parent().id,
    section: isParentSection ? question.parent().id : 'none',
    question:''
  } as IHierarchyValue;
  }
  const [hierarchyValue, setHierarchyValue] = React.useState<IHierarchyValue>(defaulthierarchyValue())
  const handleSetHierarchyValue = (folder:string, page:string, section:string, question:string) => {
    const val = defaulthierarchyValue();
    if (folder === '' && page === '' && section === '' && question === '') { setHierarchyValue(val); return; }
    if (folder !== '') { val.folder = folder; } else { val.folder = hierarchyValue.folder; }
    if (page !== '') { val.page = page; } else { val.page = hierarchyValue.page; }
    if (section !== '') { val.section = section; } else { val.section = hierarchyValue.section; }
    if (question !== '') { val.question = question; } else { val.question = hierarchyValue.question; }
    setHierarchyValue(val);
  }
  const sections = [{id:'none',text:'none'}];
  const pageItems = nav.findItemById(hierarchyValue.page).items
  for (let i = 0; i < pageItems.length; i++) {
    if (getQuestionMenuType(pageItems[i]) === QuestionMenuTypesMap.section.type) {
      sections.push({id:pageItems[i].id,text:pageItems[i].text});
    }
  }
  const pages = nav.findItemById(hierarchyValue.folder).items;
  const questions = hierarchyValue.section === 'none' ? pageItems : nav.findItemById(hierarchyValue.section).items;

  return (
    <Modal
    open={activeModal}
    onClose={(e) => {setActiveModal(false)}}
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
          {topHierarchy}
          <Stack spacing={1} direction={'row'} sx={{justifyContent: 'space-between'}}>
            {insideHierarchyPos === 'f' && (<>{insideHierarchy}</>)}
            <Stack spacing={1}>
              <Typography>Folder:</Typography>
              <Select
                value={hierarchyValue.folder}
                onChange={(e,v) => {handleSetHierarchyValue(e.target.value,'','','')}}
              >
                  {nav.getFolders().map((f, idx1) => (
                    <MenuItem key={f.id} value={f.id}>{f.text}</MenuItem>
                  ))}
              </Select>
            </Stack>
            {insideHierarchyPos === 'fp' && (<>{insideHierarchy}</>)}
            <Stack spacing={1}>
              <Typography>Page:</Typography>
              <Select
                value={hierarchyValue.page}
                onChange={(e,v) => {handleSetHierarchyValue('',e.target.value,'','')}}
              >
                  {pages.map((f, idx1) => (
                    <MenuItem key={f.id} value={f.id}>{f.text}</MenuItem>
                  ))}
              </Select>
            </Stack>
            {insideHierarchyPos === 'ps' && (<>{insideHierarchy}</>)}
            <Stack spacing={1}>
              <Typography>Section:</Typography>
              <Select
                value={hierarchyValue.section}
                onChange={(e,v) => {handleSetHierarchyValue('','',e.target.value,'')}}
              >
                  {sections.map((s, idx1) => (
                    <MenuItem key={s.id} value={s.id}>{s.text}</MenuItem>
                  ))}
              </Select>
            </Stack>
            {insideHierarchyPos === 'sq' && (<>{insideHierarchy}</>)}
            <Stack spacing={1}>
              <Typography>Question:</Typography>
              <Select
                value={hierarchyValue.question}
                onChange={(e,v) => {handleSetHierarchyValue('','','',e.target.value)}}
              >
                  {questions.map((qs, idx1) => {
                    // if (typeof QuestionMenuTypesMap[getQuestionMenuType(qs)] !== 'undefined')
                    return (
                      <MenuItem key={qs.id} value={qs.id}>{QuestionMenuTypesMap[getQuestionMenuType(qs)].icon}{qs.text}</MenuItem>
                    )
                    })}
              </Select>
            </Stack>
            {insideHierarchyPos === 'q' && (<>{insideHierarchy}</>)}
          </Stack>
          <Stack direction='row' spacing={1} sx={{justifyContent: 'flex-end'}}>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {handleConfirm(hierarchyValue); setActiveModal(false)}}>
            <CheckCircle/>
            </Button>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {setActiveModal(false)}}>
            <Cancel/>
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Modal>
  );
}

export interface RenderMoveModalProps {
  question:Item;
  editorState:IUseEditorState;
  moveModal:boolean;
  setMoveModal:(b:boolean)=>void;
}

export function RenderMoveModal({
  question,
  editorState,
  moveModal,
  setMoveModal,
}:RenderMoveModalProps) {
  const editor = editorState.editor;
  const nav = editorState.nav;

  const renderTopHierarchy = () => (<Typography>Moving <Chip disabled label={question.text}/> from <Chip disabled label={question.parent().text}/> to:</Typography>);
  const movePositionMap = ['before','after','inside'] as const;
  const [movePositionValue, setMovePositionValue] = React.useState<string>(movePositionMap[0]);
  const renderInsideHierarchy = () => (
    <Stack spacing={1}>
      <Typography>Position:</Typography>
      <Select
        value={movePositionValue}
        onChange={(e,v) => {setMovePositionValue(e.target.value)}}
      >
          {movePositionMap.map((mp, idx) => (
            <MenuItem key={idx} value={mp}>{mp}</MenuItem>
          ))}
      </Select>
    </Stack>
  );
  const handleMove = (moveValue:IHierarchyValue) => {
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

    // move
    if (movePositionValue === 'inside') {
      let moveInside:Item = null;

      if (nav.getItemType(itemToMove.id) === GroupMap.layout.style.folder) {

      } else if (nav.getItemType(itemToMove.id) === GroupMap.layout.style.page) {

      } else if (getQuestionMenuType(itemToMove) === QuestionMenuTypesMap.section.type) {
        if (moveToQuestion !== null) { return; }
        if (moveToSection !== null) { return; }
        moveInside = moveToPage;
      } else {
        if (moveToQuestion !== null) { 
          if (getQuestionMenuType(moveToQuestion) === QuestionMenuTypesMap.cond.type)
          { moveInside = moveToQuestion; } else { return; } 
        } else {
          moveInside = moveToSection !== null ? moveToSection : moveToPage;
        }
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
      const curIdx = nav.getItemIdx(itemToMove.id);
      const refIdx = nav.getItemIdx(moveRef.id)
      const moveToIndex = refIdx + (movePositionValue === 'before' ? (curIdx < refIdx ? -1 : 0) : (curIdx < refIdx ? 0 : 1));
      
      editor.moveItem(itemToMove, moveToIndex, moveRef.parent().id);
      return;
    }

  }
  return (
    <RenderHierarchy 
    question={question}
    editorState={editorState}
    activeModal={moveModal}
    setActiveModal={setMoveModal}
    handleConfirm={handleMove}
    topHierarchy={renderTopHierarchy()}
    insideHierarchy={renderInsideHierarchy()}
    insideHierarchyPos={'sq'}
    />
  );
}