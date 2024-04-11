import React from "react";
import moment from "moment";
import Grid2 from "@mui/material/Unstable_Grid2";

export const DateCell = (format = "DD/MM/yyyy") =>
  ({ cellValue }) => {
    if (typeof cellValue === "undefined") return null;
    return <Grid2 container>{moment(cellValue).format(format)}</Grid2>;
  };
