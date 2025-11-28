import React from 'react';
import Avatar, { AvatarProps } from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';

export const AvatarCell = (
  avatarOnly: boolean = false,
  avatarProps?: AvatarProps,
  clickAction?: (value: unknown) => void,
) => {
  const Renderer = ({ cellValue }: { cellValue: string }): React.ReactNode => {
    const onAvatarClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
      e.stopPropagation();
      clickAction?.(cellValue);
    };

    return (
      <Grid
        container
        size={12}
        justifyContent="center"
        alignItems="center"
        flexWrap="nowrap"
        spacing={1}
      >
        <Grid container justifyContent="flex-start" alignItems="center" flexGrow={0}>
          <Avatar
            component={'div'}
            src={cellValue}
            onClick={clickAction ? onAvatarClick : undefined}
            {...avatarProps}
          >
            {avatarProps?.children}
          </Avatar>
        </Grid>

        <Grid container justifyContent="flex-start" alignItems="center" flexGrow={1} px={1}>
          {!avatarOnly ? cellValue : null}
        </Grid>
      </Grid>
    );
  };

  Renderer.displayName = 'AvatarCell';

  return Renderer;
};
