import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SurveyForm, SurveyFormProps } from '../../src/components/crf/SurveyForm';
import {Survey} from '../../src/core/schema'
import surveyFormExmple from './SurveyFormExample.json'

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'crf/Form',
  component: SurveyForm,
  argTypes: {},
} as Meta;

const Template: Story = (args) => <SurveyFormExample {...args} />;

export const Primary: Story = Template.bind({});

const SurveyFormExample: React.VFC = (args) => {
  return (
    <SurveyForm
      {...args}
      survey={new Survey(Survey.schemaFromJSON(JSON.stringify(surveyFormExmple)))}
    //   questions={{
    //     1: { type: 'textbox', text: 'Nome', value: 'string' },
    //     2: { type: 'textbox', text: 'Anni', value: 'number' },
    //     3: {
    //       type: 'select',
    //       text: 'Si no',
    //       value: 'bool',
    //       options: [
    //         { value: true, label: 'si' },
    //         { value: false, label: 'no' },
    //       ],
    //     },
    //     4: {
    //       type: 'select',
    //       text: 'Carne',
    //       value: 'string',
    //       options: [
    //         { value: 'bufalo', label: 'bufalo' },
    //         { value: 'manzo', label: 'manzo' },
    //         { value: 'maialo', label: 'maialo' },
    //       ],
    //     },
    //   }}
    //   initAnswers={{ 1: 'we', 3: false }}
    //   onSubmit={(answers, allValid) => console.log(answers)}
    />
  );
};
