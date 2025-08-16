import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { sendChatRequest } from '../../utils/backend.js';
import { getDefaultModel } from '../../utils/config.js';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onLogout: () => void;
}

export default function ChatInterface({ onLogout }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [error, setError] = useState('');

  useInput((input: string, key: any) => {
    if (key.ctrl && input === 'l') {
      onLogout();
    } else if (key.ctrl && input === 'h') {
      setShowCommands(!showCommands);
    } else if (key.ctrl && input === 'c' && isLoading) {
      setIsLoading(false);
      setError('Request cancelled');
    }
  });

  const handleSubmit = async (input: string) => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);
    setError('');

    try {
      // Check if it's a command
      if (input.startsWith('/')) {
        await handleCommand(input);
        return;
      }

      // Send to AI
      const response = await sendChatRequest({
        messages: [
          ...messages.map(msg => ({ role: msg.role, content: msg.content })),
          { role: 'user', content: input.trim() }
        ],
        model: getDefaultModel()
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: unknown) {
      let errorMessage: string;
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else {
        errorMessage = 'Failed to send message';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommand = async (command: string) => {
    const cmd = command.toLowerCase();

    if (cmd === '/clear') {
      setMessages([]);
    } else if (cmd === '/help') {
      const helpMessage: Message = {
        role: 'assistant',
        content: `Available commands:
/clear - Clear chat history
/help - Show this help
/logout - Logout and return to welcome screen

Keyboard shortcuts:
Ctrl+L - Logout
Ctrl+H - Toggle command help
Ctrl+C - Cancel current request`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, helpMessage]);
    } else if (cmd === '/logout') {
      onLogout();
    } else {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Unknown command: ${command}. Type /help for available commands.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    setIsLoading(false);
  };

  return (
    <Box flexDirection="column" height="100%">
      {/* Header */}
      <Box borderStyle="double" borderColor="cyan" paddingX={3} paddingY={1} marginBottom={1}>
        <Box flexDirection="column">
          <Box flexDirection="row" justifyContent="center" marginBottom={1}>
            <Text color="cyan" bold>💬 Synex Chat Interface</Text>
          </Box>
          <Box flexDirection="row" justifyContent="center">
            <Text dimColor>Ctrl+H for help | Ctrl+L to logout</Text>
          </Box>
        </Box>
      </Box>

      {/* Command Help */}
      {showCommands && (
        <Box borderStyle="round" borderColor="yellow" paddingX={2} paddingY={1} marginBottom={1}>
          <Box marginBottom={1}>
            <Text color="yellow" bold>📋 Available Commands:</Text>
          </Box>
          <Box flexDirection="column" paddingLeft={1}>
            <Text>• <Text color="cyan">/clear</Text> - Clear chat history</Text>
            <Text>• <Text color="cyan">/help</Text> - Show this help message</Text>
            <Text>• <Text color="cyan">/logout</Text> - Logout and return to welcome screen</Text>
          </Box>
          <Box marginTop={1}>
            <Text dimColor>Press Ctrl+H to hide this help</Text>
          </Box>
        </Box>
      )}

      {/* Messages Area */}
      <Box flexDirection="column" flexGrow={1} paddingX={2} paddingY={1}>
        {messages.length === 0 ? (
          <Box justifyContent="center" alignItems="center" height="100%">
            <Text dimColor>Start a conversation by typing a message below...</Text>
          </Box>
        ) : (
          messages.map((message, index) => {
            const isUser = message.role === 'user';
            return (
              <Box key={index} marginBottom={2}>
                {isUser ? (
                  // User message - enhanced styling with better visual appeal
                  <Box flexDirection="column" alignItems="flex-end">
                    <Box
                       borderStyle="single"
                       borderColor="green"
                       paddingX={3}
                       paddingY={1}
                       width={70}
                     >
                      <Box marginBottom={1}>
                        <Text color="green" bold>👤 You</Text>
                      </Box>
                      <Box paddingLeft={1}>
                        <Text color="white" wrap="wrap">{message.content}</Text>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  // AI message - enhanced styling with better visual appeal
                  <Box flexDirection="column" alignItems="flex-start">
                    <Box
                       borderStyle="double"
                       borderColor="cyan"
                       paddingX={3}
                       paddingY={2}
                       width={90}
                     >
                      <Box marginBottom={1}>
                        <Text color="cyan" bold>🤖 AI Assistant</Text>
                      </Box>
                      <Box paddingLeft={1}>
                        <Text color="white" wrap="wrap">{message.content}</Text>
                      </Box>
                      <Box marginTop={1} paddingLeft={1}>
                        <Text dimColor>───────────────────────────────────</Text>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            );
          })
        )}

        {isLoading && (
          <Box flexDirection="column" alignItems="flex-start" marginBottom={2}>
            <Box
              borderStyle="double"
              borderColor="yellow"
              paddingX={3}
              paddingY={2}
              width={60}
            >
              <Box marginBottom={1}>
                <Text color="yellow" bold>🤖 AI Assistant</Text>
              </Box>
              <Box paddingLeft={1}>
                <Text color="white">Thinking and processing your request...</Text>
              </Box>
              <Box marginTop={1} paddingLeft={1}>
                <Text color="yellow">⚡ ⚡ ⚡</Text>
              </Box>
            </Box>
          </Box>
        )}

        {error && (
          <Box flexDirection="column" alignItems="center" marginBottom={2}>
            <Box
              borderStyle="double"
              borderColor="red"
              paddingX={3}
              paddingY={2}
              width={80}
            >
              <Box marginBottom={1}>
                <Text color="red" bold>❌ Error</Text>
              </Box>
              <Box paddingLeft={1}>
                <Text color="white" wrap="wrap">{error}</Text>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Input Area */}
      <Box borderStyle="round" borderColor="cyan" paddingX={2} paddingY={1}>
        <Box flexDirection="row" alignItems="center">
          <Text color="cyan">💬 </Text>
          <Box flexGrow={1}>
            <TextInput
              value={currentInput}
              onChange={setCurrentInput}
              onSubmit={handleSubmit}
              placeholder="Type your message or /help for commands..."
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
