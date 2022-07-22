import React from 'react';
import { ColumnInterfaceBasedOnValue } from 'react-table';
import { Button, ButtonProps, IconButton, IconButtonProps } from '@mui/material';

interface ExtButtonProps extends Omit<ButtonProps, 'onClick'> {
  label: string;
}
interface ExtIconButtonProps extends Omit<IconButtonProps, 'onClick'> {
  icon: React.ReactNode;
}

export const ActionCell= ( callback: (obj) => void, buttonProps: ExtButtonProps | ExtIconButtonProps) => ({
  row,
}) => {
  const onClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    callback(row.original);
  };

  let CompButton: React.VFC = () => <></>;
  if ('icon' in buttonProps) {
    CompButton = () => (
      <IconButton onClick={onClick} {...buttonProps}>
        {buttonProps.icon}
      </IconButton>
    );
  } else {
    CompButton = () => (
      <Button onClick={onClick} {...buttonProps}>
        {buttonProps.label}
      </Button>
    );
  }

  return <CompButton />;
};
