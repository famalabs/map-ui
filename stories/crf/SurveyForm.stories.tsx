import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SurveyForm, SurveyFormProps } from '../../src/components/crf/Compiler/SurveyForm';
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
      survey={new Survey(surveyFormExmple)}
    />
  );
};
