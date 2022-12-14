import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SurveyForm, SurveyFormProps } from '../../dist/esm/types/components/crf/Compiler';
import { Survey } from '../../dist/esm/types/core/schema';
import surveyFormExmple from './asdf.json'

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'crfcopy/Form',
  component: SurveyForm,
  argTypes: {},
} as Meta;

const Template: Story = (args) => <SurveyFormExample {...args} />;

export const Primary: Story = Template.bind({});

const SurveyFormExample: React.VFC = (args) => {
  return (
    <SurveyForm
      {...args}
      survey={new Survey(surveyFormExmple)}
    />
  );
};
