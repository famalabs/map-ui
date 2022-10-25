import React from 'react';
import {Survey, GroupMap, Question, QuestionMap, QuestionTextMap, QuestionNumberMap, QuestionSelectMap, QuestionCheckMap, QuestionDateMap} from '../../../core/schema'
import { AutoSelect } from '../../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid, Typography, InputLabel, Select, MenuItem, FormLabel, Accordion, AccordionSummary, AccordionDetails, Menu } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import PinIcon from '@mui/icons-material/Pin';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { QuestionEditorForm } from './QuestionEditor';
import { INavState } from '../Navigation';
import { IEditorState } from './EditorBuilder';

export interface PageEditorFormProps {
	editor: IEditorState;
	nav: INavState;
}

export function PageEditorForm({
	editor,
	nav
	}: PageEditorFormProps) {
	const page = nav.getPage();
	const [anchorAddQuestion, setAnchorAddQuestion] = React.useState<null | HTMLElement>(null);
	const openAddQuestion = Boolean(anchorAddQuestion);
	const handleOpenAddQuestion = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorAddQuestion(event.currentTarget);
	};
	const handleAddQuestion = (type: string) => {
		setAnchorAddQuestion(null);
	};
	return (
		<div>
			<Typography variant='h6'>Questions</Typography>
			{page.items.map((question) => {
				return(
					<QuestionEditorForm
							editor={editor}
							nav={nav}
							question={question as Question}
					/>
				);
			})}
			{/* <QuestionEditorForm
							editor={editor}
							nav={nav}
			/>
			<QuestionEditorForm
							editor={editor}
							nav={nav}
			/>
			<QuestionEditorForm
							editor={editor}
							nav={nav}
			/> */}
			<Button 
				color="inherit" 
				startIcon={<AddCircleIcon />}
        aria-controls={openAddQuestion ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openAddQuestion ? 'true' : undefined}
        onClick={handleOpenAddQuestion}
			>
				Add new question
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
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionTextMap.type)}><TextFieldsIcon/> <Typography>Text</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionNumberMap.type)}><PinIcon/> <Typography>Number</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionSelectMap.type)}><RadioButtonCheckedIcon/> <Typography>Radio Buttons</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionCheckMap.type)}><CheckBoxIcon/> <Typography>CheckBoxs</Typography></MenuItem>
				<MenuItem onClick={(e) =>handleAddQuestion(QuestionDateMap.type)}><CalendarMonthIcon/><Typography>Date</Typography></MenuItem>
			</Menu>
		</div>
	);
}