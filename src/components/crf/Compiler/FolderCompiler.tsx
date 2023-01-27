import { Box, Paper, Typography } from "@mui/material";
import { GroupMap } from "../../forms";
import React from "react";
import { IUseFormCompiler } from "./FormCompiler";
import { PageCompilerForm } from "./PageCompiler";

export interface FolderCompilerFormProps {
  formCompiler:IUseFormCompiler;
  loading:boolean;
}

export function FolderCompilerForm ({
  formCompiler,
  loading,
}:FolderCompilerFormProps) {
  const form = formCompiler.form;
  const nav = formCompiler.nav;
  const page = nav.getPage();

  console.log("render folder", page)
  return (
    <Box
    style={{width:'100%', minHeight: '70vh'}}
    >
    {page.layout.style === GroupMap.layout.style.card ? 
			(
				<Paper style={{width:'100%',padding:'24px', minWidth: '60vw'}}>
					<PageCompilerForm
          formCompiler={formCompiler}
          loading={loading}
          />
				</Paper>
			):(
				<Box style={{width:'100%',padding:'24px'}}>
					<PageCompilerForm
          formCompiler={formCompiler}
          loading={loading}
          />
				</Box>
			)
		}
  <Typography>{JSON.stringify(form.getValidObj(nav.getPageId()), null, 2)}</Typography>
    <Typography>{JSON.stringify(form.getValue(nav.getPageId()), null, 2)}</Typography>
    </Box>
  );
}