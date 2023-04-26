import { IChangePassword, IUser } from '@hopehome/interfaces';
import { ErrorMessage, useNotification } from '@hopehome/toast';
import {
  EmailOutlined,
  LockOutlined,
  ReportRounded,
} from '@mui/icons-material';
import { Avatar, Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import EditInfoDialog from '../../components/profile/editInfoDialog';
import EditPasswordDialog from '../../components/profile/editPasswordDialog';
import { useUser } from '../../contexts/user.provider';
import { changePassword, updateProfile } from '../../services/auth.service';

export default function Profile() {
  const {
    activeUser: {
      email,
      fullname,
      preferred_lang,
      profile_image_ref,
      whatsapp_number,
      phone_number,
    },
    userDispatch,
  } = useUser();
  const { formatMessage, formatNumber } = useIntl();

  const [isEditPasswordDialogOpen, setIsEditPasswordDialogOpen] =
    useState<boolean>(false);
  const [isEditInfoDialogOpen, setIsEditInfoDialogOpen] =
    useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionNotif, setSubmissionNotif] = useState<useNotification>();

  function changeAccountInfo(
    val: Omit<
      IUser,
      'created_at' | 'person_id' | 'role' | 'gender' | 'profile_image_ref'
    >
  ) {
    setIsSubmitting(true);
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'changingAccountInfo',
      }),
    });
    updateProfile(val)
      .then(() => {
        notif.update({
          render: formatMessage({
            id: 'changedAccountInfoSuccessfully',
          }),
        });
        userDispatch({ type: 'UPDATE_USER', payload: val });
        setSubmissionNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => changeAccountInfo(val)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: 'changeAccountInfoFailed',
                })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsSubmitting(false));
  }
  function changePasswordHandler(val: IChangePassword) {
    setIsSubmitting(true);
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'changingPassword',
      }),
    });
    changePassword(val.current_password, val.new_password)
      .then(() => {
        notif.update({
          render: formatMessage({
            id: 'changedPasswordSuccessfully',
          }),
        });
        setSubmissionNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => changePasswordHandler(val)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: 'changePasswordFailed',
                })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  function changeProfileImage(e: React.ChangeEvent<HTMLInputElement>) {
    const newProfileImage = e.target.files[0];

    setIsSubmitting(true);
    const notif = new useNotification();
    if (submissionNotif) {
      submissionNotif.dismiss();
    }
    setSubmissionNotif(notif);
    notif.notify({
      render: formatMessage({
        id: 'changingProfileImage',
      }),
    });
    updateProfile({}, newProfileImage)
      .then(() => {
        notif.update({
          render: formatMessage({
            id: 'changedProfileImageSuccessfully',
          }),
        });
        userDispatch({
          type: 'UPDATE_USER',
          payload: { profile_image_ref: URL.createObjectURL(newProfileImage) },
        });
        setSubmissionNotif(undefined);
      })
      .catch((error) => {
        notif.update({
          type: 'ERROR',
          render: (
            <ErrorMessage
              retryFunction={() => changeProfileImage(e)}
              notification={notif}
              message={
                error?.message ||
                formatMessage({
                  id: 'changeProfileImageFailed',
                })
              }
            />
          ),
          autoClose: false,
          icon: () => <ReportRounded fontSize="medium" color="error" />,
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <>
      <EditPasswordDialog
        submitDialog={(val: IChangePassword) => changePasswordHandler(val)}
        open={isEditPasswordDialogOpen}
        closeDialog={() => setIsEditPasswordDialogOpen(false)}
      />
      <EditInfoDialog
        info={{
          email,
          fullname,
          preferred_lang,
          whatsapp_number:
            whatsapp_number.length > 0 ? whatsapp_number.slice(3) : '',
          phone_number: phone_number.length > 0 ? phone_number.slice(3) : '',
        }}
        closeDialog={() => setIsEditInfoDialogOpen(false)}
        open={isEditInfoDialogOpen}
        submitDialog={(val) => changeAccountInfo(val)}
      />
      <Box sx={{ mt: 4, padding: `0 7.1%`, mb: 2, display: 'grid', rowGap: 2 }}>
        <Typography variant="h4">
          {formatMessage({ id: 'accountSettings' })}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            columnGap: 1,
          }}
        >
          <Box sx={{ display: 'grid', rowGap: 1 }}>
            <Typography fontWeight={500}>
              {formatMessage({ id: 'password' })}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={300}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                columnGap: 1,
              }}
            >
              <LockOutlined fontSize="small" /> *********
            </Typography>
          </Box>
          <Button
            sx={{ textTransform: 'none', justifySelf: 'none' }}
            variant="text"
            color="primary"
            onClick={() => setIsEditPasswordDialogOpen(true)}
            disabled={isSubmitting}
          >
            {formatMessage({ id: 'edit' })}
          </Button>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            columnGap: 1,
          }}
        >
          <Box sx={{ display: 'grid', rowGap: 1 }}>
            <Typography fontWeight={500}>
              {formatMessage({ id: 'email' })}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={300}
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                columnGap: 1,
              }}
            >
              <EmailOutlined fontSize="small" /> {email}
            </Typography>
          </Box>
          <Button
            sx={{ textTransform: 'none', justifySelf: 'none' }}
            variant="text"
            color="primary"
            onClick={() => setIsEditInfoDialogOpen(true)}
            disabled={isSubmitting}
          >
            {formatMessage({ id: 'edit' })}
          </Button>
        </Box>
        <Box sx={{ display: 'grid', rowGap: 1 }}>
          <Typography fontWeight={500}>
            {formatMessage({ id: 'username' })}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={300}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              columnGap: 1,
            }}
          >
            {fullname}
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', rowGap: 1 }}>
          <Typography fontWeight={500}>
            {formatMessage({ id: 'whatsappNumber' })}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={300}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              columnGap: 1,
            }}
          >
            {formatNumber(Number(whatsapp_number))}
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', rowGap: 1 }}>
          <Typography fontWeight={500}>
            {formatMessage({ id: 'phoneNumber' })}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={300}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              columnGap: 1,
            }}
          >
            {formatNumber(Number(phone_number))}
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', rowGap: 1 }}>
          <Typography fontWeight={500}>
            {formatMessage({ id: 'preferredLanguage' })}
          </Typography>
          <Typography
            variant="body2"
            fontWeight={300}
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              columnGap: 1,
            }}
          >
            {formatMessage({ id: preferred_lang })}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: '1fr auto',
            columnGap: 1,
          }}
        >
          <Box sx={{ display: 'grid', rowGap: 1 }}>
            <Typography fontWeight={500}>
              {formatMessage({ id: 'profileImage' })}
            </Typography>
            <Avatar
              src={profile_image_ref}
              alt="user profile"
              sx={{ height: 100, width: 100 }}
            />
          </Box>
          <Box>
            <input
              accept="image/*"
              hidden
              id="raised-button-file"
              type="file"
              onChange={changeProfileImage}
            />
            <label htmlFor="raised-button-file">
              <Button
                sx={{ textTransform: 'none', justifySelf: 'none' }}
                variant="text"
                color="primary"
                component="span"
                disabled={isSubmitting}
              >
                {formatMessage({ id: 'edit' })}
              </Button>
            </label>
          </Box>
        </Box>
      </Box>
    </>
  );
}
