import { PartialBlock } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import { it } from '@blocknote/core/locales';
import { BlockNoteView, darkDefaultTheme, lightDefaultTheme } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { Button, ButtonProps, GlobalStyles, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useCallback, useMemo, useState } from 'react';
import { useIsAiDirty } from '../AiEditingContext';
import {
  AvailableToolbarButtons,
  CustomFormattingToolbar,
  CustomToolbarButton,
} from './FormattingToolbar';

const locale = it;
const richTextGlobalStyles = {
  '.ProseMirror .bn-editor .bn-default-styles': {
    bakcgroundColor: 'transparent',
  },
  '.bn-editor': {
    backgroundColor: 'transparent',
  },
  '.bn-default-styles h1': { fontSize: '32px' },
  '.bn-default-styles h2': { fontSize: '24px' },
  '.bn-default-styles h3': { fontSize: '16px' },
  '.bn-container': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    gap: '8px',
  },
  '.bn-formatting-toolbar': {
    display: 'flex !important',
    flexWrap: 'wrap !important',
    margin: '10px',
    marginTop: '25px',
    boxShadow: 'none !important',
    maxWidth: '100% !important',
  },
  '.bn-ai-effect': {
    border: '2px solid',
    borderColor: 'rgba(0,122,255,0.3)',
    transition: 'border-color 0.3s ease',
    boxShadow: '0 0 12px rgba(0, 122, 255, 0.3), inset 0 0 0 1px rgba(0,122,255,0.5)',
    borderRadius: 8,
  },
  '.bn-ai-effect:hover': {
    borderColor: 'rgba(0,122,255,0.5)',
  },
};

export interface RichTextEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onBlur'> {
  ref?: React.Ref<HTMLDivElement | null>;
  id?: string;
  name?: string; // optional name to track AI editing/dirty state
  title?: string;
  placeholder?: string;
  mode?: 'html' | 'json' | 'markdown';
  value?: string | PartialBlock[];
  readonly?: boolean;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  trailingBlock?: boolean;
  onChange?: (text: string) => void;
  onBlur?: (text: string) => void;
  focus?: boolean;
  toolbar?: 'default' | 'static';
  menu?: boolean;
  theme?: 'light' | 'dark';
  backgroundPreset?: 'default' | 'paper';
  menuPreset?: 'default' | 'paper';
  submitButton?: ButtonProps & { label?: string };
  availableButtons?: AvailableToolbarButtons;
  customButtons?: CustomToolbarButton[];
}

