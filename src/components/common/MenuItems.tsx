import React from "react";
import List, { ListOwnProps } from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useTheme } from "@mui/material";

export type MenuID = "body" | "footer" | string;
export interface MenuItemsProps<T extends Record<string, any>> {
  listType: MenuID;
  displayItems: T[];
  onSelectItem: (itemID: MenuID, title: string, link: string) => void;
  selectedLink?: string;
  listProps?: ListOwnProps;
  listStyle?: Record<string, any>;
  iconOnly?: boolean;
}

export function MenuItems<T extends Record<string, any>>(props: MenuItemsProps<T>) {

  const { displayItems, listType, onSelectItem, selectedLink, listProps, listStyle, iconOnly = false } = props;

  const theme = useTheme();

  return (
    <>
      <List {...listProps} sx={{ ...listStyle }}>
        {displayItems.map((item, index) => (
          <ListItem
            key={`${item.title}-${index}`}
            component="div"
            disablePadding
          >
            <ListItemButton
              onClick={() => onSelectItem(listType, item.title, item.link)}
              sx={{
                ...(selectedLink === item.link && {
                  color: (theme) => theme.palette.primary.main,
                }),
                paddingInline: iconOnly ? 0 : 'auto',
                paddingY: 0.8,
                transition: `padding ${theme.transitions.easing.sharp} ${theme.transitions.duration.leavingScreen}ms`,
              }}
            >
              <ListItemIcon
                sx={{
                  ...(selectedLink === item.link && {
                    color: (theme) => theme.palette.primary.main,
                  }),
                  minWidth: '32px',
                  paddingLeft: '12px',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!iconOnly &&
                <ListItemText
                  primary={item.title}
                  sx={{ paddingInline: 1 }}
                />
              }
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}
