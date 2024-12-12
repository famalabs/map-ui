// import Box from "@mui/material/Box";
// import Drawer, { DrawerProps } from "@mui/material/Drawer";
// import Grid from "@mui/material/Grid2";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
// import CloseIcon from "@mui/icons-material/Close";
// import React, { useMemo } from "react";

// type CustomIcons = {
//   X: React.ComponentType<React.SVGProps<SVGSVGElement>>;
// };

// export interface ResponsiveDrawerProps extends DrawerProps {
//   children: React.ReactNode;
//   header?: React.ReactNode | string;
//   footer?: React.ReactNode;
//   useToolbar?: boolean; // assuming the toolbar is the standard 53px height
//   toolbarHeight?: number; // number height in px for toolbar height variations
//   customIcons?: CustomIcons;
// }

// export const ResponsiveDrawer = (props: ResponsiveDrawerProps) => {
//   const {
//     children,
//     useToolbar,
//     toolbarHeight = 53,
//     header,
//     footer,
//     onClose,
//     customIcons = {
//       X: CloseIcon,
//     } as CustomIcons,
//   } = props;

//   const { X } = customIcons;

//   const height = useToolbar ? (toolbarHeight + 24) : 24;
//   const calcHeight = `calc(100dvh - 8px - ${height}px)`;

//   const marginy = useToolbar ? (toolbarHeight + 8) : 8;
//   const calcMarginY = `calc(8px + ${marginy}px)`;

//   const DefaultHeader = useMemo(() => (
//     <Grid
//       container
//       size={12}
//       justifyContent='space-between'
//       alignItems='center'
//       p={2}
//     >

//       <Grid>
//         <Typography
//           fontSize={22}
//           fontWeight='light bold'
//           color="gray"
//         >
//           {header}
//         </Typography>
//       </Grid>

//       <Grid>
//         <IconButton
//           disableRipple
//           onClick={(event) => onClose?.(event, 'backdropClick')}
//         >
//           <X />
//         </IconButton>
//       </Grid>

//     </Grid>
//   ), [X, header, onClose]);

//   return (
//     <Drawer
//       PaperProps={{
//         sx: {
//           borderRadius: 1,
//           mx: '16px',
//           my: calcMarginY,
//           height: calcHeight,
//           scrollbarWidth: 'thin',
//         },
//       }}
//       {...props}
//     >

//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           flexGrow: 1,
//           overflow: 'hidden',
//         }}
//       >
//         <Box
//           component='header'
//           sx={{
//             backgroundColor: 'background.paper',
//             position: 'sticky',
//             top: 0,
//             width: '100%',
//             zIndex: 1,
//           }}
//         >
//           {typeof header === 'string' ? DefaultHeader : header}
//         </Box>

//         <Box
//           component='main'
//           sx={{
//             flexGrow: 1,
//             overflowY: 'auto',
//             overflowX: 'hidden',
//             scrollbarWidth: 'thin',
//           }}
//         >
//           {children}
//         </Box>

//         <Box
//           component='footer'
//           sx={{
//             backgroundColor: 'background.paper',
//             position: 'sticky',
//             bottom: 0,
//             width: '100%',
//             zIndex: 1,
//           }}
//         >
//           {footer}
//         </Box>
//       </Box>

//     </Drawer>
//   );
// };
