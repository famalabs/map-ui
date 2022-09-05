import React, { useState } from 'react';
import { ColumnInstance, IdType, TableInstance } from 'react-table';
import { Button, Popover, Grid, Select, MenuItem, IconButton, Theme, Box } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { AutoSelect, AutoSelectOption } from '../../simple';
import { BooleanFilter } from '../filters';
import { FilterIcon } from './Table';
import { styled } from '@mui/material/styles';

const Span = styled('span')``;
const Div = styled('div')``;

export interface CustomFilter<T extends Record<string, any>> {
  column: IdType<T>;
  cond: string;
  value: any;
  nullable: boolean;
}

interface IProps<T extends Record<string, any>> {
  allColumns: ColumnInstance<T>[];
  filters: any['state']['filters']; //CustomFilter<T>[];
  setFilter: any['setFilter'];
  setAllFilters: any['setAllFilters'];
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  defaultColumn: string | undefined;
  setDefaultColumn: (id: string | undefined) => void;
}

export function TableFilter<T extends Record<string, any>>({
                                                             allColumns,
                                                             setFilter,
                                                             filters,
                                                             setAllFilters,
                                                             panelOpen,
                                                             setPanelOpen,
                                                             defaultColumn,
                                                             setDefaultColumn
                                                           }: IProps<T>): JSX.Element {
  const buttonRef = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  React.useEffect(() => setAnchorEl(buttonRef.current), [buttonRef]);

  const filtrableColumns = React.useMemo(() => allColumns.filter((col: any) => col.canFilter), [allColumns]);
  const columnById = React.useCallback((id: string) => filtrableColumns.find((col) => col.id === id), [
    filtrableColumns
  ]);

  const newDfilter = React.useCallback(
    (df: Partial<CustomFilter<T>> = {}): CustomFilter<T> => {
      if (df.column) {
        const defaults: Partial<CustomFilter<T>> = { ...df, ...columnById(df.column)['filterModel'].defaults };
        return {
          column: df.column,
          cond: (df.cond || defaults.cond) ?? '',
          value: df.value ?? defaults.value ?? null,
          nullable: df.nullable ?? defaults.nullable ?? true
        };
      } else return { column: '', cond: '', value: null, nullable: true };
    },
    [columnById]
  );

  const [dfilters, setDfilters] = React.useState<CustomFilter<T>[]>([newDfilter()]);

  React.useEffect(() => {
    const fdict = dfilters.reduce<{ [id: string]: Pick<CustomFilter<T>, 'cond' | 'value'>[] }>((dict, df) => {
      const key = df.column;
      if (!key || df.nullable) return dict;
      if (dict[key]) dict[key].push({ cond: df.cond, value: df.value });
      else dict[key] = [{ cond: df.cond, value: df.value }];
      return dict;
    }, {});
    setAllFilters(Object.entries(fdict).map(([id, value]) => ({ id, value })));
  }, [setAllFilters, dfilters]);

  const addDfilter = React.useCallback(() => {
    setDfilters((olds) => olds.concat(newDfilter({ column: defaultColumn })));
  }, [defaultColumn]);
  const editDfilter = React.useCallback((idx: number, obj: Partial<CustomFilter<T>>) => {
    setDfilters((olds) => {
      if (obj.column) olds[idx] = newDfilter(obj);
      else olds[idx] = { ...olds[idx], ...obj };
      return olds.slice();
    });
  }, []);
  const removeDfilter = React.useCallback((idx = -1) => {
    if (idx < 0)
      setDfilters((olds) => {
        olds.splice(0, olds.length, newDfilter());
        return olds.slice();
      });
    else
      setDfilters((olds) => {
        olds.splice(idx, 1);
        if (olds.length === 0) olds.push(newDfilter());
        return olds.slice();
      });
  }, []);

  const emptyDfilter = React.useMemo(() => dfilters.findIndex((df) => !df.column), [dfilters]);

  React.useEffect(() => {
    if (defaultColumn) {
      if (emptyDfilter < 0) addDfilter();
      else editDfilter(emptyDfilter, { column: defaultColumn });
      setDefaultColumn(undefined);
    }
  }, [addDfilter, editDfilter, emptyDfilter, defaultColumn, setDefaultColumn]);

  return (
    <>
      <Button
        style={{ marginRight: 15 }}
        ref={buttonRef}
        onClick={() => setPanelOpen(true)}
        disableElevation
        variant={filters.length ? 'contained' : 'text'}
        color={filters.length ? 'secondary' : 'inherit'}
      >
        <FilterIcon style={{ marginRight: 10 }} />
        Filtro {filters.length ? '(' + filters.length + ')' : ''}
      </Button>
      <Popover
        open={panelOpen}
        anchorEl={anchorEl}
        onClose={() => setPanelOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        elevation={6}
      >
        <Box sx={{ height: 300,
      padding: '5px 20px',
      width: 700}}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2 style={{ display: 'flex', alignItems: 'center' }}>
              Scegli i filtri{' '}
              {filters.length ? (
                <Span sx={{color: (theme:Theme) => theme.palette.secondary.main,
                  backgroundColor: (theme:Theme) => theme.palette.secondary.main + '33',
                  borderRadius: 20,
                  padding: '1px 8px',
                  fontSize: 13,
                  marginLeft: 10}}>
                  {filters.length} attiv{filters.length > 1 ? 'i' : 'o'}
                </Span>
              ) : (
                ''
              )}
            </h2>
            <Button
              color={'secondary'}
              style={{ alignSelf: 'center' }}
              onClick={() => removeDfilter()}
              disabled={dfilters.length === 1 && emptyDfilter >= 0}
            >
              Rimuovi tutti
            </Button>
          </div>

          {dfilters.map((dfilter, idx, dfilters) => {
            let conditions: AutoSelectOption[] = [];
            let ValueFilter: React.VFC<any> = ({ label }) => (
              <AutoSelect title={label} options={[]} autocompleteProps={{ size: 'small' }} />
            );
            if (dfilter.column) {
              const col: any = columnById(dfilter.column);
              conditions = col.filterModel.conditionsMap;
              ValueFilter = col.filterModel.DisplayFilter;
            }
            return (
              <Div sx={{ display: 'flex', marginBottom: 2}} key={idx}>
                {/* <Div style={{ width: '40px', flex: 'none', textAlign: 'center' }} sx={{ justifySelf: 'stretch', alignSelf: 'center', marginRight: 4}}>
                  {idx === dfilters.length-1 ? 'Nuovo':'Filtro '+(idx+1) }
                </Div> */}
                <Box style={{ width: '80px', flex:1 }} sx={{ justifySelf: 'stretch', alignSelf: 'center', marginRight: 3}}>
                  <AutoSelect
                    title="Colonna"
                    autocompleteProps={{ disableClearable: true, size: 'small' }}
                    options={filtrableColumns.map((col: any) => ({
                      id: col.id,
                      label: col.name || col.id
                    }))}
                    value={dfilter.column}
                    onChange={(id) => editDfilter(idx, { column: id })}
                  />
                </Box>
                <Box style={{ width: '80px', flex:1 }} sx={{ justifySelf: 'stretch', alignSelf: 'center', marginRight: 3}}>
                  <AutoSelect
                    title="Condizione"
                    autocompleteProps={{ disableClearable: true, size: 'small' }}
                    options={conditions}
                    value={dfilter.cond}
                    onChange={(id) => editDfilter(idx, { cond: id })}
                  />
                </Box>
                <Box style={{ width: '140px', flex:1 }} sx={{ justifySelf: 'stretch', alignSelf: 'center', marginRight: 3}}>
                  <ValueFilter
                    value={dfilter.value}
                    condition={dfilter.cond}
                    onChange={(value) => editDfilter(idx, { value: value })}
                    updateFilters={() => null}
                    autoDelete={(nullable) => editDfilter(idx, { nullable: nullable })}
                    label="Valore"
                  />
                </Box>
                <Box style={{ width: '24px' }} sx={{ justifySelf: 'stretch',alignSelf: 'center', marginRight: 2}}>
                  <IconButton size="small" onClick={() => removeDfilter(idx)}>
                    <CloseOutlined />
                  </IconButton>
                </Box>
              </Div>
            );
          })}

          <Button onClick={() => addDfilter()} disabled={emptyDfilter >= 0} color={'primary'}>
            Aggiungi un filtro
          </Button>
        </Box>
      </Popover>
    </>
  );
}
