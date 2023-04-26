import { CacheProvider, EmotionCache } from '@emotion/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import LandingLayout from '../components/layout/layout';
import './styles.css';
import 'react-toastify/dist/ReactToastify.css';
import './globalStyles.css';
import { useLanguage, HHThemeProvider } from '@hopehome/theme';
import createEmotionCache from '../config_mui/createEmotionCache';
import UserContextProvider from '../contexts/user.provider';
import { GoogleOAuthProvider } from '@react-oauth/google';

const App = (props) => {
  const { Component, pageProps } = props;
  const { languageDispatch } = useLanguage();
  useEffect(() => {
    languageDispatch({
      type:
        localStorage.getItem('hope_home_active_language') === 'en'
          ? 'USE_ENGLISH'
          : 'USE_FRENCH',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
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
          <GoogleOAuthProvider clientId="752561817920-8esi5105gks06dugi9l14h7dg23vdnff.apps.googleusercontent.com">
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
