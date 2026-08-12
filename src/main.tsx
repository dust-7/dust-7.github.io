import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Home from './features/home/Home.tsx';

const base = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: green[600],
    },
  },
});

const theme = createTheme(base, {
  typography: {
    h2: {
      color: base.palette.primary.main,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Home />
    </ThemeProvider>
  </StrictMode>,
);
