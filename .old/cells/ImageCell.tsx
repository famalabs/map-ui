import React from "react";
import { ColumnInterfaceBasedOnValue } from "react-table";

export const ImageCell =
  (src: (obj) => string, imgProps?: Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src">) =>
  ({ row }) => {
    return (
      <>
        <img src={src(row.original)} height="100px" {...imgProps} />
      </>
    );
  };
