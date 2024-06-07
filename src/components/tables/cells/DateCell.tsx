import React from "react";
import moment from "moment";
import Grid2 from "@mui/material/Unstable_Grid2";

export const DateCell = (format = "DD/MM/yyyy") =>
  ({ cellValue }) => {
    return (
      <Grid2 container>
        {cellValue ? moment(cellValue).format(format) : ''}
      </Grid2>
    );
  };
