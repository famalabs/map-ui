import { Accordion, AccordionDetails, AccordionSummary, AppBar, Box, Button, Collapse, Divider, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, Typography } from "@mui/material";
import { SurveyItem } from "../../../core/schema";
import React from "react";
import { INavState, SurveyNav } from '../Navigation';
import { IUseFormCompiler } from "./FormCompiler";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

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

	const renderFolder = (folder:SurveyItem) => {
		return (
			<ListItemButton onClick={(e) => {nav.setFolder(folder); }}>
        {/* <ListItemIcon>
          <InboxIcon />
        </ListItemIcon> */}
        <ListItemText primary={folder.text} />
      </ListItemButton>
		);
	}
	const renderPage = (folder:SurveyItem, page:SurveyItem) => {
		return (
			<ListItemButton onClick={(e) => {nav.setFolder(folder, page); }}>
        {/* <ListItemIcon>
          <InboxIcon />
        </ListItemIcon> */}
        <ListItemText primary={page.text} />
      </ListItemButton>
		);
	}

	return (
		<Box
			component="nav"
			// sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
			style={{position:'fixed',top:'0',left:'0',bottom:'0', width: `${drawerWidth}px`}}
			// style={{position:'absolute',left:drawerWidth,top:0,right:0, padding:0}}
		>
			<Paper style={{padding:'24px',height:'100%',width:'100%'}}>
				<Typography variant="h3">{form.getRoot().text}</Typography>
				<Stack spacing={1} style={{marginTop:24}}>
				{form.getRoot().items.map((folder, idx) => {
					return (
						<Accordion key={folder.id} 
						defaultExpanded={folder.id===nav.getFolderId()}
						sx={{border: folder.id===nav.getFolderId()?'1px solid black':0}}
						>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							{form.getValid(folder.id)?
												(<CheckCircleIcon color="success"/>)
												:(<CancelIcon color="error"/>)}
							{folder.text}
							{/* <Button onClick={(e) => {nav.setFolder(folder); }}>
								{folder.text}
							</Button> */}
							</AccordionSummary>
							<AccordionDetails>
								<Stack spacing={1}>
								{folder.items.map((page, idx2) => {
									return (
											<Button 
											variant={page.id===nav.getPageId()?"contained":"text"}
											onClick={(e) => {nav.setFolder(folder, page);}}
											startIcon={page.id===nav.getPageId()?null
												:form.getValid(page.id)?
												(<CheckCircleIcon color="success"/>)
												:(<CancelIcon color="error"/>)}
											>
												{page.text}
											</Button>
									);
								})}
								</Stack>
							</AccordionDetails>
							{/* <Divider variant="middle"></Divider> */}
						</Accordion>
					);
					// <div key={folder.id}>
					// 	<Link underline="hover" onClick={(e) => {nav.setFolder(folder); }}><Typography variant="h5">{folder.text}</Typography></Link>
						// {folder.items.map((page, idx2) => (
							// <div key={page.id}>
							// 	<Link underline="hover" onClick={(e) => {  nav.setFolder(folder, page); }}><Typography>{page.text}</Typography></Link>
							// </div>
						// ))}
					// </div>
				})}
				</Stack>
			</Paper>
		</Box>
	);
}