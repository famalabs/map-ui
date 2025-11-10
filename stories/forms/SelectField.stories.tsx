import Container from '@mui/material/Container';
import { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { SelectField, SelectFieldProps } from '../../src/components/forms/SelectField';
import MenuItem from '@mui/material/MenuItem';

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
  const { control } = useForm<Record<string, any>>({
    defaultValues: {
      inputField: args.defaultValue || '',
    },
  });

  return (
    <Container maxWidth="md" sx={{ verticalAlign: 'middle' }}>
      <SelectField control={control} name="inputField" {...args}>
        <MenuItem value="">None</MenuItem>
        <MenuItem value="option1">Option 1</MenuItem>
        <MenuItem value="option2">Option 2</MenuItem>
        <MenuItem value="option3">Option 3</MenuItem>
      </SelectField>
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
