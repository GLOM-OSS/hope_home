import { IUser } from '@hopehome/interfaces';
import { theme } from '@hopehome/theme';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';

export default function EditInfoDialog({
  open,
  closeDialog,
  submitDialog,
  info,
}: {
  open: boolean;
  closeDialog: () => void;
  submitDialog: (
    val: Omit<
      IUser,
      'created_at' | 'person_id' | 'role' | 'gender' | 'profile_image_ref'
    >
  ) => void;
  info: Omit<
    IUser,
    'created_at' | 'person_id' | 'role' | 'gender' | 'profile_image_ref'
  >;
}) {
  const { formatMessage } = useIntl();

  const initialValues: Omit<
    IUser,
    'created_at' | 'person_id' | 'role' | 'gender' | 'profile_image_ref'
  > = info ?? {
    email: '',
    fullname: '',
    preferred_lang: 'fr',
    whatsapp_number: '',
    phone_number: '',
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().required(),
    fullname: Yup.string().required(),
    preferred_lang: Yup.string().oneOf(['en', 'fr']).required(),
    phone_number: Yup.string().matches(
      /^(6|2)(2|3|[5-9])[0-9]{7}$/gm,
      '(6|2) (2|3|[5-9])x xxx xxx'
    ),
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
        ...values,
        phone_number: `237${values.phone_number}`,
        whatsapp_number: `237${values.whatsapp_number}`,
      });
      resetForm();
      closeDialog();
    },
  });

  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogTitle>{formatMessage({ id: 'updateProfile' })}</DialogTitle>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ display: 'grid', rowGap: 2, padding: '0 8px' }}
      >
        <TextField
          fullWidth
          required
          autoFocus
          label={formatMessage({ id: 'email' })}
          placeholder={formatMessage({ id: 'enterEmail' })}
          variant="standard"
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          {...formik.getFieldProps('email')}
        />
        <TextField
          fullWidth
          required
          label={formatMessage({ id: 'fullname' })}
          placeholder={formatMessage({ id: 'enterFullname' })}
          variant="standard"
          error={formik.touched.fullname && Boolean(formik.errors.fullname)}
          helperText={formik.touched.fullname && formik.errors.fullname}
          {...formik.getFieldProps('fullname')}
        />
        <TextField
          fullWidth
          required
          label={formatMessage({ id: 'phoneNumber' })}
          placeholder={formatMessage({ id: 'enterPhoneNumber' })}
          variant="standard"
          InputProps={{
            startAdornment: <Typography mr={0.5}>237</Typography>,
          }}
          error={
            formik.touched.phone_number && Boolean(formik.errors.phone_number)
          }
          helperText={formik.touched.phone_number && formik.errors.phone_number}
          {...formik.getFieldProps('phone_number')}
        />
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

        <FormControl>
          <InputLabel id="preferredLang">
            {formatMessage({ id: 'preferredLang' })}
          </InputLabel>
          <Select
            labelId="preferredLang"
            required
            fullWidth
            variant="standard"
            {...formik.getFieldProps('preferred_lang')}
            error={
              formik.touched.preferred_lang &&
              Boolean(formik.errors.preferred_lang)
            }
            sx={{ minWidth: '200px' }}
            size="small"
            input={
              <OutlinedInput label={formatMessage({ id: 'questionType' })} />
            }
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                },
              },
            }}
          >
            {['en', 'fr'].map((_, index) => (
              <MenuItem key={index} value={_}>
                {formatMessage({ id: _ })}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.preferred_lang && formik.errors.preferred_lang && (
            <FormHelperText color={theme.palette.error.main}>
              {formik.errors.preferred_lang}
            </FormHelperText>
          )}
        </FormControl>

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
            disabled={
              formik.values.email === info.email &&
              formik.values.fullname === info.fullname &&
              formik.values.phone_number === info.phone_number &&
              formik.values.preferred_lang === info.preferred_lang &&
              formik.values.whatsapp_number === info.whatsapp_number
            }
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
