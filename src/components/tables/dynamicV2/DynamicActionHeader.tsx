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
import Grid2 from "@mui/material/Unstable_Grid2";
import React, { Dispatch, SetStateAction, useState } from 'react';
import { ActionEvent, ActionEventItem, CustomButton, DynColumnsDef } from './DynamicTypes';

export interface ColumnVisibilityPopperProps {
  tableName: string;
  visibleColumns: DynColumnsDef[];
  setVisibleColumns: Dispatch<SetStateAction<DynColumnsDef[]>>;
}

export function ColumnVisibilityPopper(props: ColumnVisibilityPopperProps) {

  const { tableName, visibleColumns, setVisibleColumns } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handlePopClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopClose = () => {
    setAnchorEl(null);

    // save array of objects with { accessor, visible } to local storage from visibleColumns
    const localVisibleCols = visibleColumns.map(column => {
      return { accessor: column.accessor, visible: column.visible }
    });
    localStorage.setItem(tableName, JSON.stringify(localVisibleCols));

  };

  const popOpen = Boolean(anchorEl);

  const handleHideColumn = (accessor: string) => () => {

    setVisibleColumns(visibleColumns.map(column => {
      if (column.accessor === accessor) {
        column.visible = !column.visible;
      }
      return column;
    }
    ));

  };

  return (
    <>
      <Tooltip title="Column Visibility">
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
                    checked={column.visible}
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

interface ActionButtonsProps<T> {
  defineActions: { actionList: ActionEventItem[], onAction: ActionEvent<T> };
  quickSelectedRows: T[];
}

export function ActionButtons<T extends Record<string, any>>(props: ActionButtonsProps<T>) {

  const { quickSelectedRows, defineActions: { actionList, onAction } } = props;

  if (quickSelectedRows.length === 0) return null;

  return (
    <Grid2
      container
      direction="row"
      sm={12} md={12}
    >

      <Grid2
        container
        sm={6} md={6}
        justifyContent='flex-start'
        alignItems='center'
        p={1}
      >
        <Typography fontSize={14} marginInlineStart={1}> {`Items Selected: ${quickSelectedRows.length}`} </Typography>
      </Grid2>

      {/* Action Buttons */}
      <Grid2
        container
        sm={6} md={6}
        justifyContent='flex-end'
        alignItems='center'
        p={1}
      >

        {actionList && actionList.map((action, index) => (
          <Grid2 p={1} key={index}>

            {
              action.isIconButton

                ? <Tooltip title={action.label ?? action.type}>
                  <IconButton
                    color={action.color ?? 'primary'}
                    onClick={() => onAction(action.type, quickSelectedRows)}
                  >
                    {action.icon && action.icon}
                  </IconButton>
                </Tooltip>

                : <Button
                  variant="contained"
                  size="small"
                  color={action.color ?? 'primary'}
                  onClick={() => onAction(action.type, quickSelectedRows)}
                >
                  {action.icon && action.icon}
                  <Typography fontSize={14}> {action.label ?? action.type} </Typography>
                </Button>
            }

          </Grid2>
        ))}

      </Grid2>

    </Grid2>
  )

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

export interface DynamicActionsProps<T> {
  tableName: string;
  visibleColumns: DynColumnsDef[];
  setVisibleColumns: Dispatch<SetStateAction<DynColumnsDef[]>>;
  defineActions: { actionList: ActionEventItem[], onAction: ActionEvent<T> }
  quickActions: boolean;
  setQuickActions: Dispatch<SetStateAction<boolean>>;
  quickSelectedRows: T[];
  setQuickSelectedRows: Dispatch<SetStateAction<T[]>>;
  newItemButton?: CustomButton;
}

export function DynamicActionHeader<T extends Record<string, any>>(props: DynamicActionsProps<T>) {

  const {
    tableName,
    visibleColumns,
    setVisibleColumns,
    defineActions,
    quickActions,
    setQuickActions,
    quickSelectedRows,
    setQuickSelectedRows,
    newItemButton
  } = props;

  const toggleQuickActions = () => {
    setQuickActions(!quickActions);
    quickActions && setQuickSelectedRows([]);
  }

  return (
    <>
      <Grid2
        container
        sm={4} md={4}
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        p={1}
      >
        <Grid2 p={0.5}>
          <Tooltip title="Quick Actions">
            <IconButton
              color={quickActions ? 'secondary' : 'primary'}
              onClick={toggleQuickActions}
            >
              <ElectricBoltIcon />
            </IconButton>
          </Tooltip>

        </Grid2>

        <Grid2 p={0.5}>
          <ColumnVisibilityPopper
            tableName={tableName}
            visibleColumns={visibleColumns} 
            setVisibleColumns={setVisibleColumns} 
          />
        </Grid2>

        {newItemButton &&
          <Grid2 p={0.5}>
            <NewItemButton
              label={newItemButton.label}
              icon={newItemButton.icon}
              buttonClick={newItemButton.buttonClick}
            />
          </Grid2>
        }

      </Grid2>

      <ActionButtons
        quickSelectedRows={quickSelectedRows}
        defineActions={defineActions}
      />

    </>
  )
}