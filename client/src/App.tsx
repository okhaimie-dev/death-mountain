import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes, } from "react-router-dom";

import Box from '@mui/material/Box';
import { SnackbarProvider } from 'notistack';

import { routes } from './utils/routes';
import { mainTheme } from './utils/themes';

function App() {

  return (
    <BrowserRouter>
      <Box className='bgImage'>
        <Box className='background'>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={mainTheme}>
              <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }} preventDuplicate autoHideDuration={3000}>

                <Box className='main'>
                  <AnimatePresence mode="wait">

                    <Routes>
                      {routes.map((route, index) => {
                        return <Route key={index} path={route.path} element={route.content} />
                      })}
                    </Routes>

                  </AnimatePresence>
                </Box>

              </SnackbarProvider>
            </ThemeProvider>
          </StyledEngineProvider>
        </Box>
      </Box>
    </BrowserRouter >
  );
}

export default App;
