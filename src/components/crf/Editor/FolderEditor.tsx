import React from 'react';
import {Survey, GroupMap} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails, Stack } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FolderIcon from '@mui/icons-material/Folder';
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
		<Paper style={{margin:'24px',padding:'24px',width:'100%'}}>
			{/* <Typography variant='h4'>{folder.text}</Typography> */}
				<div>
					<FormLabel component="legend">Folder Name</FormLabel>
					<TextField
						value={folder.text}
						onChange={(e) => {editor.onChangeValue(folder.id,'text', e.target.value)}}
					/>
				</div>
		</Paper>
		<Paper style={{margin:'24px',padding:'24px',width:'100%'}}>
			<Stack direction="row" spacing={1}>
				{pages.map((page) => {
					return(
						<Button key={page.id} variant={pageId === page.id ? "contained" : "outlined"} color={pageId === page.id ? "secondary" : "inherit"} onClick={(e) => {nav.setPage(page)}}>
							{page.text}
						</Button>
					);
				})}
				<Button variant="outlined" color="secondary" onClick={(e) => {editor.addPage(folder)}}>
				<AddCircleIcon />
				</Button>
			</Stack>
		</Paper>
		<Paper style={{margin:'24px',padding:'24px',width:'100%'}}>
		{/* <Typography variant='h5'>{page.text}</Typography> */}
			<div>
				<FormLabel component="legend">Page Name</FormLabel>
				<TextField
					value={page.text}
					onChange={(e) => {editor.onChangeValue(page.id,'text', e.target.value)}}
				/>
			</div>
		</Paper>
		<Paper style={{margin:'24px',padding:'24px',width:'100%'}}>
			<PageEditorForm
					editorState={editorState}
				/>
		</Paper>
			</div>
	);
}