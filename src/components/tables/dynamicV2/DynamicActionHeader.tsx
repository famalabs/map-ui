import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import AddIcon from '@mui/icons-material/Add';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Grid from "@mui/material/Grid";
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
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { ActionEvent, ActionEventItem, ActiveFilter, CustomButton, CustomIconButton, DynamicColumns, i18nStrings } from './DynamicTypes';

interface ColumnVisibilityPopperProps<T> {
  columnsButton?: CustomIconButton;
  currentColumns: DynamicColumns<T>[];
  setCurrentColumns: Dispatch<SetStateAction<DynamicColumns<T>[]>>;
  onColumnsPopoverClose?: (visibleColumns: string[]) => void;
  localeStr: i18nStrings['header'];
}

function ColumnVisibilityPopper<T>(props: ColumnVisibilityPopperProps<T>) {

  const { 
    columnsButton, 
    currentColumns, 
    setCurrentColumns, 
    onColumnsPopoverClose,
    localeStr 
  } = props;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const popOpen = Boolean(anchorEl);
  const handlePopClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const lockedColumns = React.useMemo(() => currentColumns.filter(column => Boolean(column.locked)), [currentColumns]);
  const visibleColumns = React.useMemo(() => currentColumns.filter(column => !Boolean(column.locked) && Boolean(column.visible)), [currentColumns]);
  const hiddenColumns = React.useMemo(() => currentColumns.filter(column => !Boolean(column.locked) && !Boolean(column.visible)), [currentColumns]);;

  const handleToggleColumn = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, accessor: string) => {
    event.stopPropagation();
    // column should be set to visible (columns has to be from hiddenColumns)
    setCurrentColumns(currentColumns.map(column => {
      if (column.accessor === accessor) {
        column.visible = !Boolean(column.visible);
      }
      return column;
    }
    ));
  }, [currentColumns, setCurrentColumns]);

  const handlePopClose = useCallback(() => {
    setAnchorEl(null);
    // save array of visible columns as array of strings
    const localVisibleCols = currentColumns
      .filter(column => !Boolean(column.locked) && Boolean(column.visible))
      .map(column => column.accessor);
   
    onColumnsPopoverClose?.(localVisibleCols);
  }, [currentColumns, onColumnsPopoverClose]);
  
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const handleDragEnd = useCallback((result: DropResult) => {
    try {

      console.log('result', result);

      if (!result.destination) return;
      if (!result.source) return;
      if (
        result.destination.droppableId === result.source.droppableId &&
        result.destination.index === result.source.index
      ) {
        return;
      }

      const reorderedItems = Array.from(currentColumns);
      const [movedItem] = reorderedItems.splice(result.source.index - 1, 1);
      reorderedItems.splice(result.destination.index - 1, 0, movedItem);
      setCurrentColumns(reorderedItems);

    } catch (error) {
      console.error('Error dragging column', error);
    } finally {
      setIsDragging(false);
    }
  }, [currentColumns, setCurrentColumns]);

  const ColumDisplayList = useCallback((columns: DynamicColumns<T>[], type: 'locked' | 'visible' | 'hidden') => (
    <>
      <Grid size={12} p={2}>
        <Typography
          variant="body1"
          fontWeight='bold'
          fontSize={13}
        >
          {type === 'locked' ? localeStr?.lockedColumns : type === 'visible' ? localeStr?.visibleColumns : localeStr?.hiddenColumns}
        </Typography>
      </Grid>

      <Grid size={12} pb={2}>
        <DragDropContext
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
        >
          <Droppable
            droppableId="droppableMain"
            type={`droppable-${type}`}
            isDropDisabled={type !== 'visible'}

          >
            {(provided) => (
              <List
                ref={provided.innerRef}
                dense
                style={{
                  width: '100%',
                  padding: 0,
                }}
                {...provided?.droppableProps}
                >
                {columns.map((column, index) => (
                  <Draggable
                    key={`${column.accessor}`}
                    draggableId={`draggable-${column.accessor}`}
                    index={index + 1}
                    isDragDisabled={type !== 'visible'}
                  >
                    {(provided) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided?.draggableProps}
                        disablePadding
                        disableGutters
                        dense
                        sx={type === 'visible' 
                          ? { display: Boolean(column.visible) && !Boolean(column.locked) ? 'block' : 'none' }
                          : undefined
                        }
                      >
                        <ListItemButton
                          disableRipple={type === 'locked'}
                          sx={{
                            py: 0,
                            pointerEvents: isDragging ? 'none' : (type === 'locked' ? 'none' : 'auto'),
                            cursor: type === 'locked' ? 'default' : 'pointer',
                            userSelect: 'none',
                          }}
                        >
                          {type !== 'locked' &&
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                checked={Boolean(column.visible)}
                                disableRipple
                                onClick={(event) => {
                                  handleToggleColumn(event, column.accessor);
                                }}
                              />
                            </ListItemIcon>
                          }
                          
                          <ListItemText id={column.label} primary={column.label} />

                          {type === 'visible' &&
                            <Grid
                            container
                            justifyContent='center'
                            alignItems='center'
                            style={{
                              visibility: type !== 'visible' ? 'hidden' : 'visible',
                            }}
                            {...provided?.dragHandleProps}
                            >
                              <DragIndicatorIcon color='action' />
                            </Grid>
                          }
                        </ListItemButton>
                      </ListItem>
                    )}

                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>

        </DragDropContext>
      </Grid>
    </>
  ), [handleDragEnd, handleToggleColumn, isDragging, localeStr?.hiddenColumns, localeStr?.lockedColumns, localeStr?.visibleColumns]);

  return (
    <>
      <Tooltip title={columnsButton?.label ?? localeStr?.visibleColumns} arrow>
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

          {lockedColumns.length > 0 && ColumDisplayList(lockedColumns, 'locked')}

          <Divider flexItem style={{ width: '100%' }} />

          {visibleColumns.length > 0 && ColumDisplayList(currentColumns, 'visible')}

          <Divider flexItem style={{ width: '100%' }} />

          {hiddenColumns.length > 0 && ColumDisplayList(hiddenColumns, 'hidden')}

        </Grid>

      </Popover>
    </>
  )
}

interface ActionButtonsProps<T extends Record<string, any>> {
  quickActions: boolean;
  defineActions: { actionList: ActionEventItem[], onAction: ActionEvent<T> };
  quickSelectedRows: T[];
  activeFilters: ActiveFilter[];
  localeStr: i18nStrings['header'];
}

function ActionButtons<T extends Record<string, any>>(props: ActionButtonsProps<T>) {

  const {
    quickActions,
    quickSelectedRows,
    defineActions,
    activeFilters,
    localeStr
  } = props;

  const { actionList, onAction } = defineActions;

  const handleAction = async (action: ActionEventItem, quickSelectedRows: T[], activeFilters: ActiveFilter[]) => {
    onAction?.(action.type, quickSelectedRows, activeFilters);
    // if (action.refetch) await fetchData(quickSelectedRows.length, activeFilters, false);
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
          {`${localeStr?.itemsSelected} ${quickSelectedRows.length}`}
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
              <Tooltip title={action.label ?? action.type} arrow>
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
    <Tooltip title={label ?? 'Export'} arrow>
      <IconButton
        color="primary"
        onClick={(event) => buttonClick?.(event)}
      >
        {icon ?? <FileUploadOutlinedIcon sx={{ mr: 0.5 }} />}
      </IconButton>
    </Tooltip>
  )
}

export interface DynamicActionsProps<T> {
  tableName: string;
  currentColumns: DynamicColumns<T>[];
  setCurrentColumns: Dispatch<SetStateAction<DynamicColumns<T>[]>>;
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
  onColumnsPopoverClose?: (visibleColumns: string[]) => void;
  showVisibleColumnsButton: boolean;
  localeStr: i18nStrings['header'];
}

export function DynamicActionHeader<T extends Record<string, any>>(props: DynamicActionsProps<T>) {

  const {
    currentColumns,
    setCurrentColumns,
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
    onColumnsPopoverClose,
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
                label={exportButton?.label ?? ''}
                icon={exportButton?.icon}
                buttonClick={exportButton?.buttonClick ?? (() => null)}
              />
            </Grid>
          }

          {defineActions.actionList?.length > 0 &&
            <Grid p={0.5}>
              <Tooltip title={actionButton?.label ?? localeStr?.quickActions} arrow>
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
                currentColumns={currentColumns}
                setCurrentColumns={setCurrentColumns}
                onColumnsPopoverClose={onColumnsPopoverClose}
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
        quickActions={quickActions}
        quickSelectedRows={quickSelectedRows}
        defineActions={defineActions}
        activeFilters={activeFilters}
        localeStr={localeStr}
      />
    </>
  );
}