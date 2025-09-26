import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import {
  Control,
  Controller,
  FieldPathValue,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import React from 'react';

export interface AutocompleteFieldProps<
  T extends FieldValues,
  Option,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
> extends Omit<
    AutocompleteProps<Option, Multiple, DisableClearable, FreeSolo>,
    'renderInput' | 'onChange' | 'defaultValue'
  > {
  name: Path<T>;
  control: Control<T>;
  defaultValue?: FieldPathValue<T, Path<T>>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  shouldUnregister?: boolean;
  legend?: boolean;
  label?: string;
  textFieldProps?: Omit<TextFieldProps, 'label' | 'error' | 'helperText'>;
  onChange?: AutocompleteProps<Option, Multiple, DisableClearable, FreeSolo>['onChange'];
}

export function AutocompleteField<
  T extends FieldValues,
  Option,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
>(props: AutocompleteFieldProps<T, Option, Multiple, DisableClearable, FreeSolo>) {
  const {
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
    legend = true,
    label,
    textFieldProps,
    onChange,
    ...autoProps
  } = props as AutocompleteFieldProps<T, Option, any, any, any>;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={autoProps.disabled}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState: { error } }) => {
        const multiple = Boolean(autoProps.multiple);
        const controlledValue =
          autoProps.value ??
          (multiple
            ? ([] as unknown as Option[])
            : field.value || (null as unknown as Option | null));

        return (
          <>
            {legend && <FormLabel component="legend">{label}</FormLabel>}
            <FormControl fullWidth={autoProps.fullWidth} style={{ marginTop: 0 }}>
              <Autocomplete<Option, any, any, any>
                {...autoProps}
                value={
                  controlledValue as Option | (string | Option)[] | NonNullable<string | Option>[]
                }
                onChange={(event, newValue, reason, details) => {
                  if (onChange) {
                    onChange(event, newValue, reason, details);
                  } else {
                    field.onChange(newValue);
                  }
                }}
                onBlur={field.onBlur}
                disabled={field.disabled}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={!legend ? label : ''}
                    error={Boolean(error)}
                    helperText={error?.message}
                    {...textFieldProps}
                  />
                )}
              />
            </FormControl>
          </>
        );
      }}
    />
  );
}
