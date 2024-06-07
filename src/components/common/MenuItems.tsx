import React from "react";
import List from "@mui/material/List";
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
}

export function MenuItems<T extends Record<string, any>>(props: MenuItemsProps<T>) {

  const { displayItems, listType, onSelectItem, selectedLink, listProps } = props;

  return (
    <>
      <List sx={{...listProps}}>
        {displayItems.map((item, index) => (
          <ListItemButton
            key={index}
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
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItemButton>
        ))}
      </List>
    </>
  );
}
