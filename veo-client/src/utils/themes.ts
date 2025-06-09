import { createTheme } from '@mui/material/styles';

export const mainTheme = createTheme({
  typography: {
    fontFamily: [
      'Cinzel',
      'roboto',
    ].join(','),
    allVariants: {
      color: '#d0c98d'
    },
    h1: {
      fontSize: '35px'
    },
    h2: {
      fontSize: '26px',
    },
    h3: {
      fontSize: '22px'
    },
    h4: {
      fontSize: '20px'
    },
    h5: {
      fontSize: '18px'
    },
    h6: {
      fontSize: '16px'
    },
    body1: {
      fontSize: '14px',
      lineHeight: '18px'
    },
    subtitle1: {
      fontSize: '14px',
      lineHeight: '18px',
      color: 'rgba(255, 255, 255, 0.7)'
    },
    subtitle2: {
      color: 'rgba(255, 255, 255, 0.5)',
      fontStyle: 'italic',
      fontSize: '12px',
      fontFamily: 'cursive'
    }
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#d0c98d',
      contrastText: '#000000'
    },
    secondary: {
      main: '#d7c529',
      contrastText: "#000000"
    },
    warning: {
      main: '#f59100',
      contrastText: "#fff"
    },
    text: {
      primary: '#d0c98d',
      secondary: 'rgba(10, 10, 9, 0.25)'
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#d0c98d',
          justifyContent: 'flex-start',
          lineHeight: '15px',
          height: '42px',
          letterSpacing: '0.5px',
          fontSize: '14px',
          minWidth: '40px',
        }
      }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '16px',
          background: '#000',
          color: '#80FF00',
          border: '1px solid rgba(128, 255, 0, 0.6)',
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            'webkitBoxShadow': '0 0 0 100px #282729 inset',
            'webkitTextFillColor': '#fff'
          }
        }
      }
    }
  }
})
