import React from "react";

export const ImageCell = (
  imgProps?: Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src">
) => ({ cellValue }) => {
  return (
      <img height="100px" {...imgProps} />
  );
};
