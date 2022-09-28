import React from 'react';
import { useFormState, InputString, InputNumber, InputRadio, Option, Form } from '../forms';
import { ButtonLoading } from '../simple';
import { Typography } from '@mui/material';

interface QuestionGeneral {
  text: string;
  description?: string;
  required?: boolean;
  requiredMessage?: string;
}
export interface QuestionTextbox extends QuestionGeneral {
  type: 'textbox';
  value: 'string' | 'number';
}
interface QuestionSelectGeneric extends QuestionGeneral {
  type: 'select';
}
interface QuestionSelectString extends QuestionSelectGeneric {
  value: 'string';
  options: Option<string>[];
}
interface QuestionSelectNumber extends QuestionSelectGeneric {
  value: 'number';
  options: Option<number>[];
}
interface QuestionSelectBool extends QuestionSelectGeneric {
  value: 'bool';
  options: Option<boolean>[];
}
export type QuestionSelect = QuestionSelectString | QuestionSelectNumber | QuestionSelectBool;

export type Question = QuestionTextbox | QuestionSelect;

export type Survey = {
  [id: string]: Question;
};

type SurveyAnswers<T extends Survey> = {
  [Prop in keyof T]: T[Prop] extends { value: 'string' }
    ? string
    : T[Prop] extends { value: 'number' }
    ? number
    : T[Prop] extends { value: 'bool' }
    ? boolean
    : never;
};

export interface SurveyFormProps<T extends Survey> {
  questions: T;
  onSubmit: (answers: SurveyAnswers<T>, allValid: boolean) => void;
  partialSave?: (answers: SurveyAnswers<T>) => void;
  initAnswers?: Partial<SurveyAnswers<T>>;
  submitLabel?: string;
  loading?: boolean;
  requiredMessageDefault?: string;
  requiredMessageSelect?: string;
  requiredMessageTextbox?: string;
}

export function SurveyForm<T extends Survey>({
  questions,
  initAnswers = {},
  onSubmit,
  partialSave,
  submitLabel = 'Send',
  loading,
  requiredMessageDefault = 'This question is required',
  requiredMessageSelect,
  requiredMessageTextbox,
}: SurveyFormProps<T>) {
  const [showAllErrors, setShowAllErrors] = React.useState(false);
  const questionsArray = React.useMemo(() => Object.entries(questions), []);
  const { Value, setValue, Valid } = useFormState(
    {
      type: 'group',
      value: questionsArray.reduce(
        (state, [idx, node]) => ({
          ...state,
          [idx]: { type: 'node', value: node.value, required: node.required } as Form,
        }),
        {}
      ),
    },
    initAnswers
  );

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowAllErrors(true);
    onSubmit(Value as any, Valid.allValid);
  };
  return (
    <form noValidate onSubmit={onSubmitForm}>
      {questionsArray.map(([idx, question]) => (
        <div key={idx}>
          <Typography>{question.text}</Typography>
          <Typography>{question.description}</Typography>
          {question.type === 'select' ? (
            <InputRadio
              nameid={idx}
              title={''}
              value={Value[idx]}
              options={question.options as any}
              setValue={setValue[idx]}
              required={question.required}
              emptyMessage={question.requiredMessage ?? requiredMessageSelect ?? requiredMessageDefault}
              showError={showAllErrors}
            />
          ) : question.type === 'textbox' ? (
            question.value === 'string' ? (
              <InputString
                nameid={idx}
                title={''}
                label={''}
                value={Value[idx]}
                setValue={setValue[idx]}
                required={question.required}
                emptyMessage={question.requiredMessage ?? requiredMessageTextbox ?? requiredMessageDefault}
                showError={showAllErrors}
              />
            ) : question.value === 'number' ? (
              <InputNumber
                nameid={idx}
                title={''}
                label={''}
                value={Value[idx]}
                setValue={setValue[idx]}
                required={question.required}
                emptyMessage={question.requiredMessage ?? requiredMessageTextbox ?? requiredMessageDefault}
                showError={showAllErrors}
              />
            ) : null
          ) : null}
        </div>
      ))}
      <ButtonLoading label={submitLabel} type="submit" variant="contained" loading={!!loading} />
    </form>
  );
}
