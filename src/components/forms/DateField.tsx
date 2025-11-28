import { FormControl, InputAdornment, SvgIconProps, TextFieldProps, useTheme } from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { CalendarFoldIcon, SparklesIcon } from 'lucide-react';
import React from 'react';
import {
  Control,
  Controller,
  FieldPathValue,
  FieldValues,
  Path,
  RegisterOptions,
  useWatch,
} from 'react-hook-form';
import { useIsAiDirty, useIsAiEditing } from './AiEditingContext';
import { aiEffectStyle } from './AiUtils';
import { InputField } from './InputField';

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

  const theme = useTheme();
  const emptyValue = stringOnEmpty ? '' : null;
  const isAiEditing = useIsAiEditing(name);
  const isDirtyAi = useIsAiDirty(name);

  const minDate: dayjs.Dayjs = datePickerProps.minDate ?? dayjs('1900-01-01');
  const maxDate: dayjs.Dayjs = datePickerProps.maxDate ?? dayjs('2099-12-31');
  const isWithinBounds = React.useCallback(
    (date: dayjs.Dayjs) => {
      return (
        (!minDate || date.isAfter(minDate) || date.isSame(minDate, 'day')) &&
        (!maxDate || date.isBefore(maxDate) || date.isSame(maxDate, 'day'))
      );
    },
    [minDate, maxDate],
  );

  const fieldValue = useWatch({ control, name });
  const [internalValue, setInternalValue] = React.useState<dayjs.Dayjs | null>(() => {
    if (fieldValue) {
      const date = dayjs(fieldValue as string);
      return date.isValid() && isWithinBounds(date) ? date : null;
    }
    return null;
  });

  if (fieldValue && !internalValue) {
    const date = dayjs(fieldValue as string);
    if (date.isValid() && isWithinBounds(date)) {
      setInternalValue(date);
    }
  }

  const handleOnAccept = React.useCallback(
    (date: dayjs.Dayjs | null, fieldOnChange: (value: any) => void, fieldOnBlur: () => void) => {
      if (!date || !date.isValid()) {
        fieldOnChange(emptyValue);
        fieldOnBlur();
        setInternalValue(null);
        return;
      }

      const isoString = date.toDate().toISOString();
      fieldOnChange(isoString);
      fieldOnBlur();
      setInternalValue(date);
    },
    [emptyValue],
  );

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={datePickerProps.disabled}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormControl
            fullWidth={fullWidth}
            sx={{
              margin: 'auto',
              position: 'relative',
            }}
          >
            {legend && <FormLabel>{datePickerProps.label}</FormLabel>}
            {!isAiEditing ? (
              <>
                <DateTimePicker
                  views={['year', 'month', 'day']}
                  format="DD/MM/YYYY HH:mm"
                  {...datePickerProps}
                  {...field}
                  ref={field.ref}
                  formatDensity="dense"
                  value={internalValue}
                  onChange={(date) => {
                    if (!date || !date.isValid() || !isWithinBounds(date)) {
                      setInternalValue(null);
                      return;
                    }
                    setInternalValue(date);
                  }}
                  minDate={minDate}
                  maxDate={maxDate}
                  enableAccessibleFieldDOMStructure={false}
                  onAccept={(date) => handleOnAccept(date, field.onChange, field.onBlur)}
                  slots={{
                    ...datePickerProps.slots,
                    openPickerIcon: CalendarFoldIcon,
                  }}
                  slotProps={{
                    openPickerIcon: {
                      color: theme.palette.action.active,
                      size:
                        (datePickerProps.slotProps?.textField as TextFieldProps)?.size === 'small'
                          ? 20
                          : 24,
                    } as SvgIconProps & { size?: number },
                    openPickerButton: {
                      size: (datePickerProps.slotProps?.textField as TextFieldProps)?.size,
                    },
                    ...datePickerProps.slotProps,
                    textField: {
                      label: !legend ? datePickerProps.label : '',
                      error: Boolean(error),
                      helperText: error?.message,
                      onBlur: field.onBlur,
                      ...datePickerProps.slotProps?.textField,
                      sx: {
                        ...(datePickerProps.slotProps?.textField as TextFieldProps)?.sx,
                        ...(isDirtyAi ? aiEffectStyle() : {}),
                      },
                    },
                  }}
                />
                {isDirtyAi && !isAiEditing && (
                  <InputAdornment
                    position="end"
                    sx={{ position: 'absolute', right: 45, top: '57%' }}
                  >
                    <SparklesIcon size={20} color="rgba(0,122,255,0.8)" />
                  </InputAdornment>
                )}
              </>
            ) : (
              <InputField
                name={name}
                control={control}
                size={(datePickerProps.slotProps?.textField as TextFieldProps)?.size || 'medium'}
                value={
                  field.value ? dayjs(field.value as string).format('DD/MM/YYYY HH:mm') : emptyValue
                }
                legend={false}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarFoldIcon
                          size={
                            (datePickerProps.slotProps?.textField as TextFieldProps)?.size ===
                            'small'
                              ? 20
                              : 24
                          }
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ ...aiEffectStyle(isAiEditing) }}
              />
            )}
          </FormControl>
        );
      }}
    />
  );
}
