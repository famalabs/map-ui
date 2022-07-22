import React from 'react';
import { Survey, Question, QuestionSelect } from './SurveyForm';
import { AutoSelect } from '../simple';
import { Button, Paper, TextField, FormControlLabel, Switch, FormControl, Grid } from '@mui/material';

type CommonQuestionProps = Pick<Question, 'text' | 'description' | 'required' | 'value'>;

const defaultQuestion = {
    text: '',
    description: '',
    value: 'string',
    required: true,
} as const;

const initSelectQuestion: (init?: Partial<CommonQuestionProps>) => Question = (init) => ({
    ...defaultQuestion,
    ...init,
    type: 'select',
    options: [],
});
const initTextboxQuestion: (init?: Partial<CommonQuestionProps>) => Question = (init) => ({
    ...defaultQuestion,
    ...init,
    type: 'textbox',
    value: init.value === 'string' || init.value === 'number' ? init.value : defaultQuestion.value,
});

function initSelectOptions(
    value: QuestionSelect['value'],
    oldOptions?: QuestionSelect['options'],
    labels?: QuestionLabels
): QuestionSelect['options'] {
    if (value === 'bool')
        return [
            {value: true, label: labels?.true ?? 'true'},
            {value: false, label: labels?.false ?? 'false'},
        ];
    if (oldOptions && oldOptions.length > 0) {
        if (value === 'string') return oldOptions.map(({label}, idx) => ({label, value: String(idx)}));
        if (value === 'number') return oldOptions.map(({label}, idx) => ({label, value: idx}));
    }
    return [];
}

export interface SurveyEditorProps {
    saveSurvey: (survey: Survey) => void;
    initSurvey?: Survey;
    addQuestionLabel?: string;
    saveSurveyLabel?: string;
    questionLabels?: Partial<QuestionLabels>;
}

const emptyObj = {};

export function SurveyEditor({
                                 saveSurvey,
                                 initSurvey = emptyObj,
                                 addQuestionLabel = 'Add question',
                                 saveSurveyLabel = 'Save survey',
                                 questionLabels = emptyObj,
                             }: SurveyEditorProps) {
    const [questions, setQuestions] = React.useState<Question[]>(Object.values(initSurvey));

    return (
        <div>
            {questions.map((question, idx) => {
                return (
                    <>
                        <QuestionEditor
                            key={idx}
                            question={question}
                            questionIndex={idx}
                            changeQuestion={(q) =>
                                setQuestions((prev) => prev.slice(0, idx).concat(q, prev.slice(idx + 1)))
                            }
                            deleteQuestion={() => setQuestions((prev) => prev.slice(0, idx).concat(prev.slice(idx + 1)))}
                            questionLabels={questionLabels}
                        />
                    </>
                );
            })}
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Button variant="outlined" onClick={() => setQuestions((prev) => prev.concat(initSelectQuestion()))}>
                    {addQuestionLabel}
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                        saveSurvey(questions.reduce<Survey>((state, q, idx) => ({...state, [idx]: q}), {}))
                    }
                >
                    {saveSurveyLabel}
                </Button>
            </div>
        </div>
    );
}

interface QuestionLabels {
    delete: string;
    type: string;
    select: string;
    textbox: string;
    valueType: string;
    string: string;
    number: string;
    bool: string;
    true: string;
    false: string;
    text: string;
    date: string;
    description: string;
    required: string;
    options: string;
    addOption: string;
    deleteOption: string;
    optValue: string;
    optLabel: string;
    questionTranslate: string;
}

const defaultQuestionLabels: QuestionLabels = {
    delete: 'Delete question',
    type: 'Format',
    select: 'select',
    textbox: 'textbox',
    valueType: 'Type',
    string: 'text',
    number: 'number',
    bool: 'true/false',
    true: 'true',
    false: 'false',
    text: 'Text',
    date: 'Date',
    description: 'Description',
    required: 'Required',
    options: 'Options',
    addOption: 'Add option',
    deleteOption: 'Delete option',
    optValue: 'Value',
    optLabel: 'Label',
    questionTranslate: 'Question',
};

interface QuestionEditorProps {
    question: Question;
    questionIndex: number;
    changeQuestion: (question: Question) => void;
    deleteQuestion: () => void;
    questionLabels: Partial<QuestionLabels>;
}

