import { Box, Paper } from "@mui/material";
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
  return (
    <Box
    style={{width:'100%'}}
    >
    {page.layout.style === GroupMap.layout.style.card ? 
			(
				<Paper style={{padding:'24px',margin:'24px 0px',width:'100%'}}>
					<PageCompilerForm
          formCompiler={formCompiler}
          />
				</Paper>
			):(
				<Box style={{padding:'24px',margin:'24px 0px',width:'100%'}}>
					<PageCompilerForm
          formCompiler={formCompiler}
          />
				</Box>
			)
		}
    </Box>
  );
}