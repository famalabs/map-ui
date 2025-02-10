import React from "react";
import Grid from "@mui/material/Grid2";
import Chip from "@mui/material/Chip";

export interface SelectCellOption {
  id: string | number | boolean;
  type: 'warning' | 'success' | 'error' | 'default';
  label: string;
}

export const SelectCell = (selectOptions: SelectCellOption[]) =>
  ({ cellValue }: { cellValue: string }) => {

    if (
      cellValue === undefined 
      || cellValue === null 
      || cellValue === ''
    ) {
      <Grid container>
        {''}
      </Grid>
    }

    const chipColorMap = {
      warning: '#FFA500',
      success: '#40916C',
      error: '#ff0000',
      default: '#808080',
    };
    
    const cellData = selectOptions.find((option) => option.id === cellValue);
    const customColor = cellData && cellData.type ? chipColorMap[cellData.type] : chipColorMap.default;

    if (!cellData) return null;

    return (
      <Grid container>
        <Chip
          size="small"
          label={cellData ? cellData.label : ''}
          style={{
            backgroundColor: `${customColor}4D`,
            color: customColor,
          }}
        />
      </Grid>
    );
  };
