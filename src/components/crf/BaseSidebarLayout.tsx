import { AppBar, Box, Paper, Typography } from "@mui/material";
import { SurveyItem } from "@src/core/schema";
import React from "react";

export interface BaseSidebarLayoutProps {
    drawerWidth: number;
    root: SurveyItem;
    setFolder:any;
    setPage:any;
}

export function BaseSidebarLayout ({
    drawerWidth,
    root,
    setFolder,
    setPage
}: BaseSidebarLayoutProps) {

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
        >
            <Paper style={{margin:'24px',padding:'24px'}}>
                <Typography variant="h3">{root.text}</Typography>
                {root.layout.style === 'multi_folder' ? (
                    <div>
                    {root.items.map((itm) => (
                        <div key={itm.id}>
                            <Typography variant="h4" onClick={(e) => setFolder(itm.id)}>{itm.text}</Typography>
                            {itm.items.map((itm2) => (
                                <div key={itm2.id}>
                                    <Typography variant="h5" onClick={(e) => { setFolder(itm.id); setPage(itm2.id); }}>{itm2.text}</Typography>
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