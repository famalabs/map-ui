import React from 'react';
import Link, { LinkProps } from '@mui/material/Link';

export const LinkCell = (
  clickAction: (value) => void,
  label: (value) => string,
  linkProps?: Omit<LinkProps, 'onClick' | 'href' | 'ref' | 'type'>
) => ({ cellValue } : { cellValue: string }) => {

  if (typeof cellValue === 'undefined' || cellValue === null) return null;
  
  const onLinkClick: React.MouseEventHandler<HTMLSpanElement> = (e) => {
    e.stopPropagation();
    clickAction(cellValue);
  };

  return (
    <Link color="secondary" onClick={onLinkClick} {...linkProps}>
      {label(cellValue)}
    </Link>
  );
};
