import React from 'react';
import { ButtonLoading } from '../../simple';

/*export interface SubmitButtonProps extends ButtonLoadingProps {
  validForm: boolean;
}*/

export const SubmitButton: React.VFC<any> = ({
                                                             label = 'Submit',
                                                             validForm,
                                                             variant = 'contained',
                                                             color = 'primary',
                                                             fullWidth = true,
                                                             ...props
                                                           }) => {

  return (
      <ButtonLoading
        loading={false} type="submit"
        label={label}
        fullWidth={fullWidth}
        variant={variant}
        color={color}
        sx={{
          margin: (theme) => theme.spacing(3, 0, 2),
          textTransform: 'uppercase'
        }}
        disabled={!validForm}
        {...props}      />
  );
};