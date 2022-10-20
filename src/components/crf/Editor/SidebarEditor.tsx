import React from 'react';
import {Survey, SurveyMap} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import { OptionsEditorForm } from './OptionsEditor';
import { FolderEditorForm } from './FolderEditor';

export interface SidebarEditorProps {
}

export function SidebarEditorForm({
    }: SidebarEditorProps) {

    const renderPages = () => {
        return (
            <div>
            <Button color="inherit" startIcon={<EditIcon />}>
                Page 1
            </Button>
            <Button color="inherit" startIcon={<EditIcon />}>
                Page 2
            </Button>
            <Button color="inherit" startIcon={<EditIcon />}>
                Page 3
            </Button>
            </div>
        );
    }

    const renderFolders = () => {
        return (
            <div>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="pane21a-content"
                    id="panel2a-header"
                    >
                    <Typography>Folder 1</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {renderPages()}
                        <Button color="inherit" startIcon={<AddCircleIcon />}>
                        Add new page
                        </Button>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="pane21a-content"
                    id="panel2a-header"
                    >
                    <Typography>Folder 2</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {renderPages()}
                        <Button color="inherit" startIcon={<AddCircleIcon />}>
                        Add new page
                        </Button>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="pane21a-content"
                    id="panel2a-header"
                    >
                    <Typography>Folder 3</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {renderPages()}
                        <Button color="inherit" startIcon={<AddCircleIcon />}>
                        Add new page
                        </Button>
                    </AccordionDetails>
                </Accordion>

            </div>
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
                        <Button color="inherit" startIcon={<AddCircleIcon />}>
                        Add new folder
                        </Button>
                    </AccordionDetails>
                </Accordion>
            </Paper>
        </Box>
    );
}