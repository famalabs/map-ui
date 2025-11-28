import Container from '@mui/material/Container';
import { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import {
  AutocompleteField,
  AutocompleteFieldProps,
} from '../../src/components/forms/AutocompleteField';
import { AiEditingProvider, useAiEditing } from '../../src/components/forms/AiEditingContext';

const meta: Meta<typeof AutocompleteField> = {
  title: 'Forms/AutocompleteField',
  component: AutocompleteField,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
  },
};

type Story = StoryObj<AutocompleteFieldProps<any, any, any>>;
export default meta;

const RenderSelectField = (
  args: Omit<AutocompleteFieldProps<any, any, any>, 'name' | 'control'>,
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
  args: Omit<AutocompleteFieldProps<any, any, any>, 'name' | 'control'>;
}) => {
  const { aiEditingField, setAiEditingField, markAiDirty } = useAiEditing();

  const handleToggleAiEdit = () => {
    if (aiEditingField === 'inputField') {
      console.log('Clearing AI Edit field');
      setAiEditingField(null);
      markAiDirty('inputField'); // mark as dirty when done editing
    } else {
      console.log('Setting AI Edit field to inputField');
      // setValue('inputField', 'option2');
      setAiEditingField('inputField');
    }
  };

  return (
    <Container maxWidth="md" sx={{ verticalAlign: 'middle' }}>
      <AutocompleteField
        fullWidth
        size="small"
        control={control}
        name="inputField"
        {...args}
        options={[
          {
            label: 'Option 1',
            value: 'option1',
          },
          {
            label: 'Option 2',
            value: 'option2',
          },
          {
            label: 'Option 3',
            value: 'option3',
          },
        ]}
        getOptionLabel={(option) => option.label}
        onChange={(_, value) => {
          setValue('inputField', value);
        }}
      />

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
    legend: true,
  },

  render: (args) => <RenderSelectField {...args} />,
};
