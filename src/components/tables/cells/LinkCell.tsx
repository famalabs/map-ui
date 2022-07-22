import React from 'react';
import { ColumnInterfaceBasedOnValue } from 'react-table';
import { Link, LinkProps } from '@mui/material';

export const LinkCell = (callback: (obj) => void,
                         label: (obj) => string,
                         linkProps?: Omit<LinkProps, 'onClick' | 'href' | 'ref' | 'type'>) => ({
  row,
}) => {
  const onClick: React.MouseEventHandler<HTMLSpanElement> = (e) => {
    e.stopPropagation();
    callback(row.original);
  };

  return (
    <Link component="button" color="secondary" onClick={onClick} {...linkProps}>
      {label(row.original)}
    </Link>
  );
};
