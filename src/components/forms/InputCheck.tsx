// import React from 'react';
// import {
//   FormControl,
//   FormControlProps,
//   FormControlTypeMap,
//   FormLabel,
//   FormControlLabel,
//   FormHelperText,
//   Checkbox,
//   FormGroup,
// } from '@mui/material';
// import { FormNodeType } from './useFormState';


// interface InputCheckProps extends Partial<Omit<FormControlProps<any, 'div'>, 'title' | 'component' | 'error' | 'children'>> { 
//     nameid: string;
//     title?: React.ReactNode;
//     value: boolean;
//     setValue: (value: boolean) => void;
//     setValid?: (valid: boolean) => void;
//     emptyMessage?: string;
//     required?: boolean;
//     showError?: boolean;
// }

// export function InputCheck({
//   nameid,
//   title,
//   value,
//   setValue,
//   setValid,
//   emptyMessage = 'Please select an option',
//   required = true,
//   showError = false,
//   margin = 'normal',
//   fullWidth = true,
//   ...props
// }: InputCheckProps) {
//   const [error, setError] = React.useState(required ? emptyMessage : '');

//   const validate = React.useCallback(
//     (input: FormNodeType): boolean => {
//       if (required && (input === '' || input == null)) {
//         setError(emptyMessage);
//         return false;
//       }

//       setError('');
//       return true;
//     },
//     [required, emptyMessage]
//   );

// //   const idxValue = React.useMemo(() => options.findIndex((opt) => opt.value === value), [value, options]);

//   React.useEffect(() => {
//     if (setValid) setValid(validate(value));
//     else validate(value);
//   }, [value, validate, setValid]);

//   return (
//     // <FormControlLabel control={<Checkbox defaultChecked />} label={title} /> 
//     // <FormControl
//     //   component="fieldset"
//     //   error={showError && !!error}
//     //   margin={margin}
//     //   fullWidth={fullWidth}
//     //   {...props}
//     // >
//     //   {title === '' ? null : <FormLabel component="legend">{title ?? nameid}</FormLabel>}
//     //   <RadioGroup
//     //     name={nameid}
//     //     aria-label={nameid}
//     //     value={idxValue}
//     //     onChange={(e, v) => {
//     //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     //       // @ts-ignore
//     //       setValue(options[v].value);
//     //     }}
//     //   >
//     //     {options.map((opt, idx) => (
//     //       <FormControlLabel key={idx} value={idx} control={<Radio />} label={opt.label} />
//     //     ))}
//     //   </RadioGroup>
//     //   <FormHelperText>{showError ? error : ''}</FormHelperText>
//     // </FormControl>
//   null);
// }
