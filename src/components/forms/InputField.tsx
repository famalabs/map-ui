import FormLabel from '@mui/material/FormLabel';
import TextField, { OutlinedTextFieldProps } from '@mui/material/TextField';
import React from 'react';
import {
  Control,
  Controller,
  FieldPathValue,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';

export interface InputFieldProps<T extends FieldValues>
  extends Omit<OutlinedTextFieldProps, 'name' | 'defaultValue' | 'variant' | 'error'> {
  name: Path<T>;
  control: Control<T>;
  defaultValue?: FieldPathValue<T, Path<T>>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  shouldUnregister?: boolean;
  legend?: boolean;
}

export function InputField<T extends FieldValues>(props: InputFieldProps<T>) {
  const {
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
    legend = true,
    ...textFieldProps
  } = props;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={textFieldProps.disabled}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState: { error } }) => {
        const isNumber = textFieldProps.type === 'number';
        return (
          <>
            {legend && <FormLabel component="legend">{textFieldProps.label}</FormLabel>}
            <TextField
              variant="outlined"
              fullWidth
              {...textFieldProps}
              label={!legend ? textFieldProps.label : ''}
              error={Boolean(error)}
              helperText={error?.message}
              slotProps={{
                ...textFieldProps.slotProps,
                htmlInput: {
                  ...textFieldProps.slotProps?.htmlInput,
                  ...(isNumber && {
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                  }),
                },
              }}
              {...field}
              disabled={field.disabled}
              value={field.value ?? null}
              onChange={(e) => {
                textFieldProps.onChange?.(e);
                if (isNumber) {
                  const v = (e.target as HTMLInputElement).value;
                  field.onChange(v === '' ? undefined : Number(v));
                } else {
                  field.onChange(e);
                }
              }}
            />
          </>
        );
      }}
    />
  );
}
