import React from 'react';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LockOutlined  from '@mui/icons-material/LockOutlined';

export interface AuthContainerProps {
  error?: string;
  title?: string;
  children: any;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ error, title, children }) => {

  return (
    <Box sx={{paddingTop: '40px',
        marginTop: (theme) => theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'}}>
      <Avatar
        sx={{
          margin: (theme) => theme.spacing(1),
          backgroundColor: (theme) => theme.palette.secondary.main,
        }}
      >
        <LockOutlined />
      </Avatar>
      <Typography component="h1" variant="h5">
        {title}
      </Typography>
      {/* <p style={{ color: 'red' }}>{error}</p> */}
      {error && <p style={{ color: 'red' }}>Credenziali non corrette, si prega di riprovare</p>}

     
      {children}
    </Box>
  );
};
