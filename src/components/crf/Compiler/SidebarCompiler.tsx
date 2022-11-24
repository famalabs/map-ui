import { AppBar, Box, Link, Paper, Typography } from "@mui/material";
import { SurveyItem } from "../../../core/schema";
import React from "react";
import { INavState, SurveyNav } from '../Navigation';
import { IUseFormCompiler } from "./FormCompiler";

export interface BaseSidebarLayoutProps {
	drawerWidth: number;
	formCompiler: IUseFormCompiler;
}

export function BaseSidebarLayout ({
	drawerWidth,
	formCompiler
}: BaseSidebarLayoutProps) {

	const form = formCompiler.form;
	const nav = formCompiler.nav;

	return (
		<Box
			component="nav"
			// sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
			style={{position:'fixed',top:'0',left:'0',bottom:'0', width: `${drawerWidth}px`}}
			// style={{position:'absolute',left:drawerWidth,top:0,right:0, padding:0}}
		>
			<Paper style={{padding:'24px',height:'100%',width:'100%'}}>
				<Typography variant="h3">{form.getRoot().text}</Typography>
				{form.getRoot().layout.style === 'multi_folder' ? (
					<div>
					{form.getRoot().items.map((folder, idx) => (
						<div key={folder.id}>
							<Link underline="hover" onClick={(e) => {nav.setFolder(folder); }}><Typography variant="h5">{folder.text}</Typography></Link>
							{folder.items.map((page, idx2) => (
								<div key={page.id}>
									<Link underline="hover" onClick={(e) => {  nav.setFolder(folder, page); }}><Typography>{page.text}</Typography></Link>
								</div>
							))}
						</div>
					))}
					</div>
				) : null}
			</Paper>
		</Box>
	);
}