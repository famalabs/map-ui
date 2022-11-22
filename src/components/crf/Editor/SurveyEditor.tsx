import React from 'react';
import {Survey} from '../../../core/schema'
import { Box, CssBaseline } from '@mui/material';
import { FolderEditorForm } from './FolderEditor';
import { SidebarEditorForm } from './SidebarEditor';
import { useEditorState } from './EditorBuilder';

export interface SurveyEditorProps {
    saveSurvey: (survey: Survey) => void;
    // initSurvey?: Survey;
    // addQuestionLabel?: string;
    // saveSurveyLabel?: string;
}

export function SurveyEditorForm({
    saveSurvey,
    // initSurvey = emptyObj,
    // addQuestionLabel = 'Add question',
    // saveSurveyLabel = 'Save survey',
    }: SurveyEditorProps) {
    // const [questions, setQuestions] = React.useState<Question[]>(Object.values(initSurvey));

    // const [schema, setSchema] = React.useState(Object.values())
    const editorState = useEditorState();
    console.log('render survey', editorState.editor.getRoot());
    return (
        <Box 
        // sx={{ display: 'flex', width:'100%' }}
        sx={{ width:'100%' }}
        >
            <CssBaseline />
            <SidebarEditorForm
                editorState={editorState}
            />
            <Box
                component="main"
                // sx={{ flexGrow: 1, justifySelf: 'stretch', width: { sm: `calc(100% - ${320}px)` } }}
                style={{position:'absolute',left:320+64,top:0,right:0, padding:'0px 24px'}}
            >
                <FolderEditorForm
                    editorState={editorState}
                />
            </Box>

        </Box>

    );
}