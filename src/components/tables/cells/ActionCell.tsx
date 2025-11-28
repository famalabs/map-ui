import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
interface ExtButtonProps extends Omit<ButtonProps, 'onClick'> {
  label: string;
}
interface ExtIconButtonProps extends Omit<IconButtonProps, 'onClick'> {
  icon: React.ReactNode;
}

export const ActionCell = (
  clickAction: (value: unknown) => void,
  buttonProps: ExtButtonProps | ExtIconButtonProps,
) => {
  const Renderer = ({ cellValue }: { cellValue: string }): React.ReactNode => {
    const onButtonClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      e.stopPropagation();
      clickAction(cellValue);
    };

    return 'icon' in buttonProps ? (
      <IconButton onClick={onButtonClick} {...buttonProps}>
        {buttonProps?.icon}
      </IconButton>
    ) : (
      <Button onClick={onButtonClick} {...buttonProps}>
        {buttonProps?.label}
      </Button>
    );
  };

  Renderer.displayName = 'ActionCell';

  return Renderer;
};
