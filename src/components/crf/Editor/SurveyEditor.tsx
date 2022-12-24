import React from 'react';
import {Survey} from '../../../core/schema'
import { Box, CssBaseline } from '@mui/material';
import { FolderEditorForm } from './FolderEditor';
import { SidebarEditorForm } from './SidebarEditor';
import { useEditorState } from './EditorBuilder';

export interface SurveyEditorProps {
    saveSurvey: (survey: Survey) => void;
    initSurvey: any;
}

export function SurveyEditorForm({
    saveSurvey,
    initSurvey,
    }: SurveyEditorProps) {
        
    const editorState = useEditorState(initSurvey);
    // console.log('render survey survey', editorState.editor.getSurvey());
    // console.log('render survey root', editorState.editor.getRoot());
    // console.log('render survey schema', editorState.editor.getRoot().getSchema());
    return (
        <Box 
        // sx={{ display: 'flex', width:'100%', m:0, justifyContent: 'flex-end' }}
        sx={{ width:'100%' }}
        >
            {/* <CssBaseline /> */}
            <SidebarEditorForm
                editorState={editorState}
            />
            <Box
                component="main"
                // sx={{ flexGrow: 1, p:'0px 24px',ml:`${320+64}px`,mt:0,mr:0, minWidth:`calc(100% - ${320+64}px)`, maxWidth:`calc(100% - ${320+64}px)`}}
                style={{position:'absolute',left:320+64,top:0,right:0, padding:24}}
            >
                <FolderEditorForm
                    editorState={editorState}
                />
            </Box>

        </Box>

    );
}