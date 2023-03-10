import { theme } from '@hopehome/theme';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useIntl } from 'react-intl';
import { DialogTransition } from './dialog-transition';

export function ConfirmDialog({
  isDialogOpen,
  closeDialog,
  confirm,
  dialogMessage,
  dialogTitle = 'delete',
  confirmButton = 'delete',
  danger = false,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  confirm: () => void;
  dialogMessage: string;
  dialogTitle?: string;
  confirmButton?: string;
  danger?: boolean;
}) {
  const { formatMessage } = useIntl();
  return (
    <Dialog
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={closeDialog}
    >
      <DialogTitle
        sx={{ color: danger ? theme.palette.error.main : 'initial' }}
      >
        {dialogTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{dialogMessage}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ textTransform: 'none' }}
          color={danger ? 'primary' : 'error'}
          variant={danger ? 'outlined' : 'text'}
          onClick={closeDialog}
        >
          {formatMessage({ id: 'cancel' })}
        </Button>
        <Button
          sx={{ textTransform: 'none' }}
          color={danger ? 'error' : 'primary'}
          variant={danger ? 'outlined' : 'contained'}
          onClick={() => {
            confirm();
            closeDialog();
          }}
        >
          {confirmButton ? confirmButton : formatMessage({ id: confirmButton })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
