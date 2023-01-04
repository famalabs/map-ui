import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SurveyForm, SurveyFormProps } from '../../src/components/crf/Compiler/';
import {Survey} from '../../src/survey'
// import surveyFormExmple from './asdf.json'
import { crf } from './crf';

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'crf/Form',
  component: SurveyForm,
  argTypes: {},
} as Meta<SurveyFormProps>;

// const Template: Story<SurveyFormProps> = (args) => <SurveyFormExample {...args} />;

// export const Primary: Story = Template.bind({});

// const SurveyFormExample: React.VFC = (args) => {
//   return (
//     <SurveyForm
//       {...args}
//       initSurvey={surveyFormExmple}
//     />
//   );
// };


const Template: Story<SurveyFormProps> = (args) => <SurveyForm {...args} />;

export const Primary: Story<SurveyFormProps> = Template.bind({});
Primary.args = {
  initSurvey: crf,
  loading: false,
};
