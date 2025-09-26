import LockOutlined from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';

export interface AuthSuccessProps {
  error?: string;
  success?: string;
  title?: string;
}

export const AuthSuccess: React.FC<AuthSuccessProps> = ({
  error,
  title = 'Operation Completed',
  success = 'Operation completed successfully',
}) => {
  const authColor = error ? 'error' : success ? 'success' : 'primary';

  return (
    <Box
      sx={{
        paddingTop: '40px',
        marginTop: (theme) => theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar
        sx={{
          margin: (theme) => theme.spacing(1),
          backgroundColor: (theme) => theme.palette.secondary.main,
        }}
      >
        <LockOutlined color={authColor} />
      </Avatar>
      <Typography component="h1" variant="h5">
        {title}
      </Typography>
      {error && <p style={{ color: 'red' }}>Credenziali non corrette, si prega di riprovare</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </Box>
  );
};
