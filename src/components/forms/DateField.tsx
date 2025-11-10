import { FormControl, InputAdornment, SvgIconProps, TextFieldProps, useTheme } from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import {
  Control,
  Controller,
  FieldPathValue,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { aiSxEffect, InputField } from './InputField';
import { CalendarFoldIcon, SparklesIcon } from 'lucide-react';
import { useIsAiDirty, useIsAiEditing } from './AiEditingContext';

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
                value={field.value ? dayjs(field.value as string) : null}
                onChange={(date, context) => {
                  if (context?.validationError) return;
                  if (!date || !date.isValid()) return;
                  field.onChange(date.toDate().toISOString());
                }}
                enableAccessibleFieldDOMStructure={false}
                onAccept={(date) => {
                  field.onChange(date && date.isValid() ? date.toDate().toISOString() : emptyValue);
                  field.onBlur();
                }}
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
                      ...(isDirtyAi ? aiSxEffect() : {}),
                    },
                  },
                }}
              />
              {isDirtyAi && !isAiEditing && (
                <InputAdornment position="end" sx={{ position: 'absolute', right: 45, top: '57%' }}>
                  <SparklesIcon size={20} color="rgba(0,122,255,0.8)" />
                </InputAdornment>
              )}
            </>
          ) : (
            <InputField
              name={name}
              control={control}
              size={(datePickerProps.slotProps?.textField as TextFieldProps)?.size || 'medium'}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarFoldIcon
                        size={
                          (datePickerProps.slotProps?.textField as TextFieldProps)?.size === 'small'
                            ? 20
                            : 24
                        }
                      />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ ...aiSxEffect(isAiEditing) }}
            />
          )}
        </FormControl>
      )}
    />
  );
}
