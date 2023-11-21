import React from 'react';
import {
  FormControlProps,
} from '@mui/material/FormControl';
import { FormNodeType } from './useFormState';
import { InputString } from './InputString';


interface InputDateProps extends Partial<Omit<FormControlProps<any, 'div'>, 'title' | 'component' | 'error' | 'children'>> { 
    nameid: string;
    title?: string;
    // title?: React.ReactNode;
    value: string;
    // value: boolean;
    setValue: (value: string) => void;
    // setValue: (value: boolean) => void;
    setValid?: (valid: boolean) => void;
    emptyMessage?: string;
    required?: boolean;
    showError?: boolean;
}

export function InputDate({
  nameid,
  title,
  label,
  value,
  setValue,
  setValid,
  emptyMessage = 'Please select an option',
  required = true,
  showError = false,
  margin = 'normal',
  fullWidth = true,
  ...props
}: InputDateProps) {
  const [error, setError] = React.useState(required ? emptyMessage : '');

  const validate = React.useCallback(
    (input: FormNodeType): boolean => {
      if (required && (input === '' || input == null)) {
        setError(emptyMessage);
        return false;
      }

      setError('');
      return true;
    },
    [required, emptyMessage]
  );

//   const idxValue = React.useMemo(() => options.findIndex((opt) => opt.value === value), [value, options]);

  React.useEffect(() => {
    if (setValid) setValid(validate(value));
    else validate(value);
  }, [value, validate, setValid]);

  return (
        // <div>
        //   {title === '' ? null : <FormLabel component="legend">{title ?? nameid}</FormLabel>}
        //   <MobileDatePicker
        //       label={label}
        //       inputFormat="YYYYY-MM-DD"
        //       // inputFormat="MM/DD/YYYY"
        //       value={value}
        //       onChange={((value:boolean)=>console.log(value))}
        //       renderInput={(params) => <TextField {...params} helperText={showError ? error : ''}/>}
        //   />
        // </div>
        <InputString
            nameid={nameid}
            title={title}
            label={label}
            value={value}
            setValue={setValue}
            required={required}
            // required={item.options.required}
            emptyMessage={'empty message'}
            showError={showError}
            />
  );
}
