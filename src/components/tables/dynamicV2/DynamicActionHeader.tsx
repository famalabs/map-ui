import AddIcon from '@mui/icons-material/Add';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Grid from "@mui/material/Grid2";
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
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ActionEvent, ActionEventItem, ActiveFilter, CustomButton, CustomIconButton, DynamicColumns, i18nStrings } from './DynamicTypes';

interface ColumnVisibilityPopperProps<T> {
  columnsButton: CustomIconButton;
  tableName: string;
  visibleColumns: DynamicColumns<T>[];
  setVisibleColumns: Dispatch<SetStateAction<DynamicColumns<T>[]>>;
  localeStr: i18nStrings['header'];
}

function ColumnVisibilityPopper<T>(props: ColumnVisibilityPopperProps<T>) {

  const { columnsButton, tableName, visibleColumns, setVisibleColumns, localeStr } = props;

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
      <Tooltip title={columnsButton?.label ?? localeStr.visibleColumns}>
        <IconButton
          color='primary'
          onClick={(event) => {
            handlePopClick(event);
            columnsButton?.buttonClick?.(event);
          }}
        >
          {columnsButton?.icon ?? <SettingsOutlinedIcon />}
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

        <Grid
          component={Paper}
          container
          maxHeight={300}
          width={200}
          sx={{
            overflow: 'auto',
            scrollbarWidth: 'thin',
          }}
        >

          <Grid size={12} p={2}>
            <Typography variant="subtitle1">
              {localeStr.visibleColumns}
            </Typography>
          </Grid>

          <Grid size={12}>
            <List
              dense
              sx={{ width: '100%', padding: 0 }}
            >
              {visibleColumns.map((column) => (
                <ListItem
                  key={column.accessor}
                  disablePadding
                  disableGutters
                >
                  <ListItemButton
                    onClick={handleHideColumn(column.accessor)}
                    sx={{ py: 0 }}
                  >
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
            </List>
          </Grid>

        </Grid>

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
  localeStr: i18nStrings['header'];
}

function ActionButtons<T extends Record<string, any>>(props: ActionButtonsProps<T>) {

  const {
    fetchData,
    quickActions,
    quickSelectedRows,
    defineActions,
    activeFilters,
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
          {`${localeStr.itemsSelected} ${quickSelectedRows.length}`}
        </Typography>
      </Grid>
      {/* Action Buttons */}
      <Grid
        container
        justifyContent='flex-end'
        alignItems='center'
        spacing={1}
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

function NewItemButton(props: CustomButton) {

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

function ExportButton(props: CustomButton) {

  const { label, icon, buttonClick } = props;

  return (
    <Tooltip title={label ?? 'Export'}>
      <IconButton
        color="primary"
        onClick={(event) => buttonClick?.(event)}
      >
        {icon ?? <FileUploadOutlinedIcon sx={{ mr: 0.5 }} />}
      </IconButton>
    </Tooltip>
  )
}

export interface DynamicActionsProps<T extends Record<string, any>> {
  tableName: string;
  fetchData: (limit: number, filters: ActiveFilter[], firstLoad?: boolean) => Promise<void>
  visibleColumns: DynamicColumns<T>[];
  setVisibleColumns: Dispatch<SetStateAction<DynamicColumns<T>[]>>;
  defineActions: { actionList: ActionEventItem[], onAction: ActionEvent<T> }
  quickActions: boolean;
  setQuickActions: Dispatch<SetStateAction<boolean>>;
  quickSelectedRows: T[];
  setQuickSelectedRows: Dispatch<SetStateAction<T[]>>;
  activeFilters: ActiveFilter[];
  newItemButton?: CustomButton;
  columnsButton?: CustomIconButton;
  actionButton?: CustomIconButton;
  exportButton?: CustomIconButton;
  showVisibleColumnsButton: boolean;
  localeStr: i18nStrings['header'];
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
    actionButton,
    columnsButton,
    exportButton,
    showVisibleColumnsButton,
    localeStr,
  } = props;

  const toggleQuickActions = () => {
    setQuickActions(!quickActions);
    if (quickActions) setQuickSelectedRows([]);
  }

  const CustomActionButton = actionButton?.icon 
    ? actionButton?.icon
    : <LayersOutlinedIcon />;

  const CustomActiveActionButton = actionButton?.activeIcon
    ? actionButton?.activeIcon
    : <LayersOutlinedIcon />;

  const shouldActionBeHidden = defineActions.actionList?.length === 0 && !newItemButton && !showVisibleColumnsButton;

  return (
    <>
      {!shouldActionBeHidden &&
        <Grid
          container
          justifyContent="flex-end"
          alignItems="center"
          p={1}
        >

          {exportButton &&
            <Grid p={0.5}>
              <ExportButton
                label={exportButton?.label}
                icon={exportButton?.icon}
                buttonClick={exportButton?.buttonClick}
              />
            </Grid>
          }

          {defineActions.actionList?.length > 0 &&
            <Grid p={0.5}>
              <Tooltip title={actionButton?.label ?? localeStr.quickActions}>
                <IconButton
                  color='primary'
                  onClick={(event) => {
                    toggleQuickActions();
                    actionButton?.buttonClick?.(event);
                  }}
                >
                  {quickActions ? CustomActiveActionButton : CustomActionButton}
                </IconButton>
              </Tooltip>
            </Grid>
          }

          {showVisibleColumnsButton &&
            <Grid p={0.5}>
              <ColumnVisibilityPopper
                columnsButton={columnsButton}
                tableName={tableName}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
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
      }

      <ActionButtons
        fetchData={fetchData}
        quickActions={quickActions}
        quickSelectedRows={quickSelectedRows}
        defineActions={defineActions}
        activeFilters={activeFilters}
        localeStr={localeStr}
      />
    </>
  );
}