import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function AdditionalDataDialog({
  open,
  closeDialog,
  submitDialog,
}: {
  open: boolean;
  closeDialog: () => void;
  submitDialog: (val: { whatsapp_number: string }) => void;
}) {
  const { formatMessage } = useIntl();

  const initialValues: {
    whatsapp_number: string;
  } = {
    whatsapp_number: '',
  };
  const validationSchema = Yup.object().shape({
    whatsapp_number: Yup.string().matches(
      /^(6|2)(2|3|[5-9])[0-9]{7}$/gm,
      '(6|2) (2|3|[5-9])x xxx xxx'
    ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      submitDialog({
        whatsapp_number: values.whatsapp_number,
      });
      resetForm();
      closeDialog();
    },
  });

  return (
    <Dialog open={open}>
      <DialogTitle>{formatMessage({ id: 'AdditionalInfo' })}</DialogTitle>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ display: 'grid', rowGap: 2, padding: '0 8px' }}
      >
        <TextField
          fullWidth
          required
          label={formatMessage({ id: 'whatsappNumber' })}
          placeholder={formatMessage({ id: 'enterWhatsappNumber' })}
          variant="standard"
          InputProps={{
            startAdornment: <Typography mr={0.5}>237</Typography>,
          }}
          error={
            formik.touched.whatsapp_number &&
            Boolean(formik.errors.whatsapp_number)
          }
          helperText={
            formik.touched.whatsapp_number && formik.errors.whatsapp_number
          }
          {...formik.getFieldProps('whatsapp_number')}
        />
        <DialogActions>
          <Button
            size="small"
            type="submit"
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none' }}
          >
            {formatMessage({ id: 'SignIn' })}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
