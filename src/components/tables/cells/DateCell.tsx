import React from "react";
import moment from "moment";
import Grid from "@mui/material/Grid2";

export const DateCell = (format = "DD/MM/yyyy") =>
  ({ cellValue }) => {
    return (
      <Grid container>
        {cellValue ? moment(cellValue).format(format) : ''}
      </Grid>
    );
  };
