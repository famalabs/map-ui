import {
  Control,
  Controller,
  FieldPathValue,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { useIsAiEditing } from './AiEditingContext';
import { aiEffectStyle } from './AiUtils';
import { InputField } from './InputField';
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

  const isAiEditing = useIsAiEditing(name) ?? false;

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
          <>
            {!isAiEditing ? (
              <RichTextEditor
                {...richTextProps}
                {...field}
                value={field.value as string}
                error={Boolean(error)}
                errorMessage={error?.message}
              />
            ) : (
              <InputField
                name={name}
                control={control}
                label={richTextProps.title || ''}
                value={field.value}
                multiline
                minRows={4}
                sx={{
                  ...aiEffectStyle(isAiEditing),
                  bgcolor: 'background.paper',
                  pointerEvents: 'none',
                }}
              />
            )}
          </>
        );
      }}
    />
  );
}
