import Box from '@mui/material/Box';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter, Route, Routes, } from "react-router-dom";

import { ControllerProvider } from './contexts/controller';
import { GameDirector } from './contexts/GameDirector';
import { SoundProvider } from './contexts/Sound';
import { routes } from './utils/routes';
import { mainTheme } from './utils/themes';

function App() {
  return (
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={mainTheme}>
          <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }} preventDuplicate autoHideDuration={3000}>
            <SoundProvider>
              <ControllerProvider>
                <GameDirector>
                  <Box className='main'>

                    <Routes>
                      {routes.map((route, index) => {
                        return <Route key={index} path={route.path} element={route.content} />
                      })}
                    </Routes>

                  </Box>
                </GameDirector>
              </ControllerProvider>
            </SoundProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  );
}

export default App;