function QuestionEditor({
                            question,
                            changeQuestion,
                            deleteQuestion,
                            questionLabels,
                            questionIndex,
                        }: QuestionEditorProps) {
    const labels: QuestionLabels = React.useMemo(() => ({...defaultQuestionLabels, ...questionLabels}), [
        questionLabels,
    ]);
    return (
        <Paper style={{padding: 20, marginBottom: 20}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <h2>
                    {labels.questionTranslate} {questionIndex + 1}
                </h2>
                <Button color="secondary" style={{alignSelf: 'center'}} onClick={deleteQuestion}>
                    {labels.delete}
                </Button>
            </div>
            <FormControl style={{float: 'right'}}>
                <FormControlLabel
                    control={
                        <Switch
                            color="primary"
                            checked={question.required}
                            onChange={(_, checked) => changeQuestion({...question, required: checked})}
                        />
                    }
                    label={labels.required}
                    labelPlacement="start"
                />
            </FormControl>
            <Grid container>
                <Grid item xs={12} md={10} lg={6}>
                    <TextField
                        label={labels.text}
                        value={question.text}
                        onChange={(e) => changeQuestion({...question, text: e.target.value})}
                        fullWidth
                        style={{marginTop: 15}}
                        variant="outlined"
                    />
                    <AutoSelect
                        title={labels.type}
                        options={[
                            {id: 'select', label: labels.select},
                            {id: 'textbox', label: labels.textbox},
                        ]}
                        value={question.type}
                        onChange={(id) =>
                            changeQuestion(
                                id === 'select'
                                    ? initSelectQuestion({...question})
                                    : initTextboxQuestion({
                                        text: question.text,
                                        description: question.description,
                                        required: question.required,
                                        value: question.value,
                                    })
                            )
                        }
                        autocompleteProps={{disableClearable: true, fullWidth: false, style: {marginTop: 15}}}
                    />
                    <TextField
                        label={labels.description}
                        value={question.description}
                        onChange={(e) => changeQuestion({...question, description: e.target.value})}
                        style={{marginTop: 15}}
                        fullWidth
                        variant="outlined"
                    />

                    {question.type === 'select' ? (
                        <AutoSelect
                            title={labels.valueType}
                            options={[
                                {id: 'string', label: labels.string},
                                {id: 'number', label: labels.number},
                                {id: 'bool', label: labels.bool},
                            ]}
                            value={question.value}
                            onChange={(id) =>
                                changeQuestion({
                                    ...question,
                                    value: id,
                                    options: initSelectOptions(id, question.options, labels) as any,
                                })
                            }
                            autocompleteProps={{disableClearable: true, fullWidth: false, style: {marginTop: 15}}}
                        />
                    ) : (
                        <AutoSelect
                            title={labels.valueType}
                            options={[
                                {id: 'string', label: labels.string},
                                {id: 'number', label: labels.number},
                                {id: 'date', label: labels.date},
                            ]}
                            value={question.value}
                            onChange={(id) => changeQuestion({...question, value: id})}
                            autocompleteProps={{disableClearable: true, style:{marginTop: 15}}}
                        />
                    )}
                    {question.type === 'select' && (
                        <div style={{marginTop: '1rem'}}>
                            <p>{labels.options}</p>
                            {question.value === 'bool' ? (
                                question.options.map((opt, idx) => (
                                    <FormControl key={idx} fullWidth>
                                        {opt.value ? labels.true : labels.false}:
                                        <TextField
                                            fullWidth={false}
                                            label={labels.optLabel}
                                            style={idx === 0 ? {marginBottom: 10} : null}
                                            value={opt.label}
                                            onChange={(e) =>
                                                changeQuestion({
                                                    ...question,
                                                    options: question.options.slice(0, idx).concat(
                                                        {
                                                            value: opt.value,
                                                            label: e.target.value,
                                                        },
                                                        question.options.slice(idx + 1)
                                                    ),
                                                })
                                            }
                                        />
                                    </FormControl>
                                ))
                            ) : (
                                <div>
                                    <ul>
                                        {question.options.map((opt, idx) => (
                                            <li key={idx} style={{listStyleType: 'none'}}>
                                                <FormControl fullWidth>
                                                    <TextField
                                                        label={labels.optValue}
                                                        value={opt.value}
                                                        type={question.value === 'number' ? 'number' : undefined}
                                                        onChange={(e) =>
                                                            changeQuestion({
                                                                ...question,
                                                                options: (question.value === 'string'
                                                                    ? question.options
                                                                        .slice(0, idx)
                                                                        .concat(
                                                                            {value: e.target.value, label: opt.label},
                                                                            question.options.slice(idx + 1)
                                                                        )
                                                                    : question.options.slice(0, idx).concat(
                                                                        {
                                                                            value: Number(e.target.value),
                                                                            label: opt.label,
                                                                        },
                                                                        question.options.slice(idx + 1)
                                                                    )) as any,
                                                            })
                                                        }
                                                    />
                                                    <TextField
                                                        label={labels.optLabel}
                                                        value={opt.label}
                                                        onChange={(e) =>
                                                            changeQuestion({
                                                                ...question,
                                                                options: (question.value === 'string'
                                                                    ? question.options
                                                                        .slice(0, idx)
                                                                        .concat(
                                                                            {value: opt.value, label: e.target.value},
                                                                            question.options.slice(idx + 1)
                                                                        )
                                                                    : question.options
                                                                        .slice(0, idx)
                                                                        .concat(
                                                                            {value: opt.value, label: e.target.value},
                                                                            question.options.slice(idx + 1)
                                                                        )) as any,
                                                            })
                                                        }
                                                    />
                                                    <Button
                                                        onClick={() =>
                                                            changeQuestion({
                                                                ...question,
                                                                options: (question.value === 'string'
                                                                    ? question.options.slice(0, idx).concat(question.options.slice(idx + 1))
                                                                    : question.options
                                                                        .slice(0, idx)
                                                                        .concat(question.options.slice(idx + 1))) as any,
                                                            })
                                                        }
                                                    >
                                                        {labels.deleteOption}
                                                    </Button>
                                                </FormControl>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        variant="outlined"
                                        onClick={() =>
                                            changeQuestion({
                                                ...question,
                                                options: (question.value === 'string'
                                                    ? question.options.concat({
                                                        value: String(question.options.length),
                                                        label: '',
                                                    })
                                                    : question.options.concat({
                                                        value: question.options.length,
                                                        label: '',
                                                    })) as any,
                                            })
                                        }
                                    >
                                        {labels.addOption}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
}
