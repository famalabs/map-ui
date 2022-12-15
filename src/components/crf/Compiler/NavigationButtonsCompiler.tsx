import { Box, Button } from '@mui/material';
import * as React from 'react';
import { IUseFormCompiler } from './FormCompiler';

export interface NavigationButtonsProps {
	formCompiler:IUseFormCompiler;
}

export function NavigationButtons({
	formCompiler,
}: NavigationButtonsProps) {
	const form = formCompiler.form;
	const nav = formCompiler.nav;
	
	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
				{/* <Button color="inherit" disabled={activePage === 0} onClick={(e) => {handleSetPage([pages[activePage-1].id,activePage-1])}} sx={{ mr: 1 }}> */}
				<Button color="inherit" disabled={nav.getPageIdx() === 0} onClick={(e) => {nav.prevPage()}} sx={{ mr: 1 }}>
					Back
				</Button>
				<Box sx={{ flex: '1 1 auto' }} />
					{/* <Button color="inherit" disabled={activePage === pages.length-1} onClick={(e)=>{handleSetPage([pages[activePage+1].id,activePage+1])}} sx={{ mr: 1 }}> */}
					<Button color="inherit" disabled={nav.getPageIdx() === nav.getPages().length-1} onClick={(e)=>{nav.nextPage()}} sx={{ mr: 1 }}>
						Next
					</Button>
					{/* {valid.children[folder[0]].allValid && activePage === pages.length-1 ? 
						folder[1] === root.items.length-1 ? (
							<Button color="inherit" disabled={false} onClick={(e)=>{}} sx={{ mr: 1 }}>
								Send Survey
							</Button>
						) : (
						<Button color="inherit" disabled={false} onClick={(e)=>{handleSetFolder([root.items[folder[1]+1].id,folder[1]+1])}} sx={{ mr: 1 }}>
							Continue
						</Button>
					) : null} */}
					{form.getValid(nav.getFolderId()) && nav.getPageIdx() === nav.getPages().length-1 ? 
						nav.getFolderIdx() === nav.getFolders().length-1 ? (
							<Button color="inherit" disabled={false} onClick={(e)=>{}} sx={{ mr: 1 }}>
								Send Survey
							</Button>
						) : (
						<Button color="inherit" disabled={false} onClick={(e)=>{nav.nextFolder()}} sx={{ mr: 1 }}>
							Continue
						</Button>
					) : null}
			</Box>
		</Box>
	);
}
