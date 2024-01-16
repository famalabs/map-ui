import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Divider, Box, Drawer, Container, IconButton, Theme, Stack } from "@mui/material";
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import { MenuIcon } from '@src/components/icons/stockholm';
import MainDiv from '@src/components/common/MainDiv';


import MenuItems from '@src/components/common/MenuItems';
import SidebarFooter from './SidebarFooter';

const openedMixin = (theme: Theme): typeof openedMixin => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): typeof closedMixin  => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});


const MapDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
) as typeof Drawer;

// can be a prop for custom width
const drawerWidth = 240;

export interface ItemData {
  title: string;
  link: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface SidebarData {
  genericData: ItemData[];
  footerData: ItemData[];
}
export interface SidebarLayoutProps {
  renderData: SidebarData;
  guard?: boolean;
  baseUrl?: string;
  onSelectMenuItem: (itemID: string, link: string) => void;
  selectedLink?: string;
  children: React.ReactNode;
}

export default function SidebarLayout({
  renderData,
  onSelectMenuItem,
  selectedLink,
  children,
}: SidebarLayoutProps) {

  const theme = useTheme();

  // this needs to refer to a global state for open/close
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const { genericData, footerData } = renderData;

  return <Box sx={{ display: 'flex' }}>
    <MapDrawer
      elevation={10}
      variant="permanent"
      sx={{
        position: 'relative',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        width: drawerWidth,
        transition: (theme) => theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen
        }),
        ...(
          !sidebarOpen && {
            overflowX: 'hidden',
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen
            }),
            width: (theme) => theme.spacing(6),
          }
        )
      }}
      open={sidebarOpen}
    >

      <Box component="span">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{
            paddingRight: (theme) => theme.spacing(1.5),
            ...theme.mixins.toolbar
          }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => {/* this needs to be a global state */ setSidebarOpen(!sidebarOpen) }}
          >
            {sidebarOpen ? <ChevronLeft /> : <MenuIcon />}

          </IconButton>
        </Stack>
      </Box>

      <Divider />

      <MenuItems
        displayItems={genericData}
        itemID='generic'
        onSelectItem={onSelectMenuItem}
        selectedLink={selectedLink}
      />

      <Divider />

      <SidebarFooter
        popupItems={footerData}
        isSidebarOpen={sidebarOpen}
        onSelectItem={onSelectMenuItem}
      />

    </MapDrawer>

    {/* Main page Div */}

    <MainDiv>
      {/** need to fix this sx, minHeight with vh not optimal */}
      <Container sx={{ minHeight: '60vh' }}>
        {children}
      </Container>
    </MainDiv>
  </Box>
}