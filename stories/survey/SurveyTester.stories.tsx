import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SurveyEditor, Survey, SurveyForm } from '@src/components/survey';
import { FormControl, FormControlLabel, Switch, Divider } from '@mui/material';

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'survey/Test',
} as Meta;

export const Primary: Story = () => {
  const [survey, setSurvey] = React.useState<Survey>({});
  const [onEdit, setOnEdit] = React.useState(true);

  return (
    <div>
      <FormControl fullWidth>
        <FormControlLabel
          control={<Switch color="primary" checked={onEdit} onChange={(_, checked) => setOnEdit(checked)} />}
          label={onEdit ? 'Editor' : 'Test'}
          labelPlacement="start"
        />
      </FormControl>
      <Divider />
      {onEdit ? (
        <SurveyEditor saveSurvey={(sur) => setSurvey(sur)} initSurvey={survey} />
      ) : (
        <SurveyForm questions={survey} onSubmit={(answers) => console.log(answers)} />
      )}
    </div>
  );
};
