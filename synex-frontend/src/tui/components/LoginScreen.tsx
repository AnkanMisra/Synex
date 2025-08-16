import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { loginWithAPIKey } from '../../convex/auth.js';

type LoginMethod = 'apikey';

interface LoginScreenProps {
  loginMethod: LoginMethod;
  onLoginSuccess: () => void;
  onBack: () => void;
}

export default function LoginScreen({ loginMethod, onLoginSuccess, onBack }: LoginScreenProps) {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInput, setShowInput] = useState(true);

  useInput((input: string, key: any) => {
    if (key.escape) {
      onBack();
    }
  });

  const handleSubmit = async () => {
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
          🔑 API Key Login
        </Text>
      </Box>

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
      <Box marginTop={2}>
        <Text dimColor>
          Press Escape to go back, Enter to login
        </Text>
      </Box>
    </Box>
  );
}
