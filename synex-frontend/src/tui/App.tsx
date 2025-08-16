import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';
import ChatInterface from './components/ChatInterface';
import { hasApiKey, removeApiKey } from '../utils/config.js';

type AppState = 'welcome' | 'login' | 'chat';
type LoginMethod = 'apikey';

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [loginMethod, setLoginMethod] = useState<LoginMethod | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { exit } = useApp();

  // Always start with welcome screen on startup
  useEffect(() => {
    // Always show welcome screen first, regardless of API key presence
    setCurrentState('welcome');

    // Check if user has API key for potential auto-login later
    if (hasApiKey()) {
      setIsAuthenticated(true);
    }

    // Handle Ctrl+C (SIGINT) to exit without removing API key
    const handleSigInt = () => {
      exit();
    };

    process.on('SIGINT', handleSigInt);

    // Cleanup event listener on unmount
    return () => {
      process.off('SIGINT', handleSigInt);
    };
  }, [exit]);



  // No need for conditional return - let the render logic handle the state

  const handleLoginMethodSelected = (method: LoginMethod) => {
    setLoginMethod(method);
    setCurrentState('login');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentState('chat');
  };

  const handleLogout = () => {
    // Clear API key on explicit logout
    try {
      removeApiKey();
    } catch (error) {
      console.error('Failed to remove API key during logout:', error instanceof Error ? error.message : error);
    }
    setIsAuthenticated(false);
    setLoginMethod(null);
    setCurrentState('welcome');
  };

  return (
    <Box flexDirection="column" height="100%">
      {currentState === 'welcome' && (
        <WelcomeScreen onLoginMethodSelected={handleLoginMethodSelected} />
      )}

      {currentState === 'login' && loginMethod && (
        <LoginScreen
          loginMethod={loginMethod}
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setCurrentState('welcome')}
        />
      )}

      {currentState === 'chat' && isAuthenticated && (
        <ChatInterface onLogout={handleLogout} />
      )}
    </Box>
  );
}
