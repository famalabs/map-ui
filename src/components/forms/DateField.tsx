import { FormControl } from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import React from 'react';
import {
  Control,
  Controller,
  FieldPathValue,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';

export interface DateFieldProps<T extends FieldValues>
  extends Omit<DateTimePickerProps, 'name' | 'defaultValue' | 'variant' | 'error'> {
  name: Path<T>;
  control: Control<T>;
  defaultValue?: FieldPathValue<T, Path<T>>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  shouldUnregister?: boolean;
  legend?: boolean;
  fullWidth?: boolean;
  stringOnEmpty?: boolean;
}

export function DateField<T extends FieldValues>(props: DateFieldProps<T>) {
  const {
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
    legend = true,
    fullWidth = true,
    stringOnEmpty = false,
    ...datePickerProps
  } = props;

  const emptyValue = stringOnEmpty ? '' : null;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={datePickerProps.disabled}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState: { error } }) => (
        <FormControl
          fullWidth={fullWidth}
          sx={{
            margin: 'auto',
          }}
        >
          {legend && <FormLabel>{datePickerProps.label}</FormLabel>}
          <DateTimePicker
            views={['year', 'month', 'day']}
            format="DD/MM/YYYY HH:mm"
            {...datePickerProps}
            {...field}
            ref={field.ref}
            formatDensity="dense"
            value={field.value ? dayjs(field.value as string) : null}
            onChange={(date, context) => {
              if (context?.validationError) return;
              field.onChange(date ? date.toDate().toISOString() : emptyValue);
            }}
            onAccept={field.onBlur}
            slotProps={{
              ...datePickerProps.slotProps,
              textField: {
                label: !legend ? datePickerProps.label : '',
                error: Boolean(error),
                helperText: error?.message,
                onBlur: field.onBlur,
                ...datePickerProps.slotProps?.textField,
              },
            }}
          />
        </FormControl>
      )}
    />
  );
}
