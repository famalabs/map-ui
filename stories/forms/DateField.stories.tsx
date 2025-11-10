import Container from '@mui/material/Container';
import { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { DateField, DateFieldProps } from '../../src/components/forms/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AiEditingProvider, useAiEditing } from '../../src/components/forms/AiEditingContext';

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
  const { control } = useForm<Record<string, any>>({
    defaultValues: {
      inputField: args.defaultValue || '',
    },
  });

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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
      <Container maxWidth="md" sx={{ verticalAlign: 'middle' }}>
        <DateField
          control={control}
          name="inputField"
          {...args}
          slotProps={{ textField: { size: 'small' } }}
        />
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
    defaultValue: '11/02/2020 13:45',
  },

  render: (args) => <RenderDateField {...args} />,
};
