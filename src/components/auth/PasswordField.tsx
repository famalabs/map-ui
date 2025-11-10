import { styled, SxProps, Theme, useTheme } from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { CheckIcon, EyeClosedIcon, EyeIcon, LucideProps, XIcon } from 'lucide-react';
import React from 'react';

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
  Eye: React.ComponentType<React.SVGProps<SVGSVGElement> & Omit<LucideProps, 'ref'>>;
  EyeOff: React.ComponentType<React.SVGProps<SVGSVGElement> & Omit<LucideProps, 'ref'>>;
  X: React.ComponentType<React.SVGProps<SVGSVGElement> & Omit<LucideProps, 'ref'>>;
  Check: React.ComponentType<React.SVGProps<SVGSVGElement> & Omit<LucideProps, 'ref'>>;
};

export interface PasswordFieldProps {
  title: string;
  name: string;
  placeholder?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  required?: boolean;
  requiredText?: string;
  margin?: 'none' | 'dense' | 'normal';
  size?: 'small' | 'medium';
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
    size = 'medium',
    errorText = 'La password non è conforme',
    fullWidth = true,
    showRequirements = true,
    customIcons = {
      Eye: EyeIcon,
      EyeOff: EyeClosedIcon,
      X: XIcon,
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
    (passwordInput: string) => {
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
                  <Check size={18} style={{ color: theme.palette.success.main }} />
                ) : (
                  <X size={18} style={{ color: theme.palette.error.main }} />
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
    () => showRequirements && password.length > 0 && !isRegexValid,
    [isRegexValid, password?.length, showRequirements],
  );

  return (
    <Grid size={12}>
      <FormLabel>{`${title}${required ? '*' : ''}`}</FormLabel>
      <CardTooltip
        title={RequirementsTooltip(password)}
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
          size={size}
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
                    {showPassword ? (
                      <EyeOff size={size === 'small' ? 18 : 24} />
                    ) : (
                      <Eye size={size === 'small' ? 18 : 24} />
                    )}
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
