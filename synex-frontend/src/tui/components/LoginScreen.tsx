import React, { useState, useEffect } from 'react';
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
    <Box flexDirection="column" height="100%">


      {/* Main Content */}
      <Box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1}>

        {/* Main Login Form */}
        <Box
          flexDirection="column"
          alignItems="center"
          borderStyle="single"
          borderColor="green"
          paddingX={6}
          paddingY={1}
          width={100}
          marginBottom={2}
        >
          <Box marginBottom={1}>
            <Text color="green" bold>Get Started in Seconds</Text>
          </Box>

          <Box flexDirection="column" alignItems="center" width="100%">
            <Box marginBottom={1}>
              <Text color="white">
                Enter your OpenRouter API key to unlock premium features:
              </Text>
            </Box>

            <Box
              marginBottom={1}
              borderStyle="round"
              borderColor="blue"
              paddingX={2}
              paddingY={1}
              width="100%"
              alignItems="center"
              justifyContent="center"
            >
              <Box flexDirection="column" alignItems="center" justifyContent="center">
                <Text color="blue" bold>How to get your API key:</Text>
                <Box marginTop={1} justifyContent="center">
                  <Text color="cyan">1. Visit: </Text>
                  <Text color="yellow" bold>https://openrouter.ai/keys</Text>
                </Box>
                <Box justifyContent="center">
                  <Text color="cyan">2. Create an account or sign in</Text>
                </Box>
                <Box justifyContent="center">
                  <Text color="cyan">3. Generate a new API key</Text>
                </Box>
                <Box justifyContent="center">
                  <Text color="cyan">4. Copy and paste it below</Text>
                </Box>
              </Box>
            </Box>

            {showInput && (
              <Box
                marginBottom={1}
                width="100%"
                borderStyle="single"
                borderColor="cyan"
                paddingX={2}
                paddingY={1}
                alignItems="center"
              justifyContent="center"
              >
                <Box flexDirection="column">
                  <Box marginBottom={1} alignItems="center" justifyContent="center">
                    <Text color="cyan" bold>API Key:</Text>
                  </Box>
                  <TextInput
                    value={apiKey}
                    onChange={setApiKey}
                    onSubmit={handleSubmit}
                    placeholder="sk-or-v1-..."
                    mask="*"
                  />
                </Box>
              </Box>
            )}

            {error && (
              <Box
                marginBottom={2}
                borderStyle="double"
                borderColor="red"
                paddingX={3}
                paddingY={1}
                width="100%"
              >
                <Box flexDirection="row" alignItems="center" justifyContent="center">
                  <Text color="red" bold>Authentication Failed</Text>
                </Box>
                <Box justifyContent="center" marginTop={1}>
                  <Text color="white">{error}</Text>
                </Box>
              </Box>
            )}

            {isLoading && (
              <Box
                borderStyle="round"
                borderColor="yellow"
                paddingX={3}
                paddingY={1}
              >
                <Box flexDirection="row" alignItems="center">
                  <Text color="yellow">Validating your API key...</Text>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
