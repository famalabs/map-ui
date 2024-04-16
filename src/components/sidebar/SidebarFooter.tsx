import React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import MoreVertOutlined from "@mui/icons-material/MoreVertOutlined";
import { SidebarItem } from "./SidebarLayout";
import { MenuItems } from "../common/MenuItems";

export interface FooterData {
  itemsList: SidebarItem[];
  appTitle: string;
  avatar: {
    username: string;
    imageSrc: string;
  }
}

export interface SidebarFooterProps {
  footerData: FooterData;
  isSidebarOpen: boolean;
  onSelectItem: (itemID: string, link: string) => void;
}

export function SidebarFooter(props: SidebarFooterProps) {

  const {
    footerData: {
      itemsList,
      appTitle,
      avatar
    },
    isSidebarOpen,
    onSelectItem
  } = props;

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
        <ListItemButton
          aria-describedby={id}
          style={{ paddingLeft: 7 }}
          onClick={(event) => handleClick(event)}
        >
          <ListItemAvatar>
            <Avatar
              alt={avatar.username || ''}
              src={avatar.imageSrc || ''}
            >
              {avatar.username.toUpperCase().charAt(0) || 'User'}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={avatar.username || "User"} />
          {isSidebarOpen ? (
            <ListItemSecondaryAction style={{ zIndex: -1 }}>
              <IconButton edge="end" aria-label="delete">
                <MoreVertOutlined />
              </IconButton>
            </ListItemSecondaryAction>
          ) : null}
        </ListItemButton>
      </List>

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
        <Box style={{ height: 300, padding: 20, width: 260 }}>
          <Typography sx={{ padding: (theme) => theme.spacing(2) }}> {appTitle || 'App Title'} </Typography>
          <Divider />
          <Grid2 container style={{ marginTop: 10 }}>
            <Grid2 xs={12} md={12} lg={12}>
              <MenuItems
                displayItems={itemsList ?? []}
                listType="footer"
                onSelectItem={onSelectItem}
                listProps={{
                  margin: 'auto 0'
                }}
              />
            </Grid2>
          </Grid2>
        </Box>
      </Popover>
    </>
  );
}
