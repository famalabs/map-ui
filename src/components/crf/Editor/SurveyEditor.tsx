import React from 'react';
import { DBSchema, Survey } from '../../../survey'
import { Box, CssBaseline } from '@mui/material';
import { FolderEditorForm } from './FolderEditor';
import { SidebarEditorForm } from './SidebarEditor';
import { useEditorState } from './EditorBuilder';
import { DrawerCommon } from '../common';

export interface SurveyEditorProps {
	saveSurvey: (survey: Survey) => void;
	initSurvey: DBSchema;
}

export function SurveyEditorForm({
	saveSurvey,
	initSurvey,
	}: SurveyEditorProps) {
		
	const editorState = useEditorState(initSurvey);
	// console.log('render survey survey', editorState.editor.getSurvey());
	// console.log('render survey root', editorState.editor.getRoot());
	// console.log('render survey schema', editorState.editor.getRoot().getSchema());
	const sidebar = (<SidebarEditorForm editorState={editorState}/>);
	const content = (<FolderEditorForm editorState={editorState} />);
	return (
		<DrawerCommon
		sidebar={sidebar}
		content={content}
		drawerWidth={320+64}	
		title={"Survey Editor"}		
		// removeHeader={true}
		/>
	);
}