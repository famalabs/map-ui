import React from 'react';
import { SurveyItemForm } from './SurveyItem'
import {Survey, SurveyItem} from '../../core/schema'
import { QuestionForm } from './Question';
import { useFormState } from '../forms';

export interface SurveyFormProps {
    survey: Survey;
}

export function SurveyForm({
    survey,
}: SurveyFormProps) {
    // const { Value, setValue, Valid } = useFormState(
    //     {
    //         type: 'group',
    //         value: questionsArray.reduce(
    //             (state, [idx, node]) => ({
    //             ...state,
    //             [idx]: { type: 'node', value: node.value, required: node.required } as Form,
    //             }),
    //             {}
    //         ),
    //     },
    //     initAnswers
    //     );

    return (
        <form>
            <SurveyItemForm item={survey.root}/>
        </form>
    );
}