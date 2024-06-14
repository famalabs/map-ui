import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

export type MenuID = "body" | "footer" | string;
export interface MenuItemsProps<T extends Record<string, any>> {
  listType: MenuID;
  displayItems: T[];
  onSelectItem: (itemID: MenuID, title: string, link: string) => void;
  selectedLink?: string;
  listProps?: Record<string, any>;
  iconOnly?: boolean;
}

export function MenuItems<T extends Record<string, any>>(props: MenuItemsProps<T>) {

  const { displayItems, listType, onSelectItem, selectedLink, listProps, iconOnly = false } = props;

  return (
    <>
      <List sx={{ ...listProps }}>
        {displayItems.map((item, index) => (
          <ListItem
            key={`${item.title}-${index}`}
            component="div" 
            disablePadding
          >
            <ListItemButton
              sx={{
                ...(selectedLink === item.link && {
                  color: (theme) => theme.palette.primary.main,
                }),
              }}
              onClick={() => onSelectItem(listType, item.title, item.link)}
            >
              <ListItemIcon 
                sx={{ 
                  ...(selectedLink === item.link && {
                    color: (theme) => theme.palette.primary.main,
                  }),
                  minWidth: '32px' 
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!iconOnly && <ListItemText primary={item.title} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}
