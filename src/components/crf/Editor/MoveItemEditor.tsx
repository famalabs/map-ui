// import { CheckCircle, Cancel } from "@mui/icons-material";
// import { Modal, Paper, Stack, Typography, Chip, Select, MenuItem, Button } from "@mui/material";
// import React from "react";
// import { getQuestionMenuType, QuestionMenuTypesMap, GroupMap } from "../../../core/schema";
// import { Item } from "../../../survey";


// const [moveModal, setMoveModal] = React.useState<boolean>(false);
// const handleOpenMoveModal = () => {
//   setMoveModal(true);
//   setMoveValue(defaultMoveValue());
// }
// const movePosition = ['before','after','inside'];
// const defaultMoveValue = () => {
//   const isParentSection = getQuestionMenuType(question.parent()) === QuestionMenuTypesMap.section.type;
//   return {
//   folder: isParentSection ? question.parent().parent().parent().id : question.parent().parent().id,
//   page: isParentSection ? question.parent().parent().id : question.parent().id,
//   section: isParentSection ? question.parent().id : 'none',
//   position:movePosition[0],question:''
// };
// }
// const [moveValue, setMoveValue] = React.useState(defaultMoveValue())
// const handleSetMoveValue = (folder:string, page:string, section:string, position:string, question:string) => {
//   const val = defaultMoveValue();
//   if (folder === '' && page === '' && section === '' && position === '' && question === '') { setMoveValue(val); return; }
//   if (folder !== '') { val.folder = folder; } else { val.folder = moveValue.folder; }
//   if (page !== '') { val.page = page; } else { val.page = moveValue.page; }
//   if (section !== '') { val.section = section; } else { val.section = moveValue.section; }
//   if (position !== '') { val.position = position; } else { val.position = moveValue.position; }
//   if (question !== '') { val.question = question; } else { val.question = moveValue.question; }
//   setMoveValue(val);
// }
// const moveSections = [{id:'none',text:'none'}];
// const movePageItems = nav.findItemById(moveValue.page).items
// for (let i = 0; i < movePageItems.length; i++) {
//   if (getQuestionMenuType(movePageItems[i]) === QuestionMenuTypesMap.section.type) {
//     moveSections.push({id:movePageItems[i].id,text:movePageItems[i].text});
//   }
// }
// const movePages = nav.findItemById(moveValue.folder).items;
// const  moveQuestions = moveValue.section === 'none' ? movePageItems : nav.findItemById(moveValue.section).items;
// const handleMove = () => {
//   const itemToMove = question;

//   const survey = editor.getSurvey();
//   let moveToFolder = null;
//   try { moveToFolder = survey.get(moveValue.folder); } catch(e) {}
//   let moveToPage = null;
//   try { moveToPage = survey.get(moveValue.page); } catch(e) {}
//   let moveToSection = null;
//   try { moveToSection = survey.get(moveValue.section); } catch(e) {}
//   let moveToQuestion = null;
//   try { moveToQuestion = survey.get(moveValue.question); } catch(e) {}

//   // edge cases
//   // TODO: expand for moving pages and folders
//   // if (moveValue.position === 'inside') {
//   //   if (getQuestionMenuType(itemToMove) === QuestionMenuTypesMap.section.type) {
//   //     if (moveToSection !== null || moveToQuestion !== null) {
//   //       // not sections inside questions or sections
//   //       return;
//   //     }
//   //   } else {
//   //     if (moveToQuestion !== null && getQuestionMenuType(moveToQuestion) !== QuestionMenuTypesMap.section.type) {
//   //       // not questions inside other questions (except inside sections)
//   //       return;
//   //     }
//   //   }
//   // }

//   // move
//   if (moveValue.position === 'inside') {
//     let moveInside:Item = null;

//     if (nav.getItemType(itemToMove.id) === GroupMap.layout.style.folder) {

//     } else if (nav.getItemType(itemToMove.id) === GroupMap.layout.style.page) {

//     } else if (getQuestionMenuType(itemToMove) === QuestionMenuTypesMap.section.type) {
//       if (moveToQuestion !== null) { return; }
//       if (moveToSection !== null) { return; }
//       moveInside = moveToPage;
//     } else {
//       if (moveToQuestion !== null) { return; }
//       moveInside = moveToSection !== null ? moveToSection : moveToPage;
//     }

