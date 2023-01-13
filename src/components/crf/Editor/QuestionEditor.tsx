import React from 'react';
import { GroupMap, QuestionSelectMap } from '../../../core/schema'
import { Question, QuestionText, QuestionNumber, QuestionSelect, QuestionDate, QuestionCheck, Item, ItemFunction, ItemConditional } from '../../../survey'
import { Button, TextField, FormControlLabel, FormControl, Typography, Select, MenuItem, FormLabel, Stack, Box, Tabs, Tab, Checkbox, Divider, Paper, Accordion, AccordionDetails, AccordionSummary, Modal, Chip } from '@mui/material';
import {Edit, Expand, CheckCircle, Cancel, Settings, ArrowUpward, ArrowDownward, Delete, Preview, SettingsAccessibilityOutlined, ExpandMore, VerticalAlignBottom, VerticalAlignTop, ContentCopy} from '@mui/icons-material';
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
import { ItemConditionalEditorForm } from './ItemConditionalEditor';
import { IHierarchyValue, RenderHierarchy, RenderMoveModal } from './HierarchyEditor';
import { QuestionList } from '../../../survey/src/lib/form/question-list';
import { QuestionListEditorForm } from './QuestionListEditor';

export interface QuestionEditorFormProps {
  index?: any;
  editorState: IUseEditorState;
  question: Item;
  questionState: any;
  handleSetQuestionState: (id:string, state:string) => void;
}

const locale = "it";

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
  const isItemCond = getQuestionMenuType(question) === QuestionMenuTypesMap.cond.type;
  const thisQuestionState = isSection || isItemCond ? questionState[question.id] : questionState;

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
    // } else if (question instanceof QuestionList) {
    //   return (
    //     <QuestionListEditorForm
    //       index={index}
    //       editorState={editorState}
    //       question={question}
    //       questionState={thisQuestionState}
    //     />
    //   );
    } else if (question instanceof ItemFunction) {
      return (
        <ItemFunctionEditorForm
          index={index}
          editorState={editorState}
          question={question}
          questionState={thisQuestionState}
        />
      );
    } else if (question instanceof ItemConditional) {
      return (
        <ItemConditionalEditorForm
          index={index}
          editorState={editorState}
          question={question}
          questionState={questionState}
					handleSetQuestionState={handleSetQuestionState}
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
        </Stack>
        <Box>
          {renderQuestion()}
        </Box>
      </Stack>
      
    );
  }

  const [moveModal, setMoveModal] = React.useState<boolean>(false);
  const renderMoveModal = () => (
    <RenderMoveModal 
    question={question}
    editorState={editorState}
    moveModal={moveModal}
    setMoveModal={setMoveModal}
    />
  )

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
            onClick={(e) => {setMoveModal(true)}}>
            <Expand/>
            </Button>
            {/* <Button variant="outlined" color="secondary"
            onClick={(e) => {editor.duplicateItem(question)}}>
            <ContentCopy/>
            </Button> */}
            <Button variant="outlined" color="secondary"
            onClick={(e) => {editor.cancelChanges(); editor.removeItem(question)}}>
            <Delete/>
            </Button>
          </Stack>
        </Box>
        <div
          onClick={(e) => {if (thisQuestionState === QuestionStateMap.hover 
            && (!isSection || !isItemCond)) {handleSetQuestionState(question.id, QuestionStateMap.edit)}}}
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
            <Tabs value={thisQuestionState} onChange={handleChangeTab} sx={{justifyContent: 'center'}}>
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
  // console.log('renderQuestion question questionState', question, thisQuestionState);
  return (
    <div
    onMouseEnter={() =>  {if (thisQuestionState === QuestionStateMap.normal && !(isSection || isItemCond)){handleSetQuestionState(question.id, QuestionStateMap.hover)}}}
    onMouseLeave={() => {if (thisQuestionState === QuestionStateMap.hover && !(isSection || isItemCond)) {handleSetQuestionState(question.id, QuestionStateMap.normal)}}}
    style={{padding:'0px 12px'}}
    >
      {/* {moveModal ? renderMoveModal(question) : null} */}
      {renderMoveModal()}
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