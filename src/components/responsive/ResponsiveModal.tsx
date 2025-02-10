import { ButtonOwnProps, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export interface ResponsiveModalButton extends ButtonOwnProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "reset" | "submit",
  loading?: boolean;
  disabled?: boolean;
}

export interface ResponsiveModalProps {
  title?: string;
  confirmButton?: ResponsiveModalButton;
  closeIconButton?: ResponsiveModalButton;
  backButton?: ResponsiveModalButton;
  cancelButton?: ResponsiveModalButton;
  isForm?: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  open: boolean;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  footerText?: string;
  icons?: {
    X: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    ArrowLeft: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }
  customSize?: {
    maxHeight: number | string;
    width: number | string;
  };
  children: React.ReactNode;
}

export function ResponsiveModal(props: ResponsiveModalProps) {

  const {
    title = 'Modal Title',
    confirmButton,
    closeIconButton,
    backButton,
    cancelButton,
    isForm,
    onSubmit,
    open,
    size = 'medium',
    customSize,
    footerText,
    icons,
    children
  } = props;

  const { X, ArrowLeft } = icons || { X: CloseIcon, ArrowLeft: ArrowBackIcon };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const sizeMap = {
    small: {
      maxHeight: '100vh',
      width: isMobile ? 'calc(100% - 4rem)' : (isTablet ? '60%' : 600),
    },
    medium: {
      maxHeight: '100vh',
      width: isMobile ? 'calc(100% - 4rem)' : (isTablet ? '80%' : 900),
    },
    large: {
      maxHeight: '100vh',
      width: isMobile ? 'calc(100% - 4rem)' : (isTablet ? '90%' : 1200),
    },
    fullscreen: {
      maxHeight: '100vh',
      height: '100vh',
      width: '100vw',
      margin: 0,
      borderRadius: 0,
    },
  };

  const ResponsiveStyle = {
    position: "absolute" as const,
    top: '50%',
    left: '50%',
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
    overflowX: 'hidden',
    ...sizeMap[size],
    ...customSize,
  };

  return (
    <Modal
      open={open}
      sx={{
        margin: 4,
        '.MuiModal-backdrop': {
          backdropFilter: 'saturate(180%) blur(5px)',
        }
      }}
    >
      <Grid
        container
        size={12}
        component={isForm ? 'form' : 'div'}
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          onSubmit?.(e);
        }}
        sx={ResponsiveStyle}
      >

        {/* Header */}


        <Grid
          size={12}
          container
          justifyContent='space-between'
          alignItems='center'
        >

          <Grid
            container
            justifyContent='flex-start'
            alignItems='center'
            gap={1}
          >
            {backButton &&
              <Grid>
                <Tooltip title={'Back'}>
                  <IconButton color='primary' onClick={backButton?.onClick}>
                    <ArrowLeft />
                  </IconButton>
                </Tooltip>
              </Grid>
            }

            <Grid>
              <Typography variant='h4'>{title}</Typography>
            </Grid>
          </Grid>

          <Grid>
            <Tooltip title={closeIconButton?.label || 'Close'}>
              <IconButton color='primary' disabled={closeIconButton?.disabled} onClick={closeIconButton?.onClick}>
                {closeIconButton?.icon || <X />}
              </IconButton>
            </Tooltip>
          </Grid>

        </Grid>


        <Grid container size={12}>
          {children}
        </Grid>

        {/* Footer */}
        <Grid
          container
          size={12}
          sx={{
            position: 'sticky',
            bottom: '-32px',
            backgroundColor: 'background.paper',
            zIndex: 1000,
          }}
        >
          <Grid
            container
            size={12}
            sx={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              gap: 1,
              py: 2
            }}>
            {footerText && <Typography
              sx={{
                alignSelf: 'center',
                color: 'text.primary'
              }}>{footerText}</Typography>}
            {cancelButton &&
              <Grid container>
                <Button
                  type={confirmButton?.type || 'button'}
                  variant="outlined"
                  color="primary"
                  startIcon={cancelButton.icon}
                  onClick={cancelButton.onClick}
                  disabled={cancelButton.disabled}
                >
                  {cancelButton.label || 'Cancel'}
                </Button>
              </Grid>
            }

            {confirmButton &&
              <Grid container>
                <Button
                  type={confirmButton?.type || 'button'}
                  variant="contained"
                  color="primary"
                  startIcon={confirmButton?.icon}
                  onClick={confirmButton?.onClick}
                  disabled={confirmButton?.disabled || confirmButton?.loading}
                // loading={confirmButton?.loading}
                >
                  {!confirmButton?.loading
                    ? (confirmButton?.label || 'Conferma')
                    : 'Caricamento..'
                  }
                </Button>
              </Grid>
            }

          </Grid>
        </Grid>

      </Grid>
    </Modal >
  );
}