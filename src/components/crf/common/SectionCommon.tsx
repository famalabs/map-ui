import React from 'react';
import { Children } from 'react'
import { Divider, Stack, Typography } from '@mui/material';
import { Item } from '../../../survey';

interface SectionCommonProps {
  index:string;
  question:Item;
  content:JSX.Element;
  handleMouseEnter:()=>void;
  handleClick:(a:any)=>void;
}

export function SectionCommon({
  index,
  question,
  content,
  handleMouseEnter,
  handleClick
  }:SectionCommonProps) {

  return (
    <Stack spacing={2}>
      <Stack spacing={2}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      >
      <Typography variant='h4'>{index[question.id]}{question.text}</Typography>
      <Typography>{question.description}</Typography>
      </Stack>
      {content}
      <Divider variant='middle'/>
    </Stack>
  );
}