//     if (moveInside === null) { return; }
//     editor.moveItem(itemToMove, -1, moveInside.id);
//     return;

//   } else {
//     let moveRef:Item = null;
//     if (nav.getItemType(itemToMove.id) === GroupMap.layout.style.folder) {

//     } else if (nav.getItemType(itemToMove.id) === GroupMap.layout.style.page) {

//     } else if (getQuestionMenuType(itemToMove) === QuestionMenuTypesMap.section.type) {
//       if (moveToSection !== null) { return; }
//       moveRef = moveToQuestion;
//     } else {
//       moveRef = moveToQuestion;
//     }

//     if (moveRef === null) { return; }
//     const moveToIndex = nav.getItemIdx(moveRef.id) + (moveValue.position === 'before' ? 0 : 1);
//     editor.moveItem(itemToMove, moveToIndex, moveRef.parent().id);
//     return;
//   }

// }
// const renderMoveModal = (item:Item) => {

//   // editor.cancelChanges(); 
//   // editor.moveItemDown(question)


//   return (
//     <Modal
//     open={moveModal}
//     onClose={(e) => {setMoveModal(false)}}
//     >
//       <Paper sx={{
//         position: 'absolute' as 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         minWidth: 520,
//         p: '24px',
//       }}>
//         <Stack spacing={2}>
//           <Typography>Moving <Chip disabled label={question.text}/> from <Chip disabled label={question.parent().text}/> to:</Typography>
//           <Stack spacing={1} direction={'row'} sx={{justifyContent: 'space-between'}}>
//             <Stack spacing={1}>
//               <Typography>Folder:</Typography>
//               <Select
//                 value={moveValue.folder}
//                 onChange={(e,v) => {handleSetMoveValue(e.target.value,'','','','')}}
//               >
//                   {nav.getFolders().map((f, idx1) => (
//                     <MenuItem key={f.id} value={f.id}>{f.text}</MenuItem>
//                   ))}
//               </Select>
//             </Stack>
//             <Stack spacing={1}>
//               <Typography>Page:</Typography>
//               <Select
//                 value={moveValue.page}
//                 onChange={(e,v) => {handleSetMoveValue('',e.target.value,'','','')}}
//               >
//                   {movePages.map((f, idx1) => (
//                     <MenuItem key={f.id} value={f.id}>{f.text}</MenuItem>
//                   ))}
//               </Select>
//             </Stack>
//             <Stack spacing={1}>
//               <Typography>Section:</Typography>
//               <Select
//                 value={moveValue.section}
//                 onChange={(e,v) => {handleSetMoveValue('','',e.target.value,'','')}}
//               >
//                   {moveSections.map((s, idx1) => (
//                     <MenuItem key={s.id} value={s.id}>{s.text}</MenuItem>
//                   ))}
//               </Select>
//             </Stack>
//             <Stack spacing={1}>
//               <Typography>Position:</Typography>
//               <Select
//                 value={moveValue.position}
//                 onChange={(e,v) => {handleSetMoveValue('','','',e.target.value,'')}}
//               >
//                   {movePosition.map((p, idx1) => (
//                     <MenuItem key={p} value={p}>{p}</MenuItem>
//                   ))}
//               </Select>
//             </Stack>
//             <Stack spacing={1}>
//               <Typography>Question:</Typography>
//               <Select
//                 value={moveValue.question}
//                 onChange={(e,v) => {handleSetMoveValue('','','','',e.target.value)}}
//               >
//                   {moveQuestions.map((f, idx1) => (
//                     <MenuItem key={f.id} value={f.id}>{QuestionMenuTypesMap[getQuestionMenuType(f)].icon}{f.text}</MenuItem>
//                   ))}
//               </Select>
//             </Stack>
//           </Stack>
//           <Stack direction='row' spacing={1} sx={{justifyContent: 'flex-end'}}>
//             <Button variant="outlined" color="secondary"
//             onClick={(e) => {handleMove(); setMoveModal(false)}}>
//             <CheckCircle/>
//             </Button>
//             <Button variant="outlined" color="secondary"
//             onClick={(e) => {setMoveModal(false)}}>
//             <Cancel/>
//             </Button>
//           </Stack>
//         </Stack>
//       </Paper>
//     </Modal>
//   );
// }