#!/usr/bin/env node

// src/tui-index.tsx
import { render } from "ink";

// src/tui/App.tsx
import { useState as useState4, useEffect as useEffect2 } from "react";
import { Box as Box4, useApp } from "ink";

// src/tui/components/WelcomeScreen.tsx
import { useState } from "react";
import { Box, Text, useInput } from "ink";

// src/output/banner.ts
import chalk from "chalk";
var SYNEX_LOGO = [
  "  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557   \u2588\u2588\u2557\u2588\u2588\u2588\u2557   \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557  \u2588\u2588\u2557  ",
  "  \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u255A\u2588\u2588\u2557 \u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u255A\u2588\u2588\u2557\u2588\u2588\u2554\u255D  ",
  "  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u255A\u2588\u2588\u2588\u2588\u2554\u255D \u2588\u2588\u2554\u2588\u2588\u2557 \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2557   \u255A\u2588\u2588\u2588\u2554\u255D   ",
  "  \u255A\u2550\u2550\u2550\u2550\u2588\u2588\u2551  \u255A\u2588\u2588\u2554\u255D  \u2588\u2588\u2551\u255A\u2588\u2588\u2557\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u255D   \u2588\u2588\u2554\u2588\u2588\u2557   ",
  "  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551   \u2588\u2588\u2551   \u2588\u2588\u2551 \u255A\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2554\u255D \u2588\u2588\u2557  ",
  "  \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D   \u255A\u2550\u255D   \u255A\u2550\u255D  \u255A\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u255D  "
];
var banner = [
  "",
  ...SYNEX_LOGO,
  ""
];

// src/tui/components/WelcomeScreen.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var menuOptions = [
  {
    title: "\u{1F680} Free API Login",
    description: "Quick start with free credits",
    value: "free"
  },
  {
    title: "\u{1F511} API Key Login",
    description: "Use your own API key for unlimited access",
    value: "apikey"
  }
];
function WelcomeScreen({ onLoginMethodSelected }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  useInput((input, key) => {
    if (key.upArrow || key.leftArrow) {
      setSelectedIndex((prev) => prev > 0 ? prev - 1 : menuOptions.length - 1);
    } else if (key.downArrow || key.rightArrow) {
      setSelectedIndex((prev) => prev < menuOptions.length - 1 ? prev + 1 : 0);
    } else if (key.return) {
      onLoginMethodSelected(menuOptions[selectedIndex].value);
    }
  });
  return /* @__PURE__ */ jsxs(Box, { flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", paddingX: 4, children: [
    /* @__PURE__ */ jsx(Box, { borderStyle: "round", borderColor: "cyan", paddingX: 2, marginBottom: 2, children: /* @__PURE__ */ jsx(Text, { color: "cyan", children: "\u273B Welcome to Synex \u273B" }) }),
    /* @__PURE__ */ jsx(Box, { flexDirection: "column", alignItems: "center", marginBottom: 3, children: SYNEX_LOGO.map((line, index) => {
      const colors = ["#00FFFF", "#00CED1", "#1E90FF"];
      const colorIndex = index % colors.length;
      return /* @__PURE__ */ jsx(Text, { color: colors[colorIndex], bold: true, children: line }, index);
    }) }),
    /* @__PURE__ */ jsx(Box, { marginBottom: 3, children: /* @__PURE__ */ jsx(Text, { dimColor: true, children: "AI tool for code review, analysis and smart automation." }) }),
    /* @__PURE__ */ jsx(Box, { marginBottom: 1, children: /* @__PURE__ */ jsx(Text, { color: "cyan", children: "Select login method:" }) }),
    /* @__PURE__ */ jsx(Box, { flexDirection: "column", alignItems: "center", marginBottom: 2, children: menuOptions.map((option, index) => {
      const isSelected = index === selectedIndex;
      return /* @__PURE__ */ jsx(Box, { marginBottom: 1, paddingX: 2, children: /* @__PURE__ */ jsxs(Box, { flexDirection: "row", alignItems: "center", children: [
        /* @__PURE__ */ jsx(Text, { color: isSelected ? "cyan" : "white", children: isSelected ? "\u276F " : "  " }),
        /* @__PURE__ */ jsx(Text, { color: isSelected ? "cyan" : "white", bold: isSelected, children: option.title }),
        /* @__PURE__ */ jsxs(Text, { dimColor: true, children: [
          " (",
          option.description,
          ")"
        ] })
      ] }) }, index);
    }) }),
    /* @__PURE__ */ jsx(Box, { marginTop: 2, children: /* @__PURE__ */ jsx(Text, { dimColor: true, children: "Use arrow keys to navigate, Enter to select, Ctrl+C to exit" }) })
  ] });
}

