import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes, } from "react-router-dom";

import Box from '@mui/material/Box';
import { SnackbarProvider } from 'notistack';

import { routes } from './utils/routes';
import { mainTheme } from './utils/themes';
import { ControllerProvider } from './contexts/Controller';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <Box className='bgImage'>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={mainTheme}>
            <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }} preventDuplicate autoHideDuration={3000}>
              <ControllerProvider>

                <Box className='main'>
                  <AnimatePresence mode="wait">
                    <Header />

                    <Routes>
                      {routes.map((route, index) => {
                        return <Route key={index} path={route.path} element={route.content} />
                      })}
                    </Routes>

                  </AnimatePresence>
                </Box>

              </ControllerProvider>
            </SnackbarProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </Box>
    </BrowserRouter >
  );
}

export default App;
