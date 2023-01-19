import React from 'react';
import { ItemFunction, Item } from '../../../survey'
import { FnMap, getQuestionMenuType, QuestionMenuTypesMap} from '../../../core/schema'
import { FormLabel, Stack, Typography, Divider, FormControl, Select, MenuItem, Chip, Button, Modal, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { AddCircle, Cancel, ExpandMore} from '@mui/icons-material';
import { IUseEditorState } from './EditorBuilder';
import { QuestionStateMap } from './PageEditor';
import { QuestionCommonEditorForm, QuestionGeneralEdit, renderGeneralOptions } from './CommonEditor';

// enum FnMedicine {
//   BodyMassIndex = 'BMI',
//   SofaScore = 'SOFA',
//   ISTHScore = 'ISTH',
//   CIDScore = 'CID',
//   HScore = 'HScore',
//   MeanArterialPressure = 'MeanArterialPressure',
//   GFRCockcroftGault = 'CrocoftGault',
//   CKD_EPI_CREATININE = 'CDKEPI',
//   PF_Percent = 'PFpercent',
// }

import { QuestionHeaderCommon } from '../common';
import { QuestionCommonEditorProps } from './CommonEditor';
import { IHierarchyValue, RenderHierarchy } from './HierarchyEditor';

export function ItemFunctionEditorForm({
  index,
  editorState,
  question,
  questionState,
  }: QuestionCommonEditorProps<ItemFunction>) {

  // if (question instanceof ItemFunction) {
    const editor = editorState.editor;
    const nav = editorState.nav;
    const locale = 'it'

    const getRenderParams = ():string[] => {
      // const params = []
      // const fixParams = [];
      // for (let i = 0; i < question.parameters.length; i++) {
      //   const paramId = question.parameters[i]
      //   const param = nav.findItemById(paramId);
      //   params.push(paramId);
      //   if (getQuestionMenuType(param) === QuestionMenuTypesMap.selectTable.type) {

      //   } else {
      //     fixParams.push(paramId);
      //   }
      // }
      return question.parameters;
    }

    const handleAddParam = (id:string) => {
      if (question.parameters.includes(id)) { return }
      question.parameters.push(id);
      editor.onChangeValue(question.id, 'parameters', question.parameters);
    }
    const handleAddParams = (ids:string[]) => {
      for (let i = 0; i < ids.length; i++) {
        if (question.parameters.includes(ids[i])) { continue; }
        question.parameters.push(ids[i]);
      }
      editor.onChangeValue(question.id, 'parameters', question.parameters);
    }
    const handleRemoveParam = (id:string) => {
      const params = question.parameters;
      const idx = params.indexOf(id);
      params.splice(idx,1);
      editor.onChangeValue(question.id, 'parameters', params);
    }
    const handleChangeFunction = (newFn:string) => {
      editor.onChangeValue(question.id, 'fn', newFn);
    }

    // const [modalPrams, setModalParams] = React.useState(false);

    const renderNormal = () => {
      return (
        <Stack spacing={1}>
            <QuestionHeaderCommon
            index={index}
            question={question}
            required={false}            
            />
            <Typography>Function Name: {question.fn}</Typography>
            <Stack spacing={1}>
              <Typography>Function Params:</Typography>
              <Stack direction={'row'} spacing={2} style={{flexWrap: 'wrap'}}>
                {getRenderParams().length > 0 ? getRenderParams().map((id,idx) => {
                const item = nav.findItemById(id);  
                return (
                    <Chip disabled key={id} label={item.text}/>
                  );
                }) : (<Typography>No Parameters</Typography>)}
              </Stack>
            </Stack>
        </Stack>
      );
    }
    const renderChipParams = () => {
      return getRenderParams().length > 0 ? getRenderParams().map((id,idx) => {
        const item = nav.findItemById(id);  
        return (
            <Chip key={id} label={item.text} onDelete={(e) => {handleRemoveParam(id)}} />
          );
        }) : (<Typography>No Parameters</Typography>);
    }

    // const renderSingleAddParam = (qs:Item, params:string[]) => {
    //   return (
    //     <div key={qs.id} style={{display:'flex', justifyContent: 'space-between'}}>
    //     <Typography>{QuestionMenuTypesMap[getQuestionMenuType(qs)].icon}{qs.text}</Typography>
    //     {qs.id !== question.id ? (
    //       params.includes(qs.id) ? (
    //         <Button variant="outlined" color="secondary"
    //         onClick={(e) => {handleRemoveParam(qs.id)}}>
    //         <Cancel/>
    //         </Button>
    //       ) : (
    //         <Button variant="outlined" color="primary"
    //         onClick={(e) => {handleAddParam(qs.id)}}>
    //         <AddCircle />
    //         </Button>
    //       )
    //     ) : (null)}
    //     </div>
    //   );
    // }
    
    // const renderAddParams = () => {
    //   const params = getRenderParams();
    //   return (
    //     <Stack spacing={1}>
    //       {nav.getPages().map((page,idx) => {
    //         return (
    //           <Accordion key={page.id}>
    //             <AccordionSummary
    //               expandIcon={<ExpandMore />}
    //             >
    //               <Typography>{page.text}</Typography>
    //             </AccordionSummary>
    //             <AccordionDetails>
    //               {page.items.map((qs,idx) => {
    //                 // if (!params.includes(qs.id)) {
    //                 if (getQuestionMenuType(qs) === QuestionMenuTypesMap.section.type) {
    //                   return (
    //                     <Accordion key={qs.id}>
    //                       <AccordionSummary
    //                         expandIcon={<ExpandMore />}
    //                       >
    //                         <Typography>{qs.text}</Typography>
    //                       </AccordionSummary>
    //                       <AccordionDetails>
    //                         {qs.items.map((qss,idx) => {
    //                           return renderSingleAddParam(qss,params);
    //                           // }
    //                         })}
    //                       </AccordionDetails>
    //                     </Accordion>
    //                   );
    //                 }
    //                 return renderSingleAddParam(qs,params);
    //                 // }
    //               })}
    //             </AccordionDetails>
    //           </Accordion>
    //         );
    //       })}
    //     </Stack>
    //   );
    // }


    enum GuidedModalState {none,selectParam,selectTable};
    const guidedModalDefault = () => {return{
      state: GuidedModalState.none,
      param: null as Item,
    }}
    const [guidedModal, setGuidedModal] = React.useState(guidedModalDefault)
    const renderAddParamsModal = ():JSX.Element => {

      const setActiveModal = (b:boolean) => {}
      const handleConfirm = (ihv:IHierarchyValue) => {
        if (ihv.question !== null && ihv.question !== '') {
          guidedModal.param = nav.findItemById(ihv.question);
          if (getQuestionMenuType(guidedModal.param) === QuestionMenuTypesMap.selectTable.type) {
            const params = [];
            for (let i = 0; i < guidedModal.param.items.length; i++) {
              params.push(guidedModal.param.items[i].id);
            }
            handleAddParams(params);
            setGuidedModal({
              state: GuidedModalState.none,
              param: guidedModal.param,
            })
          } else {
            handleAddParam(guidedModal.param.id);
            setGuidedModal({
              state: GuidedModalState.none,
              param: guidedModal.param,
            })
          }
          return;
        }

      };
      const renderTop = () => (
        <Stack spacing={1}>
          <Stack direction={'row'} spacing={2} style={{flexWrap: 'wrap'}}>{renderChipParams()}</Stack>
          <Typography>{FnMap.locale.addParam[locale]}: </Typography>
        </Stack>
      );
      const renderInside = () => null;
      return (
        <RenderHierarchy 
          question={question}
          editorState={editorState}
          activeModal={guidedModal.state===GuidedModalState.selectParam}
          setActiveModal={setActiveModal}
          handleConfirm={handleConfirm}
          topHierarchy={renderTop()}
          insideHierarchy={renderInside()}
          insideHierarchyPos={'sq'}
        />
      );
    } 
    const renderSelectTableModal = ():JSX.Element => {
      return null;
    }

    const renderEdit = () => {
      return (
        <div>
          <Stack spacing={2}>
            <FormControl>
            <FormLabel component="legend">Function Name</FormLabel>
            <Select
              value={question.fn}
              onChange={(e) => {handleChangeFunction(e.target.value)}}
            >
                {Object.values(FnMap.fn).map((key, idx) => (
                  <MenuItem key={key} value={key}
                  >
                    <Typography>{key}</Typography>
                  </MenuItem>
                ))}
            </Select>
            </FormControl>
            <div>
              <Stack direction={'row'} spacing={2} style={{	flexWrap: 'wrap'}}>
                <Button variant="outlined" color="secondary"
                onClick={(e) => {setGuidedModal({state:GuidedModalState.selectParam,param:null})}}>
                <AddCircle />
                </Button>
                {renderChipParams()}
              </Stack>
            {/* <Modal
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
            </Modal> */}
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
      <>
      {renderAddParamsModal()}
      <QuestionCommonEditorForm 
        contentNormal={renderNormal()} 
        contentEdit={renderEdit()} 
        contentLayout={renderLayout()} 
        index={index} 
        editorState={editorState} 
        question={question} 
        questionState={questionState}    
      />
      </>
    );
  //   }
  // return null;
}