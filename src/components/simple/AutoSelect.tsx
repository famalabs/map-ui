import React from 'react';
import { TextField, TextFieldProps, Autocomplete, AutocompleteProps } from '@mui/material';
import { Theme } from '@mui/material';

export interface AutoSelectOption {
  id: string;
  label: string;
}

export interface AutoSelectProps<T extends string | string[] = string> {
  title: string;
  options: AutoSelectOption[] | string[];
  value?: T;
  onChange?: (id?: T) => void;
  autocompleteProps?: Omit<
    AutocompleteProps<any, any, any, any>,
    'value' | 'options' | 'onChange' | 'getOptionSelected' | 'freeSolo' | 'renderInput'
  >;
  textfieldProps?: Omit<TextFieldProps, 'label'>;
}

function isAutoSelectOption(obj: any): obj is AutoSelectOption {
  if (typeof obj?.id === 'string' && typeof obj?.label === 'string') return true;
  return false;
}

function isArray<T>(obj: any): obj is T[] {
  return Array.isArray(obj);
}

function isStringArray(array: any): array is string[] {
  if (typeof array?.length !== 'number') return false;
  if (array.length === 0) return true;
  return typeof array[0] === 'string';
}

export function AutoSelect<T extends string | string[]>({
  title,
  options,
  value,
  onChange,
  autocompleteProps,
  textfieldProps,
}: AutoSelectProps<T>) {
  if (options?.length && isStringArray(options)) options = options.map((opt) => ({ id: opt, label: opt }));
  const builtOptions: AutoSelectOption[] = React.useMemo(
    () =>
      !options?.length
        ? []
        : isStringArray(options)
        ? options.map((opt) => ({ id: opt, label: opt }))
        : options,
    [options]
  );
  const optionsMap: Record<string, AutoSelectOption> = React.useMemo(
    () => builtOptions.reduce((dict, opt) => ({ ...dict, [opt.id]: opt }), {}),
    [builtOptions]
  );
  const selectValue = React.useMemo(
    () =>
      autocompleteProps?.multiple
        ? isStringArray(value)
          ? value.map((v) => optionsMap[v])
          : []
        : !value
        ? null
        : typeof value === 'string'
        ? optionsMap[value]
        : null,
    [value, optionsMap]
  );

  return (
    <Autocomplete
      id={null}
      options={builtOptions}
      sx={{
        fontSize: 15,
        "& > span": {
          marginRight: 10,
          fontSize: 18,
        },
      }}
      freeSolo={false}
      autoHighlight
      blurOnSelect
      value={selectValue}
      onChange={(event, targetValue) => {
        if (onChange)
          if (isArray<AutoSelectOption>(targetValue)) onChange(targetValue.map((v) => v.id) as T);
          else if (isAutoSelectOption(targetValue)) onChange(targetValue.id as T);
      }}
      isOptionEqualToValue={(option, sel) =>
        isAutoSelectOption(sel) && isAutoSelectOption(option) ? option.id === sel.id : false
      }
      getOptionLabel={(option) => (isAutoSelectOption(option) ? option.label : '')}
      renderOption={(props, option, { selected }) => ( <span {...props}>{isAutoSelectOption(option) ? option.label : ''}</span>)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={title}
          variant="outlined"
          {...textfieldProps}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
            ...textfieldProps?.inputProps,
          }}
        />
      )}
      {...autocompleteProps}
    />
  );
}