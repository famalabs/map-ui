import React from 'react';
import {SurveyMap} from '../../forms'
import { Button, Paper, TextField, Typography, FormLabel, Box, Stack, List, ListItem, Divider } from '@mui/material';
import {Edit, Delete, Settings, FormatListNumbered, FolderOpen, CreateNewFolder, Preview, ArrowUpward, ArrowDownward} from '@mui/icons-material';
import { renderSelectOption } from './OptionsEditor';
import { IUseEditorState } from './EditorBuilder';

const MenuStateMap = {
	folders:'folders',
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
	// console.log('sidebar', folders)

	const [menuState, setMenuState] = React.useState(MenuStateMap.folders);

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
						{renderMenuButton(FormatListNumbered, MenuStateMap.folders)}
						{renderMenuButton(Edit, MenuStateMap.edit)}
						{renderMenuButton(Settings, MenuStateMap.options)}
						{renderMenuButton(Preview, MenuStateMap.layout)}
					</List>
				</nav>
				<Divider />
				<nav>
					<List>
						{(menuState === MenuStateMap.folders || menuState === MenuStateMap.folder) ? 
						renderMenuButton(FolderOpen, MenuStateMap.folder) : null}
					</List>
				</nav>
			</Box>
		);
	}

	const renderFolders = () => {
		return (
			<Stack spacing={1}>
				{folders.map((folder,idx) => {
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
									<Button 
									variant={"outlined"} 
									color={"inherit"}  
									onClick={(e) => {setMenuState(MenuStateMap.folder)}}
									sx={{margin:'0px 3px'}}
									>
									<Edit/>
									</Button>
									<Button variant={"outlined"} 
									color={"inherit"}  
									onClick={(e) => {editor.removeItem(folder)}}
									sx={{margin:'0px 3px'}}
									>
									<Delete/>
									</Button>
								</div>
								<div style={{display:'flex', justifyContent: 'center'}}>
									<Button 
									variant={"outlined"} 
									color={"inherit"}  
									onClick={(e) => {editor.moveItemUp(folder)}}
									sx={{margin:'0px 3px'}}
									>
									<ArrowUpward/>
									</Button>
									<Button variant={"outlined"} 
									color={"inherit"}  
									onClick={(e) => {editor.moveItemDown(folder)}}
									sx={{margin:'0px 3px'}}
									>
									<ArrowDownward/>
									</Button>
								</div>
							</Stack>
							</Box>
						);
					} else {
						return (
							<Button 
							key={folder.id}
							variant={"outlined"} 
							color={"inherit"}  
							onClick={(e) => {nav.setFolder(folder)}}>
							{folder.text}
							</Button>
						);
					}
				})}
				<Button variant="outlined" color="secondary" onClick={(e) => {editor.addFolder()}}>
				<CreateNewFolder />
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
				{/* {Object.keys(SurveyMap.options).map((val,idx) => {
					return (
						<div key={val}>{renderSelectOption(SurveyMap.options[val],val, survey.options[val] ?? SurveyMap.options[val].default, editor, survey.id, 'options.'+val)}</div>
					);
				})} */}
			</Stack>
		);
	}

	const renderLayout = () => {
		// return(
		// 	<Stack spacing={2}>
		// 		{Object.keys(SurveyMap.layout).map((val,idx) => {
		// 			return (
		// 				<div key={val}>{renderSelectOption(SurveyMap.layout[val],val, survey.layout[val] ?? SurveyMap.layout[val].default, editor, survey.id, 'layout.'+val)}</div>
		// 			);
		// 		})}
		// 	</Stack>
		// );
		return null;
	}

	const renderFolder = () => {
		const folder = nav.getFolder();
		return (
			<div>
				<FormLabel component="legend">Folder Name</FormLabel>
				<TextField
					value={folder.text}
					onChange={(e) => {editor.onChangeValue(folder.id,'text', e.target.value)}}
				/>
			</div>
		);
	}
    
	return (
			<Box style={{ display: 'flex', justifyContent: 'flex-start', height:'100%', width:'100%' }}>
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
					{menuState === MenuStateMap.folders ? renderFolders() :
					menuState === MenuStateMap.edit ? renderEdit() :
					menuState === MenuStateMap.options ? renderOptions() :
					menuState === MenuStateMap.layout ? renderLayout() :
					menuState === MenuStateMap.folder ? renderFolder() :
					null
					}
					</Stack>
				</Box>
			</Box>
	);
}