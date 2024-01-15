import React from 'react';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

const Main = styled('main')``;

interface IProps {
  appbar?: boolean;
  children: React.ReactNode;
}

export const MainDiv: React.FC<IProps> = ({ children }) => {

  //const theme: any = useTheme();

  return (
    <Main sx={{ flexGrow: 1, height: '100vh', overflow: 'auto', backgroundColor: 'background.default' }}>
      <Container maxWidth="lg" sx={{
        paddingTop: (theme) => theme.spacing(4),
        paddingBottom: (theme) => theme.spacing(4),
        minHeight: '80vh'
      }}>
        {children}
      </Container>
    </Main>
  );
};