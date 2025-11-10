import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Meta, StoryObj } from '@storybook/react-vite';
import { SidebarItem, SidebarLayout, SidebarLayoutProps } from '../../src/components/sidebar';
import { LayoutGridIcon } from 'lucide-react';

const meta: Meta<typeof SidebarLayout> = { component: SidebarLayout };
export default meta;

type Story = StoryObj<SidebarLayoutProps>;

const menuList: SidebarItem[] = [
  {
    title: 'Dashboard',
    link: '/dashboard',
    icon: <LayoutGridIcon size={20} />,
  },
  {
    title: 'Catalog',
    link: '/dashboard/catalog',
    icon: <LayoutGridIcon size={20} />,
  },
  {
    title: 'Brands',
    link: '/dashboard/brands',
    icon: <LayoutGridIcon size={20} />,
  },
  {
    title: 'Users',
    link: '/dashboard/users',
    icon: <LayoutGridIcon size={20} />,
  },
  {
    title: 'Settings',
    link: '/dashboard/settings',
    icon: <LayoutGridIcon size={20} />,
  },
];

const popupList: SidebarItem[] = [
  {
    title: 'Profile',
    link: 'user/profile',
    icon: <LayoutGridIcon size={20} />,
  },
  {
    title: 'Account',
    link: 'user/account',
    icon: <LayoutGridIcon size={20} />,
  },
  {
    title: 'Preferences',
    link: '/preferences',
    icon: <LayoutGridIcon size={20} />,
  },
  {
    title: 'Logout',
    link: '/preferences/logout',
    icon: <LayoutGridIcon size={20} />,
  },
];

export const SidebarLayoutTemplate: Story = {
  args: {
    itemsList: menuList,
    mainLogo: {
      fullLogo: 'https://www.famalabs.com/svgs/fl-arrows-light.svg',
      miniLogo: '',
    },
    brandLogo: {
      fullLogo: 'https://www.famalabs.com/svgs/fl-arrows-light.svg',
      miniLogo: '',
    },
    onSelectMenuItem: (itemID, title, link) => console.log(itemID, title, link),
    onHoverMenuItem: (itemID, title, link) => console.log(itemID, title, link),
    selectedLink: '/dashboard/catalog/1',
    // listProps: {
    //   dense: true,
    // },
    isLoading: false,
    listStyle: {
      mx: '4px',
    },
    footerData: {
      itemsList: popupList,
      avatar: {
        username: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        imageSrc: 'https://live.staticflickr.com/65535/52232153379_a96ddd1233_k.jpg',
      },
      listProps: {
        dense: true,
      },
      listStyle: {
        mx: '4px',
      },
    },
  },

  render: (args) => {
    return (
      <SidebarLayout {...args}>
        <Grid container size={12} justifyContent="center" alignContent="center" height="100dvh">
          <Button variant="contained" color="primary">
            Click Me
          </Button>
        </Grid>
      </SidebarLayout>
    );
  },
};
