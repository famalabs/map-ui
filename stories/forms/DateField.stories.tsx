import Container from '@mui/material/Container';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { AiEditingProvider, useAiEditing } from '../../src/components/forms/AiEditingContext';
import { DateField, DateFieldProps } from '../../src/components/forms/DateField';

const meta: Meta<typeof DateField> = {
  title: 'Forms/DateField',
  component: DateField,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
  },
};

type Story = StoryObj<DateFieldProps<Record<string, any>>>;
export default meta;

const RenderDateField = (args: Omit<DateFieldProps<Record<string, any>>, 'name' | 'control'>) => {
  const { control, setValue, watch } = useForm<Record<string, any>>({
    defaultValues: {
      inputField: '2024-12-15T10:30',
    },
  });
  React.useEffect(() => {
    setTimeout(() => {
      console.log('Setting inputField to 2023-12-25T10:30');
      setValue('inputField', '2023-12-25T10:30');
    }, 6000);
  }, [setValue]);

  console.log('Current value:', watch('inputField'));

  return (
    <AiEditingProvider>
      <InnerRender control={control} args={args} />
    </AiEditingProvider>
  );
};

const InnerRender = ({
  control,
  args,
}: {
  control: any;
  args: Omit<DateFieldProps<Record<string, any>>, 'name' | 'control'>;
}) => {
  const { aiEditingField, setAiEditingField, markAiDirty } = useAiEditing();

  const handleToggleAiEdit = () => {
    if (aiEditingField === 'inputField') {
      console.log('Clearing AI Edit field');
      setAiEditingField(null);
      markAiDirty('inputField'); // mark as dirty when done editing
    } else {
      console.log('Setting AI Edit field to inputField');
      setAiEditingField('inputField');
    }
  };

  const [currentField, setCurrentField] = React.useState<string>('inputField');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
      <Container maxWidth="md" sx={{ verticalAlign: 'middle' }}>
        {currentField === 'inputField' && (
          <DateField
            control={control}
            name="inputField"
            {...args}
            slotProps={{ textField: { size: 'small' } }}
          />
        )}
        {currentField === 'inputField_2' && (
          <DateField
            control={control}
            name="inputField_2"
            {...args}
            slotProps={{ textField: { size: 'small' } }}
          />
        )}

        <div style={{ marginTop: '16px' }}>
          <button onClick={() => setCurrentField('inputField')} style={{ marginRight: '8px' }}>
            Show Input Field 1
          </button>
          <button onClick={() => setCurrentField('inputField_2')}>Show Input Field 2</button>
        </div>

        <button onClick={handleToggleAiEdit} style={{ marginTop: '16px' }}>
          {aiEditingField === 'inputField' ? 'Stop AI Edit' : 'Start AI Edit'}
        </button>
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          AI Editing Field: {aiEditingField ?? 'none'}
        </div>
      </Container>
    </LocalizationProvider>
  );
};

export const DateFieldTemplate: Story = {
  args: {
    label: 'Title',
    legend: true,
    closeOnSelect: true,
  },

  render: (args) => <RenderDateField {...args} />,
};
