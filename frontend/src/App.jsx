import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './components/layout/ScrollToTop';
import WelcomeSplash from './components/common/WelcomeSplash';
import GlobalErrorBoundary from './components/common/GlobalErrorBoundary';
import { Toaster } from 'react-hot-toast';
import './styles/global.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <ScrollToTop />
            <WelcomeSplash />
            <GlobalErrorBoundary>
              <AppRoutes />
            </GlobalErrorBoundary>
            <Toaster position="top-right" />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
