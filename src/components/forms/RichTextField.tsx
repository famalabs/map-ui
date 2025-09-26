import React from 'react';
import {
  Control,
  Controller,
  FieldPathValue,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { RichTextEditor, RichTextEditorProps } from './RichTextEditor';

export interface RichTextFieldProps<T extends FieldValues>
  extends Omit<RichTextEditorProps, 'name' | 'defaultValue'> {
  name: Path<T>;
  control: Control<T>;
  defaultValue?: FieldPathValue<T, Path<T>>;
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
  shouldUnregister?: boolean;
}

export function RichTextField<T extends FieldValues>(props: RichTextFieldProps<T>) {
  const { name, control, defaultValue, rules, shouldUnregister, ...richTextProps } = props;
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      disabled={richTextProps.disabled}
      rules={rules}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState: { error } }) => {
        return (
          <RichTextEditor
            {...richTextProps}
            {...field}
            value={field.value as string}
            error={Boolean(error)}
            errorMessage={error?.message}
          />
        );
      }}
    />
  );
}
