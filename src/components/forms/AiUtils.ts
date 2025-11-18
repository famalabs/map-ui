import React from "react";

export const useTypewriter = (text: string, speed = 20) => {
  const [displayText, setDisplayText] = React.useState<string>('');
  const textRef = React.useRef<string>(text);

  React.useEffect(() => {
    if (textRef.current !== text) {
      textRef.current = text;
      setDisplayText('');
    }
  }, [text]);

  React.useEffect(() => {
    if (speed <= 0) {
      setDisplayText(text);
      return;
    }

    if (displayText.length >= text.length) return;

    const timeoutId = setTimeout(() => {
      setDisplayText(text.slice(0, displayText.length + 1));
    }, speed);

    return () => clearTimeout(timeoutId);
  }, [displayText, text, speed]);

  return displayText;
};

export const aiEffectStyle = (animate = false) => {
  const staticStyle = {
    '& fieldset': {
      border: '2px solid',
      borderColor: 'rgba(0,122,255,0.3)',
      transition: 'border-color 0.3s ease',
      boxShadow: '0 0 12px rgba(0, 122, 255, 0.3), inset 0 0 0 1px rgba(0,122,255,0.5)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0,122,255,0.5)',
    },
  };

  const animationStyle = {
    pointerEvents: 'none',
    userSelect: 'none',
    transition: 'border-color 0.3s ease',
    boxShadow: '0 0 16px rgba(0, 122, 255, 0.5), inset 0 0 0 1px rgba(0,122,255,0.6)',
    '& fieldset': {
      border: '2px solid',
      borderColor: 'rgba(0,122,255,0.8)',
      boxShadow: '0 0 12px rgba(0, 122, 255, 0.3), inset 0 0 0 1px rgba(0,122,255,0.5)',
      animation: 'glowPulse 1.6s ease-in-out infinite',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0,122,255,0.5)',
    },
  };

  return {
    '& .MuiOutlinedInput-root': {
      transition: 'all 0.3s ease',
      ...(animate ? animationStyle : staticStyle),
      '&.Mui-focused': {
        ...(animate ? animationStyle : staticStyle),
      },
    },
    '@keyframes glowPulse': {
      '0%': {
        boxShadow: '0 0 6px rgba(0,122,255,0.3)',
      },
      '50%': {
        boxShadow: '0 0 12px rgba(0,122,255,0.6)',
      },
      '100%': {
        boxShadow: '0 0 6px rgba(0,122,255,0.3)',
      },
    },
  };
};

export const aiSelectSxEffect = (animate = false) => {
  const staticStyle = {
    border: '2px solid',
    borderColor: 'rgba(0,122,255,0.3)',
    transition: 'border-color 0.3s ease',
    boxShadow: '0 0 12px rgba(0, 122, 255, 0.3), inset 0 0 0 1px rgba(0,122,255,0.5)',
  };

  const animationStyle = {
    pointerEvents: 'none',
    userSelect: 'none',
    transition: 'border-color 0.3s ease',
    boxShadow: '0 0 16px rgba(0, 122, 255, 0.5), inset 0 0 0 1px rgba(0,122,255,0.6)',
    '& fieldset': {
      border: '2px solid',
      borderRadius: 4,
      borderColor: 'rgba(0,122,255,0.8)',
      boxShadow: '0 0 12px rgba(0, 122, 255, 0.3), inset 0 0 0 1px rgba(0,122,255,0.5)',
      animation: 'glowPulse 1.6s ease-in-out infinite',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0,122,255,0.5)',
    },
  };

  return {
    '& .MuiInputBase-input': {
      ...(animate ? animationStyle : staticStyle),
      '&:focus': {
        ...(animate ? animationStyle : staticStyle),
      },
      '&:hover': {
        borderColor: 'rgba(0,122,255,0.5)',
      },
    },
    '& fieldset': {
      border: 'none',
    },
    '@keyframes glowPulse': {
      '0%': {
        boxShadow: '0 0 6px rgba(0,122,255,0.3)',
      },
      '50%': {
        boxShadow: '0 0 12px rgba(0,122,255,0.6)',
      },
      '100%': {
        boxShadow: '0 0 6px rgba(0,122,255,0.3)',
      },
    },
  };
};