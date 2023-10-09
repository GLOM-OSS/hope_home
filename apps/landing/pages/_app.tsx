import { CacheProvider, EmotionCache } from '@emotion/react';
import { HHThemeProvider, useLanguage } from '@hopehome/theme';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LandingLayout from '../components/layout/layout';
import WhatsappDialog from '../components/profile/whatsappDialog';
import createEmotionCache from '../config_mui/createEmotionCache';
import UserContextProvider, { useUser } from '../contexts/user.provider';
import { updateProfile } from '../services/auth.service';
import './globalStyles.css';
import './styles.css';
import 'aos/dist/aos.css';
import AOS from 'aos';

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
  const [isWhatsappDialogOpen, setIsWhatsappDialogOpen] = useState<boolean>(
    Boolean(person_id && !whatsapp_number)
  );

  useEffect(() => {
    setIsWhatsappDialogOpen(Boolean(person_id && !whatsapp_number));
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
  
  useEffect(
    () =>
      AOS.init({
        offset: 200,
        duration: 600,
        easing: 'ease-in-sine',
        delay: 100,
      }),
    []
  );

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
        <link rel="icon" type="image/x-icon" href="/favicon_green.png" />
      </Head>
      <CacheProvider value={emotionCache}>
        <HHThemeProvider>
          <GoogleOAuthProvider clientId="192320988067-mjrh21aa3ue5blqp2o0nng7tmjkrl971.apps.googleusercontent.com">
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
