import Container from '@mui/material/Container';
import { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { AiEditingProvider, useAiEditing } from '../../src/components/forms/AiEditingContext';
import { RichTextField, RichTextFieldProps } from '../../src/components/forms/RichTextField';

const meta: Meta<typeof RichTextField> = {
  title: 'Forms/RichTextField',
  component: RichTextField,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
  },
};

type Story = StoryObj<RichTextFieldProps<Record<string, any>>>;
export default meta;

const RenderInputField = (
  args: Omit<RichTextFieldProps<Record<string, any>>, 'name' | 'control'>,
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
  args: Omit<RichTextFieldProps<Record<string, any>>, 'name' | 'control'>;
}) => {
  const { aiEditingField, setAiEditingField, markAiDirty } = useAiEditing();

  const handleToggleAiEdit = () => {
    if (aiEditingField === 'inputField') {
      console.log('Clearing AI Edit field');
      setAiEditingField(null);
      markAiDirty('inputField'); // mark as dirty when done editing
    } else {
      console.log('Setting AI Edit field to inputField');
      setValue('inputField', '<b>Automated AI generated content.</b>');
      setAiEditingField('inputField');
    }
  };

  return (
    <Container maxWidth="md" sx={{ verticalAlign: 'middle' }}>
      <RichTextField control={control} name="inputField" {...args} />

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
    title: 'Rich Text Editor',
    defaultValue: 'TEST',
  },

  render: (args) => <RenderInputField {...args} />,
};
