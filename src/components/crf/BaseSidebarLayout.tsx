import { AppBar, Box, Link, Paper, Typography } from "@mui/material";
import { SurveyItem } from "@src/core/schema";
import React from "react";
import { INavState, SurveyNav } from './Navigation';

export interface BaseSidebarLayoutProps {
    drawerWidth: number;
    root: SurveyItem;
    surveyNav: INavState;
    // folder:[string, number];
    // handleSetFolder:any;
    // page:[string, number];
    // handleSetPage:any;
}

export function BaseSidebarLayout ({
    drawerWidth,
    root,
    surveyNav
    // folder,
    // handleSetFolder,
    // page,
    // handleSetPage
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
                    {root.items.map((itm, idx) => (
                        <div key={itm.id}>
                        {/* <Link underline="hover" onClick={(e) => {handleSetFolder([itm.id,idx],[itm.items[0].id,0]); }}><Typography variant="h5">{itm.text}</Typography></Link> */}
                            <Link underline="hover" onClick={(e) => {surveyNav.setFolder(itm); }}><Typography variant="h5">{itm.text}</Typography></Link>
                            {itm.items.map((itm2, idx2) => (
                                <div key={itm2.id}>
                                    <Link underline="hover" onClick={(e) => {  surveyNav.setFolder(itm, itm2); }}><Typography>{itm2.text}</Typography></Link>
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