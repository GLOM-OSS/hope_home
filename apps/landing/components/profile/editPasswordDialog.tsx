import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function EditPasswordDialog({
  open,
  closeDialog,
  submitDialog,
}: {
  open: boolean;
  closeDialog: () => void;
  submitDialog: (val: {
    current_password: string;
    new_password: string;
  }) => void;
}) {
  const { formatMessage } = useIntl();

  const initialValues: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  } = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required(),
    newPassword: Yup.string().required(),
    confirmNewPassword: Yup.string()
      .required()
      .oneOf(
        [Yup.ref('newPassword'), null],
        formatMessage({ id: 'passwordMismatch' })
      ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      submitDialog({
        current_password: values.currentPassword,
        new_password: values.newPassword,
      });
      resetForm();
      closeDialog();
    },
  });

  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle>{formatMessage({ id: 'changePassword' })}</DialogTitle>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ display: 'grid', rowGap: 2, padding: '0 8px' }}
      >
        <TextField
          fullWidth
          required
          autoFocus
          label={formatMessage({ id: 'currentPassword' })}
          placeholder={formatMessage({ id: 'enterCurrentPassword' })}
          variant="standard"
          type="password"
          error={
            formik.touched.currentPassword &&
            Boolean(formik.errors.currentPassword)
          }
          helperText={
            formik.touched.currentPassword && formik.errors.currentPassword
          }
          {...formik.getFieldProps('currentPassword')}
        />
        <TextField
          fullWidth
          required
          label={formatMessage({ id: 'newPassword' })}
          placeholder={formatMessage({ id: 'enterNewPassword' })}
          variant="standard"
          type="password"
          error={
            formik.touched.newPassword && Boolean(formik.errors.newPassword)
          }
          helperText={formik.touched.newPassword && formik.errors.newPassword}
          {...formik.getFieldProps('newPassword')}
        />
        <TextField
          fullWidth
          required
          label={formatMessage({ id: 'confirmNewPassword' })}
          placeholder={formatMessage({ id: 'confirmNewPassword' })}
          variant="standard"
          type="password"
          error={
            formik.touched.confirmNewPassword &&
            Boolean(formik.errors.confirmNewPassword)
          }
          helperText={
            formik.touched.confirmNewPassword &&
            formik.errors.confirmNewPassword
          }
          {...formik.getFieldProps('confirmNewPassword')}
        />
        <DialogActions>
          <Button
            size="small"
            onClick={closeDialog}
            sx={{ textTransform: 'none' }}
          >
            {formatMessage({ id: 'cancel' })}
          </Button>
          <Button
            size="small"
            type="submit"
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none' }}
          >
            {formatMessage({ id: 'changePassword' })}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
