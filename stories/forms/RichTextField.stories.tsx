import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
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
  const { control, getValues, setValue } = useForm<Record<string, any>>({
    defaultValues: {
      inputField: args.defaultValue || '',
    },
  });

  const addRandomText = () => {
    const randomText = Math.random().toString(36).substring(2, 15);
    const currentValue = getValues('inputField') || '';
    // Insert random text inside a <p> tag
    let newValue;
    if (currentValue.includes('<p>')) {
      newValue = currentValue.replace(/<p>(.*?)<\/p>/, `<p>$1 ${randomText}</p>`);
    } else {
      newValue = `<p>${currentValue} ${randomText}</p>`;
    }
    setValue('inputField', newValue);
    console.log('New Rich Text Field Value:', newValue);
  };

  return (
    <Container maxWidth="md" sx={{ verticalAlign: 'middle' }}>
      <RichTextField control={control} name="inputField" {...args} />
      <Button variant="contained" onClick={addRandomText} sx={{ mt: 2 }}>
        Add Text
      </Button>
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
