import React from 'react';
import { SidebarCompiler } from './SidebarCompiler';
import { Box, CssBaseline } from '@mui/material';
import { HorizontalStepper } from './StepperCompiler';
import { NavigationButtons } from './NavigationButtonsCompiler';
import { Survey } from '../../../survey';
import { useFormCompiler } from './FormCompiler';
import { FolderCompilerForm } from './FolderCompiler';
import { DrawerCommon } from '../common';

export interface SurveyFormProps {
	initSurvey: any;
	loading: boolean;
}

export function SurveyForm({
	initSurvey,
	loading,
}: SurveyFormProps) {

	const formCompiler = useFormCompiler(initSurvey);
	const form = formCompiler.form;
	const nav = formCompiler.nav;

	const sidebar = (<SidebarCompiler formCompiler={formCompiler} loading={loading}/>);
	const content = (
		<><HorizontalStepper formCompiler={formCompiler}/>
		<form onSubmit={form.submitForm}><FolderCompilerForm formCompiler={formCompiler} loading={loading}/></form>
		<NavigationButtons formCompiler={formCompiler}/></>);
	return (
		<DrawerCommon
		sidebar={sidebar}
		content={content}
		drawerWidth={320}	
		title={form.getRoot().text}		
		/>
	);
}