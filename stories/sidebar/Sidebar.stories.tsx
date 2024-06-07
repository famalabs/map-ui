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
    /* {
      title: 'Preferences',
      link: "/preferences",
      icon: <ViewModuleIcon />
    },
    {
      title: 'Logout',
      link: "/preferences/logout",
      icon: <ViewModuleIcon />
    } */
  ];

  return (
    <>
      <SidebarLayout 
        itemsList={menuList}
        customHeader={
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span> TEST </span>
          </div>
        }
        mainLogo={{
          fullLogo: 'https://www.famalabs.com/svgs/fl-arrows-light.svg',
          miniLogo: ''
        }}
        brandLogo={{
          fullLogo: 'https://www.famalabs.com/svgs/fl-arrows-light.svg',
          miniLogo: ''
        }}
        onSelectMenuItem={(itemID, title, link) => console.log(itemID, title, link)}
        selectedLink="/dashboard"
        footerData={{
          itemsList: popupList,
          avatar: {
            username: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
            imageSrc: 'https://live.staticflickr.com/65535/52232153379_a96ddd1233_k.jpg'
          }
        }}
      >
        {args.children}
      </SidebarLayout>
    </>
  );
};