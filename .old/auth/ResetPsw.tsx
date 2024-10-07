import React from 'react';
import { useValidatorState } from '../validators';
import { AuthContainer, AuthForm, NewPswTextField, SubmitButton } from './common';

export interface ResetPswProps {
  onSubmit: (psw: string) => void;
  error?: string;
  loading: boolean;
  title?: string;
  newPswLabel?: string;
  confirmPswLabel?: string;
  submitButtonText?: string;
  emptyFieldText?: string;
  weakPswText?: string;
  shortPswText?: string;
  wrongConfirmPswText?: string;
}

export const ResetPsw: React.FC<ResetPswProps> = ({
                                                    onSubmit,
                                                    loading,
                                                    error,
                                                    title = 'Set New Password',
                                                    newPswLabel = 'New Password',
                                                    confirmPswLabel = 'Confirm Password',
                                                    submitButtonText = 'Change Password',
                                                    emptyFieldText = 'You cannot leave this field empty',
                                                    weakPswText = 'Password too weak',
                                                    shortPswText = 'Password too short',
                                                    wrongConfirmPswText = 'Password and confirmation password do not match'
                                                  }) => {
  const [psw, setPsw] = React.useState('');
  const [psw2, setPsw2] = React.useState('');
  const { allValid, setValid } = useValidatorState(['psw', 'psw2']);

  return (
    <AuthContainer error={error} title={title}>
      <AuthForm onSubmit={() => onSubmit(psw)}>
        <NewPswTextField
          value={psw}
          setValue={setPsw}
          setValid={setValid('psw')}
          label={newPswLabel}
          emptyMessage={emptyFieldText}
          weakPswText={weakPswText}
          shortPswText={shortPswText}
        />

        <NewPswTextField
          value={psw2}
          setValue={setPsw2}
          setValid={setValid('psw2')}
          confirm
          label={confirmPswLabel}
          emptyMessage={emptyFieldText}
          firstPsw={psw}
          wrongConfirmPswText={wrongConfirmPswText}
        />

        <SubmitButton loading={loading} validForm={allValid} label={submitButtonText} />
      </AuthForm>
    </AuthContainer>
  );
};
