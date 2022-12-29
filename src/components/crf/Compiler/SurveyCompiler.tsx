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
}

export function SurveyForm({
	initSurvey,
}: SurveyFormProps) {

	const formCompiler = useFormCompiler(initSurvey);
	const form = formCompiler.form;
	const nav = formCompiler.nav;

	const sidebar = (<SidebarCompiler formCompiler={formCompiler}/>);
	const content = (
		<><HorizontalStepper formCompiler={formCompiler}/>
		<form onSubmit={form.submitForm}><FolderCompilerForm formCompiler={formCompiler}/></form>
		<NavigationButtons formCompiler={formCompiler}/></>);
	return (
		// <Box 
		// // sx={{ display: 'flex', width:'100%' }}
		// sx={{ width:'100%' }}
		// >
		// 	<CssBaseline />
			// <BaseSidebarLayout
			// 	drawerWidth={drawerWidth}
			// 	formCompiler={formCompiler}
			// />
		// 	<Box
		// 		component="main"
		// 		// sx={{ left:`${drawerWidth}px`, flexGrow: 1, p:3, width: { sm: `calc(100vw - ${drawerWidth}px)`, minWidth:'614px' } }}
		// 		// sx={{ flexGrow: 1, p:3,ml:`${drawerWidth}px`,mt:0,mr:0, minWidth:`calc(100vw - ${drawerWidth}px)`, maxWidth:`calc(100vw - ${drawerWidth}px)`}}
		// 		style={{position:'absolute',left:drawerWidth,top:0,right:0, padding:24}}
		// 	>
				// <HorizontalStepper
				// 	formCompiler={formCompiler}
				// />
		// 		<form onSubmit={form.submitForm}>
		// 			<FolderCompilerForm
		// 			formCompiler={formCompiler}
		// 			/>
		// 		</form>
		// 		<NavigationButtons
		// 			formCompiler={formCompiler}
		// 		/>
		// 		{/* <div>
		// 			<p>Value</p>
		// 			<pre>{JSON.stringify(Value[nav.getFolderId()][nav.getPageId()], null, 2)}</pre>
		// 			<p>validators</p>
		// 			<pre>{JSON.stringify(validators[nav.getFolderId()][nav.getPageId()], null, 2)}</pre>
		// 			<p>requires</p>
		// 			<pre>{JSON.stringify(requires[nav.getFolderId()][nav.getPageId()], null, 2)}</pre>
		// 			<p>Valid</p>
		// 			<pre>{JSON.stringify(typeof Valid !== 'boolean' ? Valid.children[nav.getFolderId()].children[nav.getPageId()] : {}, null, 2)}</pre>
		// 		</div> */}

		// 	</Box>

		// </Box>
		<DrawerCommon
		sidebar={sidebar}
		content={content}
		drawerWidth={320}	
		title={form.getRoot().text}		
		/>
	);
}