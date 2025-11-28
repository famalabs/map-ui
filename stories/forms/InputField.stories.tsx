import Container from '@mui/material/Container';
import { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { AiEditingProvider, useAiEditing } from '../../src/components/forms/AiEditingContext';
import { InputField, InputFieldProps } from '../../src/components/forms/InputField';

const meta: Meta<typeof InputField> = {
  title: 'Forms/InputField',
  component: InputField,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
  },
};

type Story = StoryObj<InputFieldProps<Record<string, any>>>;
export default meta;

const RenderInputField = (args: Omit<InputFieldProps<Record<string, any>>, 'name' | 'control'>) => {
  const { control, setValue } = useForm<Record<string, any>>({
    values: {
      inputField: 'One',
      inputFieldTwo: 'TEST',
    },
  });

  return (
    <AiEditingProvider defaultEditSpeed={10}>
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
  args: Omit<InputFieldProps<Record<string, any>>, 'name' | 'control'>;
}) => {
  const { aiEditingField, setAiEditingField, markAiDirty } = useAiEditing();

  const handleToggleAiEdit = () => {
    if (aiEditingField === 'inputField') {
      console.log('Clearing AI Edit field');
      setAiEditingField(null);
      markAiDirty('inputField'); // mark as dirty when done editing
    } else {
      console.log('Setting AI Edit field to inputField');
      setValue('inputField', 'Automated AI generated content.');
      setAiEditingField('inputField');
    }
  };

  return (
    <Container maxWidth="md" sx={{ verticalAlign: 'middle' }}>
      <InputField control={control} name="inputField" {...args} />
      <InputField control={control} name="inputFieldTwo" {...args} />

      <button onClick={handleToggleAiEdit} style={{ marginTop: '16px' }}>
        {aiEditingField === 'inputField' ? 'Stop AI Edit' : 'Start AI Edit'}
      </button>
      <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
        AI Editing Field: {aiEditingField ?? 'none'}
      </div>
    </Container>
  );
};

export const InputFieldTemplate: Story = {
  args: {
    label: 'Title',
    legend: true,
  },

  render: (args) => <RenderInputField {...args} />,
};
