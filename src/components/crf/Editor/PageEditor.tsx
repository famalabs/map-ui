import React from 'react';
import {Survey, GroupMap, Question, QuestionMap, QuestionTextMap, QuestionNumberMap, QuestionSelectMap, QuestionCheckMap, QuestionDateMap, FnMap} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails, Menu, Stack, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import PinIcon from '@mui/icons-material/Pin';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LinearScaleRoundedIcon from '@mui/icons-material/LinearScaleRounded';
import { QuestionEditorForm } from './QuestionEditor';
import { INavState } from '../Navigation';
import { IEditorState, IUseEditorState } from './EditorBuilder';

export interface PageEditorFormProps {
	editorState: IUseEditorState;
}

export function PageEditorForm({
	editorState,
	}: PageEditorFormProps) {
	const editor = editorState.editor;
	const nav = editorState.nav;
	const page = nav.getPage();
	const [anchorAddQuestion, setAnchorAddQuestion] = React.useState<null | HTMLElement>(null);
	const openAddQuestion = Boolean(anchorAddQuestion);
	const handleOpenAddQuestion = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorAddQuestion(event.currentTarget);
	};
	const handleAddQuestion = (type: string) => {
		setAnchorAddQuestion(null);
		if (typeof type !== 'undefined') {
			editor.addQuestion(type);
		}
	};
	console.log('render page',page);
	return (
		<div>
			<Typography variant='h6'>Questions</Typography>
			<Stack spacing={2}>
			{page.items.map((question) => {
				return(
					<QuestionEditorForm
						key={question.id}
						editorState={editorState}
						question={question as Question}
					/>
				);
			})}
			</Stack>
			<Button 
				color="inherit" 
        aria-controls={openAddQuestion ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openAddQuestion ? 'true' : undefined}
        onClick={handleOpenAddQuestion}
			>
				<AddCircleIcon />
			</Button>
			<Menu
				// id="basic-menu"
				anchorEl={anchorAddQuestion}
				open={openAddQuestion}
				onClose={(e) =>handleAddQuestion(undefined)}
				// MenuListProps={{
				// 'aria-labelledby': 'basic-button',
				// }}
			>
				{/* <Stack direction="row"></Stack> */}
				<Divider variant='middle'>Questions</Divider>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionTextMap.type)}><TextFieldsIcon/> <Typography>Text</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionTextMap.layout.style.area)}><TextFieldsIcon/> <Typography>Text Multiline</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionNumberMap.type)}><PinIcon/> <Typography>Number</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionNumberMap.layout.style.range)}><LinearScaleRoundedIcon/> <Typography>Slider</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionSelectMap.type)}><RadioButtonCheckedIcon/> <Typography>Radio Buttons</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionCheckMap.type)}><CheckBoxIcon/> <Typography>CheckBoxs</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionDateMap.type)}><CalendarMonthIcon/><Typography>Date</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionDateMap.type)}><CalendarMonthIcon/><Typography>Score Table</Typography></MenuItem>
				<Divider variant='middle'>Functions</Divider>
				<MenuItem onClick={(e) =>handleAddQuestion(FnMap.type)}><CalendarMonthIcon/><Typography>Function</Typography></MenuItem>
				<Divider variant='middle' >Layout</Divider>
				<MenuItem onClick={(e) =>handleAddQuestion(undefined)}><CalendarMonthIcon/><Typography>Group</Typography></MenuItem>
			</Menu>
		</div>
	);
}