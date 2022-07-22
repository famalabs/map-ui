import React from 'react';
import {  Theme, Box } from '@mui/material';

export interface AuthFormProps extends React.HTMLProps<HTMLFormElement> {
  onSubmit: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, noValidate = true, children, ...props }) => {

  return (
    <form
      noValidate={noValidate}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      {...props}
    >
      <Box
        sx={{
          width: "100%", // Fix IE 11 issue.
      marginTop: (theme: Theme) => theme.spacing(1),
    }}>
       {children}
    </Box>
    </form>
  );
};
