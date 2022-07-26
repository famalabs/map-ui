import React from 'react';
import {GroupMap} from '../../../core/schema'
import { Button, Paper, TextField, Typography, FormLabel, Stack, Divider, Box, Modal } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { PageEditorForm } from './PageEditor';
import { IUseEditorState } from './EditorBuilder';
import { renderSelectOption } from './OptionsEditor';

const PageStateMap = {
	normal: 'normal',
	hover: 'hover',
	modal: 'modal'
}

export interface FolderEditorFormProps {
	editorState: IUseEditorState;
}

export function FolderEditorForm({
	editorState,
	}: FolderEditorFormProps) {
	const editor = editorState.editor;
	const nav = editorState.nav;
	const folder = nav.getFolder();
	const pages = nav.getPages();
	const pageId = nav.getPageId();
	const page = nav.getPage();

	const pageOptions = {
		default:GroupMap.layout.style.page,
		page:GroupMap.layout.style.page,
		card:GroupMap.layout.style.card
	}

	const [modalPage, setModalPage] = React.useState(PageStateMap.normal);
	const renderPageModal = () => {
		if (modalPage == PageStateMap.normal) {
			return(
				<Box sx={{ width: '100%'}}
				style={{minHeight:'36px'}}
				onMouseEnter={() =>  setModalPage(PageStateMap.hover)}
				>
					<Typography variant='h5'>{page.text}</Typography>
				</Box>
			);
		} else if (modalPage == PageStateMap.hover) {
			return (
				<Box sx={{ width: '100%'}}
				onMouseLeave={() => setModalPage(PageStateMap.normal)}
				>
					
					<Stack direction='row' spacing={1}>
					<Typography  onClick={(e) => {setModalPage(PageStateMap.modal)}} variant='h5'>{page.text}</Typography>

					<Button variant="outlined" 
					color="secondary"
          onClick={(e) => {setModalPage(PageStateMap.modal)}}
					>
					<EditIcon/>
					</Button>
					<Button variant={"outlined"} 
					color={"secondary"}  
					onClick={(e) => {editor.moveItemUp(page)}}
					>
					<ArrowUpwardIcon/>
					</Button>
					<Button variant={"outlined"} 
					color={"secondary"}  
					onClick={(e) => {editor.moveItemDown(page)}}
					>
					<ArrowDownwardIcon/>
					</Button>
					<Button variant={"outlined"} 
					color={"secondary"}  
					onClick={(e) => {editor.removeItem(page)}}
					>
					<DeleteIcon/>
					</Button>
				</Stack>
					
				</Box>
				);
		} else {
			return (
				<Box sx={{ width: '100%'}}>
					<Typography variant='h5'>{page.text}</Typography>
					<Modal
					open={modalPage === PageStateMap.modal}
					onClose={(e) => setModalPage(PageStateMap.normal)}
					>
						<Paper sx={{
							position: 'absolute' as 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							width: 320,
							p: '24px',
						}}>
						<Stack spacing={1}>
						<div>
							<FormLabel component="legend">Page Name</FormLabel>
							<TextField
								value={page.text}
								onChange={(e) => {editor.onChangeValue(page.id,'text', e.target.value)}}
							/>
						</div>
						<Typography>Layout</Typography>
						{renderSelectOption(pageOptions,'style',page.layout.style,editor, page.id, 'layout.style')}
						<Box>
						<Stack direction='row' spacing={1}>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {setModalPage(PageStateMap.normal); editor.saveChanges()}}>
            <CheckCircleIcon/>
            </Button>
            <Button variant="outlined" color="secondary"
            onClick={(e) => {setModalPage(PageStateMap.normal); editor.cancelChanges()}}>
            <CancelIcon/>
            </Button>
          </Stack>
						</Box>
						</Stack>
						</Paper>
					</Modal>
				</Box>
				);
		}
	}

	// console.log('render folder', folder);
	return (
		<Box 
		// style={{margin:'0px 24px',width:'100%',minWidth:'614px'}}
		style={{width:'100%'}}
		>

		
		{/* PAGE NAVIGATION */}
			<Stack spacing={2}>
				<Stack direction="row" spacing={1} style={{ flexWrap: 'wrap', alignItems: 'center'}}>
				<Box><Typography>{folder.text} /</Typography></Box>
					{pages.map((page,idx) => {
						return(
							<Button key={page.id} 
							variant={pageId === page.id ? "contained" : "outlined"} 
							color={pageId === page.id ? "secondary" : "inherit"} 
							onClick={(e) => {nav.setPage(page)}}>
								<Stack spacing={1}>
									<Typography>{page.text}</Typography>
							</Stack>
							</Button>
						);
					})}
					<Button variant="outlined" 
					color="secondary" 
					onClick={(e) => {editor.addPage(folder)}}
					>
					<NoteAddIcon />
					</Button>
				</Stack>				
			</Stack>

		{/* PAGE RENDER */}
		{page.layout.style === GroupMap.layout.style.card ? 
			(
				<Paper style={{padding:'24px',margin:'24px 0px',width:'100%'}}>
					{renderPageModal()}
					<PageEditorForm
							editorState={editorState}
						/>
				</Paper>
			):(
				<Box style={{padding:'24px',margin:'24px 0px',width:'100%'}}>
					{renderPageModal()}
					<PageEditorForm
							editorState={editorState}
						/>
				</Box>
			)
		}

		{/* NAVIGATION BUTTONS */}
		<Box sx={{ width: '100%' }}>
			<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mt:'24px' }}>
				<Button 
				variant={"contained"} 
				color="secondary" 
				disabled={nav.getPageIdx() === 0} 
				onClick={(e) => {nav.prevPage()}} 
				startIcon={<ArrowBackIosIcon />}
				>
					Back
				</Button>
				<Button 
				variant={"contained"} 
				color="secondary" 
				onClick={(e) => {
					console.log(JSON.stringify(editor.getRoot().getSchema()));
				}} 
				>
					Print JSON
				</Button>
				<Box/>
					{nav.getPageIdx() === nav.getPages().length-1 ? (
						<Stack
						direction='row'
						>
							{/* <Button 
							variant={"outlined"} 
							color="secondary" 
							onClick={(e)=>{editor.addFolder()}} 
							// endIcon={<AddCircleIcon />}
							sx={{ mr: 1 }}
							>
								<CreateNewFolderIcon/>
							</Button> */}
						<Button 
						variant={"contained"} 
						color="secondary" 
						onClick={(e)=>{editor.addPage(folder)}} 
						// endIcon={<AddCircleIcon />}
						sx={{ mr: 1 }}
						>
							<NoteAddIcon/>
						</Button>
						</Stack>
					) : (
						<Button 
						variant={"contained"} 
						color="secondary" 
						onClick={(e)=>{nav.nextPage()}} 
						endIcon={<ArrowForwardIosIcon />}
						sx={{ mr: 1 }}
						>
							Next
						</Button>
					)}
				</Box>
			</Box>

			</Box>
	);
}