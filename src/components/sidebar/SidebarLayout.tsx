import ChevronLeft from "@mui/icons-material/ChevronLeft";
import MenuIcon from '@mui/icons-material/Menu';
import { Theme, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import React from "react";
import { MainDiv } from "../common/MainDiv";
import { MenuItems } from "../common/MenuItems";
import { FooterData, SidebarFooter } from "./SidebarFooter";

const drawerWidth = 240;

/* ------------ Standard Mini Drawer ------------  */

const openedMixin = (theme: Theme): typeof openedMixin => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): typeof closedMixin => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)})`
});

const MiniDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    overflow: "hidden",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  })
) as typeof Drawer;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

/* ------------ Swipeable Drawer ------------  */

const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

const SwipeDrawer = styled(({ ...other }) => (
  <SwipeableDrawer
    disableBackdropTransition={!iOS}
    disableDiscovery={iOS}
    onClose={() => {}}
    onOpen={() => {}}
    {...other}
  />
))(({ theme }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  overflow: "hidden",
  '& .MuiDrawer-paper': {
    width: drawerWidth,
  },
})) as typeof SwipeableDrawer;

/* ------------ Final Drawer component ------------  */

const Sidebar = ({ children, sidebarOpen, setSidebarOpen, mainContent }) => {
  const isSmallScreen = useMediaQuery(useTheme().breakpoints.down('sm'));

  if (isSmallScreen) {
    return (
      <>
        <SwipeDrawer
          anchor={'left'}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(!sidebarOpen)}
          onOpen={() => setSidebarOpen(!sidebarOpen)}
        >
          {children}
        </SwipeDrawer>
        {mainContent}
      </>
    );
  }

  return (
    <Box sx={{ display: "flex", height: '100%' }}>
      <MiniDrawer
        open={sidebarOpen}
        elevation={10}
        variant="permanent"
      >
        {children}
      </MiniDrawer>
      {mainContent}
    </Box>
  );
};


export interface SidebarItem {
  title: string;
  link: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface SidebarLayoutProps {
  itemsList: SidebarItem[];
  mainLogo?: {
    fullLogo: string;
    miniLogo: string;
  }
  onSelectMenuItem: (itemID: string, link: string) => void;
  selectedLink?: string;
  footerData?: FooterData;
  children: React.ReactNode;
}

export function SidebarLayout(props: SidebarLayoutProps) {
  const { itemsList, onSelectMenuItem, selectedLink, footerData, children } = props;
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(true);

  const mainContent = (
    <MainDiv>
      {children}
    </MainDiv>
  );

  return (
    <>
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        mainContent={mainContent}
      >
        <Box component="span">
          <DrawerHeader>
            <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <ChevronLeft /> : <MenuIcon />}
            </IconButton>
          </DrawerHeader>
        </Box>

        <Divider />

        {/* Sidebar Logo */}


        <MenuItems
          displayItems={itemsList ?? []}
          listType="body"
          onSelectItem={onSelectMenuItem}
          selectedLink={selectedLink}
          listProps={{
            margin: '0',
            marginBottom: 'auto',
          }}
        />

        {footerData &&
          <SidebarFooter
            footerData={footerData}
            isSidebarOpen={sidebarOpen}
            onSelectItem={onSelectMenuItem}
          />
        }
      </Sidebar>
    </>
  );
}