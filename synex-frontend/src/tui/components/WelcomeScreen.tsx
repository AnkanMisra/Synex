import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { SYNEX_LOGO } from '../../output/banner.js';

type LoginMethod = 'apikey';

interface WelcomeScreenProps {
  onLoginMethodSelected: (method: LoginMethod) => void;
}

const menuOptions = [
  {
    title: '🔑 API Key Login',
    description: 'Use your own API key for unlimited access',
    value: 'apikey' as LoginMethod
  }
];

export default function WelcomeScreen({ onLoginMethodSelected }: WelcomeScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

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
    <Box flexDirection="column" alignItems="center" justifyContent="center" height="100%" paddingX={4}>
      {/* Welcome Box */}
      <Box borderStyle="round" borderColor="cyan" paddingX={2} marginBottom={2}>
        <Text color="cyan">✻ Welcome to Synex ✻</Text>
      </Box>

      {/* Logo */}
      <Box flexDirection="column" alignItems="center" marginBottom={3}>
        {SYNEX_LOGO.map((line, index) => {
          const colors = ['#00FFFF', '#00CED1', '#1E90FF'];
          const colorIndex = index % colors.length;
          return (
            <Text key={index} color={colors[colorIndex]} bold>
              {line}
            </Text>
          );
        })}
      </Box>

      {/* Description */}
      <Box marginBottom={3}>
        <Text dimColor>
          AI tool for code review, analysis and smart automation.
        </Text>
      </Box>

      {/* Menu Title */}
      <Box marginBottom={1}>
        <Text color="cyan">
          Select login method:
        </Text>
      </Box>

      {/* Menu Options */}
      <Box flexDirection="column" alignItems="center" marginBottom={2}>
        {menuOptions.map((option, index) => {
          const isSelected = index === selectedIndex;
          return (
            <Box key={index} marginBottom={1} paddingX={2}>
              <Box flexDirection="row" alignItems="center">
                <Text color={isSelected ? 'cyan' : 'white'}>
                  {isSelected ? '❯ ' : '  '}
                </Text>
                <Text color={isSelected ? 'cyan' : 'white'} bold={isSelected}>
                  {option.title}
                </Text>
                <Text dimColor> ({option.description})</Text>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Instructions */}
      <Box marginTop={2}>
        <Text dimColor>
          Use arrow keys to navigate, Enter to select, Ctrl+C to exit
        </Text>
      </Box>
    </Box>
  );
}
