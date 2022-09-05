import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SurveyForm, SurveyFormProps } from '../../src/components/survey/SurveyForm';

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'survey/FormExample',
  component: SurveyForm,
  argTypes: {},
} as Meta;

const Template: Story = (args) => <SurveyFormExample {...args} />;

export const Primary: Story = Template.bind({});

const SurveyFormExample: React.VFC = (args) => {
  return (
    <SurveyForm
      {...args}
      questions={{
        1: { type: 'textbox', text: 'Nome', value: 'string' },
        2: { type: 'textbox', text: 'Anni', value: 'number' },
        3: {
          type: 'select',
          text: 'Si no',
          value: 'bool',
          options: [
            { value: true, label: 'si' },
            { value: false, label: 'no' },
          ],
        },
        4: {
          type: 'select',
          text: 'Carne',
          value: 'string',
          options: [
            { value: 'bufalo', label: 'bufalo' },
            { value: 'manzo', label: 'manzo' },
            { value: 'maialo', label: 'maialo' },
          ],
        },
      }}
      initAnswers={{ 1: 'we', 3: false }}
      onSubmit={(answers, allValid) => console.log(answers)}
    />
  );
};
