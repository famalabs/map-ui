import Container from '@mui/material/Container';
import { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import {
  AutocompleteField,
  AutocompleteFieldProps,
} from '../../src/components/forms/AutocompleteField';

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
  const { control } = useForm<Record<string, any>>({
    defaultValues: {
      inputField: args.defaultValue || '',
    },
  });

  return (
    <Container maxWidth="md" sx={{ verticalAlign: 'middle' }}>
      <AutocompleteField fullWidth control={control} name="inputField" {...args} options={[]} />
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
