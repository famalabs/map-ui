import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import List, { ListOwnProps } from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import { alpha, styled, Theme, useTheme } from '@mui/material/styles';
import SwipeableDrawer, { SwipeableDrawerProps } from '@mui/material/SwipeableDrawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';
import { MenuItems } from '../common/MenuItems';
import { FooterData, SidebarFooter } from './SidebarFooter';

const drawerWidth = 240;

/* ------------ Standard Mini Drawer ------------  */

const openedMixin = (theme: Theme): Record<string, string | number | boolean> => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): Record<string, string | number | boolean> => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(8)})`,
});

const MiniDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    overflow: 'hidden',
    zIndex: 1000,
    '& .MuiDrawer-paper': {
      overflow: 'visible',
    },
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': {
        ...openedMixin(theme),
        overflow: 'visible',
      },
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': {
        ...closedMixin(theme),
        overflow: 'visible',
      },
    }),
  }),
) as typeof Drawer;

/* ------------ Swipeable Drawer ------------  */

// const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

const SwipeDrawer = styled((props: SwipeableDrawerProps) => (
  <Drawer
    // disableBackdropTransition={!iOS}
    // disableDiscovery={iOS}
    // allowSwipeInChildren={true}
    // onClose={() => {  }}
    // onOpen={() => {  }}
    {...props}
  />
))(() => ({
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  overflow: 'hidden',
  zIndex: 999,
  '& .MuiDrawer-paper': {
    width: '100%',
  },
})) as typeof SwipeableDrawer;

const SwipeFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  left: theme.spacing(2),
  zIndex: theme.zIndex.drawer + 100,
  backgroundColor: alpha(theme.palette.grey[800], 0.3),
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: alpha(theme.palette.grey[900], 0.5),
  },
}));

/* ------------ Final Drawer component ------------  */

export interface SidebarProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mainContent: React.ReactNode;
}

const Sidebar = ({ children, sidebarOpen, setSidebarOpen, mainContent }: SidebarProps) => {
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
            color="inherit" // use the theme color
            aria-label="swipe-sidebar-button"
            onClick={() => setSidebarOpen(true)}
            size="medium"
          >
            <ArrowForwardIcon />
          </SwipeFab>
        )}
        {sidebarOpen && (
          <SwipeDrawer
            anchor="left"
            open={sidebarOpen}
            onClose={() => setSidebarOpen(!sidebarOpen)}
            onOpen={() => setSidebarOpen(!sidebarOpen)}
          >
            {children}
          </SwipeDrawer>
        )}
        {mainContent}
      </>
    );
  }

  return (
    <Box display="flex">
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
  variant?: 'square' | 'rounded' | 'circular';
  width?: string;
}
export interface SidebarLayoutProps {
  itemsList: SidebarItem[];
  customHeader?: React.ReactNode;
  customHeaderCompact?: React.ReactNode;
  mainLogo?: SidebarLogo;
  brandLogo?: SidebarLogo;
  onSelectMenuItem: (itemID: string, title: string, link: string) => void;
  onHoverMenuItem?: (itemID: string, title: string, link: string) => Promise<void> | void;
  selectedLink?: string;
  isLoading?: boolean;
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
    onHoverMenuItem,
    selectedLink,
    isLoading = false,
    footerData,
    listProps,
    listStyle,
    children,
  } = props;

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(true);
  const iconOnly = !sidebarOpen && !isSmallScreen;

  const mainContent = <>{children}</>;

  return (
    <>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} mainContent={mainContent}>
        {/* Sidebar Logo */}

        <List sx={{ padding: '1rem 0 0.5rem 0', position: 'relative' }}>
          {isSmallScreen && (
            <Box
              component="div"
              sx={{
                position: 'absolute',
                right: 0,
                pr: 2,
              }}
            >
              <IconButton size="large" onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ p: 1 }}>
                <ChevronLeft fontSize="medium" />
              </IconButton>
            </Box>
          )}
          {mainLogo && (
            <ListItemIcon
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box component="div">
                {sidebarOpen ? (
                  <img
                    src={mainLogo.fullLogo || ''}
                    alt="FullLogo"
                    style={{ width: '10rem', height: 'auto' }}
                  />
                ) : (
                  <Avatar
                    variant={mainLogo.variant || 'square'}
                    alt="Minilogo"
                    src={mainLogo.miniLogo}
                    sx={{ padding: '4px' }}
                  />
                )}
              </Box>
            </ListItemIcon>
          )}
        </List>

        {mainLogo && <Divider />}

        {/* Custom Header */}

        {sidebarOpen && customHeader}

        {!sidebarOpen && customHeaderCompact}

        {!isLoading ? (
          <MenuItems
            displayItems={itemsList ?? []}
            listType="body"
            iconOnly={iconOnly}
            onSelectItem={(...args) => {
              onSelectMenuItem(...args);
              if (isSmallScreen) setSidebarOpen(false);
            }}
            onHoverItem={onHoverMenuItem}
            selectedLink={selectedLink}
            listProps={{
              dense: isSmallScreen ? false : true,
              ...listProps,
            }}
            listStyle={{
              margin: '0',
              marginTop: isSmallScreen ? 'auto' : 1,
              marginBottom: 'auto',
              ...listStyle,
            }}
            mobile={isSmallScreen}
          />
        ) : (
          <List
            {...listProps}
            dense={isSmallScreen ? false : true}
            sx={{
              margin: '0',
              marginTop: isSmallScreen ? 'auto' : 1,
              marginBottom: 'auto',
              ...(listStyle || {}),
            }}
          >
            {Array.from({ length: Math.min(itemsList?.length || 6, 8) }).map((_, idx) => (
              <ListItem
                key={`skeleton-item-${idx}`}
                disableGutters
                sx={{ px: sidebarOpen ? 2 : 1 }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    paddingY: isSmallScreen ? 2 : iconOnly ? 0.8 : 0.5,
                  }}
                >
                  <Skeleton
                    variant={sidebarOpen ? 'circular' : 'rounded'}
                    width={22}
                    height={22}
                    animation="wave"
                  />
                </ListItemIcon>
                {sidebarOpen && (
                  <ListItemText
                    primary={<Skeleton variant="text" width={150} animation="wave" />}
                    sx={{ my: 0 }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        )}

        {brandLogo && (
          <List>
            <ListItemIcon
              sx={{
                display: 'flex',
                justifyContent: 'center',
                padding: '10px 0',
              }}
            >
              <Box component="div">
                {sidebarOpen ? (
                  <img
                    src={brandLogo.fullLogo || ''}
                    alt="FullLogo"
                    style={{ width: '10rem', height: 'auto' }}
                  />
                ) : (
                  <Avatar
                    variant={brandLogo.variant || 'square'}
                    alt="Minilogo"
                    src={brandLogo.miniLogo}
                  />
                )}
              </Box>
            </ListItemIcon>
          </List>
        )}

        <Divider />

        {footerData && (
          <SidebarFooter
            footerData={footerData}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onHoverItem={onHoverMenuItem}
            onSelectItem={(...args) => {
              onSelectMenuItem(...args);
              if (isSmallScreen) setSidebarOpen(false);
            }}
            mobile={isSmallScreen}
          />
        )}
      </Sidebar>
    </>
  );
}
