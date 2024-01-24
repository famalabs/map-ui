import React from "react";
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

export type MenuID = "generic" | "footer" | string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface MenuItemsProps<T extends Record<string, any>> {
  displayItems: T[];
  itemID: MenuID;
  onSelectItem: (itemID: MenuID, link: string) => void;
  selectedLink?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MenuItems<T extends Record<string, any>>({
  displayItems,
  itemID,
  onSelectItem,
  selectedLink,
}: MenuItemsProps<T>) {

  return (
    <>
      <List style={{ margin: "auto 0" }}>
        {displayItems.map((item, index) => (
          <ListItemButton
            key={index}
            sx={{
              ...(selectedLink === item.link && {
                color: (theme) => theme.palette.primary.main,
              }),
            }}
            onClick={() => onSelectItem(itemID, item.link as string)}
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
