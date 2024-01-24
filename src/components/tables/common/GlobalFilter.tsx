import React from 'react';
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import  Clear  from '@mui/icons-material/Clear';
import { SearchIcon } from './Table';

interface IProps {
  globalFilter?: string;
  setGlobalFilter: (value: string) => void;
  localeObj: string;
}

export function GlobalFilter({ globalFilter = '', setGlobalFilter, localeObj }: IProps): JSX.Element {
  return (
    <TextField
      variant="outlined"
      size="small"
      style={{ width: 200, marginRight: 15 }}
      value={globalFilter}
      name={'search'}
      placeholder={localeObj}
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
