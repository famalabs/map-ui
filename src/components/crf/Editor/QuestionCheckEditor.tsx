// import React from 'react';
// import {Survey, GroupMap, Question, QuestionText, QuestionNumber, QuestionNumberMap, QuestionSelect, QuestionSelectMap, QuestionDate, QuestionDateMap, QuestionCheckMap, QuestionCheck, TextScore, SurveyItem} from '../../../core/schema'
// import { AutoSelect } from '../../simple';
// import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails, Stack, RadioGroup, Radio } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import EditIcon from '@mui/icons-material/Edit';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import TextFieldsIcon from '@mui/icons-material/TextFields';
// import PinIcon from '@mui/icons-material/Pin';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
// import CheckBoxIcon from '@mui/icons-material/CheckBox';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import SettingsIcon from '@mui/icons-material/Settings';
// import DeleteIcon from '@mui/icons-material/Delete';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import { OptionsEditorForm } from './OptionsEditor';
// import { QuestionMap, QuestionTextMap } from '../../../core/schema';
// import { INavState } from '../Navigation';
// import { IEditorState, IUseEditorState } from './EditorBuilder';
// import { QuestionGeneralEdit, QuestionStateMap, renderGeneralOptions } from './QuestionEditor';

// export interface QuestionCheckEditorFormProps {
//   editorState: IUseEditorState;
//   question: SurveyItem;
//   questionState: string;
// }

// export function QuestionCheckEditorForm({
//   editorState,
//   question,
//   questionState,
//   }: QuestionCheckEditorFormProps) {
//   const editor = editorState.editor;
//   const nav = editorState.nav;

//   const renderIcon = () => {
//     return (<PinIcon/>);
//   }

//   const checks = question.CheckOptions;
//   const addCheck = () => {
//     checks.push({text:"New Radio",score:checks.length} as TextScore);
//     editor.onChangeValue(question.id, 'CheckOptions', checks);
//   } 
//   const removeCheck = (idx:number) => {
//     var newChecks = [];
//     for (let i = 0; i < checks.length; i++) {
//       if (i < idx) {
//         newChecks.push(checks[i]);
//       } else if (i > idx) {
//         var newCheck = checks[i];
//         newCheck.score -= 1;
//         newChecks.push(newCheck)
//       }
//     }
//     editor.onChangeValue(question.id, 'CheckOptions', newChecks);
//   } 
//   const textCheck = (idx:number, value:string) => {
//     checks[idx].text = value;
//     editor.onChangeValue(question.id, 'CheckOptions', checks);
//   }

//   const renderNormal = () => {
//     return (
//       <div>
//       <FormControl
//         // component="fieldset"
//         // error={showError && !!error}
//         // margin={margin}
//         // fullWidth={fullWidth}
//         // {...props}
//       >
//         <FormLabel component="legend">{question.text}</FormLabel>
//         <FormLabel component="legend">{question.description}</FormLabel>
//         <RadioGroup
//           name={question.id}
//           aria-label={question.id}
//           // value={idxValue}
//           // onChange={(e, v) => {
//           //   setValue(options[v].value);
//           // }}
//         >
//           {checks.length > 0 ? checks.map((opt, idx) => (
//             <FormControlLabel disabled key={idx} value="disabled" 
//             control={<Radio />} label={opt.text} />
//           )) : <Typography>No Radio Element</Typography>}
//         </RadioGroup>
//         {/* <FormHelperText>{showError ? error : ''}</FormHelperText> */}
//       </FormControl>
//       </div>
//     );
//   }
//   const renderHover = () => {
//     return renderNormal();
//   }
//   const renderEdit = () => {
//     return (
//       <div>
//         {QuestionGeneralEdit(question, editor)}
//         <FormControl
//           // component="fieldset"
//           // error={showError && !!error}
//           // margin={margin}
//           // fullWidth={fullWidth}
//           // {...props}
//         >
//           {/* <FormLabel component="legend">{question.text}</FormLabel> */}
//           <RadioGroup
//             name={question.id}
//             aria-label={question.id}
//             // value={idxValue}
//             // onChange={(e, v) => {
//             //   setValue(options[v].value);
//             // }}
//           >
//             {checks.map((opt, idx) => (
//               <Stack direction="row" spacing={1}>
//                 <FormControlLabel disabled 
//                 key={idx} value="disabled" 
//                 control={<Radio />} label=""
//                 />
//                 <TextField
//                   value={opt.text}
//                   onChange={(e) => {textCheck(idx, e.target.value)}}
//                 />
//                 <Button 
//                 variant="outlined" 
//                 color="inherit" 
//                 onClick={(e) => {}}>
//                 <ArrowUpwardIcon />
//                 </Button>
//                 <Button 
//                 variant="outlined" 
//                 color="inherit" 
//                 onClick={(e) => {}}>
//                 <ArrowDownwardIcon />
//                 </Button>
//                 <Button 
//                 variant="outlined" 
//                 color="inherit" 
//                 onClick={(e) => {removeCheck(idx)}}>
//                 <DeleteIcon />
//                 </Button>
//               </Stack> 
//             ))}
//           </RadioGroup>
//           <Typography></Typography>
//           <Button 
//           variant="outlined" 
//           color="inherit" 
//           onClick={(e) => {addCheck()}}>
//           <AddCircleIcon />
//           </Button>
//           {/* <FormHelperText>{showError ? error : ''}</FormHelperText> */}
//         </FormControl>
//       </div>
//     );
//   }
//   const renderLayout = () => {
//     return null;
//   }
//   console.log('render Check', questionState);
//   return (
//     <div>
//     {questionState === QuestionStateMap.normal ? (
//       renderNormal()
//     ) : questionState === QuestionStateMap.hover ? (
//       renderHover()
//     ) : questionState === QuestionStateMap.edit ? (
//       renderEdit()
//     ) : questionState === QuestionStateMap.options ? (
//       renderGeneralOptions(QuestionCheckMap.options,"Check options")
//     ) : questionState === QuestionStateMap.layout ? (
//       renderLayout()
//     ) : null}
//     </div>
//   );
// }