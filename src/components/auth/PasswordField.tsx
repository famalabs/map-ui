import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import React from 'react';
import { styled, SxProps, Theme, useTheme } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const CardTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

const requirements = [
  { regex: /.{8,}/, label: 'Almeno 8 caratteri' },
  { regex: /[a-z]/, label: 'Almeno una lettera minuscola' },
  { regex: /[A-Z]/, label: 'Almeno una lettera maiuscola' },
  { regex: /\d/, label: 'Almeno un numero' },
  // { regex: /[@$!%*?&]/, label: 'Almeno un carattere speciale' },
];

type CustomIcons = {
  Eye: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  EyeOff: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  X: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  Check: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export interface PasswordFieldProps {
  title: string;
  name: string;
  placeholder?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  required?: boolean;
  requiredText?: string;
  margin?: 'none' | 'dense' | 'normal';
  errorText?: string;
  fullWidth?: boolean;
  showRequirements?: boolean;
  customIcons?: CustomIcons;
  sx?: SxProps<Theme>;
}

export const PasswordField = (props: PasswordFieldProps) => {
  const {
    title = 'Password',
    name = 'password',
    placeholder = 'Inserisci la password',
    variant = 'outlined',
    required = true,
    requiredText = 'Questo campo è obbligatorio',
    margin = 'dense',
    errorText = 'La password non è conforme',
    fullWidth = true,
    showRequirements = true,
    customIcons = {
      Eye: VisibilityIcon,
      EyeOff: VisibilityOffIcon,
      X: CloseIcon,
      Check: CheckIcon,
    } as CustomIcons,
    sx,
  } = props;

  const { Eye, EyeOff, X, Check } = customIcons;

  const theme = useTheme();
  const controlRegex = /^(?=.*[a-z])(?=.*\d).{8,}$/;

  const [password, setPassword] = React.useState<string>('');
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [passwordError, setPasswordError] = React.useState<string>('');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const RequirementsTooltip = React.useCallback(
    ({ passwordInput }: { passwordInput: string }) => {
      return (
        <Grid
          container
          direction="column"
          sx={{
            flexWrap: 'nowrap',
            justifyContent: 'center',
            alignItems: 'flex-start',
            p: 2,
            gap: 1,
          }}
        >
          {requirements.map((req, index) => (
            <Grid
              key={index}
              container
              sx={{
                flexWrap: 'nowrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Grid
                container
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {req.regex.test(passwordInput) ? (
                  <Check style={{ color: theme.palette.success.main }} />
                ) : (
                  <X style={{ color: theme.palette.error.main }} />
                )}
              </Grid>

              <Grid
                container
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="caption"
                  color={
                    req.regex.test(passwordInput)
                      ? theme.palette.success.main
                      : theme.palette.error.main
                  }
                >
                  {req.label}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      );
    },
    [Check, X, theme.palette.error.main, theme.palette.success.main],
  );

  const passwordRef = React.useRef<HTMLInputElement>(null);
  const isRegexValid = controlRegex.test(password);

  const isTooltipOpen = React.useMemo(
    () =>
      showRequirements &&
      passwordRef.current?.contains(document.activeElement) &&
      password.length > 0 &&
      !isRegexValid,
    [isRegexValid, password?.length, showRequirements],
  );

  return (
    <Grid size={12}>
      <FormLabel>{`${title}${required ? '*' : ''}`}</FormLabel>
      <CardTooltip
        title={<RequirementsTooltip passwordInput={password} />}
        placement="bottom-start"
        open={isTooltipOpen ?? false}
        onClose={() => passwordRef.current?.blur()}
        enterDelay={300}
      >
        <TextField
          ref={passwordRef}
          fullWidth={fullWidth}
          name={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          variant={variant}
          required={required}
          margin={margin}
          error={!!passwordError}
          helperText={passwordError}
          value={password}
          autoComplete={'off'}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={(e) => {
            if (!e.target.value && required) {
              setPasswordError(requiredText);
            } else if (!controlRegex.test(e.target.value)) {
              setPasswordError(errorText);
            }
          }}
          onChangeCapture={() => setPasswordError('')}
          sx={{
            ...sx,
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              '& fieldset': {
                borderWidth: '2px',
              },
            },
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    size="small"
                    focusRipple={false}
                    sx={{ mr: '-5px' }}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </CardTooltip>
    </Grid>
  );
};
