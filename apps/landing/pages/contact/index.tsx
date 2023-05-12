import { EastOutlined, ReportRounded } from '@mui/icons-material';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useIntl } from 'react-intl';
import { useState } from 'react';
import { ErrorMessage, useNotification } from '@hopehome/toast';
import { IMessage } from '@hopehome/interfaces';

export default function Contact() {
  const { formatMessage } = useIntl();
  const texts = [
    { title: 'customerCare', description: 'customerCareMessage' },
    { title: 'ownerMessage', description: 'ownerMessageSummary' },
  ];

  const initialValues: IMessage = {
    name: '',
    message: '',
    email: '',
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    name: Yup.string().required(),
    message: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      sendMessage(values);
      resetForm();
    },
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionNotif, setSubmissionNotif] = useState<useNotification>();

  function sendMessage(message: IMessage) {
    setIsSubmitting(true);
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'sendingMail',
      }),
    });
    setTimeout(() => {
      //TODO: CALL API HERE TO SEND MAIL TO ADMIN
      // eslint-disable-next-line no-constant-condition
      if (4 < 5) {
        notif.update({
          render: formatMessage({
            id: 'mailSentSuccessfully',
          }),
        });
        setSubmissionNotif(undefined);
      } else {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => sendMessage(message)}
              notification={notif}
              message={
                //TODO: message should come from backend
                formatMessage({
                  id: 'sendmailFailed',
                })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      }
    }, 3000);
  }

  return (
    <Box sx={{ mt: 4, padding: `0 7.1%`, mb: 2, display: 'grid', rowGap: 3 }}>
      <Box sx={{ display: 'grid', rowGap: 3 }}>
        <Typography variant="h4">
          {formatMessage({ id: 'contactUs' })}
        </Typography>
        <Typography variant="h6" fontWeight={400}>
          {formatMessage({ id: 'contactUsSummary' })}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            desktop: '1fr 1fr',
            mobile: '1fr',
          },
          rowGap: 5,
          columnGap: 5,
        }}
      >
        {texts.map(({ description, title }, index) => (
          <Box key={index}>
            <Divider
              orientation="horizontal"
              sx={{ backgroundColor: 'black' }}
            />
            <Box sx={{ display: 'grid', rowGap: 1.4, mt: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  textAlign: {
                    mobile: 'center',
                    desktop: 'left',
                  },
                }}
              >
                {formatMessage({ id: title })}
              </Typography>
              <Typography
                sx={{
                  textAlign: {
                    mobile: 'center',
                    desktop: 'left',
                  },
                }}
              >
                {formatMessage({ id: description })}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            mobile: '1fr',
            desktop: '1fr 1fr',
          },
          columnGap: 5,
        }}
      >
        <Box sx={{ display: 'grid', rowGap: 1, mt: 5 }}>
          <Typography>{formatMessage({ id: 'contactUsMessage' })}</Typography>
          <Box
            component={'form'}
            sx={{ display: 'grid', rowGap: 2 }}
            onSubmit={formik.handleSubmit}
          >
            <TextField
              variant="standard"
              label={formatMessage({ id: 'yourName' })}
              required
              placeholder="John Doe"
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              {...formik.getFieldProps('name')}
            />
            <TextField
              variant="standard"
              label={formatMessage({ id: 'email' })}
              type="email"
              required
              placeholder="xxx@service.tld"
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              {...formik.getFieldProps('email')}
            />
            <TextField
              variant="standard"
              label={formatMessage({ id: 'yourMessage' })}
              required
              placeholder={formatMessage({
                id: formatMessage({ id: 'yourMessageTemplate' }),
              })}
              error={formik.touched.message && Boolean(formik.errors.message)}
              helperText={formik.touched.message && formik.errors.message}
              multiline
              rows={3}
              {...formik.getFieldProps('message')}
            />
            <Button
              sx={{ borderRadius: '20px', justifySelf: 'center', mt: 4 }}
              variant="contained"
              color="primary"
              endIcon={<EastOutlined />}
              type="submit"
              disabled={
                isSubmitting ||
                formik.values.name === '' ||
                formik.values.email === '' ||
                formik.values.message === ''
              }
            >
              {formatMessage({ id: 'sendMessage' })}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
