import React from "react";
import { Column, ColumnInstance, IdType } from "react-table";

import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

import CloseOutlined from "@mui/icons-material/CloseOutlined";
import { AutoSelect, AutoSelectOption } from "../../simple";
import { BooleanFilter } from "../filters";
import { FilterIcon } from "./Table";
import { styled } from "@mui/material/styles";

const Span = styled("span")``;
const Div = styled("div")``;

export interface CustomFilter<T extends Record<string, any>> {
  column: IdType<T>;
  cond: string;
  value: any;
  nullable: boolean;
}

interface IProps<T extends Record<string, any>> {
  allColumns: ColumnInstance<T>[];
  filters: any["state"]["filters"]; //CustomFilter<T>[];
  setFilter: any["setFilter"];
  setAllFilters: any["setAllFilters"];
  gotoPage?: (page: number) => void;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  defaultColumn: string | undefined;
  setDefaultColumn: (id: string | undefined) => void;
  localeObj: Record<string, any>;
}

export function TableFilter<T extends Record<string, any>>({
  allColumns,
  setFilter,
  filters,
  setAllFilters,
  gotoPage,
  panelOpen,
  setPanelOpen,
  defaultColumn,
  setDefaultColumn,
  localeObj,
}: IProps<T>): JSX.Element {
  const buttonRef = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  React.useEffect(() => setAnchorEl(buttonRef.current), [buttonRef]);

  const filtrableColumns = React.useMemo(
    () => allColumns.filter((col: any) => col.canFilter),
    [allColumns]
  );
  const columnById = React.useCallback(
    (id: string) => filtrableColumns.find((col) => col.id === id),
    [filtrableColumns]
  );

  const newDynFilter = React.useCallback(
    (dynFilter: Partial<CustomFilter<T>> = {}): CustomFilter<T> => {
      if (dynFilter.column) {
        const defaults: Partial<CustomFilter<T>> = {
          ...dynFilter,
          ...columnById(dynFilter.column)["filterModel"].defaults,
        };
        return {
          column: dynFilter.column,
          cond: (dynFilter.cond || defaults.cond) ?? "",
          value: dynFilter.value ?? defaults.value ?? null,
          nullable: dynFilter.nullable ?? defaults.nullable ?? true,
        };
      } else return { column: "", cond: "", value: null, nullable: true };
    },
    [columnById]
  );

  const [activeFilters, setActiveFilters] = React.useState<CustomFilter<T>[]>([newDynFilter()]);

  React.useMemo(() => {

    const filteredDict = activeFilters.reduce<{ [id: string]: Pick<CustomFilter<T>, "cond" | "value">[] }>(
      (dict, df) => {
        const key = df.column;
        if (!key || df.nullable) return dict;
        if (dict[key]) dict[key].push({ cond: df.cond, value: df.value });
        else dict[key] = [{ cond: df.cond, value: df.value }];
        return dict;
      },
      {}
    );

    // this prevents table re-render at startup & at popup opening
    const filteredData = Object.entries(filteredDict).map(([id, value]) => ({ id, value }));
    console.log('FilteredData', filteredData, filters);
    panelOpen ? setAllFilters(filteredData) : null;

    //console.log(activeFilters);
  }, [setAllFilters, activeFilters]);

  // this adds a new filter
  const addDynFilter = React.useCallback(() => {
    setActiveFilters((olds) => olds.concat(newDynFilter({ column: defaultColumn })));
  }, [defaultColumn]);


  const editDynFilter = React.useCallback((idx: number, obj: Partial<CustomFilter<T>>) => {
    setActiveFilters((olds) => {
      if (obj.column) {
        olds[idx] = newDynFilter(obj);
        //console.log('adeed');
      } else olds[idx] = { ...olds[idx], ...obj };

      return olds.slice();
    });
  }, []);

  const removeDynFilter = React.useCallback((idx = -1) => {
    if (idx < 0) {
      gotoPage ? gotoPage(0) : null;
      setActiveFilters((olds) => {
        olds.splice(0, olds.length, newDynFilter());
        return olds.slice();
      });
    } else {
      gotoPage ? gotoPage(0) : null;
      setActiveFilters((olds) => {
        olds.splice(idx, 1);
        if (olds.length === 0) olds.push(newDynFilter());
        return olds.slice();
      });
    }
      
  }, []);

  const emptyDynFilter = React.useMemo(() => activeFilters.findIndex((df) => !df.column), [activeFilters]);

  React.useEffect(() => {
    if (defaultColumn) {
      if (emptyDynFilter < 0) addDynFilter();
      else editDynFilter(emptyDynFilter, { column: defaultColumn });
      setDefaultColumn(undefined);
    }
  }, [addDynFilter, editDynFilter, emptyDynFilter, defaultColumn, setDefaultColumn]);

  const valueDynFilter = (idx: number, value: any) => {
    editDynFilter(idx, { value: value });
    gotoPage ? gotoPage(0) : null;
  }

  return (
    <>
      <Button
        style={{ marginRight: 15 }}
        ref={buttonRef}
        onClick={() => setPanelOpen(true)}
        disableElevation
        variant={filters.length ? "contained" : "text"}
        color={filters.length ? "secondary" : "inherit"}
      >
        <FilterIcon style={{ marginRight: 10 }} />
        {localeObj['name']} {filters.length ? "(" + filters.length + ")" : ""}
      </Button>
      <Popover
        open={panelOpen}
        anchorEl={anchorEl}
        onClose={() => setPanelOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        elevation={6}
      >
        <Box
          sx={{
            height: 300,
            padding: "5px 20px",
            width: 700,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2 style={{ display: "flex", alignItems: "center" }}>
              {localeObj['title']}{' '}
              {filters.length ? (
                <Span
                  sx={{
                    color: (theme) => theme.palette.secondary.main,
                    backgroundColor: (theme) => theme.palette.secondary.main + "33",
                    borderRadius: 20,
                    padding: "1px 8px",
                    fontSize: 13,
                    marginLeft: 10,
                  }}
                >
                  {filters.length} {localeObj['active'] }
                </Span>
              ) : (
                ""
              )}
            </h2>
            <Button
              color={"secondary"}
              style={{ alignSelf: "center" }}
              onClick={() => removeDynFilter()}
              disabled={activeFilters.length === 1 && emptyDynFilter >= 0}
            >
              {localeObj['remove']}
            </Button>
          </div>

          {activeFilters.map((dfilter, idx, dfilters) => {
            let conditions: AutoSelectOption[] = [];
            let ValueFilter: React.FC<any> = ({ label }) => (
              <AutoSelect title={label} options={[]} autocompleteProps={{ size: "small" }} />
            );
            if (dfilter.column) {
              const col: any = columnById(dfilter.column);
              conditions = col.filterModel.conditionsMap;
              ValueFilter = col.filterModel.DisplayFilter;
            }
            return (
              <Div sx={{ display: "flex", marginBottom: 2 }} key={idx}>
                {/* <Div style={{ width: '40px', flex: 'none', textAlign: 'center' }} sx={{ justifySelf: 'stretch', alignSelf: 'center', marginRight: 4}}>
                  {idx === dfilters.length-1 ? 'Nuovo':'Filtro '+(idx+1) }
                </Div> */}
                <Box
                  style={{ width: "80px", flex: 1 }}
                  sx={{ justifySelf: "stretch", alignSelf: "center", marginRight: 3 }}
                >
                  <AutoSelect
                    title={localeObj['column']}
                    autocompleteProps={{ disableClearable: true, size: "small" }}
                    options={filtrableColumns.map((col: any) => ({
                      id: col.id,
                      label: col.name || col.id,
                    }))}
                    value={dfilter.column}
                    onChange={(id) => editDynFilter(idx, { column: id })}
                  />
                </Box>
                <Box
                  style={{ width: "80px", flex: 1 }}
                  sx={{ justifySelf: "stretch", alignSelf: "center", marginRight: 3 }}
                >
                  <AutoSelect
                    title={localeObj['condition']}
                    autocompleteProps={{ disableClearable: true, size: "small" }}
                    options={conditions}
                    value={dfilter.cond}
                    onChange={(id) => editDynFilter(idx, { cond: id })}
                  />
                </Box>
                <Box
                  style={{ width: "140px", flex: 1 }}
                  sx={{ justifySelf: "stretch", alignSelf: "center", marginRight: 3 }}
                >
                  <ValueFilter
                    value={dfilter.value}
                    condition={dfilter.cond}
                    onChange={(value: any) => valueDynFilter(idx, value)}
                    updateFilters={() => null}
                    autoDelete={(nullable) => editDynFilter(idx, { nullable: nullable })}
                    label={localeObj['value']}
                  />
                </Box>
                <Box
                  style={{ width: "24px" }}
                  sx={{ justifySelf: "stretch", alignSelf: "center", marginRight: 2 }}
                >
                  <IconButton size="small" onClick={() => removeDynFilter(idx)}>
                    <CloseOutlined />
                  </IconButton>
                </Box>
              </Div>
            );
          })}

          <Button onClick={() => addDynFilter()} disabled={emptyDynFilter >= 0} color={"primary"}>
            {localeObj['add']}
          </Button>
        </Box>
      </Popover>
    </>
  );
}
