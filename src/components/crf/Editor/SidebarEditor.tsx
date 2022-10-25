import React from 'react';
import {Survey, SurveyItem, SurveyMap} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails, Box, Stack } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import FolderIcon from '@mui/icons-material/Folder';
import { OptionsEditorForm } from './OptionsEditor';
import { FolderEditorForm } from './FolderEditor';
import PreviewIcon from '@mui/icons-material/Preview';
import { IEditorState } from './EditorBuilder';
import { INavState } from '../Navigation';

export interface SidebarEditorProps {
    editor: IEditorState;
    nav: INavState;
}

export function SidebarEditorForm({
    editor,
    nav
    }: SidebarEditorProps) {

    const renderPages = (pages: SurveyItem[]) => {
        return (
            <div>
                {pages.map((page) => {
                    return(
                        <Button color="inherit" startIcon={<EditIcon />}>
                            {page.text}
                        </Button>
                    );
                })}
            </div>
        );
    }

    const renderFolders = () => {
        const folders = nav.getFolders();
        const folderId = nav.getFolderId();
        return (
            <Stack spacing={1}>
                {nav.getFolders().map((folder) => {
                    return (
                        // color={nav.getFolderId() === folder.id ? "secondary" : "inherit"}
                        <Button variant={folderId === folder.id ? "contained" : "outlined"} color={folderId === folder.id ? "secondary" : "inherit"}  onClick={(e) => {nav.setFolder(folder)}}>
                        {folder.text}
                        </Button>
                    );
                })}
                <Button variant="outlined" color="secondary" startIcon={<AddCircleIcon />} onClick={(e) => {editor.addFolder()}}>
                Add new folder
                </Button>
            </Stack>
        );
    }
    
    return (
        <Box
            component="nav"
            sx={{ width: { sm: 320 }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
        >
            <Paper style={{padding:'24px'}}>
                <div>
                    <FormLabel component="legend">Survey Name</FormLabel>
                    <TextField
                        value="My Survey 1"
                    />
                </div>
                <OptionsEditorForm
                    title="Options"
                    options={SurveyMap.options}
                />
                <OptionsEditorForm
                    title="Layout"
                    options={SurveyMap.layout}
                /> 
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="pane21a-content"
                    id="panel2a-header"
                    >
                    <Typography>Folders</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {renderFolders()}
                    </AccordionDetails>
                </Accordion>
            </Paper>
        </Box>
    );
}