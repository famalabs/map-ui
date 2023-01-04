import React from "react";
import { Button, ButtonProps, CircularProgress, Theme, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Survey, Item, DBSchema, QuestionText, QuestionNumber, QuestionSelect, Group } from '../../survey'
// import surveyFormExmple from './asdf.json'
import { TextFields, Functions, Pin, RadioButtonChecked, ToggleOnOutlined, TocRounded, CheckBox, CalendarMonth, WebAsset, LinearScaleRounded, ArrowDropDownCircleOutlined } from '@mui/icons-material';
import { useEditorState } from "../crf";

const Span = styled('span')``;

export interface ButtonLoadingProps extends ButtonProps {
  label?: string;
  loading: boolean;
}

/**
 * Button with a Loading prop available
 */
const ButtonLoading: React.VFC<ButtonLoadingProps> = ({
  label = "Button",
  loading,
  ...props
}) => {
  // const initValue = undefined ?? {
  //   id: "1",
  //   type: Group.TYPE,
  //   name: "Survey 1",
  //   items: [{
  //     id: "2",
  //     type: Group.TYPE,
  //     name: "Folder 1",
  //     items: [{
  //       id: "3",
  //       type: Group.TYPE,
  //       name:"Page 1",
  //       items:[],
  //       layout: {
  //         style: "card",
  //       }
  //     }]
  //   }],
  // } as DBSchema;

  // const getSurvey = (val:DBSchema) => {const s = new Survey(); s.load(val); return s;};
  // const getRoot = (val:DBSchema) => new Survey().load(val);

  // console.log('editor getRoot(initValue).getSchema()', getRoot(initValue).getSchema());
  // const [value, setValue] = React.useState<DBSchema>(getRoot(initValue).getSchema());
  // console.log('editor value', value)

  const editorState = useEditorState(undefined);
  return (
  //   <Button {...props} disabled={props.disabled || loading}>
  //     <Span >{label}</Span>{' '}
  //     {loading && <CircularProgress size={24} sx={{
  //   color: (theme: Theme) => theme.palette.secondary.main,
  //   position: 'absolute',
  //           top: "50%",
  //   left: '50%',
  //   marginTop: -12,
  //   marginLeft: -12,
  // }} />}
  //   </Button>
  <Typography>
  {/* {JSON.stringify(editorState.editor.getRoot())}
    {JSON.stringify(editorState.editor.getRoot().getSchema())} */}
    <TextFields/>
  </Typography>
  
  );
};

export default ButtonLoading;