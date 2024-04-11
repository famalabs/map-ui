import React, { useState, useEffect } from 'react';
import { Meta, Story } from '@storybook/react';
import { SidebarData, SidebarItem, SidebarLayout, SidebarLayoutProps } from '../../src/components/layout/sidebar/SidebarLayout';

export default {
  title: 'tables/SidebarTemplate',
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

  const SidebarPopulator = (prefix?: string): SidebarData => {

    const menuList: SidebarItem[] = [
      {
        title: 'Dashboard',
        link: '/dashboard',
        //icon: <ViewModuleIcon />
      },
      {
        title: 'Catalog',
        link: '/dashboard/catalog',
        //icon: <ViewModuleIcon />
      },
      {
        title: 'Brands',
        link: '/dashboard/brands',
        //icon: <ViewModuleIcon />
      },
      {
        title: 'Users',
        link: '/dashboard/users',
        //icon: <ViewModuleIcon />
      },
      {
        title: 'Settings',
        link: '/dashboard/settings',
        //icon: <ViewModuleIcon />
      }
    ];

    const popupList: SidebarItem[] = [
      {
        title: 'Profile',
        link: "user/profile",
        //icon: <ViewModuleIcon />
      },
      {
        title: 'Account',
        link: "user/account",
        //icon: <ViewModuleIcon />
      },
      {
        title: 'Preferences',
        link: "/preferences",
        //icon: <ViewModuleIcon />
      },
      {
        title: 'Logout',
        link: "/preferences/logout",
        //icon: <ViewModuleIcon />
      }
    ];


    return {
      genericData: menuList,
      footerData: popupList
    };
  }

  return (
    <>
      <SidebarLayout 
        renderData={SidebarPopulator()} 
        onSelectMenuItem={() => {}}
      >
        {args.children}
      </SidebarLayout>
    </>
  );
};