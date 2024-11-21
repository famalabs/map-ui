import AddIcon from '@mui/icons-material/Add';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid2";
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ActionEvent, ActionEventItem, ActiveFilter, CustomButton, DynColumnsDef, i18nStrings } from './DynamicTypes';

export interface ColumnVisibilityPopperProps<T> {
  tableName: string;
  visibleColumns: DynColumnsDef<T>[];
  setVisibleColumns: Dispatch<SetStateAction<DynColumnsDef<T>[]>>;
  selectedLocale: i18nStrings;
  localeStr?: i18nStrings;
}

export function ColumnVisibilityPopper<T>(props: ColumnVisibilityPopperProps<T>) {

  const { tableName, visibleColumns, setVisibleColumns, selectedLocale, localeStr } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handlePopClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopClose = () => {
    setAnchorEl(null);

    // save array of objects with { accessor, visible } to local storage from visibleColumns
    const localVisibleCols = visibleColumns.map(column => {
      return { accessor: column.accessor, visible: column.visible ?? false }
    });
    localStorage.setItem(tableName, JSON.stringify(localVisibleCols));

  };

  const popOpen = Boolean(anchorEl);

  const handleHideColumn = (accessor: string) => () => {

    setVisibleColumns(visibleColumns.map(column => {
      if (column.accessor === accessor) {
        column.visible = !(column.visible ?? false);
      }
      return column;
    }
    ));

  };

  return (
    <>
      <Tooltip title={localeStr ? localeStr.visibleColumns : selectedLocale.visibleColumns}>
        <IconButton color='primary' onClick={handlePopClick}>
          <VisibilityOffIcon />
        </IconButton>
      </Tooltip>
      <Popover
        open={popOpen}
        anchorEl={anchorEl}
        onClose={handlePopClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >

        <Paper
          component={List}
          variant="elevation"
          dense
        >
          {visibleColumns.map((column) => (
            <ListItem key={column.accessor} disablePadding>
              <ListItemButton onClick={handleHideColumn(column.accessor)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={column.visible ?? false}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText id={column.label} primary={column.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </Paper>

      </Popover>
    </>
  )
}

interface ActionButtonsProps<T extends Record<string, any>> {
  fetchData: (limit: number, filters: ActiveFilter[], firstLoad?: boolean) => Promise<void>;
  quickActions: boolean;
  defineActions: { actionList: ActionEventItem[], onAction: ActionEvent<T> };
  quickSelectedRows: T[];
  activeFilters: ActiveFilter[];
  selectedLocale: i18nStrings;
  localeStr?: i18nStrings;
}

export function ActionButtons<T extends Record<string, any>>(props: ActionButtonsProps<T>) {

  const {
    fetchData,
    quickActions,
    quickSelectedRows,
    defineActions,
    activeFilters,
    selectedLocale,
    localeStr
  } = props;

  const { actionList, onAction } = defineActions;

  const handleAction = async (action: ActionEventItem, quickSelectedRows: T[], activeFilters: ActiveFilter[]) => {
    onAction?.(action.type, quickSelectedRows, activeFilters);
    if (action.refetch) await fetchData(quickSelectedRows.length, activeFilters, false);
  }

  if (!quickActions) return null;

  return (
    <Grid
      container
      size={{
        sm: 12,
        md: 12
      }}
      p={2}
    >
      <Grid
        container
        justifyContent='flex-start'
        alignItems='center'
        size={{
          sm: 6,
          md: 6
        }}
      >
        <Typography fontSize={14} marginInlineStart={1}>
          {`${localeStr ? localeStr.itemsSelected : selectedLocale.itemsSelected} ${quickSelectedRows.length}`}
        </Typography>
      </Grid>
      {/* Action Buttons */}
      <Grid
        container
        justifyContent='flex-end'
        alignItems='center'
        size={{
          sm: 6,
          md: 6
        }}
      >

        {actionList && actionList?.map((action, index) => (
          <Grid key={index}>
            {action.isIconButton ? (
              <Tooltip title={action.label ?? action.type}>
                <IconButton
                  color={action.color ?? 'primary'}
                  onClick={async () => await handleAction(action, quickSelectedRows, activeFilters)}
                  disabled={quickSelectedRows.length === 0}
                >
                  {action.icon ?? undefined}
                </IconButton>
              </Tooltip>
            ) : (
              <Button
                variant="contained"
                size="small"
                color={action.color ?? 'primary'}
                onClick={async () => await handleAction(action, quickSelectedRows, activeFilters)}
                disabled={quickSelectedRows.length === 0}
              >
                {action.icon ?? undefined}
                <Typography fontSize={14}> {action.label ?? action.type} </Typography>
              </Button>
            )}

          </Grid>
        ))}

      </Grid>
    </Grid>
  );

}

export function NewItemButton(props: CustomButton) {

  const { label, icon, buttonClick } = props;

  return (
    <Button
      variant='contained'
      size="small"
      color="primary"
      onClick={buttonClick}
    >
      {icon ?? <AddIcon sx={{ mr: 0.5 }} />}
      <Typography fontSize={14}> {label ?? 'NEW'} </Typography>
    </Button>
  )
}

export interface DynamicActionsProps<T extends Record<string, any>> {
  tableName: string;
  fetchData: (limit: number, filters: ActiveFilter[], firstLoad?: boolean) => Promise<void>
  visibleColumns: DynColumnsDef<T>[];
  setVisibleColumns: Dispatch<SetStateAction<DynColumnsDef<T>[]>>;
  defineActions: { actionList: ActionEventItem[], onAction: ActionEvent<T> }
  quickActions: boolean;
  setQuickActions: Dispatch<SetStateAction<boolean>>;
  quickSelectedRows: T[];
  setQuickSelectedRows: Dispatch<SetStateAction<T[]>>;
  activeFilters: ActiveFilter[];
  newItemButton?: CustomButton;
  showVisibleColumnsButton: boolean;
  selectedLocale: i18nStrings;
  localeStr?: i18nStrings
}

export function DynamicActionHeader<T extends Record<string, any>>(props: DynamicActionsProps<T>) {

  const {
    tableName,
    fetchData,
    visibleColumns,
    setVisibleColumns,
    defineActions,
    quickActions,
    setQuickActions,
    quickSelectedRows,
    setQuickSelectedRows,
    activeFilters,
    newItemButton,
    showVisibleColumnsButton,
    selectedLocale,
    localeStr,
  } = props;

  const toggleQuickActions = () => {
    setQuickActions(!quickActions);
    if (quickActions) setQuickSelectedRows([]);
  }

  return (<>
    <Grid
      container
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      p={1}
      size={{
        sm: 4,
        md: 4
      }}>
      {defineActions.actionList?.length > 0 &&
        <Grid p={0.5}>
          <Tooltip title={localeStr ? localeStr.quickActions : selectedLocale.quickActions}>
            <IconButton
              color={quickActions ? 'secondary' : 'primary'}
              onClick={toggleQuickActions}
            >
              <ElectricBoltIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      }

      {showVisibleColumnsButton &&
        <Grid p={0.5}>
          <ColumnVisibilityPopper
            tableName={tableName}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            selectedLocale={selectedLocale}
            localeStr={localeStr}
          />
        </Grid>
      }

      {newItemButton &&
        <Grid p={0.5}>
          <NewItemButton
            label={newItemButton.label}
            icon={newItemButton.icon}
            buttonClick={newItemButton.buttonClick}
          />
        </Grid>
      }

    </Grid>
    <ActionButtons
      fetchData={fetchData}
      quickActions={quickActions}
      quickSelectedRows={quickSelectedRows}
      defineActions={defineActions}
      activeFilters={activeFilters}
      selectedLocale={selectedLocale}
      localeStr={localeStr}
    />
  </>
  );
}