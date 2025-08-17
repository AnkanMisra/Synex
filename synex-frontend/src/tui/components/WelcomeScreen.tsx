import React, { useState } from 'react';
import { Box, Text, useInput, useStdout } from 'ink';
import { SYNEX_LOGO } from '../../output/banner.js';


type LoginMethod = 'apikey' | 'guest';

interface WelcomeScreenProps {
  onLoginMethodSelected: (method: LoginMethod) => void;
}

const menuOptions = [
  {
    title: 'API Key Login',
    description: 'Use your own API key for unlimited access',
    value: 'apikey' as LoginMethod
  },
  {
    title: 'Guest Access (Read-only)',
    description: 'Explore limited features without an API key',
    value: 'guest' as LoginMethod
  }
];

export default function WelcomeScreen({ onLoginMethodSelected }: WelcomeScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Responsive width based on terminal size
  const { stdout } = useStdout();
  const columns = stdout?.columns ?? 80;
  const contentWidth = Math.min(60, Math.max(40, columns - 4));

  useInput((input: string, key: any) => {
    if (key.upArrow || key.leftArrow) {
      setSelectedIndex(prev => prev > 0 ? prev - 1 : menuOptions.length - 1);
    } else if (key.downArrow || key.rightArrow) {
      setSelectedIndex(prev => prev < menuOptions.length - 1 ? prev + 1 : 0);
    } else if (key.return) {
      onLoginMethodSelected(menuOptions[selectedIndex].value);
    }
  });
  return (
    <Box flexDirection="column" height="100%">
      {/* Main Content */}
      <Box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} paddingX={4}>
        {/* Enhanced Logo with Animation Effect */}
        <Box
          flexDirection="column"
          alignItems="center"
          marginBottom={2}
          borderStyle="round"
          borderColor="magenta"
          paddingX={3}
          paddingY={1}
          width={contentWidth}
        >
          <Box marginBottom={1}>
          </Box>
          {SYNEX_LOGO.map((line, index) => {
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
            const colorIndex = index % colors.length;
            return (
              <Text key={index} color={colors[colorIndex]} bold>
                {line}
              </Text>
            );
          })}
          <Box marginTop={1}>
            <Text color="yellow" dimColor> Powered by Advanced AI Technology </Text>
          </Box>
        </Box>


        {/* Enhanced Authentication Section */}
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          borderStyle="round"
          borderColor="blueBright"
          paddingX={4}
          paddingY={1}
          marginBottom={2}
          width={contentWidth}
        >
          <Box flexDirection="column" alignItems="center" justifyContent="center">
            <Box marginBottom={1} width="100%" justifyContent="center">
              <Text color="cyan" bold>Choose Your Authentication Method</Text>
            </Box>

            {menuOptions.map((option, index) => {
              const isSelected = index === selectedIndex;
              return (
                <Box
                  key={index}
                  flexDirection="column"
                  alignItems="center"
                  marginBottom={1}
                  width="100%"
                >
                  <Box width="100%" justifyContent="center">
                    <Text color={isSelected ? 'magenta' : 'cyan'} bold={isSelected}>
                      {`${isSelected ? '> ' : '  '}${option.title}`}
                    </Text>
                  </Box>
                  <Box width="100%" justifyContent="center">
                    <Text color={isSelected ? 'yellow' : 'gray'} dimColor={!isSelected}>
                      {option.description}
                    </Text>
                  </Box>
                </Box>
              );
            })}

            <Box marginTop={1} width="100%" justifyContent="center">
              <Text color="gray" dimColor>Use ↑↓ arrows to navigate, Enter to select</Text>
            </Box>
          </Box>
        </Box>

        {/* Enhanced Status Bar */}

      </Box>
    </Box>
  );
}
