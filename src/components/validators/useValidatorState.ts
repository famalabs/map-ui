import React from 'react';

/**
 * Use this hook only when using more validators in the same form, to keeps things short
 */
export default function useValidatorState<T extends string>(names: T[]) {
  const [validState, setValidState] = React.useState<{ [idx: string]: boolean }>(
    names.reduce((acc, name) => ({ ...acc, [name]: false }), {})
  );

  const valid = React.useMemo(() => names.map((name) => validState[name]).every((value) => value), [
    validState,
  ]);

  const setSingleState = (name: any) => (value: boolean) => {
    if (validState[name] !== value) setValidState((prevState) => ({ ...prevState, [name]: value }));
  };

  return {
    allValid: valid,
    setValid: setSingleState,
  };
}
