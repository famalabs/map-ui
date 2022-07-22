import React from 'react';
import { ColumnInstance } from 'react-table';
import { ITablePaginatedProps, selectRowsColumnId } from '../utils';
import { Checkbox, FormControlLabel, Button, Menu, MenuItem } from '@mui/material';
import { HiddenIcon } from './Table';

interface IProps<T extends Record<string, any>> {
  allColumns: ColumnInstance<T>[];
  hideColumnAction?: ITablePaginatedProps<T>['hideColumnAction'];
}

export function HideColumns<T extends Record<string, any>>({
  allColumns,
  hideColumnAction,
}: IProps<T>): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (column: any) => (e: React.MouseEvent) => {
    e.preventDefault();
    column.toggleHidden();
    if (column.canSort) column.clearSortBy();
    if (hideColumnAction) hideColumnAction(column.id);
  };
  return (
    <>
      <Button aria-controls="fade-menu" aria-haspopup="true" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <HiddenIcon style={{ marginRight: 10 }} />
        Colonne
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {allColumns.map((column:any) => {
          return column.id === selectRowsColumnId ? null : (
            <MenuItem key={column.id} onClick={handleClick(column)}>
              <FormControlLabel
                key={column.id}
                label={column.name || column.id}
                control={<Checkbox checked={column.isVisible} />}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
