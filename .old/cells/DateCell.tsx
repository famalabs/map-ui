import Box from '@mui/material/Box';
import dayjs from 'dayjs';

export const DateCell =
  (format = 'DD/MM/yyyy') =>
  ({ value }) => {
    if (typeof value === 'undefined') return null;
    return <Box>{dayjs(value).format(format)}</Box>;
  };
