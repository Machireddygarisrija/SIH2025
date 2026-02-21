import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import AppRoutes from '@/routes/AppRoutes';
import theme from '@/utils/theme';
import NotificationSnackbar from '@/components/common/NotificationSnackbar';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
            <NotificationSnackbar />
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;