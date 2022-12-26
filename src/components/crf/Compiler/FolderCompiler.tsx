import { Box, Paper, Typography } from "@mui/material";
import { GroupMap } from "../../../core/schema";
import React from "react";
import { IUseFormCompiler } from "./FormCompiler";
import { PageCompilerForm } from "./PageCompiler";

export interface FolderCompilerFormProps {
  formCompiler:IUseFormCompiler;
}

export function FolderCompilerForm ({
  formCompiler,
}:FolderCompilerFormProps) {
  const form = formCompiler.form;
  const nav = formCompiler.nav;
  const page = nav.getPage();

  console.log("render folder", page)
  return (
    <Box
    style={{width:'100%',margin:'24px 0px'}}
    >
    {page.layout.style === GroupMap.layout.style.card ? 
			(
				<Paper style={{width:'100%',padding:'24px'}}>
					<PageCompilerForm
          formCompiler={formCompiler}
          />
				</Paper>
			):(
				<Box style={{width:'100%',padding:'24px'}}>
					<PageCompilerForm
          formCompiler={formCompiler}
          />
				</Box>
			)
		}
    <Typography>{JSON.stringify(form.getValidObj(nav.getPageId()), null, 2)}</Typography>
    <Typography>{JSON.stringify(form.getValue(nav.getPageId()), null, 2)}</Typography>
    </Box>
  );
}