// src/tui/components/LoginScreen.tsx
import { useState as useState2 } from "react";
import { Box as Box2, Text as Text2, useInput as useInput2 } from "ink";
import TextInput from "ink-text-input";

// src/convex/auth.ts
import { createInterface } from "readline";
import chalk2 from "chalk";

// src/utils/config.ts
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";
var DEFAULT_CONFIG = {
  backendUrl: "http://localhost:3000",
  defaultModel: "openai/gpt-oss-20b:free"
};
function getConfigDir() {
  return join(homedir(), ".synex");
}
function getConfigPath() {
  return join(getConfigDir(), "config.json");
}
function ensureConfigDir() {
  const configDir = getConfigDir();
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }
}
function loadConfig() {
  const configPath = getConfigPath();
  if (!existsSync(configPath)) {
    return { ...DEFAULT_CONFIG };
  }
  try {
    const configData = readFileSync(configPath, "utf8");
    const config = JSON.parse(configData);
    return { ...DEFAULT_CONFIG, ...config };
  } catch (error) {
    console.warn("Failed to load config, using defaults:", error);
    return { ...DEFAULT_CONFIG };
  }
}
function saveConfig(config) {
  ensureConfigDir();
  const configPath = getConfigPath();
  try {
    writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
  } catch (error) {
    throw new Error(`Failed to save config: ${error}`);
  }
}
function getApiKey() {
  const config = loadConfig();
  return config.openRouterApiKey || null;
}
function setApiKey(apiKey) {
  const config = loadConfig();
  config.openRouterApiKey = apiKey;
  saveConfig(config);
}
function removeApiKey() {
  const config = loadConfig();
  delete config.openRouterApiKey;
  saveConfig(config);
}
function getBackendUrl() {
  const config = loadConfig();
  return config.backendUrl || DEFAULT_CONFIG.backendUrl;
}
function getDefaultModel() {
  const config = loadConfig();
  return config.defaultModel || DEFAULT_CONFIG.defaultModel;
}
function hasApiKey() {
  return getApiKey() !== null;
}

// src/utils/backend.ts
import axios from "axios";
function createBackendClient() {
  const baseURL = getBackendUrl();
  return axios.create({
    baseURL,
    timeout: 3e4,
    // 30 second timeout
    headers: {
      "Content-Type": "application/json"
    }
  });
}
function addAuthHeader(apiKey) {
  const key = apiKey || getApiKey();
  if (!key) {
    throw new Error('No API key found. Please run "synex login" first.');
  }
  return {
    "Authorization": `Bearer ${key}`
  };
}
async function testBackendConnection() {
  try {
    const client = createBackendClient();
    const response = await client.get("/health");
    return response.status === 200;
  } catch (error) {
    return false;
  }
}
async function validateApiKey(apiKey) {
  try {
    const client = createBackendClient();
    const headers = addAuthHeader(apiKey);
    const response = await client.post(
      "/api/v1/llm/validate",
      {},
      { headers }
    );
    return {
      valid: response.data.success,
      message: response.data.message
    };
  } catch (error) {
    if (error.response?.status === 401) {
      return {
        valid: false,
        message: "Invalid API key"
      };
    }
    if (error.code === "ECONNREFUSED") {
      throw new Error("Cannot connect to backend. Make sure the backend server is running on " + getBackendUrl());
    }
    throw new Error(`API key validation failed: ${error.message}`);
  }
}
async function sendChatRequest(request) {
  try {
    const client = createBackendClient();
    const headers = addAuthHeader();
    const response = await client.post(
      "/api/v1/llm/chat",
      request,
      { headers }
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || "Chat request failed");
    }
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please run "synex login" to update your credentials.');
    }
    if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    if (error.code === "ECONNREFUSED") {
      throw new Error("Cannot connect to backend. Make sure the backend server is running on " + getBackendUrl());
    }
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error(`Chat request failed: ${error.message}`);
  }
}

