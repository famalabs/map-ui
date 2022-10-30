import React from 'react';
import {Survey, SurveyItem, SurveyMap} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails, Box, Stack } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import { OptionsEditorForm } from './OptionsEditor';
import { FolderEditorForm } from './FolderEditor';
import PreviewIcon from '@mui/icons-material/Preview';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { IEditorState, IUseEditorState } from './EditorBuilder';
import { INavState } from '../Navigation';

export interface SidebarEditorProps {
	editorState: IUseEditorState;
}

export function SidebarEditorForm({
	editorState,
	}: SidebarEditorProps) {

	const editor = editorState.editor;
	const nav = editorState.nav;
	const survey = editor.getRoot();
	const folders = nav.getFolders();
	const folderId = nav.getFolderId();

	const renderFolders = () => {
		return (
			<Stack spacing={1}>
				{nav.getFolders().map((folder,idx) => {
					if (folderId === folder.id ) {
						return (
							<Stack key={folder.id} spacing={1}>
								<Button 
								variant={"contained"} 
								color={"secondary"}  
								onClick={(e) => {nav.setFolder(folder)}}>
									<Stack spacing={1}>
										<Typography>{folder.text}</Typography>
										{/* <Stack direction="row" spacing={1}>
												<Button variant={"outlined"} 
												color={"inherit"}  
												onClick={(e) => {}}
												>
												<ArrowUpwardIcon/>
												</Button>
												<Button variant={"outlined"} 
												color={"inherit"}  
												onClick={(e) => {}}
												>
												<ArrowDownwardIcon/>
												</Button>
												<Button variant={"outlined"} 
												color={"inherit"}  
												onClick={(e) => {}}
												>
												<DeleteIcon/>
												</Button>
										</Stack> */}
									</Stack>
								</Button>
							</Stack>
						);
					} else {
						return (
							<Button variant={"outlined"} 
							color={"inherit"}  
							onClick={(e) => {nav.setFolder(folder)}}>
							{folder.text}
							</Button>
						);
					}
				})}
				<Button variant="outlined" color="secondary" onClick={(e) => {editor.addFolder()}}>
				<AddCircleIcon />
				</Button>
			</Stack>
		);
	}
    
	return (
		<Box
			component="nav"
			sx={{ width: { sm: 320 }, flexShrink: { sm: 0 } }}
			aria-label="mailbox folders"
		>
			<Paper style={{padding:'24px'}}>
				<div>
					<FormLabel component="legend">Survey Name</FormLabel>
					<TextField
						value={survey.text}
						onChange={(e) => {editor.onChangeValue(survey.id,'text', e.target.value)}}
					/>
				</div>
				<OptionsEditorForm
					title="Options"
					options={SurveyMap.options}
				/>
				<OptionsEditorForm
					title="Layout"
					options={SurveyMap.layout}
				/> 
				<Accordion>
					<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="pane21a-content"
					id="panel2a-header"
					>
					<Typography>Folders</Typography>
					</AccordionSummary>
					<AccordionDetails>
						{renderFolders()}
					</AccordionDetails>
				</Accordion>
			</Paper>
		</Box>
	);
}