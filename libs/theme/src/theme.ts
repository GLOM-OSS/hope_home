import { createTheme } from '@mui/material/styles';
import React from 'react';

// thin: 100
// extraLight: 200
// light: 300
// regular: 400
// medium: 500
// semiBold: 600
// bold: 700
// extraBold: 800
// black: 900
// 16px => 1rem

declare module '@mui/material/styles' {
  interface Theme {
    common: {
      lighterPrimary: React.CSSProperties['color'];
      lowerGray: React.CSSProperties['color'];
      white: React.CSSProperties['color'];
      backgroundPrimary: React.CSSProperties['color'];
      CSK200: React.CSSProperties['color'];
      CSK50: React.CSSProperties['color'];
      primaryDark: React.CSSProperties['color'];
    };
  }
  interface ThemeOptions {
    common: {
      line: React.CSSProperties['color'];
      inputBackground: React.CSSProperties['color'];
      placeholder: React.CSSProperties['color'];
      label: React.CSSProperties['color'];
      body: React.CSSProperties['color'];
      titleActive: React.CSSProperties['color'];
    };
  }
  interface TypographyVariants {
    h1: React.CSSProperties;
    h2: React.CSSProperties;
    h3: React.CSSProperties;
    h4: React.CSSProperties;
    h5: React.CSSProperties;
    h6: React.CSSProperties;
    body1: React.CSSProperties;
    body2: React.CSSProperties;
    caption: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    h1: React.CSSProperties;
    h2: React.CSSProperties;
    h3: React.CSSProperties;
    h4: React.CSSProperties;
    h5: React.CSSProperties;
    h6: React.CSSProperties;
    body1: React.CSSProperties;
    body2: React.CSSProperties;
    caption: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h1: true;
    h2: true;
    h3: true;
    h4: true;
    h5: true;
    h6: true;
    body1: true;
    body2: true;
    caption: true;
  }
}

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false; // removes the `xs` breakpoint
    sm: false;
    md: false;
    lg: false;
    xl: false;
    mobile: true; // adds the `mobile` breakpoint
    tablet: true;
    laptop: true;
    desktop: true;
  }
}

export function generateTheme(mode?: 'light' | 'dark') {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#009C7D',
      },
      secondary: {
        main: '#FF9600',
      },
      error: {
        main: '#BB2124',
      },
      success: {
        main: '#4BB543',
      },
      warning: {
        main: '#F0AD4E',
      },
    },
    common: {
      line: '#D9DBE9',
      inputBackground: '#F4F5F7',
      placeholder: '#A0A3BD',
      label: '#6E6D7A',
      body: '#2F3A45',
      titleActive: '#172B4D',
    },
    typography: {
      fontFamily: ['Poppins', 'Raleway', 'Montserrat', 'Roboto', 'serif'].join(
        ','
      ),
      h1: {
        fontSize: '3rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '2.5rem',
        fontWeight: 700,
      },
      h3: {
        fontSize: '2.25rem',
        fontWeight: 700,
      },
      h4: {
        fontSize: '1.75rem',
        fontWeight: 700,
      },
      h5: {
        fontSize: '1.5rem',
        fontWeight: 700,
      },
      h6: {
        fontSize: '1.25rem',
        fontWeight: 700,
      },
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 300,
      },
    },
    breakpoints: {
      values: {
        mobile: 0,
        tablet: 744,
        laptop: 992,
        desktop: 1200,
      },
    },
  });
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#009C7D',
    },
    secondary: {
      main: '#FF9600',
    },
    error: {
      main: '#BB2124',
    },
    success: {
      main: '#4BB543',
    },
    warning: {
      main: '#F0AD4E',
    },
  },
  common: {
    line: '#D9DBE9',
    inputBackground: '#F4F5F7',
    placeholder: '#A0A3BD',
    label: '#6E6D7A',
    body: '#2F3A45',
    titleActive: '#172B4D',
  },
  typography: {
    fontFamily: ['Poppins', 'Raleway', 'Montserrat', 'Roboto', 'serif'].join(
      ','
    ),
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 300,
    },
  },
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 744,
      laptop: 992,
      desktop: 1200,
    },
  },
});

// export default theme;
