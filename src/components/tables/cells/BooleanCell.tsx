import React from 'react';
import Tooltip, {TooltipProps} from '@mui/material/Tooltip';
import SvgIcon from '@mui/material/SvgIcon';

export const BooleanCell = (tooltip?: (value: boolean) => string, tooltipProps?: Omit<TooltipProps, 'title' | 'children'>) => ({
                                                                                                                                 value
                                                                                                                               }) => {
  if (typeof value === 'undefined') return null;
  const DivTip: ({ children }: { children: TooltipProps['children'] }) => JSX.Element = tooltip
    ? ({ children }) => (
      <Tooltip title={tooltip(value)} {...tooltipProps}>
        {children}
      </Tooltip>
    )
    : ({ children }) => <>{children}</>;
  return (
    <DivTip>
      <div>{value ? <CheckIcon /> : <ErrorIcon />}</div>
    </DivTip>
  );
};

function CheckIcon(props) {
  return (
    <SvgIcon {...props} color="primary">
      <circle opacity="0.3" cx="12" cy="12" r="10" />
      <path
        d="M16.7689447,7.81768175 C17.1457787,7.41393107 17.7785676,7.39211077 18.1823183,7.76894473 C18.5860689,8.1457787 18.6078892,8.77856757 18.2310553,9.18231825 L11.2310553,16.6823183 C10.8654446,17.0740439 10.2560456,17.107974 9.84920863,16.7592566 L6.34920863,13.7592566 C5.92988278,13.3998345 5.88132125,12.7685345 6.2407434,12.3492086 C6.60016555,11.9298828 7.23146553,11.8813212 7.65079137,12.2407434 L10.4229928,14.616916 L16.7689447,7.81768175 Z"
        fillRule="nonzero"
      />
    </SvgIcon>
  );
}

function ErrorIcon(props) {
  return (
    <SvgIcon {...props} color="secondary">
      <circle opacity="0.3" cx="12" cy="12" r="10" />
      <path
        d="M12.0355339,10.6213203 L14.863961,7.79289322 C15.2544853,7.40236893 15.8876503,7.40236893 16.2781746,7.79289322 C16.6686989,8.18341751 16.6686989,8.81658249 16.2781746,9.20710678 L13.4497475,12.0355339 L16.2781746,14.863961 C16.6686989,15.2544853 16.6686989,15.8876503 16.2781746,16.2781746 C15.8876503,16.6686989 15.2544853,16.6686989 14.863961,16.2781746 L12.0355339,13.4497475 L9.20710678,16.2781746 C8.81658249,16.6686989 8.18341751,16.6686989 7.79289322,16.2781746 C7.40236893,15.8876503 7.40236893,15.2544853 7.79289322,14.863961 L10.6213203,12.0355339 L7.79289322,9.20710678 C7.40236893,8.81658249 7.40236893,8.18341751 7.79289322,7.79289322 C8.18341751,7.40236893 8.81658249,7.40236893 9.20710678,7.79289322 L12.0355339,10.6213203 Z" />
    </SvgIcon>
  );
}
