import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectProps } from '@mui/material/Select';
import { SparklesIcon } from 'lucide-react';
import React from 'react';
import {
  Control,
  Controller,
  FieldPathValue,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { useIsAiDirty, useIsAiEditing } from './AiEditingContext';
import { InputField } from './InputField';
import { aiEffectStyle, aiSelectSxEffect } from './AiUtils';

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

  const isAiEditing = useIsAiEditing(name);
  const isDirtyAi = useIsAiDirty(name);

  const getSelectedLabel = React.useCallback(
    (value: any): string => {
      let selectedLabel = '';
      React.Children.forEach(children, (child) => {
        if (
          React.isValidElement<{ value: any; children?: React.ReactNode }>(child) &&
          child.props.value === value
        ) {
          selectedLabel =
            typeof child.props.children === 'string' ? child.props.children : String(value);
        }
      });
      return selectedLabel || String(value);
    },
    [children],
  );

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
            {!isAiEditing ? (
              <FormControl
                fullWidth={selectProps.fullWidth ?? true}
                size={selectProps.size}
                sx={{ position: 'relative' }}
              >
                {!legend && <InputLabel id={`${name}-label`}> {selectProps.label} </InputLabel>}
                <Select
                  labelId={`${name}-label`}
                  variant="outlined"
                  {...selectProps}
                  label={!legend ? selectProps.label : ''}
                  error={Boolean(error)}
                  {...field}
                  disabled={field.disabled}
                  value={field.value ?? null}
                  sx={{
                    ...selectProps.sx,
                    ...(isDirtyAi ? aiSelectSxEffect(isAiEditing) : {}),
                  }}
                >
                  {children}
                </Select>
                {isDirtyAi && !isAiEditing && (
                  <InputAdornment
                    position="end"
                    sx={{
                      position: 'absolute',
                      right: 45,
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    <SparklesIcon size={20} color="rgba(0,122,255,0.8)" />
                  </InputAdornment>
                )}
              </FormControl>
            ) : (
              <InputField
                name={name}
                control={control}
                legend={false}
                value={getSelectedLabel(field.value)}
                size={selectProps.size}
                sx={{ ...aiEffectStyle(isAiEditing), pointerEvents: 'none' }}
              />
            )}
          </>
        );
      }}
    />
  );
}
