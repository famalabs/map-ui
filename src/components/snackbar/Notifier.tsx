import React from 'react';
import { OptionsObject, SnackbarKey, SnackbarMessage, useSnackbar } from 'notistack';
import IconButton from '@mui/material/IconButton';
import { XIcon } from 'lucide-react';

export interface ISnackbar {
  message: SnackbarMessage;
  options?: OptionsObject;
  dismissed?: boolean;
  manualClose?: boolean;
}

export interface NotifierProps {
  snackbars: ISnackbar[];
  removeSnackbar: (key: SnackbarKey) => void;
}

let displayed: SnackbarKey[] = [];

export const Notifier: React.FC<NotifierProps> = ({ snackbars, removeSnackbar }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const addDisplayed = (key: SnackbarKey) => {
    displayed = [...displayed, key];
  };

  const removeDisplayed = (key: SnackbarKey) => {
    displayed = displayed.filter((id) => id !== key);
  };

  React.useEffect(() => {
    snackbars.forEach(({ message, options, dismissed, manualClose }) => {
      if (dismissed) closeSnackbar(options?.key);

      if (options?.key && displayed.includes(options.key)) return;

      const action = manualClose
        ? (key: SnackbarKey) => (
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => closeSnackbar(key)}
            >
              <XIcon size={20} />
            </IconButton>
          )
        : options?.action;

      enqueueSnackbar(message, {
        ...options,
        onExited: (node, key) => {
          if (options?.onExited) options.onExited(node, key);
          removeSnackbar(key);
          removeDisplayed(key);
        },
        action,
      });

      if (options?.key) addDisplayed(options.key);
    });
  }, [enqueueSnackbar, closeSnackbar, snackbars, removeSnackbar]);

  return null;
};
