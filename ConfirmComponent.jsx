import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import React from "react";
import PropTypes from 'prop-types';
import { useDispatch } from "react-redux";
import { CloseConfirmModal } from "../actions/confirm";

const ConfirmComponent = (props) => {
    const {
        title,
        callbackCancel,
        callbackConfirm,
        content,
        textCancelBtn,
        textConfirmBtn,
        isOpen
    } =  props;
    console.log("props:", props);
    const dispatch = useDispatch();
    const _handleCancel = async ()=>{
        typeof(callbackCancel) == "function" && callbackCancel();
        _handleClose();
    }
    const _handleConfirm = ()=>{
        typeof(callbackConfirm) == "function" && callbackConfirm();
        _handleClose();
    }

  const _handleClose = () => {
    dispatch(CloseConfirmModal());
  };
  return (
    <Dialog
      open={isOpen}
      onClose={_handleClose}
    >
      <DialogTitle style={{ cursor: "move" }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {
              content
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={_handleCancel} color="secondary">
          {textCancelBtn}
        </Button>
        <Button onClick={_handleConfirm} color="primary">
          {textConfirmBtn}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
ConfirmComponent.defaultProps={
    textCancelBtn: "Cancel",
    textConfirmBtn : "Confirm"
}
export default ConfirmComponent;
