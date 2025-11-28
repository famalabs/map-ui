import Container from '@mui/material/Container';
import { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { SelectField, SelectFieldProps } from '../../src/components/forms/SelectField';
import MenuItem from '@mui/material/MenuItem';
import { AiEditingProvider, useAiEditing } from '../../src/components/forms/AiEditingContext';

const meta: Meta<typeof SelectField> = {
  title: 'Forms/SelectField',
  component: SelectField,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
  },
};

type Story = StoryObj<SelectFieldProps<Record<string, any>>>;
export default meta;

const RenderSelectField = (
  args: Omit<SelectFieldProps<Record<string, any>>, 'name' | 'control'>,
) => {
  const { control, setValue } = useForm<Record<string, any>>({
    defaultValues: {
      inputField: args.defaultValue || '',
      inputFieldTwo: 'TEST',
    },
  });

  return (
    <AiEditingProvider>
      <InnerRender control={control} setValue={setValue} args={args} />
    </AiEditingProvider>
  );
};

const InnerRender = ({
  control,
  setValue,
  args,
}: {
  control: any;
  setValue: (name: string, value: any) => void;
  args: Omit<SelectFieldProps<Record<string, any>>, 'name' | 'control'>;
}) => {
  const { aiEditingField, setAiEditingField, markAiDirty } = useAiEditing();

  const handleToggleAiEdit = () => {
    if (aiEditingField === 'inputField') {
      console.log('Clearing AI Edit field');
      setAiEditingField(null);
      markAiDirty('inputField'); // mark as dirty when done editing
    } else {
      console.log('Setting AI Edit field to inputField');
      setValue('inputField', 'option2');
      setAiEditingField('inputField');
    }
  };

  return (
    <Container maxWidth="md" sx={{ verticalAlign: 'middle' }}>
      <SelectField control={control} name="inputField" size="small" {...args}>
        <MenuItem value="">None</MenuItem>
        <MenuItem value="option1">Option 1</MenuItem>
        <MenuItem value="option2">Option 2</MenuItem>
        <MenuItem value="option3">Option 3</MenuItem>
      </SelectField>

      <button onClick={handleToggleAiEdit} style={{ marginTop: '16px' }}>
        {aiEditingField === 'inputField' ? 'Stop AI Edit' : 'Start AI Edit'}
      </button>
      <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
        AI Editing Field: {aiEditingField ?? 'none'}
      </div>
    </Container>
  );
};

export const SelectFieldTemplate: Story = {
  args: {
    label: 'Title',
    legend: false,
  },

  render: (args) => <RenderSelectField {...args} />,
};
