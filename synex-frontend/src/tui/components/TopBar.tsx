import React from 'react';
import { Box, Text } from 'ink';
import { AVAILABLE_MODELS } from '../../utils/config.js';

interface TopBarProps {
  currentScreen: 'welcome' | 'login' | 'chat';
  selectedModel?: string;
  isAuthenticated?: boolean;
}

export default function TopBar({ currentScreen, selectedModel, isAuthenticated }: TopBarProps) {
  const getGradientText = (text: string, colors: string[]) => {
    return text.split('').map((char, index) => {
      const colorIndex = index % colors.length;
      return (
        <Text key={index} color={colors[colorIndex]}>
          {char}
        </Text>
      );
    });
  };

  const brandColors = ['#00FFFF', '#00CED1', '#1E90FF', '#4169E1', '#6A5ACD'];
  
  return (
    <Box 
      borderStyle="double" 
      borderColor="cyan" 
      paddingX={2} 
      paddingY={1}
      flexDirection="column"
    >
      {/* Main Brand Header */}
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <Box flexDirection="row" alignItems="center">
          <Text color="cyan" bold>⚡ </Text>
          <Box flexDirection="row">
            {getGradientText('SYNEX', brandColors)}
          </Box>
          <Text color="cyan" bold> ⚡</Text>
          <Text color="white" dimColor> | AI-Powered Code Assistant</Text>
        </Box>
        
        <Box flexDirection="row" alignItems="center">
          {isAuthenticated && selectedModel && (
            <>
              <Text color="green">🤖 </Text>
              <Text color="green" bold>
                {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || selectedModel}
              </Text>
              <Text color="white" dimColor> | </Text>
            </>
          )}
          <Text color="yellow">✨ Premium Experience</Text>
        </Box>
      </Box>
      
      {/* Navigation Bar */}
      <Box 
        flexDirection="row" 
        justifyContent="space-between" 
        alignItems="center"
        marginTop={1}
        paddingTop={1}
        borderTop
        borderColor="gray"
      >
        <Box flexDirection="row">
          <Text dimColor>Navigation: </Text>
          {currentScreen === 'chat' && (
            <>
              <Text color="cyan">Ctrl+H</Text>
              <Text dimColor> Help | </Text>
              <Text color="cyan">Ctrl+M</Text>
              <Text dimColor> Model | </Text>
              <Text color="cyan">Ctrl+L</Text>
              <Text dimColor> Logout</Text>
            </>
          )}
          {currentScreen === 'welcome' && (
            <>
              <Text color="cyan">↑↓</Text>
              <Text dimColor> Navigate | </Text>
              <Text color="cyan">Enter</Text>
              <Text dimColor> Select</Text>
            </>
          )}
          {currentScreen === 'login' && (
            <>
              <Text color="cyan">Esc</Text>
              <Text dimColor> Back | </Text>
              <Text color="cyan">Enter</Text>
              <Text dimColor> Login</Text>
            </>
          )}
        </Box>
        
        <Box flexDirection="row" alignItems="center">
          <Text color="red">Ctrl+C</Text>
          <Text dimColor> Exit | </Text>
          <Text color="magenta">v1.0.0</Text>
        </Box>
      </Box>
    </Box>
  );
}