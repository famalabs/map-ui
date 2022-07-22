import React from "react";
import { Button, ButtonProps, CircularProgress, Theme } from "@mui/material";
import { styled } from '@mui/material/styles';

const Span = styled('span')``;

export interface ButtonLoadingProps extends ButtonProps {
  label?: string;
  loading: boolean;
}

/**
 * Button with a Loading prop available
 */
export const ButtonLoading: React.VFC<ButtonLoadingProps> = ({
  label = "Button",
  loading,
  ...props
}) => {
  return (
    <Button {...props} disabled={props.disabled || loading}>
      <Span >{label}</Span>{' '}
      {loading && <CircularProgress size={24} sx={{
    color: (theme: Theme) => theme.palette.secondary.main,
    position: 'absolute',
            top: "50%",
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }} />}
    </Button>
  );
};