import React from 'react';
import { GroupMap, QuestionSelectMap } from '../../../core/schema'
import { Question, QuestionText, QuestionNumber, QuestionSelect, QuestionDate, QuestionCheck, Item, ItemFunction } from '../../../survey'
import { Button, TextField, FormControlLabel, FormControl, Typography, Select, MenuItem, FormLabel, Stack, Box, Tabs, Tab, Checkbox, Divider, Paper, Accordion, AccordionDetails, AccordionSummary, Modal } from '@mui/material';
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

  const [moveModal, setMoveModal] = React.useState<boolean>(false);
  const renderMoveModal = (item:Item) => {

    // editor.cancelChanges(); 
    // editor.moveItemDown(question)
  
    const renderQuestion = (qs:Item) => {
      const parentItem = editor.getSurvey().parent(qs.id).id
      const parentQs = editor.getSurvey().parent(item.id).id
      const parent = parentItem === parentQs ? undefined : parentQs;
      return (
        <Stack spacing={2}>
        <Divider/>
        <div key={qs.id} style={{display:'flex', justifyContent: 'space-between'}}>
        <Typography>{QuestionMenuTypesMap[getQuestionMenuType(qs)].icon}{qs.text}</Typography>
        <div>
        {qs.id === item.id ? null : (
          <Stack direction={'row'}>
          <Button variant="outlined" color="primary"
          onClick={(e) => {editor.moveItem(item, nav.getItemIdx(qs.id), parent)}}>
          <VerticalAlignBottom />
          </Button>
          <Button variant="outlined" color="primary"
          onClick={(e) => {editor.moveItem(item, nav.getItemIdx(qs.id)+1, parent)}}>
          <VerticalAlignTop />
          </Button>
          </Stack>
        )}
        </div>
        </div>
        </Stack>
      );
    }
  
    const renderHierarchy = () => {
  
      return (
        <Stack spacing={1}>
        {nav.getFolders().map((folder,idx) => {
          return (
        <Accordion key={folder.id}
        defaultExpanded={folder.id === nav.getFolderId()}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
          >
            <Typography>{folder.text}</Typography>
          </AccordionSummary>
          <AccordionDetails>
          {folder.items.map((page,idx) => {
            return (
              <Accordion key={page.id}
              defaultExpanded={page.id === nav.getPageId()}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                >
                  <Typography>{page.text}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {page.items.map((qs,idx) => {
                    // if (!params.includes(qs.id)) {
                    if (getQuestionMenuType(qs) === QuestionMenuTypesMap.section.type && item.id !== qs.id) {
                      return (
                        <Accordion key={qs.id}>
                          <AccordionSummary
                            expandIcon={<ExpandMore />}
                          >
                            <Typography>{qs.text}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {qs.items.map((qss,idx) => {
                              return renderQuestion(qss);
                              // }
                            })}
                          </AccordionDetails>
                        </Accordion>
                      );
                    }
                    return renderQuestion(qs);
                    // }
                  })}
                </AccordionDetails>
              </Accordion>
            );
          })}
          </AccordionDetails>
        </Accordion>
        );
        })}
        </Stack>
      );
    }
  
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
          width: 520,
          p: '24px',
        }}>
          <Stack>
            {renderHierarchy()}
          </Stack>
        </Paper>
      </Modal>
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
            {/* <Button variant="outlined" color="secondary"
            onClick={(e) => {setMoveModal(true)}}>
            <Expand/>
            </Button> */}
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
    style={{padding:'18px'}}
    >
      {/* {moveModal ? renderMoveModal(question) : null} */}
      {/* {renderMoveModal(question)} */}
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