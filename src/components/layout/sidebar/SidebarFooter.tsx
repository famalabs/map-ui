import React from "react";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import { HomeIcon } from "../../icons/stockholm";
import { MoreVertOutlined } from "@mui/icons-material";

import MenuItems from "@src/components/common/MenuItems";
import { ItemData } from "@src/components/layout/sidebar/SidebarLayout";

interface SidebarFooterProps {
  popupItems: ItemData[];
  isSidebarOpen: boolean;
  onSelectItem: (itemID: string, link: string) => void;
}

export default function SidebarFooterComponent({
  popupItems = [],
  isSidebarOpen,
  onSelectItem,
}: SidebarFooterProps) {
  const [anchorElMenu, setAnchorElMenu] = React.useState(null);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElMenu(null);
  };

  // ADD STATE MANAGER SELECTORS
  const user = { username: "User" };

  const isPopupOpen = Boolean(anchorElMenu);
  const id = isPopupOpen ? "popover" : undefined;

  return (
    <>
      <List>
        <MenuItems
          displayItems={[
            {
              title: "Home",
              link: "/",
              icon: <HomeIcon />,
            },
          ]}
          itemID="footer"
          onSelectItem={onSelectItem}
        />

        <a onClick={(event) => handleClick(event)}>
          <ListItemButton aria-describedby={id} style={{ paddingLeft: 7 }}>
            <ListItemAvatar>
              <Avatar>{user?.username.toUpperCase().charAt(0) || null}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={user?.username || "User"} />
            {isSidebarOpen ? (
              <ListItemSecondaryAction style={{ zIndex: -1 }}>
                <IconButton edge="end" aria-label="delete">
                  <MoreVertOutlined />
                </IconButton>
              </ListItemSecondaryAction>
            ) : null}
          </ListItemButton>
        </a>
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
          {/** Needs to have custom page info instead of Map */}
          <Typography sx={{ padding: (theme) => theme.spacing(2) }}>Map</Typography>
          <Divider />
          <Grid container style={{ marginTop: 10 }}>
            <Grid item xs={12} md={12} lg={12}>
              <MenuItems displayItems={popupItems} itemID="footer" onSelectItem={onSelectItem} />
            </Grid>
          </Grid>
        </Box>
      </Popover>
    </>
  );
}
