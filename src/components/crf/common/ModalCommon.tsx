import { Modal, Paper } from "@mui/material";
import React from "react";

export interface ModalCommonProps {
  open: boolean;
  onClose: () => void;
  content: JSX.Element;
  minWidth: number;
}

export function ModalCommon({
  open,
  onClose,
  content,
  minWidth,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      >
      <Paper sx={{
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: minWidth,
        p: '24px',
      }}>
        {content}
      </Paper>
      </Modal>
  );
}