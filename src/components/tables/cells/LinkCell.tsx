import React from 'react';
import Link, { LinkProps } from '@mui/material/Link';

export const LinkCell =
  (
    clickAction: (value: unknown) => void,
    label: (value: string) => string,
    linkProps?: Omit<LinkProps, 'onClick' | 'href' | 'ref' | 'type'>,
  ) =>
  ({ cellValue }: { cellValue: string }): React.ReactNode => {
    const onLinkClick: React.MouseEventHandler<HTMLSpanElement> = (e) => {
      e.stopPropagation();
      clickAction(cellValue);
    };

    return (
      <Link color="secondary" onClick={onLinkClick} {...linkProps}>
        {cellValue ? label(cellValue) : ''}
      </Link>
    );
  };
