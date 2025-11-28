import React from 'react';

export const ImageCell = (imgProps?: Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'>) => {
  const Renderer = ({ cellValue }: { cellValue?: string }): React.ReactNode => {
    return <img src={cellValue ?? ''} height="100px" alt="" {...imgProps} />;
  };
  Renderer.displayName = 'ImageCell';
  return Renderer;
};