export const RichTextEditor = (props: RichTextEditorProps) => {
  const {
    ref,
    id,
    name,
    title,
    placeholder,
    mode = 'html',
    value,
    readonly = false,
    disabled = false,
    error = false,
    errorMessage,
    trailingBlock = false,
    onChange,
    onBlur,
    focus = false,
    toolbar = 'static',
    menu = false,
    theme,
    submitButton,
    backgroundPreset = 'paper',
    availableButtons,
    customButtons = [],
    ...restProps
  } = props;

  const isDirtyAi = useIsAiDirty(name) ?? false;

  const combinedClassName = React.useMemo(
    () =>
      [(restProps as Record<string, any>)?.className, isDirtyAi ? 'bn-ai-effect' : '']
        .filter(Boolean)
        .join(' '),
    [restProps, isDirtyAi],
  );

  // ============== Editor Setup ===================

  const editor = useCreateBlockNote({
    trailingBlock,
    dictionary: {
      ...locale,
      placeholders: {
        ...locale.placeholders,
        default: placeholder,
      },
    },
  });

  // ============== Theme setup ===================

  const muiTheme = useTheme();
  const currentTheme = theme ?? muiTheme.palette.mode;

  const editorBackground = useMemo(() => {
    if (backgroundPreset === 'default') {
      return muiTheme.palette.background.default;
    } else if (backgroundPreset === 'paper') {
      return muiTheme.palette.background.paper;
    }
    return muiTheme.palette.background.paper;
  }, [backgroundPreset, muiTheme.palette.background]);

  const menuBackground = useMemo(() => {
    return backgroundPreset === 'default'
      ? muiTheme.palette.background.paper
      : muiTheme.palette.background.default;
  }, [muiTheme.palette.background, backgroundPreset]);

  const lightTheme = useMemo(
    () => ({
      ...lightDefaultTheme,
      colors: {
        ...lightDefaultTheme.colors,
        editor: {
          text: muiTheme.palette.text.primary,
          background: editorBackground,
        },
        menu: {
          text: muiTheme.palette.text.primary,
          background: menuBackground,
        },
        selected: {
          text: '#FFFFFF',
          background: muiTheme.palette.primary.main,
        },
      },
    }),
    [
      muiTheme.palette.text.primary,
      muiTheme.palette.primary.main,
      editorBackground,
      menuBackground,
    ],
  );

  const darkTheme = useMemo(
    () => ({
      ...darkDefaultTheme,
      colors: {
        ...darkDefaultTheme.colors,
        editor: {
          text: muiTheme.palette.text.primary,
          background: editorBackground,
        },
        menu: {
          text: muiTheme.palette.text.primary,
          background: menuBackground,
        },
        selected: {
          text: '#000000',
          background: muiTheme.palette.primary.main,
        },
      },
    }),
    [muiTheme, editorBackground, menuBackground],
  );

  const [isFocused, setIsFocused] = useState<boolean>(focus || false);
  const editorStyles: React.CSSProperties = useMemo(() => {
    const borderColor = error ? muiTheme.palette.error.main : isFocused ? 'transparent' : 'silver';
    return {
      backgroundColor: editorBackground,
      paddingTop: 10,
      width: '100%',
      minHeight: toolbar === 'default' ? 120 : undefined,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: isDirtyAi ? 'rgba(0,122,255,0.3)' : borderColor,
      borderRadius: 8,
      boxShadow: isFocused ? '0 0 0 2px ' + muiTheme.palette.primary.main : undefined,
      pointerEvents: disabled ? 'none' : 'auto',
    };
  }, [
    disabled,
    editorBackground,
    error,
    isDirtyAi,
    isFocused,
    muiTheme.palette.error.main,
    muiTheme.palette.primary.main,
    toolbar,
  ]);

  // ============== Callback handlers ===================

  const [uncontrolledHtml, setUncontrolledHtml] = useState<string | undefined>(
    id ? (value as string) : undefined,
  );
  const getOutput = useCallback(async () => {
    if (!editor) return;
    if (mode === 'html') {
      const html = await editor.blocksToHTMLLossy(editor.document);
      if (id && uncontrolledHtml !== html) {
        setUncontrolledHtml(html);
      }
      return html;
    }
    if (mode === 'json') {
      return JSON.stringify(editor.document, null, 2);
    }
    if (mode === 'markdown') {
      const markdown = await editor.blocksToMarkdownLossy(editor.document);
      if (id && uncontrolledHtml !== markdown) {
        setUncontrolledHtml(markdown);
      }
      return markdown;
    }
    return undefined;
  }, [editor, id, mode, uncontrolledHtml]);

  const handleOnChange = useCallback(async () => {
    const output = await getOutput();
    if (output) onChange?.(output);
  }, [getOutput, onChange]);

  // Prevent blur event when clicking toolbar buttons
  const handleOnBlur = useCallback(
    async (event: React.FocusEvent<HTMLDivElement>) => {
      // Check if the newly focused element is inside the toolba
      event.stopPropagation();
      const toolbarEl = document.querySelector('.bn-container, .bn-formatting-toolbar');
      if (
        toolbarEl &&
        event.relatedTarget instanceof Node &&
        toolbarEl.contains(event.relatedTarget)
      ) {
        return;
      }
      if (isFocused) setIsFocused(false);
      const output = await getOutput();
      if (output) await onBlur?.(output);
      // console.log('onBlur called with output:', output);
    },
    [isFocused, getOutput, onBlur],
  );

  // ============== Load initial value based on mode ===================

  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const inputAsHtml = React.useCallback(async () => {
    try {
      // console.log('inputAsHtml called with value:', value, 'and mode:', mode);
      if (!editor || !value || mode !== 'html') return;
      if (typeof value !== 'string') {
        console.log('Value must be a string when mode is "html"');
        return;
      }
      const blocks = editor.tryParseHTMLToBlocks(value as string);
      editor.replaceBlocks(editor.document, blocks);
      setDataLoaded(true);
    } catch (error) {
      console.error(error);
    }
  }, [mode, value, editor]);

  const inputAsJson = React.useCallback(async () => {
    try {
      // console.log('inputAsJson called with value:', value, 'and mode:', mode);
      if (!editor || !value || mode !== 'json') return;
      if (Array.isArray(value) && value.length > 0) {
        editor.replaceBlocks(editor.document, value as PartialBlock[]);
        setDataLoaded(true);
      } else {
        throw new Error('Value must be an array of PartialBlock objects when mode is "json"');
      }
    } catch (error) {
      console.error(error);
    }
  }, [mode, value, editor]);

  const inputAsMarkdown = React.useCallback(async () => {
    try {
      // console.log('inputAsMarkdown called with value:', value, 'and mode:', mode);
      if (!editor || !value || mode !== 'markdown') return;
      if (typeof value !== 'string') {
        console.log('Value must be a string when mode is "markdown"');
        return;
      }
      const blocks = await editor.tryParseMarkdownToBlocks(value as string);

      editor.replaceBlocks(editor.document, blocks);
      setDataLoaded(true);
    } catch (error) {
      console.error(error);
    }
  }, [mode, value, editor]);

  if (!dataLoaded) {
    switch (mode) {
      case 'html':
        inputAsHtml();
        break;
      case 'json':
        inputAsJson();
        break;
      case 'markdown':
        inputAsMarkdown();
        break;
      default:
        break;
    }
  }

  return (
    <Grid container size={12}>
      <GlobalStyles styles={richTextGlobalStyles} />
      {title && (
        <Grid size={12}>
          <Typography variant="body1" color="textSecondary" mb={1}>
            {title}
          </Typography>
        </Grid>
      )}
      {editor && (
        <Grid size={12} container component="div">
          <BlockNoteView
            ref={ref}
            title={placeholder}
            slashMenu={menu}
            editor={editor}
            editable={!readonly}
            theme={currentTheme === 'dark' ? darkTheme : lightTheme}
            formattingToolbar={toolbar !== 'static'}
            {...restProps}
            className={combinedClassName}
            onChange={handleOnChange}
            onBlurCapture={handleOnBlur}
            onFocusCapture={() => setIsFocused(true)}
            style={editorStyles}
          >
            <Grid
              container
              size={12}
              sx={{
                position: 'relative',
                pointerEvents: disabled ? 'none' : 'auto',
              }}
            >
              <Grid flexGrow={1}>
                {!readonly && toolbar === 'static' ? (
                  <CustomFormattingToolbar
                    editor={editor}
                    availableButtons={availableButtons}
                    customButtons={customButtons}
                  />
                ) : (
                  <span className="bn-placeholder" />
                )}
              </Grid>

              {submitButton && (
                <Grid container justifyContent="flex-end" alignItems="flex-end" m="10px" mb="12px">
                  <Button
                    type={submitButton.type ?? 'button'}
                    variant={submitButton.variant ?? 'contained'}
                    size="small"
                    color={submitButton.color ?? 'primary'}
                    onClick={submitButton.onClick}
                  >
                    {submitButton.label || 'Custom Action'}
                  </Button>
                </Grid>
              )}
            </Grid>
          </BlockNoteView>
          {id && (
            <input
              type="hidden"
              name={id}
              value={uncontrolledHtml ?? ''}
              style={{
                display: 'none',
              }}
            />
          )}
        </Grid>
      )}
      {error && errorMessage && (
        <Grid size={12}>
          <Typography
            variant="caption"
            color="error"
            style={{
              marginInline: '14px',
              marginTop: '3px',
              marginBottom: -1,
            }}
          >
            {errorMessage}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};
