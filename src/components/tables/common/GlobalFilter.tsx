import React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { SearchIcon } from './Table';

interface IProps {
  globalFilter?: string;
  setGlobalFilter: (value: string) => void;
}

export function GlobalFilter({ globalFilter = '', setGlobalFilter }: IProps): JSX.Element {
  return (
    <TextField
      variant="outlined"
      size="small"
      style={{ width: 200, marginRight: 15 }}
      value={globalFilter}
      name={'search'}
      placeholder={'Cerca'}
      onChange={(e) => setGlobalFilter(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon style={{ marginRight: 10 }} />
          </InputAdornment>
        ),
        endAdornment: !!globalFilter ? (
          <InputAdornment position="end">
            <IconButton edge="end" size="small" onClick={() => setGlobalFilter('')}>
              <Clear />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
}
