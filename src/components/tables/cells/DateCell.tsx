import React from "react";
import moment from "moment";
import Box from "@mui/material/Box";

export const DateCell =
  (format = "DD/MM/yyyy") =>
  ({ value }) => {
    if (typeof value === "undefined") return null;
    return <Box>{moment(value).format(format)}</Box>;
  };
