import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import React from 'react';

export interface SelectCellOption {
  id: string | number | boolean;
  type: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  label: string;
}

export const SelectCell = (selectOptions: SelectCellOption[]) => {
  const Renderer = ({ cellValue }: { cellValue: string }): React.ReactNode => {
    if (cellValue === undefined || cellValue === null || cellValue === '') {
      return <Grid container>{''}</Grid>;
    }

    const cellColor = selectOptions.find((option) => option.id === cellValue)?.type;
    const cellData = selectOptions.find((option) => option.id === cellValue);
    if (!cellData) return null;

    return (
      <Grid container>
        <Chip
          size="small"
          label={cellData ? cellData.label : ''}
          color={cellColor}
          sx={{
            '& .MuiChip-label': {
              fontWeight: 'light',
              fontSize: '0.8rem',
            },
          }}
        />
      </Grid>
    );
  };

  Renderer.displayName = 'SelectCell';
  return Renderer;
};
