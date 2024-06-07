import React from "react";
import Grid2 from "@mui/material/Unstable_Grid2";
import Chip, { ChipOwnProps } from "@mui/material/Chip";

export interface SelectCellOption {
  id: string | number | boolean;
  type: ChipOwnProps['color'];
  label: string;
}

export const SelectCell = (selectOptions: SelectCellOption[]) =>
  ({ cellValue }) => {

    if (typeof cellValue === 'undefined' || cellValue === null) {
      <Grid2 container>
        {''}
      </Grid2>
    }

    const chipColorMap = {
      warning: '#FFA500',
      success: '#40916C',
      error: '#ff0000',
      default: '#808080',
    };
    
    const cellData = selectOptions.find((option) => option.id === cellValue);
    const customColor = cellData && cellData.type ? chipColorMap[cellData.type] : chipColorMap.default;

    return (
      <Grid2 container>
        <Chip
          size="small"
          label={cellData ? cellData.label : ''}
          style={{
            backgroundColor: `${customColor}4D`,
            color: customColor,
          }}
        />
      </Grid2>
    );
  };
