import React from 'react';
import {Survey, GroupMap} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails, Stack, Divider, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { PageEditorForm } from './PageEditor';
import { INavState } from '../Navigation';
import { IEditorState, IUseEditorState } from './EditorBuilder';

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
	console.log('render folder', folder);
	return (
		<div>
		{/* <Paper 
			style={{margin:'24px',padding:'24px',width:'100%'}} 
		>
			<Stack direction="row" spacing={1}>
				<div>
					<FormLabel component="legend">Folder Name</FormLabel>
					<TextField
						value={folder.text}
						onChange={(e) => {editor.onChangeValue(folder.id,'text', e.target.value)}}
					/>
				</div>
				<Divider orientation="vertical" variant="middle" flexItem />
				<Button variant={"outlined"} 
				color={"inherit"}  
				onClick={(e) => {editor.moveItemUp(folder)}}
				>
				<ArrowUpwardIcon/>
				</Button>
				<Button variant={"outlined"} 
				color={"inherit"}  
				onClick={(e) => {editor.moveItemDown(folder)}}
				>
				<ArrowDownwardIcon/>
				</Button>
				<Button variant={"outlined"} 
				color={"inherit"}  
				onClick={(e) => {editor.removeItem(folder)}}
				>
				<DeleteIcon/>
				</Button>
			</Stack>
		</Paper> */}
		<Paper style={{margin:'24px',padding:'24px',width:'100%'}}>
			<Stack direction="row" spacing={1}>
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
				<Button variant="outlined" color="secondary" onClick={(e) => {editor.addPage(folder)}}>
				<NoteAddIcon />
				</Button>
			</Stack>
		</Paper>
		<Paper style={{margin:'24px',padding:'24px',width:'100%'}}>
		{/* <Typography variant='h5'>{page.text}</Typography> */}
			<Stack direction="row" spacing={1}>
				<div>
					<FormLabel component="legend">Page Name</FormLabel>
					<TextField
						value={page.text}
						onChange={(e) => {editor.onChangeValue(page.id,'text', e.target.value)}}
					/>
				</div>
				<Divider orientation="vertical" variant="middle" flexItem />
				<Button variant={"outlined"} 
				color={"inherit"}  
				onClick={(e) => {editor.moveItemUp(page)}}
				>
				<ArrowUpwardIcon/>
				</Button>
				<Button variant={"outlined"} 
				color={"inherit"}  
				onClick={(e) => {editor.moveItemDown(page)}}
				>
				<ArrowDownwardIcon/>
				</Button>
				<Button variant={"outlined"} 
				color={"inherit"}  
				onClick={(e) => {editor.removeItem(page)}}
				>
				<DeleteIcon/>
				</Button>
			</Stack>
		</Paper>
		<Paper style={{margin:'24px',padding:'24px',width:'100%'}}>
			<PageEditorForm
					editorState={editorState}
				/>
		</Paper>
		<Box sx={{ width: '100%' }}>
			<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
				<Button 
				variant={"outlined"} 
				color="secondary" 
				disabled={nav.getPageIdx() === 0} 
				onClick={(e) => {nav.prevPage()}} 
				startIcon={<ArrowBackIosIcon />}
				sx={{ mr: 1 }}
				>
					Back
				</Button>
				<Box sx={{ flex: '1 1 auto' }} />
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
						variant={"outlined"} 
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
						variant={"outlined"} 
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
			</div>
	);
}