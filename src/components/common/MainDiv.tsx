import React from 'react';
import { styled } from '@mui/material/styles';

const Main = styled('main')(({ theme }) => ({
  flex: 1,
  height: '100%',
  overflow: 'auto',
  backgroundColor: theme.palette.background.default,
}));

export interface IProps {
  appbar?: boolean;
  children: React.ReactNode;
}

export const MainDiv: React.FC<IProps> = ({ children }) => {
  return (
    <Main>
      {children}
    </Main>
  );
};