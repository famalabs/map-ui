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
import { aiSxEffect, InputField } from './InputField';
import InputAdornment from '@mui/material/InputAdornment';
import { SparklesIcon } from 'lucide-react';
import { useIsAiDirty, useIsAiEditing } from './AiEditingContext';

export const aiSelectSxEffect = (animate = false) => {
  const staticStyle = {
    border: '2px solid',
    borderColor: 'rgba(0,122,255,0.3)',
    transition: 'border-color 0.3s ease',
    boxShadow: '0 0 12px rgba(0, 122, 255, 0.3), inset 0 0 0 1px rgba(0,122,255,0.5)',
  };

  const animationStyle = {
    pointerEvents: 'none',
    userSelect: 'none',
    transition: 'border-color 0.3s ease',
    boxShadow: '0 0 16px rgba(0, 122, 255, 0.5), inset 0 0 0 1px rgba(0,122,255,0.6)',
    '& fieldset': {
      border: '2px solid',
      borderRadius: 4,
      borderColor: 'rgba(0,122,255,0.8)',
      boxShadow: '0 0 12px rgba(0, 122, 255, 0.3), inset 0 0 0 1px rgba(0,122,255,0.5)',
      animation: 'glowPulse 1.6s ease-in-out infinite',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0,122,255,0.5)',
    },
  };

  return {
    '& .MuiInputBase-input': {
      ...(animate ? animationStyle : staticStyle),
      '&:focus': {
        ...(animate ? animationStyle : staticStyle),
      },
      '&:hover': {
        borderColor: 'rgba(0,122,255,0.5)',
      },
    },
    '& fieldset': {
      border: 'none',
    },
    '@keyframes glowPulse': {
      '0%': {
        boxShadow: '0 0 6px rgba(0,122,255,0.3)',
      },
      '50%': {
        boxShadow: '0 0 12px rgba(0,122,255,0.6)',
      },
      '100%': {
        boxShadow: '0 0 6px rgba(0,122,255,0.3)',
      },
    },
  };
};

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
            {!isAiEditing ? (
              <FormControl fullWidth={selectProps.fullWidth ?? true} sx={{ position: 'relative' }}>
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
                value={field.value}
                sx={{ ...aiSxEffect(isAiEditing), pointerEvents: 'none' }}
              />
            )}
          </>
        );
      }}
    />
  );
}
