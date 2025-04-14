import React from "react";
import moment from "moment";
import Grid from "@mui/material/Grid";

export const DateCell = (format = "DD/MM/yyyy") =>
  ({ cellValue }: { cellValue: string }) => {
    return (
      <Grid container>
        {cellValue ? moment(cellValue).format(format) : ''}
      </Grid>
    );
  };
