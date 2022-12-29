import { Accordion, AccordionDetails, AccordionSummary, Box, Button, ListItemButton, ListItemText, Paper, Stack, Typography } from "@mui/material";
import { Item } from "../../../survey";
import React from "react";
import { IUseFormCompiler } from "./FormCompiler";
import {ExpandMore, CheckCircle, Cancel} from '@mui/icons-material';

export interface SidebarCompilerProps {
	formCompiler: IUseFormCompiler;
}

export function SidebarCompiler ({
	formCompiler
}: SidebarCompilerProps) {

	const form = formCompiler.form;
	const nav = formCompiler.nav;

	const renderFolder = (folder:Item) => {
		return (
			<ListItemButton onClick={(e) => {nav.setFolder(folder); }}>
        {/* <ListItemIcon>
          <InboxIcon />
        </ListItemIcon> */}
        <ListItemText primary={folder.text} />
      </ListItemButton>
		);
	}
	const renderPage = (folder:Item, page:Item) => {
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
				<Stack spacing={2} sx={{p:3}}>
				<Typography variant="h3">{form.getRoot().text}</Typography>
				{form.getRoot().items.map((folder, idx) => {
					return (
						<Accordion key={folder.id} 
						defaultExpanded={folder.id===nav.getFolderId()}
						sx={{border: folder.id===nav.getFolderId()?'1px solid black':0}}
						>
							<AccordionSummary expandIcon={<ExpandMore />}>
							{form.getValid(folder.id)?
												(<CheckCircle color="success"/>)
												:(<Cancel color="error"/>)}
							{folder.text}
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
												(<CheckCircle color="success"/>)
												:(<Cancel color="error"/>)}
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
				})}
				</Stack>
		// <Box
		// 	component="nav"
		// 	// sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
		// 	style={{position:'fixed',top:'0',left:'0',bottom:'0', width: `${drawerWidth}px`}}
		// 	// style={{position:'absolute',left:drawerWidth,top:0,right:0, padding:0}}
		// >
		// 	<Paper style={{padding:'24px',height:'100%',width:'100%'}}>
		// 		<Typography variant="h3">{form.getRoot().text}</Typography>
		// 		<Stack spacing={1} style={{marginTop:24}}>
		// 		{form.getRoot().items.map((folder, idx) => {
		// 			return (
		// 				<Accordion key={folder.id} 
		// 				defaultExpanded={folder.id===nav.getFolderId()}
		// 				sx={{border: folder.id===nav.getFolderId()?'1px solid black':0}}
		// 				>
		// 					<AccordionSummary expandIcon={<ExpandMore />}>
		// 					{form.getValid(folder.id)?
		// 										(<CheckCircle color="success"/>)
		// 										:(<Cancel color="error"/>)}
		// 					{folder.text}
		// 					{/* <Button onClick={(e) => {nav.setFolder(folder); }}>
		// 						{folder.text}
		// 					</Button> */}
		// 					</AccordionSummary>
		// 					<AccordionDetails>
		// 						<Stack spacing={1}>
		// 						{folder.items.map((page, idx2) => {
		// 							return (
		// 									<Button 
		// 									variant={page.id===nav.getPageId()?"contained":"text"}
		// 									onClick={(e) => {nav.setFolder(folder, page);}}
		// 									startIcon={page.id===nav.getPageId()?null
		// 										:form.getValid(page.id)?
		// 										(<CheckCircle color="success"/>)
		// 										:(<Cancel color="error"/>)}
		// 									>
		// 										{page.text}
		// 									</Button>
		// 							);
		// 						})}
		// 						</Stack>
		// 					</AccordionDetails>
		// 					{/* <Divider variant="middle"></Divider> */}
		// 				</Accordion>
		// 			);
		// 			// <div key={folder.id}>
		// 			// 	<Link underline="hover" onClick={(e) => {nav.setFolder(folder); }}><Typography variant="h5">{folder.text}</Typography></Link>
		// 				// {folder.items.map((page, idx2) => (
		// 					// <div key={page.id}>
		// 					// 	<Link underline="hover" onClick={(e) => {  nav.setFolder(folder, page); }}><Typography>{page.text}</Typography></Link>
		// 					// </div>
		// 				// ))}
		// 			// </div>
		// 		})}
		// 		</Stack>
		// 	</Paper>
		// </Box>
	);
}