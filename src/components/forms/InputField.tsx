import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { OutlinedTextFieldProps } from '@mui/material/TextField';
import { SparklesIcon } from 'lucide-react';
import {
  Control,
  Controller,
  FieldPathValue,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { useIsAiDirty } from './AiEditingContext';
import { useIsAiEditing } from './AiEditingContext';

export const aiSxEffect = (animate = false) => {
  const staticStyle = {
    '& fieldset': {
      border: '2px solid',
      borderColor: 'rgba(0,122,255,0.3)',
      transition: 'border-color 0.3s ease',
      boxShadow: '0 0 12px rgba(0, 122, 255, 0.3), inset 0 0 0 1px rgba(0,122,255,0.5)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0,122,255,0.5)',
    },
  };

  const animationStyle = {
    pointerEvents: 'none',
    userSelect: 'none',
    transition: 'border-color 0.3s ease',
    boxShadow: '0 0 16px rgba(0, 122, 255, 0.5), inset 0 0 0 1px rgba(0,122,255,0.6)',
    '& fieldset': {
      border: '2px solid',
      borderColor: 'rgba(0,122,255,0.8)',
      boxShadow: '0 0 12px rgba(0, 122, 255, 0.3), inset 0 0 0 1px rgba(0,122,255,0.5)',
      animation: 'glowPulse 1.6s ease-in-out infinite',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0,122,255,0.5)',
    },
  };

  return {
    '& .MuiOutlinedInput-root': {
      transition: 'all 0.3s ease',
      ...(animate ? animationStyle : staticStyle),
      '&.Mui-focused': {
        ...(animate ? animationStyle : staticStyle),
      },
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

  const isAiEditing = useIsAiEditing(name);
  const isDirtyAi = useIsAiDirty(name);

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
                input: {
                  endAdornment: isDirtyAi && !isAiEditing && (
                    <InputAdornment position="end">
                      <SparklesIcon size={20} color="rgba(0,122,255,0.8)" />
                    </InputAdornment>
                  ),
                  ...textFieldProps.slotProps?.input,
                },
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
              onBlur={(e) => {
                field.onBlur();
                textFieldProps.onBlur?.(e);
              }}
              onChange={(e) => {
                textFieldProps.onChange?.(e);
                if (isNumber) {
                  const v = (e.target as HTMLInputElement).value;
                  field.onChange(v === '' ? undefined : Number(v));
                } else {
                  field.onChange(e);
                }
              }}
              sx={{
                ...textFieldProps.sx,
                ...(isDirtyAi || isAiEditing ? aiSxEffect(isAiEditing) : {}),
              }}
            />
          </>
        );
      }}
    />
  );
}
