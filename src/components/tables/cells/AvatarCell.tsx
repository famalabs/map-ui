import React from 'react';
import { ColumnInterfaceBasedOnValue } from 'react-table';
import { Avatar, AvatarProps, Button } from '@mui/material';

export const AvatarCell: <T extends Record<string, any>>(
  avatarSrc?: (obj: T) => string,
  avatarProps?: Omit<AvatarProps, 'onClick' | 'src'>,
  callback?: (obj: T) => void
) => Extract<ColumnInterfaceBasedOnValue<T, string>['Cell'], React.FC> = (
  avatarSrc,
  avatarProps,
  callback
) => ({ row, value }) => {
  if (typeof value === 'undefined') return null;
  const onClick: React.MouseEventHandler<HTMLButtonElement> | undefined = callback
    ? (e) => {
        e.stopPropagation();
        callback(row.original);
      }
    : undefined;

  return (
    <Button onClick={onClick} style={{ textTransform: 'none', color: 'inherit' }} disabled={!onClick}>
      <Avatar style={{ marginRight: 10 }} {...avatarProps} src={avatarSrc ? avatarSrc(row.original) : null}>
        {avatarSrc
          ? null
          : value
              .split(' ')
              .reduce((state, word, idx) => (idx > 1 || !word ? state : state + word[0].toUpperCase()), '')}
      </Avatar>
      {value}
    </Button>
  );
};