// src/convex/auth.ts
async function loginWithAPIKey(providedApiKey) {
  const backendConnected = await testBackendConnection();
  if (!backendConnected) {
    console.log(chalk2.red("\u274C Cannot connect to backend server."));
    console.log(chalk2.yellow("Please make sure the backend is running on http://localhost:3000"));
    console.log(chalk2.dim("Run: cd synex-backend && pnpm run dev"));
    return false;
  }
  if (providedApiKey) {
    if (!providedApiKey.trim()) {
      return false;
    }
    try {
      const validation = await validateApiKey(providedApiKey.trim());
      if (validation.valid) {
        setApiKey(providedApiKey.trim());
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
  console.log(chalk2.blue("\n\u{1F511} OpenRouter API Key Login"));
  console.log("Please enter your OpenRouter API key.");
  console.log(chalk2.dim("Get your API key at: https://openrouter.ai/keys\n"));
  console.log(chalk2.green("\u2705 Backend connection successful"));
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question("Enter your OpenRouter API key: ", async (apiKey) => {
      rl.close();
      if (!apiKey || apiKey.trim().length === 0) {
        console.log(chalk2.red("\u274C API key cannot be empty"));
        resolve(false);
        return;
      }
      try {
        console.log("\nValidating API key...");
        const validation = await validateApiKey(apiKey.trim());
        if (validation.valid) {
          setApiKey(apiKey.trim());
          console.log(chalk2.green("\u2705 API key validated and saved successfully!"));
          console.log(chalk2.dim(`Stored in: ~/.synex/config.json`));
          resolve(true);
        } else {
          console.log(chalk2.red("\u274C Invalid API key: " + validation.message));
          console.log(chalk2.yellow("Please check your API key and try again."));
          resolve(false);
        }
      } catch (error) {
        console.log(chalk2.red("\u274C Error validating API key: " + error.message));
        resolve(false);
      }
    });
  });
}

// src/tui/components/LoginScreen.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function LoginScreen({ loginMethod, onLoginSuccess, onBack }) {
  const [apiKey, setApiKey2] = useState2("");
  const [isLoading, setIsLoading] = useState2(false);
  const [error, setError] = useState2("");
  const [showInput, setShowInput] = useState2(loginMethod === "apikey");
  useInput2((input, key) => {
    if (key.escape) {
      onBack();
    } else if (key.return && loginMethod === "free" && !isLoading) {
      handleSubmit();
    }
  });
  const handleSubmit = async () => {
    if (loginMethod === "free") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess();
      }, 1e3);
      return;
    }
    if (!apiKey.trim()) {
      setError("Please enter your API key");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const success = await loginWithAPIKey(apiKey.trim());
      if (success) {
        onLoginSuccess();
      } else {
        setError("Login failed. Please check your API key.");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs2(Box2, { flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", children: [
    /* @__PURE__ */ jsx2(Box2, { borderStyle: "round", borderColor: "cyan", paddingX: 2, marginBottom: 2, children: /* @__PURE__ */ jsx2(Text2, { color: "cyan", children: loginMethod === "free" ? "\u{1F680} Free API Login" : "\u{1F511} API Key Login" }) }),
    loginMethod === "free" ? /* @__PURE__ */ jsxs2(Box2, { flexDirection: "column", alignItems: "center", children: [
      /* @__PURE__ */ jsx2(Box2, { marginBottom: 1, children: /* @__PURE__ */ jsx2(Text2, { children: "You'll get free credits to start using Synex!" }) }),
      /* @__PURE__ */ jsx2(Box2, { marginBottom: 2, children: /* @__PURE__ */ jsx2(Text2, { dimColor: true, children: "Press Enter to continue with free login" }) }),
      !isLoading ? /* @__PURE__ */ jsx2(Box2, { children: /* @__PURE__ */ jsx2(Text2, { color: "green", children: "Press Enter to login" }) }) : /* @__PURE__ */ jsx2(Text2, { color: "yellow", children: "Logging in..." })
    ] }) : /* @__PURE__ */ jsxs2(Box2, { flexDirection: "column", alignItems: "center", width: 60, children: [
      /* @__PURE__ */ jsx2(Box2, { marginBottom: 1, children: /* @__PURE__ */ jsx2(Text2, { children: "Enter your OpenRouter API key:" }) }),
      /* @__PURE__ */ jsx2(Box2, { marginBottom: 2, children: /* @__PURE__ */ jsx2(Text2, { dimColor: true, children: "Get your API key from: https://openrouter.ai/keys" }) }),
      showInput && /* @__PURE__ */ jsxs2(Box2, { marginBottom: 1, width: "100%", children: [
        /* @__PURE__ */ jsx2(Text2, { color: "cyan", children: "API Key: " }),
        /* @__PURE__ */ jsx2(
          TextInput,
          {
            value: apiKey,
            onChange: setApiKey2,
            onSubmit: handleSubmit,
            placeholder: "sk-or-...",
            mask: "*"
          }
        )
      ] }),
      error && /* @__PURE__ */ jsx2(Box2, { marginBottom: 1, children: /* @__PURE__ */ jsxs2(Text2, { color: "red", children: [
        "\u274C ",
        error
      ] }) }),
      isLoading && /* @__PURE__ */ jsx2(Text2, { color: "yellow", children: "Validating API key..." })
    ] }),
    /* @__PURE__ */ jsx2(Box2, { marginTop: 2, children: /* @__PURE__ */ jsxs2(Text2, { dimColor: true, children: [
      "Press Escape to go back, ",
      loginMethod === "apikey" ? "Enter to login" : "Enter to continue"
    ] }) })
  ] });
}

