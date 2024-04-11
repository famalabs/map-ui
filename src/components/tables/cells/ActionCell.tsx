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
  clickAction: (value) => void,
  buttonProps: ExtButtonProps | ExtIconButtonProps
) => ({ cellValue }: { cellValue: string }) => {

  if (typeof cellValue === 'undefined' || cellValue === null) return null;

  const onButtonClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    clickAction(cellValue);
  };

  return (
    ('icon' in buttonProps) ? (
      <IconButton onClick={onButtonClick} {...buttonProps}>
        {buttonProps.icon}
      </IconButton>
    ) : (
      <Button onClick={onButtonClick} {...buttonProps}>
        {buttonProps.label}
      </Button>
    )
  );
};
