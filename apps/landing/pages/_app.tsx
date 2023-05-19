import { CacheProvider, EmotionCache } from '@emotion/react';
import { HHThemeProvider, useLanguage } from '@hopehome/theme';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingLayout from '../components/layout/layout';
import WhatsappDialog from '../components/profile/additionalDataDialog';
import createEmotionCache from '../config_mui/createEmotionCache';
import UserContextProvider, { useUser } from '../contexts/user.provider';
import { updateProfile } from '../services/auth.service';
import './globalStyles.css';
import './styles.css';

const App = (props) => {
  const { Component, pageProps } = props;
  const { languageDispatch } = useLanguage();
  const {
    activeUser: { whatsapp_number, person_id },
    userDispatch,
  } = useUser();
  useEffect(() => {
    languageDispatch({
      type:
        localStorage.getItem('hope_home_active_language') === 'en'
          ? 'USE_ENGLISH'
          : 'USE_FRENCH',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [isWhatsappDialogOpen, setIsWhatsappDialogOpen] =
    useState<boolean>(person_id && !whatsapp_number);

  useEffect(() => {
    setIsWhatsappDialogOpen(person_id && !whatsapp_number);
  }, [person_id, whatsapp_number]);

  const updateWhatsappNumber = (whatsapp_number: string) => {
    updateProfile({ whatsapp_number })
      .then(() => {
        userDispatch({ type: 'UPDATE_USER', payload: { whatsapp_number } });
        setIsWhatsappDialogOpen(false);
      })
      .catch((error) =>
        toast.error(error.message || "Oops, une erreur s'est produite.")
      );
  };

  return (
    <>
      <WhatsappDialog
        open={isWhatsappDialogOpen}
        submitDialog={updateWhatsappNumber}
        closeDialog={() => setIsWhatsappDialogOpen(false)}
      />
      <LandingLayout>
        <Component {...pageProps} />
      </LandingLayout>
    </>
  );
};

interface CustomAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

function CustomApp(props: CustomAppProps) {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;

  return (
    <>
      <Head>
        <title>Hope Home</title>
        <link rel="icon" type="image/x-icon" href="favicon_green.png" />
      </Head>
      <CacheProvider value={emotionCache}>
        <HHThemeProvider>
          <GoogleOAuthProvider clientId="562313049834-07ekkibpmtfq0b2m68i56anbck3utj2p.apps.googleusercontent.com">
            <UserContextProvider>
              <App {...{ Component, pageProps, emotionCache }} />
            </UserContextProvider>
          </GoogleOAuthProvider>
        </HHThemeProvider>
      </CacheProvider>
    </>
  );
}

export default CustomApp;