// src/tui/components/ChatInterface.tsx
import { useState as useState3 } from "react";
import { Box as Box3, Text as Text3, useInput as useInput3 } from "ink";
import TextInput2 from "ink-text-input";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function ChatInterface({ onLogout }) {
  const [messages, setMessages] = useState3([]);
  const [currentInput, setCurrentInput] = useState3("");
  const [isLoading, setIsLoading] = useState3(false);
  const [showCommands, setShowCommands] = useState3(false);
  const [error, setError] = useState3("");
  useInput3((input, key) => {
    if (key.ctrl && input === "l") {
      onLogout();
    } else if (key.ctrl && input === "h") {
      setShowCommands(!showCommands);
    } else if (key.ctrl && input === "c" && isLoading) {
      setIsLoading(false);
      setError("Request cancelled");
    }
  });
  const handleSubmit = async (input) => {
    if (!input.trim() || isLoading)
      return;
    const userMessage = {
      role: "user",
      content: input.trim(),
      timestamp: /* @__PURE__ */ new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setCurrentInput("");
    setIsLoading(true);
    setError("");
    try {
      if (input.startsWith("/")) {
        await handleCommand(input);
        return;
      }
      const response = await sendChatRequest({
        messages: [
          ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
          { role: "user", content: input.trim() }
        ],
        model: getDefaultModel()
      });
      const assistantMessage = {
        role: "assistant",
        content: response.message.content,
        timestamp: /* @__PURE__ */ new Date()
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };
  const handleCommand = async (command) => {
    const cmd = command.toLowerCase();
    if (cmd === "/clear") {
      setMessages([]);
    } else if (cmd === "/help") {
      const helpMessage = {
        role: "assistant",
        content: `Available commands:
/clear - Clear chat history
/help - Show this help
/logout - Logout and return to welcome screen

Keyboard shortcuts:
Ctrl+L - Logout
Ctrl+H - Toggle command help
Ctrl+C - Cancel current request`,
        timestamp: /* @__PURE__ */ new Date()
      };
      setMessages((prev) => [...prev, helpMessage]);
    } else if (cmd === "/logout") {
      onLogout();
    } else {
      const errorMessage = {
        role: "assistant",
        content: `Unknown command: ${command}. Type /help for available commands.`,
        timestamp: /* @__PURE__ */ new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
    setIsLoading(false);
  };
  return /* @__PURE__ */ jsxs3(Box3, { flexDirection: "column", height: "100%", children: [
    /* @__PURE__ */ jsx3(Box3, { borderStyle: "double", borderColor: "cyan", paddingX: 3, paddingY: 1, marginBottom: 1, children: /* @__PURE__ */ jsxs3(Box3, { flexDirection: "column", children: [
      /* @__PURE__ */ jsx3(Box3, { flexDirection: "row", justifyContent: "center", marginBottom: 1, children: /* @__PURE__ */ jsx3(Text3, { color: "cyan", bold: true, children: "\u{1F4AC} Synex Chat Interface" }) }),
      /* @__PURE__ */ jsx3(Box3, { flexDirection: "row", justifyContent: "center", children: /* @__PURE__ */ jsx3(Text3, { dimColor: true, children: "Ctrl+H for help | Ctrl+L to logout" }) })
    ] }) }),
    showCommands && /* @__PURE__ */ jsxs3(Box3, { borderStyle: "round", borderColor: "yellow", paddingX: 2, paddingY: 1, marginBottom: 1, children: [
      /* @__PURE__ */ jsx3(Box3, { marginBottom: 1, children: /* @__PURE__ */ jsx3(Text3, { color: "yellow", bold: true, children: "\u{1F4CB} Available Commands:" }) }),
      /* @__PURE__ */ jsxs3(Box3, { flexDirection: "column", paddingLeft: 1, children: [
        /* @__PURE__ */ jsxs3(Text3, { children: [
          "\u2022 ",
          /* @__PURE__ */ jsx3(Text3, { color: "cyan", children: "/clear" }),
          " - Clear chat history"
        ] }),
        /* @__PURE__ */ jsxs3(Text3, { children: [
          "\u2022 ",
          /* @__PURE__ */ jsx3(Text3, { color: "cyan", children: "/help" }),
          " - Show this help message"
        ] }),
        /* @__PURE__ */ jsxs3(Text3, { children: [
          "\u2022 ",
          /* @__PURE__ */ jsx3(Text3, { color: "cyan", children: "/logout" }),
          " - Logout and return to welcome screen"
        ] })
      ] }),
      /* @__PURE__ */ jsx3(Box3, { marginTop: 1, children: /* @__PURE__ */ jsx3(Text3, { dimColor: true, children: "Press Ctrl+H to hide this help" }) })
    ] }),
    /* @__PURE__ */ jsxs3(Box3, { flexDirection: "column", flexGrow: 1, paddingX: 2, paddingY: 1, children: [
      messages.length === 0 ? /* @__PURE__ */ jsx3(Box3, { justifyContent: "center", alignItems: "center", height: "100%", children: /* @__PURE__ */ jsx3(Text3, { dimColor: true, children: "Start a conversation by typing a message below..." }) }) : messages.map((message, index) => {
        const isUser = message.role === "user";
        return /* @__PURE__ */ jsx3(Box3, { marginBottom: 2, children: isUser ? (
          // User message - enhanced styling with better visual appeal
          /* @__PURE__ */ jsx3(Box3, { flexDirection: "column", alignItems: "flex-end", children: /* @__PURE__ */ jsxs3(
            Box3,
            {
              borderStyle: "single",
              borderColor: "green",
              paddingX: 3,
              paddingY: 1,
              width: 70,
              children: [
                /* @__PURE__ */ jsx3(Box3, { marginBottom: 1, children: /* @__PURE__ */ jsx3(Text3, { color: "green", bold: true, children: "\u{1F464} You" }) }),
                /* @__PURE__ */ jsx3(Box3, { paddingLeft: 1, children: /* @__PURE__ */ jsx3(Text3, { color: "white", wrap: "wrap", children: message.content }) })
              ]
            }
          ) })
        ) : (
          // AI message - enhanced styling with better visual appeal
          /* @__PURE__ */ jsx3(Box3, { flexDirection: "column", alignItems: "flex-start", children: /* @__PURE__ */ jsxs3(
            Box3,
            {
              borderStyle: "double",
              borderColor: "cyan",
              paddingX: 3,
              paddingY: 2,
              width: 90,
              children: [
                /* @__PURE__ */ jsx3(Box3, { marginBottom: 1, children: /* @__PURE__ */ jsx3(Text3, { color: "cyan", bold: true, children: "\u{1F916} AI Assistant" }) }),
                /* @__PURE__ */ jsx3(Box3, { paddingLeft: 1, children: /* @__PURE__ */ jsx3(Text3, { color: "white", wrap: "wrap", children: message.content }) }),
                /* @__PURE__ */ jsx3(Box3, { marginTop: 1, paddingLeft: 1, children: /* @__PURE__ */ jsx3(Text3, { dimColor: true, children: "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500" }) })
              ]
            }
          ) })
        ) }, index);
      }),
      isLoading && /* @__PURE__ */ jsx3(Box3, { flexDirection: "column", alignItems: "flex-start", marginBottom: 2, children: /* @__PURE__ */ jsxs3(
        Box3,
        {
          borderStyle: "double",
          borderColor: "yellow",
          paddingX: 3,
          paddingY: 2,
          width: 60,
          children: [
            /* @__PURE__ */ jsx3(Box3, { marginBottom: 1, children: /* @__PURE__ */ jsx3(Text3, { color: "yellow", bold: true, children: "\u{1F916} AI Assistant" }) }),
            /* @__PURE__ */ jsx3(Box3, { paddingLeft: 1, children: /* @__PURE__ */ jsx3(Text3, { color: "white", children: "Thinking and processing your request..." }) }),
            /* @__PURE__ */ jsx3(Box3, { marginTop: 1, paddingLeft: 1, children: /* @__PURE__ */ jsx3(Text3, { color: "yellow", children: "\u26A1 \u26A1 \u26A1" }) })
          ]
        }
      ) }),
      error && /* @__PURE__ */ jsx3(Box3, { flexDirection: "column", alignItems: "center", marginBottom: 2, children: /* @__PURE__ */ jsxs3(
        Box3,
        {
          borderStyle: "double",
          borderColor: "red",
          paddingX: 3,
          paddingY: 2,
          width: 80,
          children: [
            /* @__PURE__ */ jsx3(Box3, { marginBottom: 1, children: /* @__PURE__ */ jsx3(Text3, { color: "red", bold: true, children: "\u274C Error" }) }),
            /* @__PURE__ */ jsx3(Box3, { paddingLeft: 1, children: /* @__PURE__ */ jsx3(Text3, { color: "white", wrap: "wrap", children: error }) })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx3(Box3, { borderStyle: "round", borderColor: "cyan", paddingX: 2, paddingY: 1, children: /* @__PURE__ */ jsxs3(Box3, { flexDirection: "row", alignItems: "center", children: [
      /* @__PURE__ */ jsx3(Text3, { color: "cyan", children: "\u{1F4AC} " }),
      /* @__PURE__ */ jsx3(Box3, { flexGrow: 1, children: /* @__PURE__ */ jsx3(
        TextInput2,
        {
          value: currentInput,
          onChange: setCurrentInput,
          onSubmit: handleSubmit,
          placeholder: "Type your message or /help for commands..."
        }
      ) })
    ] }) })
  ] });
}

// src/tui/App.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function App() {
  const [currentState, setCurrentState] = useState4("welcome");
  const [loginMethod, setLoginMethod] = useState4(null);
  const [isAuthenticated, setIsAuthenticated] = useState4(false);
  const { exit } = useApp();
  useEffect2(() => {
    setCurrentState("welcome");
    if (hasApiKey()) {
      setIsAuthenticated(true);
    }
    const handleSigInt = () => {
      removeApiKey();
      exit();
    };
    process.on("SIGINT", handleSigInt);
    return () => {
      process.off("SIGINT", handleSigInt);
    };
  }, [exit]);
  const handleLoginMethodSelected = (method) => {
    setLoginMethod(method);
    setCurrentState("login");
  };
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentState("chat");
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginMethod(null);
    setCurrentState("welcome");
  };
  return /* @__PURE__ */ jsxs4(Box4, { flexDirection: "column", height: "100%", children: [
    currentState === "welcome" && /* @__PURE__ */ jsx4(WelcomeScreen, { onLoginMethodSelected: handleLoginMethodSelected }),
    currentState === "login" && loginMethod && /* @__PURE__ */ jsx4(
      LoginScreen,
      {
        loginMethod,
        onLoginSuccess: handleLoginSuccess,
        onBack: () => setCurrentState("welcome")
      }
    ),
    currentState === "chat" && isAuthenticated && /* @__PURE__ */ jsx4(ChatInterface, { onLogout: handleLogout })
  ] });
}

// src/tui-index.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
process.stdout.write("\x1Bc");
render(/* @__PURE__ */ jsx5(App, {}));
