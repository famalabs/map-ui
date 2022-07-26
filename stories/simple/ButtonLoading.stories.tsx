import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ButtonLoading, ButtonLoadingProps } from '../../src/components/simple';

// controls docs at https://storybook.js.org/docs/react/essentials/controls
export default {
  title: 'simple/ButtonLoading',
  component: ButtonLoading,
  argTypes: {
    size: { control: 'inline-radio' },
    onClick: { action: 'click' },
  },
} as Meta<ButtonLoadingProps>;

const Template: Story<ButtonLoadingProps> = (args) => <ButtonLoading {...args} />;

export const Primary: Story<ButtonLoadingProps> = Template.bind({});
Primary.args = {
  label: 'Button',
  loading: false,
};
