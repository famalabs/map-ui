import React from 'react';
import {FnMap, getQuestionMenuType, ItemFunction, QuestionMenuTypesMap, SurveyItem} from '../../../core/schema'
import { FormLabel, Stack, Typography, Divider, FormControl, Select, MenuItem, Chip, Button, Modal, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IUseEditorState } from './EditorBuilder';
import { QuestionGeneralEdit, renderGeneralOptions } from './QuestionEditor';
import { QuestionStateMap } from './PageEditor';

export interface ItemFunctionEditorFormProps {
  index?: number;
  editorState: IUseEditorState;
  question: SurveyItem;
  questionState: string;
}

export function ItemFunctionEditorForm({
  index,
  editorState,
  question,
  questionState,
  }: ItemFunctionEditorFormProps) {

  if (question instanceof ItemFunction) {
    const editor = editorState.editor;
    const nav = editorState.nav;

    const getParameters = ():string[] => {
      return question.parameters;
    }

    const handleAddParam = (id:string) => {
     
      question.parameters.push(id);

      editor.onChangeValue(question.id, 'parameters', question.parameters);
    }
    const handleRemoveParam = (id:string) => {
      const params = question.parameters;
      const idx = params.indexOf(id);
      params.splice(idx,1);
      editor.onChangeValue(question.id, 'parameters', params);
    }
    const handleChangeFunction = (newFn:string) => {
      editor.onChangeValue(question.id, 'fnCompute', newFn);
    }

    const [modalPrams, setModalParams] = React.useState(false);

    const renderNormal = () => {
      return (
        <Stack spacing={1}>
          <Stack spacing={1}>
            <FormLabel component="legend">
            <Typography>{index && (index + '.')} {question.text}{question.options.required && '*'}</Typography>
              </FormLabel>
            <FormLabel component="legend">{question.description}</FormLabel>
            <Typography>Function Name: {question.fnCompute.fnName}</Typography>
            <Stack spacing={1}>
              <Typography>Function Params:</Typography>
              <Stack direction={'row'} spacing={2} style={{flexWrap: 'wrap'}}>
                {getParameters().length > 0 ? getParameters().map((id,idx) => {
                const item = nav.findItemById(id);  
                return (
                    <Chip disabled key={id} label={item.text}/>
                  );
                }) : (<Typography>No Parameters</Typography>)}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      );
    }
    const renderHover = () => {
      return renderNormal();
    }
    const renderChipParams = () => {
      return getParameters().length > 0 ? getParameters().map((id,idx) => {
        const item = nav.findItemById(id);  
        return (
            <Chip key={id} label={item.text} onDelete={(e) => {handleRemoveParam(id)}} />
          );
        }) : (<Typography>No Parameters</Typography>);
    }

    const renderSingleAddParam = (qs:SurveyItem, params:string[]) => {
      return (
        <div key={qs.id} style={{display:'flex', justifyContent: 'space-between'}}>
        <Typography>{QuestionMenuTypesMap[getQuestionMenuType(qs)].icon}{qs.text}</Typography>
        {qs.id !== question.id ? (
          params.includes(qs.id) ? (
            <Button variant="outlined" color="secondary"
            onClick={(e) => {handleRemoveParam(qs.id)}}>
            <CancelIcon/>
            </Button>
          ) : (
            <Button variant="outlined" color="primary"
            onClick={(e) => {handleAddParam(qs.id)}}>
            <AddCircleIcon />
            </Button>
          )
        ) : (null)}
        </div>
      );
    }
    
    const renderAddParams = () => {
      const params = getParameters();
      return (
        <Stack spacing={1}>
          {nav.getPages().map((page,idx) => {
            return (
              <Accordion key={page.id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography>{page.text}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {page.items.map((qs,idx) => {
                    // if (!params.includes(qs.id)) {
                    if (getQuestionMenuType(qs) === QuestionMenuTypesMap.section.type) {
                      return (
                        <Accordion key={qs.id}>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                          >
                            <Typography>{qs.text}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {qs.items.map((qss,idx) => {
                              return renderSingleAddParam(qss,params);
                              // }
                            })}
                          </AccordionDetails>
                        </Accordion>
                      );
                    }
                    return renderSingleAddParam(qs,params);
                    // }
                  })}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Stack>
      );
    }
    const renderEdit = () => {
      return (
        <div>
          {QuestionGeneralEdit(question, editor)}
          <Divider textAlign="left">Function Options</Divider>
          <Stack spacing={2}>
            <FormControl>
            <FormLabel component="legend">Function Name</FormLabel>
            <Select
              value={question.fnCompute.fnName}
              onChange={(e) => {handleChangeFunction(e.target.value)}}
            >
                {Object.keys(FnMap.fnCompute).map((key, idx) => (
                  <MenuItem key={key} value={key}
                  >
                    <Typography>{key}</Typography>
                  </MenuItem>
                ))}
            </Select>
            </FormControl>
            <div>
              <Stack direction={'row'} spacing={2} style={{	flexWrap: 'wrap'}}>
                {renderChipParams()}
                <Button variant="outlined" color="secondary"
                onClick={(e) => {setModalParams(true)}}>
                <AddCircleIcon />
                </Button>
              </Stack>
            <Modal
            open={modalPrams}
            onClose={(e) => setModalParams(false)}
            >
              <Paper sx={{
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 320,
                p: '24px',
              }}>
              <Stack spacing={2}>
                <Stack direction={'row'} spacing={2} style={{flexWrap: 'wrap'}}>{renderChipParams()}</Stack>
                <Divider variant='middle'>Add Parameter</Divider>
                {renderAddParams()}
              </Stack>
              </Paper>
            </Modal>
            </div>
          </Stack>

        </div>
      );
    }
    const renderLayout = () => {
      return null;
    }
    // console.log('render function', questionState);
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
  return null;
}