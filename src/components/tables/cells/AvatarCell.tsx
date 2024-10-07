import React from 'react';
import Avatar, { AvatarProps } from '@mui/material/Avatar';
import Grid from '@mui/material/Grid2';

export const AvatarCell = (
  avatarOnly: boolean = false,
  avatarProps?: AvatarProps,
  clickAction?: (value: unknown) => void,
) => ({ cellValue }: { cellValue: string }) => {

  const onAvatarClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    clickAction?.(cellValue);
  }

  return (
    <Grid
      container
      justifyContent='center'
      alignItems='center'
    >
      <Grid
        container
        size={2}
        justifyContent='flex-start'
        alignItems='center'
      >
        <Avatar
          component={'div'}
          onClick={clickAction && onAvatarClick}
          sx={{ marginRight: 10 }}
          {...avatarProps}
        >
          {avatarProps && avatarProps.children}
        </Avatar>
      </Grid>

      <Grid
        container
        size={10}
        justifyContent='flex-start'
        alignItems='center'
        px={1}
      >
        {!avatarOnly ? cellValue : null}
      </Grid>

    </Grid>
  );
};
