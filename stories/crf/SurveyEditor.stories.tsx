import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SurveyEditorForm, SurveyEditorProps } from '../../src/components/crf/Editor';
import { DBSchema } from '../../src/survey';
import { crf } from './crf';
// import crfJson from './crf.json'

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'crf/Editor',
  component: SurveyEditorForm,
  argTypes: {},
} as Meta;

const Template: Story<SurveyEditorProps> = (args) => <SurveyEditorForm {...args} initSurvey={crf as DBSchema}/>;

export const Primary: Story<SurveyEditorProps> = Template.bind({});

Primary.args = {
  saveSurvey: (survey) => console.log(survey),
};
