import React from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ItemData } from '../layout/sidebar/SidebarLayout';

export type MenuID = 'generic' | 'footer' | string;
export interface MenuItemsProps {
  displayItems: ItemData[];
  itemID: MenuID;
  onSelectItem: (itemID: MenuID, link: string) => void;
  selectedLink?: string;
}

export default function MenuItems({ displayItems = [], itemID, onSelectItem, selectedLink }: MenuItemsProps) {

  return (
    <List style={{ margin: 'auto 0' }}>
      {displayItems.map((item, index) => (

        <ListItemButton
          key={index}
          sx={{
            ...((selectedLink === item.link && {
              color: (theme) => theme.palette.primary.main
            }))
          }}
          onClick={() => onSelectItem(itemID, item.link as string)}
        >
          <ListItemIcon
            sx={{
              ...((selectedLink === item.link && {
                color: (theme) => theme.palette.primary.main
              }))
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItemButton>
      ))}
    </List>
  );
}