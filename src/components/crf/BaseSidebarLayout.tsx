import { AppBar, Box, Link, Paper, Typography } from "@mui/material";
import { SurveyItem } from "@src/core/schema";
import React from "react";

export interface BaseSidebarLayoutProps {
    drawerWidth: number;
    root: SurveyItem;
    folder:string;
    handleSetFolder:any;
    page:string;
    handleSetPage:any;
}

export function BaseSidebarLayout ({
    drawerWidth,
    root,
    folder,
    handleSetFolder,
    page,
    handleSetPage
}: BaseSidebarLayoutProps) {

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
        >
            <Paper style={{padding:'24px'}}>
                <Typography variant="h3">{root.text}</Typography>
                {root.layout.style === 'multi_folder' ? (
                    <div>
                    {root.items.map((itm) => (
                        <div key={itm.id}>
                            <Link underline="hover" onClick={(e) => {handleSetFolder(itm.id); handleSetPage(itm.items[0].id); }}><Typography variant="h5">{itm.text}</Typography></Link>
                            {itm.items.map((itm2) => (
                                <div key={itm2.id}>
                                    <Link underline="hover" onClick={(e) => { handleSetFolder(itm.id); handleSetPage(itm2.id); }}><Typography>{itm2.text}</Typography></Link>
                                </div>
                            ))}
                        </div>
                    ))}
                    </div>
                ) : null}
            </Paper>
        </Box>
    );
}