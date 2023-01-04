import React from 'react';
import { Children } from 'react'
import { Stack, Typography } from '@mui/material';
import { Item } from '../../../survey';

interface SectionCommonProps {
  index:string;
  question:Item;
  content:JSX.Element;
}

export function SectionCommon({
  index,
  question,
  content,
  }:SectionCommonProps) {

  return (
    <Stack spacing={6}>
      <Stack>
      <Typography variant='h4'>{index}{question.text}</Typography>
      <Typography>{question.description}</Typography>
      </Stack>
      {content}
    </Stack>
  );
}