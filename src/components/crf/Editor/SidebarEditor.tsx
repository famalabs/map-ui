import React from 'react';
import {Survey, SurveyItem, SurveyMap} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails, Box, Stack, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { OptionsEditorForm, renderSelectOption } from './OptionsEditor';
import { FolderEditorForm } from './FolderEditor';
import PreviewIcon from '@mui/icons-material/Preview';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { IEditorState, IUseEditorState } from './EditorBuilder';
import { INavState } from '../Navigation';

const MenuStateMap = {
	folsers:'folders',
	edit:'edit',
	options:'options',
	layout:'layout',
	folder:'folder'
}

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

	const [menuState, setMenuState] = React.useState(MenuStateMap.folsers);

	const renderMenuButton = (Icon, menuStateButton:string) => {
		return (
		<ListItem disablePadding>
			<Button 
			variant={menuStateButton == menuState ? "contained" : "text"} 
			color={menuStateButton == menuState ? "secondary" : "inherit"}
			style={{ borderRadius: '0px' }}
			onClick={(e) => {setMenuState(menuStateButton)}}
			>
				<Icon />
			</Button>
		</ListItem>
		);
	}

	const renderMenu = () => {
		return (
			<Box sx={{ width: '100%' }}>
				<nav>
					<List>
						{renderMenuButton(FormatListNumberedIcon, MenuStateMap.folsers)}
						{renderMenuButton(EditIcon, MenuStateMap.edit)}
						{renderMenuButton(SettingsIcon, MenuStateMap.options)}
						{renderMenuButton(PreviewIcon, MenuStateMap.layout)}
					</List>
				</nav>
				<Divider />
				<nav aria-label="secondary mailbox folders">
					<List>

					</List>
				</nav>
			</Box>
		);
	}

	const renderFolders = () => {
		return (
			<Stack spacing={1}>
				{nav.getFolders().map((folder,idx) => {
					if (folderId === folder.id ) {
						return (
							<Box key={folder.id} 
							sx={{
								border: 1, 
								borderColor: 'secondary',
								padding:'6px 16px',
								textAlign:'center'
							}}
							>
							<Stack spacing={1}>
								<Typography>{folder.text}</Typography>
								<Divider></Divider>
								<div style={{display:'flex', justifyContent: 'center'}}>
									{/* <Button 
									variant={"outlined"} 
									color={"inherit"}  
									onClick={(e) => {}}
									sx={{margin:'0px 3px'}}
									>
									<EditIcon/>
									</Button> */}
									<Button 
									variant={"outlined"} 
									color={"inherit"}  
									onClick={(e) => {editor.moveItemUp(folder)}}
									sx={{margin:'0px 3px'}}
									>
									<ArrowUpwardIcon/>
									</Button>
									<Button variant={"outlined"} 
									color={"inherit"}  
									onClick={(e) => {editor.moveItemDown(folder)}}
									sx={{margin:'0px 3px'}}
									>
									<ArrowDownwardIcon/>
									</Button>
									<Button variant={"outlined"} 
									color={"inherit"}  
									onClick={(e) => {editor.removeItem(folder)}}
									sx={{margin:'0px 3px'}}
									>
									<DeleteIcon/>
									</Button>
								</div>
							</Stack>
							</Box>
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
				<CreateNewFolderIcon />
				</Button>
			</Stack>
		);
	}

	const renderEdit = () => {
		return (
			<div>
				<FormLabel component="legend">Survey Name</FormLabel>
				<TextField
					value={survey.text}
					onChange={(e) => {editor.onChangeValue(survey.id,'text', e.target.value)}}
				/>
			</div>
		);
	}

	const renderOptions = () => {
		return(
			<Stack spacing={2}>
				{Object.keys(SurveyMap.options).map((val,idx) => {
					return renderSelectOption(SurveyMap.options[val],val);
				})}
			</Stack>
		);
	}

	const renderLayout = () => {
		return(
			<Stack spacing={2}>
				{Object.keys(SurveyMap.layout).map((val,idx) => {
					return renderSelectOption(SurveyMap.layout[val],val);
				})}
			</Stack>
		);
	}
    
	return (
		<Box
			component="nav"
			sx={{ width: { sm: 320+64 }, flexShrink: { sm: 0 } }}
		>
			<Paper style={{ display: 'flex', justifyContent: 'flex-start' }}>
				<Box
				sx={{ width:'64px', borderRight: 1, borderColor: 'divider' }}
				>
					{renderMenu()}
				</Box>
				<Box
				sx={{ width:'100%', padding:'24px' }}
				>
					<Typography variant="h3">{survey.text}</Typography>
					<Stack spacing={2}>
					<Divider variant='middle'></Divider>
					<Typography variant="h5">{menuState}</Typography>
					{menuState === MenuStateMap.folsers ? renderFolders() :
					menuState === MenuStateMap.edit ? renderEdit() :
					menuState === MenuStateMap.options ? renderOptions() :
					menuState === MenuStateMap.layout ? renderLayout() : null
					}
					</Stack>
				</Box>
			</Paper>
		</Box>
	);
}