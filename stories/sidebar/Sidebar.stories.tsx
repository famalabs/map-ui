import React from 'react';
import Box from '@mui/material/Box';
import { Meta, StoryObj } from '@storybook/react';
import { SidebarItem, SidebarLayout, SidebarLayoutProps } from '../../src/components/sidebar';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

const meta: Meta<typeof SidebarLayout> = { component: SidebarLayout };
export default meta;

type Story = StoryObj<SidebarLayoutProps>;

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


export const SidebarLayoutTemplate: Story = {
  args : {
    itemsList: menuList,
    mainLogo: {
      fullLogo: 'https://www.famalabs.com/svgs/fl-arrows-light.svg',
      miniLogo: ''
    },
    brandLogo: {
      fullLogo: 'https://www.famalabs.com/svgs/fl-arrows-light.svg',
      miniLogo: ''
    },
    onSelectMenuItem: (itemID, title, link) => console.log(itemID, title, link),
    onHoverMenuItem: (itemID, title, link) => console.log(itemID, title, link),
    selectedLink: "/dashboard",
    listProps: {
      dense: true,
    },
    listStyle: {
      mx: '4px',
    },
    footerData: {
      itemsList: popupList,
      avatar: {
        username: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        imageSrc: 'https://live.staticflickr.com/65535/52232153379_a96ddd1233_k.jpg'
      },
      listProps: {
        dense: true,
      },
      listStyle: {
        mx: '4px',
      }
    }
  },

  render: (args) => {
    
    return (
        <SidebarLayout {...args}>
          <Box>
            {args.children}
          </Box>
        </SidebarLayout>
    );
  }

}