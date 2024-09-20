import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Fab from '@mui/material/Fab';
import IconButton from "@mui/material/IconButton";
import List, { ListOwnProps } from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import { alpha, styled, Theme, useTheme } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
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
  width: `calc(${theme.spacing(8)})`
});

const MiniDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    overflow: "hidden",
    "& .MuiDrawer-paper": {
      overflow: "visible"
    },
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": {
        ...openedMixin(theme),
        overflow: "visible"
      },
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": {
        ...closedMixin(theme), overflow: "visible"
      },
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
    onClose={() => { }}
    onOpen={() => { }}
    {...other}
  />
))(() => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  overflow: "hidden",
  '& .MuiDrawer-paper': {
    width: drawerWidth,
  },
})) as typeof SwipeableDrawer;

const SwipeFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  left: theme.spacing(2),
  zIndex: theme.zIndex.drawer - 1,
  backgroundColor: alpha(theme.palette.grey[800], 0.3),
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: alpha(theme.palette.grey[900], 0.5),
  },
}));

/* ------------ Final Drawer component ------------  */

const Sidebar = ({ children, sidebarOpen, setSidebarOpen, mainContent }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    if (isSmallScreen) {
      setSidebarOpen(false);
    }
  }, [isSmallScreen, setSidebarOpen]);

  if (isSmallScreen) {
    return (
      <>
        {!sidebarOpen && (
          <SwipeFab
            color='inherit' // use the theme color
            aria-label='swipe-sidebar-button'
            onClick={() => setSidebarOpen(true)}
            size='medium'
          >
            <ArrowForwardIcon />
          </SwipeFab>
        )}
        <SwipeDrawer
          anchor={'left'}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(!sidebarOpen)}
          onOpen={() => setSidebarOpen(!sidebarOpen)}
        >
          <Box component="span">
            <DrawerHeader>
              <IconButton
                color='inherit'
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <ChevronLeft />
              </IconButton>
            </DrawerHeader>
          </Box>

          <Divider />

          {children}
        </SwipeDrawer>
        {mainContent}
      </>
    );
  }

  return (
    <Box display='flex'>
      <MiniDrawer
        open={sidebarOpen}
        elevation={10}
        variant="permanent"
        sx={{ overflow: 'visible' }}
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

export interface SidebarLogo {
  fullLogo: string;
  miniLogo: string;
  variant?: "square" | "rounded" | "circular";
  width?: string;
}
export interface SidebarLayoutProps {
  itemsList: SidebarItem[];
  customHeader?: React.ReactNode;
  customHeaderCompact?: React.ReactNode;
  mainLogo?: SidebarLogo;
  brandLogo?: SidebarLogo;
  onSelectMenuItem: (itemID: string, title: string, link: string) => void;
  selectedLink?: string;
  footerData?: FooterData;
  listProps?: ListOwnProps;
  listStyle?: Record<string, any>;
  children: React.ReactNode;
}

export function SidebarLayout(props: SidebarLayoutProps) {
  const {
    itemsList,
    customHeader,
    customHeaderCompact,
    mainLogo,
    brandLogo,
    onSelectMenuItem,
    selectedLink,
    footerData,
    listProps,
    listStyle,
    children
  } = props;

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(true);

  const mainContent = (
    <>
      {children}
    </>
  );

  return (
    <>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mainContent={mainContent}
      >

        {/* Sidebar Logo */}

        {mainLogo && (
          <>
            <List sx={{ padding: '1rem 0 0.5rem 0' }}>
              <ListItemIcon
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box component='div'>
                  {
                    sidebarOpen
                      ? <img src={mainLogo.fullLogo || ''} alt="FullLogo" style={{ width: '10rem', height: 'auto' }} />
                      : <Avatar
                        variant={mainLogo.variant || 'square'}
                        alt="Minilogo"
                        src={mainLogo.miniLogo}
                        sx={{ padding: '4px' }}
                      />
                  }
                </Box>
              </ListItemIcon>
            </List>
            <Divider />
          </>
        )}

        {/* Custom Header */}
        
        {sidebarOpen && customHeader}

        {!sidebarOpen && customHeaderCompact}

        <MenuItems
          displayItems={itemsList ?? []}
          listType="body"
          iconOnly={!sidebarOpen}
          onSelectItem={(...args) => {
            onSelectMenuItem(...args);
            if (isSmallScreen) setSidebarOpen(false);
          }}
          selectedLink={selectedLink}
          listProps={listProps}
          listStyle={{
            margin: '0',
            marginTop: 1,
            marginBottom: 'auto',
            ...listStyle,
          }}
        />

        {brandLogo && (
          <List>
            <ListItemIcon
              sx={{
                display: 'flex',
                justifyContent: 'center',
                padding: '10px 0',
              }}
            >
              <Box component='div'>
                {
                  sidebarOpen
                    ? <img src={brandLogo.fullLogo || ''} alt="FullLogo" style={{ width: '10rem', height: 'auto' }} />
                    : <Avatar variant={brandLogo.variant || 'square'} alt="Minilogo" src={brandLogo.miniLogo} />
                }
              </Box>
            </ListItemIcon>
          </List>
        )}

        <Divider />

        {footerData &&
          <SidebarFooter
            footerData={footerData}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onSelectItem={(...args) => {
              onSelectMenuItem(...args);
              if (isSmallScreen) setSidebarOpen(false);
            }}
          />
        }

      </Sidebar>
    </>
  );
}