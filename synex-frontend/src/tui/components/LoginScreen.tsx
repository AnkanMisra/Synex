import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { loginWithAPIKey } from '../../convex/auth.js';

type LoginMethod = 'free' | 'apikey';

interface LoginScreenProps {
  loginMethod: LoginMethod;
  onLoginSuccess: () => void;
  onBack: () => void;
}

export default function LoginScreen({ loginMethod, onLoginSuccess, onBack }: LoginScreenProps) {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInput, setShowInput] = useState(loginMethod === 'apikey');

  useInput((input: string, key: any) => {
    if (key.escape) {
      onBack();
    } else if (key.return && loginMethod === 'free' && !isLoading) {
      handleSubmit();
    }
  });

  const handleSubmit = async () => {
    if (loginMethod === 'free') {
      // For free login, we'll simulate success for now
      // In a real implementation, this would handle free API authentication
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess();
      }, 1000);
      return;
    }

    if (!apiKey.trim()) {
      setError('Please enter your API key');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use the existing login function with the provided API key
      const success = await loginWithAPIKey(apiKey.trim());
      if (success) {
        onLoginSuccess();
      } else {
        setError('Login failed. Please check your API key.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" height="100%">
      <Box borderStyle="round" borderColor="cyan" paddingX={2} marginBottom={2}>
        <Text color="cyan">
          {loginMethod === 'free' ? '🚀 Free API Login' : '🔑 API Key Login'}
        </Text>
      </Box>

      {loginMethod === 'free' ? (
        <Box flexDirection="column" alignItems="center">
          <Box marginBottom={1}>
            <Text>
              You'll get free credits to start using Synex!
            </Text>
          </Box>
          <Box marginBottom={2}>
            <Text dimColor>
              Press Enter to continue with free login
            </Text>
          </Box>
          {!isLoading ? (
            <Box>
              <Text color="green">Press Enter to login</Text>
            </Box>
          ) : (
            <Text color="yellow">Logging in...</Text>
          )}
        </Box>
      ) : (
        <Box flexDirection="column" alignItems="center" width={60}>
          <Box marginBottom={1}>
            <Text>
              Enter your OpenRouter API key:
            </Text>
          </Box>
          <Box marginBottom={2}>
            <Text dimColor>
              Get your API key from: https://openrouter.ai/keys
            </Text>
          </Box>

          {showInput && (
            <Box marginBottom={1} width="100%">
              <Text color="cyan">API Key: </Text>
              <TextInput
                value={apiKey}
                onChange={setApiKey}
                onSubmit={handleSubmit}
                placeholder="sk-or-..."
                mask="*"
              />
            </Box>
          )}

          {error && (
            <Box marginBottom={1}>
              <Text color="red">
                ❌ {error}
              </Text>
            </Box>
          )}

          {isLoading && (
            <Text color="yellow">Validating API key...</Text>
          )}
        </Box>
      )}

      <Box marginTop={2}>
        <Text dimColor>
          Press Escape to go back, {loginMethod === 'apikey' ? 'Enter to login' : 'Enter to continue'}
        </Text>
      </Box>
    </Box>
  );
}
