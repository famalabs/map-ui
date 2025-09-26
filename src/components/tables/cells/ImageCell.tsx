import React from "react";

export const ImageCell = (
  imgProps?: Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src">
) => (): React.ReactNode => {
  return (
      <img height="100px" alt='' {...imgProps} />
  );
};
