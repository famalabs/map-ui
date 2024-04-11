import React from 'react';
import Avatar, { AvatarProps } from '@mui/material/Avatar';
import { Stack } from '@mui/system';

export const AvatarCell = (
  avatarOnly: boolean = false,
  avatarProps: AvatarProps,
  clickAction?: (value) => void,
) => ({ cellValue }: { cellValue: string }) => {

  if (typeof cellValue === 'undefined' || cellValue === null) return null;

  const onAvatarClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    clickAction(cellValue);
  }

  return (
    <Stack 
      direction='row'
      justifyContent='flex-start'
      alignItems='center'
    >
      <Avatar
        component={'div'}
        style={{ marginRight: 10 }}
        onClick={clickAction && onAvatarClick}
        {...avatarProps}
      >
        {avatarProps.children}
      </Avatar>
      {!avatarOnly && cellValue}
    </Stack>
  );
};
