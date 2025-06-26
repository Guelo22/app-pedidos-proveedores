import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'


const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)
