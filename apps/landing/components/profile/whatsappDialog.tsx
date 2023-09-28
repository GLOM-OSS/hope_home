import {
  Box,
  Button,
  Dialog,
  DialogActions,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import { PhoneNumberTextField } from '../phoneNumberTextField';

export default function WhatsappDialog({
  open,
  closeDialog,
  submitDialog,
}: {
  open: boolean;
  closeDialog: () => void;
  submitDialog: (whatsapp_number: string) => void;
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
      submitDialog(values.whatsapp_number);
      resetForm();
      closeDialog();
    },
  });

  return (
    <Dialog open={open}>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ display: 'grid', rowGap: 2, padding: 2, maxWidth: 400 }}
      >
        <Typography variant="body1">
          {formatMessage({ id: 'whatsappDialogText' })}
        </Typography>
        <PhoneNumberTextField
          formik={formik}
          field="whatsapp_number"
          label={formatMessage({ id: 'whatsappNumber' })}
          placeholder={formatMessage({ id: 'enterWhatsappNumber' })}
        />
        <DialogActions>
          <Button
            size="small"
            type="submit"
            variant="contained"
            color="primary"
            sx={{ textTransform: 'none' }}
          >
            {formatMessage({ id: 'save' })}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
