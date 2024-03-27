import React from 'react';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

const Main = styled('main')``;

export interface IProps {
  appbar?: boolean;
  children: React.ReactNode;
}

export const MainDiv: React.FC<IProps> = ({ children }) => {

  const theme: any = useTheme();

  return (
    <Main sx={{ flexGrow: 1, height: '100vh', overflow: 'auto', backgroundColor: 'background.default' }}>
      {children}
    </Main>
  );
};
