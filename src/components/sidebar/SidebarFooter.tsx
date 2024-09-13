import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { useTheme } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List, { ListOwnProps } from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";
import { MenuItems } from "../common/MenuItems";
import { SidebarItem } from "./SidebarLayout";
export interface FooterData {
  itemsList: SidebarItem[];
  avatar: {
    username: string;
    imageSrc: string;
  };
  listProps?: ListOwnProps;
  listStyle?: Record<string, any>;
}

export interface SidebarFooterProps {
  footerData: FooterData;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onSelectItem: (itemID: string, title: string, link: string) => void;
}

export function SidebarFooter(props: SidebarFooterProps) {

  const {
    footerData: {
      itemsList,
      avatar,
      listProps = {},
      listStyle = {},
    },
    sidebarOpen,
    setSidebarOpen,
    onSelectItem,
  } = props;

  const theme = useTheme();

  const [anchorElMenu, setAnchorElMenu] = React.useState(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElMenu(null);
  };

  const isPopupOpen = Boolean(anchorElMenu);
  const id = isPopupOpen ? "popover" : undefined;

  return (
    <>
      <List>
        <ListItem
          component={itemsList.length > 0 ? ListItemButton : 'div'}
          aria-describedby={id}
          onClick={(event) => handleClick(event)}
          sx={{ paddingInline: '12px', paddingRight: '32px' }}
        >
          <ListItemAvatar>
            <Avatar
              alt={avatar.username || ''}
              src={avatar.imageSrc || ''}
            />
          </ListItemAvatar>
          <ListItemText primary={
            <Typography
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              {avatar.username || 'User'}
            </Typography>
          }
          />
        </ListItem>
        <ListItemSecondaryAction>
          <IconButton
            edge='end'
            color='inherit'
            disableRipple
            onClick={() => setSidebarOpen(!sidebarOpen)}
            sx={{
              position: 'absolute',
              backgroundColor: theme.palette.background.paper,
              border: '1px solid rgba(0, 0, 0, 0.12)',
              borderRadius: '8px',
              padding: 0,
              right: sidebarOpen ? '5px' : '-15px',
              bottom: '-10px'
            }}
          >
            {sidebarOpen ? <ChevronLeft sx={{ fontSize: '0.8em' }} /> : <ChevronRight sx={{ fontSize: '0.8em' }} />}
          </IconButton>
        </ListItemSecondaryAction>
      </List>

      {itemsList.length > 0 &&
        <Popover
          id={id}
          open={isPopupOpen}
          anchorEl={anchorElMenu}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          elevation={6}
        >
          <Box
            sx={{ width: 260 }}
          >
            <Grid2
              container
              xs={12}
            >
              <Grid2 xs={12}>
                <MenuItems
                  displayItems={itemsList}
                  listType="footer"
                  onSelectItem={(...args) => {
                    onSelectItem(...args);
                    handleClose();
                  }}
                  listProps={listProps}
                  listStyle={{
                    margin: 'auto 0',
                    ...listStyle,
                  }}
                />
              </Grid2>
            </Grid2>
          </Box>
        </Popover>
      }
    </>
  );
}
