import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SidebarItem, SidebarLayout, SidebarLayoutProps } from '../../src/components/sidebar';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

export default {
  title: 'sidebar/SidebarTemplate',
  component: SidebarLayout,
  /* argTypes: {
    paginationOptions: { changeSize: 'action' },
    hideColumnAction: { action: 'hide' },
    onSingleRowClick: { action: 'clickRow' },
    setSelected: { action: 'select' },
    onAction: { action: 'onAction' },
  }, */
} as Meta<SidebarLayoutProps>;

export const SidebarTemplate: Story<SidebarLayoutProps> = (args) => {

  const menuList: SidebarItem[] = [
    {
      title: 'Dashboard',
      link: '/dashboard',
      icon: <ViewModuleIcon />
    },
    {
      title: 'Catalog',
      link: '/dashboard/catalog',
      icon: <ViewModuleIcon />
    },
    {
      title: 'Brands',
      link: '/dashboard/brands',
      icon: <ViewModuleIcon />
    },
    {
      title: 'Users',
      link: '/dashboard/users',
      icon: <ViewModuleIcon />
    },
    {
      title: 'Settings',
      link: '/dashboard/settings',
      icon: <ViewModuleIcon />
    }
  ];

  const popupList: SidebarItem[] = [
    {
      title: 'Profile',
      link: "user/profile",
      icon: <ViewModuleIcon />
    },
    {
      title: 'Account',
      link: "user/account",
      icon: <ViewModuleIcon />
    },
    {
      title: 'Preferences',
      link: "/preferences",
      icon: <ViewModuleIcon />
    },
    {
      title: 'Logout',
      link: "/preferences/logout",
      icon: <ViewModuleIcon />
    }
  ];

  return (
    <>
      <SidebarLayout 
        itemsList={menuList} 
        onSelectMenuItem={() => {}}
        selectedLink="/dashboard"
        footerData={{
          itemsList: popupList,
          appTitle: 'My App',
          avatar: {
            username: 'Tango',
            imageSrc: 'https://live.staticflickr.com/65535/52232153379_a96ddd1233_k.jpg'
          }
        }}
      >
        {args.children}
      </SidebarLayout>
    </>
  );
};