import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { sendChatRequest } from '../../utils/backend.js';
import { getDefaultModel, setDefaultModel, AVAILABLE_MODELS } from '../../utils/config.js';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
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
  const [selectedModel, setSelectedModel] = useState(getDefaultModel());
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [modelSelectorIndex, setModelSelectorIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');

  // Progress animation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setProgress(0);
      setProgressText('Initializing...');
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 15 + 5;
          if (newProgress < 30) {
            setProgressText('Connecting to AI...');
          } else if (newProgress < 60) {
            setProgressText('Processing request...');
          } else if (newProgress < 85) {
            setProgressText('Generating response...');
          } else {
            setProgressText('Finalizing...');
          }
          return Math.min(newProgress, 90);
        });
      }, 200);
    } else {
      setProgress(0);
      setProgressText('');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  useInput((input: string, key: any) => {
    // Handle model selector navigation
    if (showModelSelector) {
      if (key.upArrow) {
        setModelSelectorIndex(prev => Math.max(0, prev - 1));
        return;
      } else if (key.downArrow) {
        setModelSelectorIndex(prev => Math.min(AVAILABLE_MODELS.length - 1, prev + 1));
        return;
      } else if (key.return) {
        const newModel = AVAILABLE_MODELS[modelSelectorIndex].id;
        setSelectedModel(newModel);
        setDefaultModel(newModel);
        setShowModelSelector(false);
        return;
      } else if (key.escape) {
        setShowModelSelector(false);
        return;
      }
    }

    // Handle global shortcuts - check for specific key combinations
    // Ctrl+L for logout
    if (key.ctrl && input === 'l') {
      onLogout();
      return;
    }

    // Ctrl+H for help
    if (key.ctrl && input === 'h') {
      setShowCommands(!showCommands);
      return;
    }

    // Ctrl+M for model selector - check for various representations
    if ((key.ctrl && (input === 'm' || key.name === 'm')) ||
        key.sequence === '\u000D' ||
        (key.ctrl && key.sequence === '\r') ||
        (key.name === 'm' && key.ctrl)) {
      setShowModelSelector(!showModelSelector);
      setModelSelectorIndex(AVAILABLE_MODELS.findIndex(m => m.id === selectedModel));
      return;
    }

    // Ctrl+C for cancel
    if (key.ctrl && input === 'c' && isLoading) {
      setIsLoading(false);
      setError('Request cancelled');
      return;
    }
  }, { isActive: true });

  const handleSubmit = async () => {
    if (!currentInput.trim()) return;

    // Handle command palette commands
    if (currentInput.startsWith('/')) {
      const parts = currentInput.trim().split(/\s+/);
      const command = parts[0].toLowerCase();
      const commandArgs = parts.slice(1);

      switch (command) {
        case '/help':
          setShowCommands(true);
          setCurrentInput('');
          return;
        case '/clear':
          setMessages([]);
          setCurrentInput('');
          setIsLoading(false); // Reset loading state
          setError(''); // Clear any errors
          return;
        case '/model':
          if (commandArgs.length === 0) {
            // Show interactive selector
            setShowModelSelector(true);
            setModelSelectorIndex(AVAILABLE_MODELS.findIndex(m => m.id === selectedModel));
          } else {
            const target = commandArgs.join(' ').toLowerCase();
            const found = AVAILABLE_MODELS.find(m => {
              const id = m.id.toLowerCase();
              const name = m.name.toLowerCase();
              // exact id, exact name, or partial name match ignoring parenthetical suffix like "(free)"
              return (
                id === target ||
                name === target ||
                name.replace(/\s*\(.*?\)$/, '') === target ||
                name.includes(target)
              );
            });
            if (found) {
              setSelectedModel(found.id);
              setDefaultModel(found.id);
              const confirmMsg: Message = {
                role: 'assistant',
                content: `Switched model to: ${found.name}`,
                timestamp: new Date(),
                model: found.id
              };
              setMessages(prev => [...prev, confirmMsg]);
            } else {
              const errMsg: Message = {
                role: 'assistant',
                content: `Unknown model: ${target}. Use /model to list available models.`,
                timestamp: new Date(),
                model: selectedModel
              };
              setMessages(prev => [...prev, errMsg]);
            }
          }
          setCurrentInput('');
          return;
        case '/logout':
          onLogout();
          return;
        default:
          // Show error for unknown command
          const errorMessage: Message = {
            role: 'assistant',
            content: `Unknown command: ${currentInput}\n\nAvailable commands:\n• /help - Show keyboard shortcuts\n• /model - Select AI model\n• /clear - Clear current conversation\n• /logout - Logout and return to welcome`,
            timestamp: new Date(),
            model: selectedModel
          };
          setMessages(prev => [...prev, errorMessage]);
          setCurrentInput('');
          return;
      }
    }

    const userMessage: Message = {
      role: 'user',
      content: currentInput,
      timestamp: new Date(),
      model: selectedModel
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    try {
      // Send to AI
      const response = await sendChatRequest({
        messages: [
          ...messages.map(msg => ({ role: msg.role, content: msg.content })),
          { role: 'user', content: currentInput.trim() }
        ],
        model: selectedModel
      });

      // Complete progress animation
      setProgress(100);
      setProgressText('Response received!');

      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 300));

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message.content,
        timestamp: new Date(),
        model: response.model
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
      setIsLoading(false); // Reset loading state
      setError(''); // Clear any errors
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
Ctrl+M - Select AI model
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


      {/* Enhanced Command Help */}
      {showCommands && (
        <Box
          borderStyle="double"
          borderColor="yellow"
          paddingX={3}
          paddingY={2}
          marginBottom={2}
          marginX={2}
        >
          <Box flexDirection="column">
            <Box marginBottom={2} justifyContent="center">
              <Text color="yellow" bold> Command Reference Guide</Text>
            </Box>
            <Box flexDirection="column" paddingLeft={2}>
              <Box marginBottom={1}>
                <Text color="cyan" bold>Chat Commands:</Text>
              </Box>
              <Text>  • <Text color="green">/clear</Text> - Clear entire chat history</Text>
              <Text>  • <Text color="green">/help</Text> - Show this comprehensive help</Text>
              <Text>  • <Text color="green">/model &lt;name/id&gt;</Text> - Quick switch AI model</Text>
              <Text>  • <Text color="green">/logout</Text> - Logout and return to welcome</Text>

              <Box marginTop={1} marginBottom={1}>
                <Text color="cyan" bold>Keyboard Shortcuts:</Text>
              </Box>
              <Text>  • <Text color="magenta">Ctrl+H</Text> - Toggle this help panel</Text>
              <Text>  • <Text color="magenta">Ctrl+M</Text> - Open model selector</Text>
              <Text>  • <Text color="magenta">Ctrl+L</Text> - Quick logout</Text>
              <Text>  • <Text color="magenta">Ctrl+C</Text> - Exit application</Text>
            </Box>
            <Box marginTop={2} justifyContent="center">
              <Text color="yellow" dimColor> Press Ctrl+H again to hide this panel</Text>
            </Box>
          </Box>
        </Box>
      )}

      {/* Enhanced Model Selector */}
      {showModelSelector && (
        <Box
          justifyContent="center"
          alignItems="center"
          height="100%"
          position="absolute"
          width="100%"
        >
          <Box
            borderStyle="double"
            borderColor="green"
            paddingX={6}
            paddingY={3}
            width={60}
          >
            <Box flexDirection="column">
              <Box marginBottom={2} justifyContent="center">
                <Text color="green" bold> AI Model Selection Center</Text>
              </Box>
              <Box flexDirection="column" alignItems="center">
              {AVAILABLE_MODELS.map((model, index) => {
                const isSelected = index === modelSelectorIndex;
                const isCurrent = model.id === selectedModel;
                return (
                  <Box
                    key={model.id}
                    marginBottom={1}
                    borderStyle={isSelected ? "single" : undefined}
                    borderColor={isSelected ? "cyan" : undefined}
                    paddingX={isSelected ? 2 : 0}
                    paddingY={isSelected ? 1 : 0}
                  >
                    <Box flexDirection="row" alignItems="center">
                      <Text color={isSelected ? "cyan" : "white"} bold>
                        {isSelected ? "> " : "  "}
                      </Text>
                      <Text color={isSelected ? "cyan" : "white"} bold={isSelected}>
                        {model.name}
                      </Text>
                      {isCurrent && (
                        <Text color="yellow" bold> (Active)</Text>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
            <Box marginTop={2} justifyContent="center">
              <Text color="green" dimColor> Use ↑↓ to navigate • Enter to select • Escape to cancel</Text>
            </Box>
          </Box>
        </Box>
      </Box>
      )}

      {/* Enhanced Messages Area */}
      <Box flexDirection="column" flexGrow={1} paddingX={3} paddingY={2}>
        {messages.length === 0 ? (
          <Box flexDirection="column" flexGrow={1}>
            {/* Empty state - no welcome message */}
          </Box>
        ) : (
          <>
            {messages.map((message, index) => {
              const isUser = message.role === 'user';
              const timestamp = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <Box key={index} marginBottom={1} width="100%" height={20}>
                  <Box flexDirection="row" width="100%" height={20}>
                    {isUser ? (
                      // User Message on Right
                      <>
                        <Box flexGrow={1} />
                        <Box width="50%" height={20} borderStyle="single" borderColor="green" paddingX={2} paddingY={1}>
                          <Box flexDirection="row" alignItems="center" height={1}>
                            <Text color="green" bold>You</Text>
                            <Box flexGrow={1} />
                            <Text color="gray" dimColor>{timestamp}</Text>
                          </Box>
                          <Box height={17} overflow="hidden">
                            <Text color="white" wrap="wrap">{message.content}</Text>
                          </Box>
                        </Box>
                      </>
                    ) : (
                      // AI Message on Left
                      <>
                        <Box width="50%" height={20} borderStyle="single" borderColor="cyan" paddingX={2} paddingY={1}>
                          <Box flexDirection="row" alignItems="center" height={1}>
                            <Text color="cyan" bold>AI</Text>
                            {message.model && (
                              <Text color="yellow" dimColor>
                                {' • '}{AVAILABLE_MODELS.find(m => m.id === message.model)?.name || message.model}
                              </Text>
                            )}
                            <Box flexGrow={1} />
                            <Text color="gray" dimColor>{timestamp}</Text>
                          </Box>
                          <Box height={17} overflow="hidden">
                            <Text color="white" wrap="wrap">{message.content}</Text>
                          </Box>
                        </Box>
                        <Box flexGrow={1} />
                      </>
                    )}
                  </Box>
                </Box>
              );
           })}

           {/* Enhanced Loading Indicator with Progress Bar */}
           {isLoading && (
             <Box marginBottom={3}>
               <Box flexDirection="column" alignItems="flex-start">
                 <Box
                   borderStyle="double"
                   borderColor="cyan"
                   paddingX={4}
                   paddingY={2}
                   width={85}
                 >
                   <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom={1}>
                     <Box flexDirection="row" alignItems="center">
                       <Text color="cyan" bold>AI Assistant</Text>
                       <Text color="yellow" dimColor> • {selectedModel}</Text>
                     </Box>
                     <Text color="gray" dimColor>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                   </Box>
                   <Box
                     paddingX={2}
                     paddingY={1}
                     borderStyle="single"
                     borderColor="cyan"
                   >
                     <Box flexDirection="column">
                       <Text color="cyan">{progressText}</Text>
                       <Box marginTop={1}>
                         <Box flexDirection="row" alignItems="flex-start">
                           <Text color="cyan">Progress: </Text>
                           <Box marginLeft={2}>
                             <Box height={10} width={3} borderStyle="single" borderColor="gray" flexDirection="column" justifyContent="flex-end">
                               <Box height={Math.floor(progress * 10 / 100)} backgroundColor="cyan" width={1}>
                                 <Text> </Text>
                               </Box>
                             </Box>
                           </Box>
                           <Box marginLeft={2}>
                             <Text color="yellow">{Math.floor(progress)}%</Text>
                           </Box>
                         </Box>
                       </Box>
                     </Box>
                   </Box>
                   <Box marginTop={1} justifyContent="center">
                     <Text color="cyan" dimColor>───────────────────────────────────────</Text>
                   </Box>
                 </Box>
               </Box>
             </Box>
           )}
         </>
         )}



        {error && (
          <Box flexDirection="column" alignItems="center" marginBottom={3}>
            <Box
              borderStyle="double"
              borderColor="red"
              paddingX={4}
              paddingY={3}
              width={85}
            >
              <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom={2}>
                <Box flexDirection="row" alignItems="center">
                  <Text color="red" bold>Error Occurred</Text>
                </Box>
                <Text color="gray" dimColor>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </Box>
              <Box
                paddingX={3}
                paddingY={2}
                borderStyle="single"
                borderColor="red"
              >
                <Text color="white" wrap="wrap">{error}</Text>
              </Box>
              <Box marginTop={2} flexDirection="column" alignItems="center">
                <Text color="yellow" dimColor>Troubleshooting Tips:</Text>
                <Box flexDirection="column" paddingLeft={2} marginTop={1}>
                  <Text color="cyan" dimColor>• Check your internet connection</Text>
                  <Text color="green" dimColor>• Verify your API key is valid</Text>
                  <Text color="magenta" dimColor>• Try a different model if available</Text>
                </Box>
                <Box marginTop={2}>
                  <Text color="red" dimColor>Please try again or use /help for assistance</Text>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Enhanced Input Area */}
      <Box flexDirection="column" paddingX={3} paddingY={2}>
        {/* Command Suggestions */}
        {currentInput.startsWith('/') && (
          <Box
            borderStyle="round"
            borderColor="yellow"
            paddingX={3}
            paddingY={1}
            marginBottom={1}
          >
            <Text color="yellow" bold>Command Palette</Text>
            <Box flexDirection="column" paddingLeft={2} marginTop={1}>
              <Text color="cyan">• /help - Show keyboard shortcuts</Text>
              <Text color="green">• /clear - Clear current conversation</Text>
              <Text color="green">• /model - Select AI model</Text>
              <Text color="magenta">• /logout - Logout and return to welcome</Text>
            </Box>
          </Box>
        )}

        {/* Enhanced Single Input Box */}
        <Box
          borderStyle="single"
          borderColor={currentInput.startsWith('/') ? 'yellow' : 'blue'}
          paddingX={3}
          paddingY={2}
          minHeight={5}
          flexDirection="column"
        >
          <Box flexGrow={1}>
            <TextInput
              value={currentInput}
              onChange={setCurrentInput}
              onSubmit={handleSubmit}
              placeholder={currentInput.startsWith('/') ? 'Type a command... (e.g., /help, /clear)' : 'Type your message here... (Press Enter to send)'}
            />
          </Box>
          {/* Model name overlay in bottom-left */}
          <Box
            marginTop={1}
            justifyContent="flex-start"
          >
            <Text color="cyan" dimColor>
              {selectedModel}
            </Text>
          </Box>
        </Box>


      </Box>
    </Box>
  );
}
