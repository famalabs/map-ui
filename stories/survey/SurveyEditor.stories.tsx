import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SurveyEditor, SurveyEditorProps } from '@src/components/survey';

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'survey/Editor',
  component: SurveyEditor,
  argTypes: {},
} as Meta;

const Template: Story<SurveyEditorProps> = (args) => <SurveyEditor {...args} />;

export const Primary: Story<SurveyEditorProps> = Template.bind({});

Primary.args = {
  saveSurvey: (survey) => console.log(survey),
};
