import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectProps } from '@mui/material/Select';
import React from 'react';
import {
  Control,
  Controller,
  FieldPathValue,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';

export interface SelectFieldProps<T extends FieldValues>
  extends Omit<SelectProps, 'name' | 'defaultValue' | 'variant' | 'error'> {
  name: Path<T>;
  control: Control<T>;
  defaultValue?: FieldPathValue<T, Path<T>>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  shouldUnregister?: boolean;
  legend?: boolean;
  children: React.ReactNode;
}

export function SelectField<T extends FieldValues>(props: SelectFieldProps<T>) {
  const {
    name,
    control,
    defaultValue,
    rules,
    shouldUnregister,
    legend = true,
    children,
    ...selectProps
  } = props;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={selectProps.disabled}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState: { error } }) => {
        return (
          <>
            {legend && <FormLabel> {selectProps.label} </FormLabel>}
            {!legend && <InputLabel id={`${name}-label`}> {selectProps.label} </InputLabel>}
            <FormControl fullWidth={selectProps.fullWidth ?? true}>
              <Select
                labelId={`${name}-label`}
                variant="outlined"
                {...selectProps}
                label={!legend ? selectProps.label : ''}
                error={Boolean(error)}
                {...field}
                disabled={field.disabled}
                value={field.value ?? null}
              >
                {children}
              </Select>
            </FormControl>
          </>
        );
      }}
    />
  );
}
