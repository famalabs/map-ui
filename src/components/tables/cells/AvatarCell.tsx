import React from 'react';
import Avatar, { AvatarProps } from '@mui/material/Avatar';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

export const AvatarCell = (
  avatarOnly: boolean = false,
  avatarProps?: AvatarProps,
  clickAction?: (value) => void,
) => ({ cellValue }: { cellValue: string }) => {

  const onAvatarClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    clickAction(cellValue);
  }

  return (
    <Grid2
      container
      justifyContent='center'
      alignItems='center'
    >
      <Grid2
        container
        xs={2}
        justifyContent='flex-start'
        alignItems='center'
      >
        <Avatar
          component={'div'}
          style={{ marginRight: 10 }}
          onClick={clickAction && onAvatarClick}
          {...avatarProps}
        >
          {avatarProps && avatarProps.children}
        </Avatar>
      </Grid2>

      <Grid2
        container
        xs={10}
        justifyContent='flex-start'
        alignItems='center'
        px={1}
      >
        {!avatarOnly ? cellValue : null}
      </Grid2>
    </Grid2>
  );
};
