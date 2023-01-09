import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import {Menu} from '@mui/icons-material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export interface DrawerCommonProps {
  sidebar:JSX.Element;
  content:JSX.Element;
  drawerWidth:number;
	title:string;
	// header:boolean;
}

export function DrawerCommon({
  sidebar,
  content,
  drawerWidth,
	title,
	// header,
	}: DrawerCommonProps) {
		
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
	setMobileOpen(!mobileOpen);
  };

  const drawer = (
	<div>
	  {/* <Toolbar />
	  <Divider /> */}
			{sidebar}
	</div>
  );

  // const container = window !== undefined ? () => window().document.body : undefined;
	const container = undefined;

  return (
	<Box sx={{ display: 'flex' }}>
	  <CssBaseline />
	  <AppBar
		position="fixed"
		sx={{
		  width: { sm: `calc(100% - ${drawerWidth}px)` },
		  ml: { sm: `${drawerWidth}px` },
		}}
	  >
		<Toolbar>
		  <IconButton
			color="inherit"
			aria-label="open drawer"
			edge="start"
			onClick={handleDrawerToggle}
			sx={{ mr: 2, display: { sm: 'none' } }}
		  >
			<Menu />
		  </IconButton>
		  <Typography variant="h6" noWrap component="div">
				{/* {title} */}
		  </Typography>
		</Toolbar>
	  </AppBar>
	  <Box
		component="nav"
		sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
		// sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
	  >
		{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
		<Drawer
		  container={container}
		  variant="temporary"
		  open={mobileOpen}
		  onClose={handleDrawerToggle}
		  ModalProps={{
			keepMounted: true, // Better open performance on mobile.
		  }}
		  sx={{
			display: { xs: 'block', sm: 'none' },
			'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
		  }}
		>
		  {drawer}
		</Drawer>
		<Drawer
		  variant="permanent"
		  sx={{
			display: { xs: 'none', sm: 'block' },
			'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
		  }}
		  open
		>
		  {drawer}
		</Drawer>
	  </Box>
	  <Box
		component="main"
		sx={{ flexGrow: 1, p: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
		// sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
	  >
		<Toolbar />
				{content}
	  </Box>
	</Box>
  );
}