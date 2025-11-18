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
  useWatch,
} from 'react-hook-form';
import { useIsAiDirty } from './AiEditingContext';
import { useIsAiEditing, useTypewriterSpeed } from './AiEditingContext';
import { aiEffectStyle, useTypewriter } from './AiUtils';

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
  const typewriterSpeed = useTypewriterSpeed();

  const fieldValue = useWatch({ control, name });
  const actualValue = textFieldProps.value ?? fieldValue;

  const typewriterText = useTypewriter(
    isAiEditing && typeof actualValue === 'string' ? actualValue : '',
    isAiEditing ? typewriterSpeed : 0,
  );

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
              value={isAiEditing ? typewriterText : fieldValue ?? null}
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
                ...(isDirtyAi || isAiEditing ? aiEffectStyle(isAiEditing) : {}),
              }}
            />
          </>
        );
      }}
    />
  );
}
