import { BlockNoteEditor } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import {
  BasicTextStyleButton,
  BlockTypeSelect,
  blockTypeSelectItems,
  ColorStyleButton,
  CreateLinkButton,
  FormattingToolbar,
  NestBlockButton,
  TextAlignButton,
  UnnestBlockButton,
} from '@blocknote/react';
import React from 'react';
import { JSX, memo, useMemo } from 'react';

export interface AvailableToolbarButtons {
  heading?: boolean | 'full' | 'essential';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  code?: boolean;
  textAlign?: boolean;
  color?: boolean;
  nestBlock?: boolean;
  link?: boolean;
}

export interface CustomToolbarButton {
  button: JSX.Element;
  position?: number;
}

interface CustomFormattingToolbarProps {
  editor: BlockNoteEditor;
  availableButtons?: AvailableToolbarButtons;
  customButtons?: CustomToolbarButton[];
}

export const CustomFormattingToolbar = memo(
  ({ editor, availableButtons, customButtons }: CustomFormattingToolbarProps) => {
    const defaultAvailableButtons: AvailableToolbarButtons = {
      heading: availableButtons?.heading ?? 'full',
      bold: availableButtons?.bold ?? true,
      italic: availableButtons?.italic ?? true,
      underline: availableButtons?.underline ?? true,
      strike: availableButtons?.strike ?? true,
      code: availableButtons?.code ?? false,
      textAlign: availableButtons?.textAlign ?? true,
      color: availableButtons?.color ?? true,
      nestBlock: availableButtons?.nestBlock ?? true,
      link: availableButtons?.link ?? true,
    };

    const completeSelectOptions = blockTypeSelectItems(editor.dictionary);
    const essentialSelectOptions = completeSelectOptions.slice(0, 4);

    const toolbarButtons = useMemo(
      () => [
        <BlockTypeSelect
          key={'select_button'}
          items={
            defaultAvailableButtons.heading === 'full'
              ? completeSelectOptions
              : essentialSelectOptions
          }
        />,
        <BasicTextStyleButton basicTextStyle={'bold'} key={'bold_button'} />,
        <BasicTextStyleButton basicTextStyle={'italic'} key={'italic_button'} />,
        <BasicTextStyleButton basicTextStyle={'underline'} key={'underline_button'} />,
        <BasicTextStyleButton basicTextStyle={'strike'} key={'strike_button'} />,
        <BasicTextStyleButton basicTextStyle={'code'} key={'code_button'} />,
        <TextAlignButton textAlignment={'left'} key={'align_left_button'} />,
        <TextAlignButton textAlignment={'center'} key={'align_center_butto'} />,
        <TextAlignButton textAlignment={'right'} key={'align_right_button'} />,
        <ColorStyleButton key={'color_button'} />,
        <NestBlockButton key={'nest_button'} />,
        <UnnestBlockButton key={'unnest_button'} />,
        <CreateLinkButton key={'link_button'} />,
      ],
      [completeSelectOptions, defaultAvailableButtons.heading, essentialSelectOptions],
    );

    const defaultButtons = toolbarButtons.filter((button) => {
      switch (button.key) {
        case 'select_button':
          return defaultAvailableButtons.heading;
        case 'bold_button':
          return defaultAvailableButtons.bold;
        case 'italic_button':
          return defaultAvailableButtons.italic;
        case 'underline_button':
          return defaultAvailableButtons.underline;
        case 'strike_button':
          return defaultAvailableButtons.strike;
        case 'code_button':
          return defaultAvailableButtons.code;
        case 'align_left_button':
          return defaultAvailableButtons.textAlign;
        case 'align_center_butto':
          return defaultAvailableButtons.textAlign;
        case 'align_right_button':
          return defaultAvailableButtons.textAlign;
        case 'color_button':
          return defaultAvailableButtons.color;
        case 'nest_button':
          return defaultAvailableButtons.nestBlock;
        case 'unnest_button':
          return defaultAvailableButtons.nestBlock;
        case 'link_button':
          return defaultAvailableButtons.link;
        default:
          return true;
      }
    });

    const mergedButtons = useMemo(() => {
      if (!customButtons || customButtons.length === 0) {
        return defaultButtons;
      }

      const buttons = [...defaultButtons];

      customButtons.forEach(({ button, position = 0 }) => {
        if (!position || position > buttons.length) position = buttons.length;
        if (position < 0) position = 0;
        if (position >= buttons.length) {
          buttons.push(button);
        } else {
          buttons.splice(position, 0, button);
        }
      });

      return buttons;
    }, [customButtons, defaultButtons]);

    return <FormattingToolbar>{mergedButtons}</FormattingToolbar>;
  },
);
