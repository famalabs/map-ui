import React from 'react';
import {  Theme, Avatar, Typography, Box } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

export interface AuthContainerProps {
  error?: string;
  title?: string;
  children: any;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ error, title, children }) => {

  return (
    <Box sx={{paddingTop: 40,
        marginTop: (theme: Theme) => theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'}}>
      <Avatar
        sx={{
          margin: (theme: Theme) => theme.spacing(1),
          backgroundColor: (theme: Theme) => theme.palette.secondary.main,
        }}
      >
        <LockOutlined />
      </Avatar>
      <Typography component="h1" variant="h5">
        {title}
      </Typography>
      <p style={{ color: 'red' }}>{error}</p>

      {children}
    </Box>
  );
};
