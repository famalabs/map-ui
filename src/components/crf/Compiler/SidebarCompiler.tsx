import { Accordion, AccordionDetails, AccordionSummary, Box, Button, ListItemButton, ListItemText, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { Item } from "../../../survey";
import React from "react";
import { IUseFormCompiler } from "./FormCompiler";
import {ExpandMore, CheckCircle, Cancel, Edit} from '@mui/icons-material';

export interface SidebarCompilerProps {
	formCompiler: IUseFormCompiler;
	loading: boolean;
}

export function SidebarCompiler ({
	formCompiler,
	loading
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

	const ready = (
				<Stack spacing={2} sx={{p:3}}>
				<Typography variant="h5" style={{marginBottom: 15}}>{form.getRoot().text}</Typography>
				{form.getRoot().items.map((folder, idx) => {
					return (
						<Button
						key={folder.id}
						variant={folder.id===nav.getFolderId()?"contained":"outlined"}
						onClick={(e)=>{nav.setFolder(folder)}}
						// sx={{border: folder.id===nav.getFolderId()?'1px solid black':0}}
						>
						{/* {form.getValid(folder.id)?(<CheckCircle color="success"/>):(<Cancel color="error"/>)} */}
							{form.getValid(folder.id)?(<CheckCircle color="success"/>):(<Edit />)}
						 	<span style={{paddingLeft: 10}}>{folder.text}</span>
						</Button>
						// <Accordion key={folder.id} style={{margin: 0}}
						// defaultExpanded={folder.id===nav.getFolderId()}
						// sx={{border: folder.id===nav.getFolderId()?'1px solid black':0}}
						// >
						// 	<AccordionSummary expandIcon={<ExpandMore />}>
						// 	{form.getValid(folder.id)?
						// 						(<CheckCircle color="success"/>)
						// 						:(<Cancel color="error"/>)}
						// 	<span style={{paddingLeft: 10}}>{folder.text}</span>
						// 	</AccordionSummary>
						// 	<AccordionDetails>
						// 		<Stack spacing={1}>
						// 		{folder.items.map((page, idx2) => {
						// 			return (
						// 					<Button 
						// 					style={{justifyContent: 'start'}}
						// 					key={page.id}
						// 					variant={page.id===nav.getPageId()?"contained":"text"}
						// 					onClick={(e) => {nav.setFolder(folder, page);}}
						// 					startIcon={page.id===nav.getPageId()?null
						// 						:form.getValid(page.id)?
						// 						(<CheckCircle color="success"/>)
						// 						:(<Cancel color="error"/>)}
						// 					>
						// 						{page.text}
						// 					</Button>
						// 			);
						// 		})}
						// 		</Stack>
						// 	</AccordionDetails>
						// 	{/* <Divider variant="middle"></Divider> */}
						// </Accordion>
					);
				})}
				</Stack>
	)
	const skeleton = (
		<Stack spacing={-2} sx={{pl:3,pr:3,pt:0}}>
		<Skeleton animation="wave" variant="text" sx={{ fontSize: '5rem' }} />

		<Skeleton animation="wave" variant="text" sx={{ fontSize: '3rem' }} />
		<Stack sx={{pl:6}} spacing={-2}>
		<Skeleton animation="wave" variant="text" sx={{ fontSize: '3rem' }} />
		<Skeleton animation="wave" variant="text" sx={{ fontSize: '3rem' }} />
		<Skeleton animation="wave" variant="text" sx={{ fontSize: '3rem' }} />
		</Stack>

		<Skeleton animation="wave" variant="text" sx={{ fontSize: '5rem' }} />

		<Skeleton animation="wave" variant="text" sx={{ fontSize: '5rem' }} />
		
		{/* <Skeleton variant="circular" width={40} height={40} />
		<Skeleton variant="rectangular" width={210} height={60} />
		<Skeleton variant="rounded" width={210} height={60} /> */}
		</Stack>
	)
	return loading ? skeleton : ready;
}