import React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
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
  avatar: {
    username: string;
    imageSrc: string;
  }
}

export interface SidebarFooterProps {
  footerData: FooterData;
  isSidebarOpen: boolean;
  onSelectItem: (itemID: string, title: string, link: string) => void;
}

export function SidebarFooter(props: SidebarFooterProps) {

  const {
    footerData: {
      itemsList,
      avatar
    },
    isSidebarOpen,
    onSelectItem,
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
          } />
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
        <Box
          sx={{ width: 260 }}
        >
          <Grid2
            container
            xs={12}
          >
            <Grid2 xs={12}>
              <MenuItems
                displayItems={itemsList ?? []}
                listType="footer"
                onSelectItem={(...args) => {
                  onSelectItem(...args);
                  handleClose();
                }}
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
