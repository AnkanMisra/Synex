#!/usr/bin/env node

// src/tui-index.tsx
import { render } from "ink";

// src/tui/App.tsx
import { useState as useState4, useEffect as useEffect3 } from "react";
import { Box as Box4, useApp } from "ink";

// src/tui/components/WelcomeScreen.tsx
import { useState } from "react";
import { Box, Text, useInput, useStdout } from "ink";

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
    title: "API Key Login",
    description: "Use your own API key for unlimited access",
    value: "apikey"
  },
  {
    title: "Guest Access (Read-only)",
    description: "Explore limited features without an API key",
    value: "guest"
  }
];
function WelcomeScreen({ onLoginMethodSelected }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { stdout } = useStdout();
  const columns = stdout?.columns ?? 80;
  const contentWidth = Math.min(60, Math.max(40, columns - 4));
  useInput((input, key) => {
    if (key.upArrow || key.leftArrow) {
      setSelectedIndex((prev) => prev > 0 ? prev - 1 : menuOptions.length - 1);
    } else if (key.downArrow || key.rightArrow) {
      setSelectedIndex((prev) => prev < menuOptions.length - 1 ? prev + 1 : 0);
    } else if (key.return) {
      onLoginMethodSelected(menuOptions[selectedIndex].value);
    }
  });
  return /* @__PURE__ */ jsx(Box, { flexDirection: "column", height: "100%", children: /* @__PURE__ */ jsxs(Box, { flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1, paddingX: 4, children: [
    /* @__PURE__ */ jsxs(
      Box,
      {
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 2,
        borderStyle: "round",
        borderColor: "magenta",
        paddingX: 3,
        paddingY: 1,
        width: contentWidth,
        children: [
          /* @__PURE__ */ jsx(Box, { marginBottom: 1 }),
          SYNEX_LOGO.map((line, index) => {
            const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"];
            const colorIndex = index % colors.length;
            return /* @__PURE__ */ jsx(Text, { color: colors[colorIndex], bold: true, children: line }, index);
          }),
          /* @__PURE__ */ jsx(Box, { marginTop: 1, children: /* @__PURE__ */ jsx(Text, { color: "yellow", dimColor: true, children: " Powered by Advanced AI Technology " }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      Box,
      {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderStyle: "round",
        borderColor: "blueBright",
        paddingX: 4,
        paddingY: 1,
        marginBottom: 2,
        width: contentWidth,
        children: /* @__PURE__ */ jsxs(Box, { flexDirection: "column", alignItems: "center", justifyContent: "center", children: [
          /* @__PURE__ */ jsx(Box, { marginBottom: 1, width: "100%", justifyContent: "center", children: /* @__PURE__ */ jsx(Text, { color: "cyan", bold: true, children: "Choose Your Authentication Method" }) }),
          menuOptions.map((option, index) => {
            const isSelected = index === selectedIndex;
            return /* @__PURE__ */ jsxs(
              Box,
              {
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 1,
                width: "100%",
                children: [
                  /* @__PURE__ */ jsx(Box, { width: "100%", justifyContent: "center", children: /* @__PURE__ */ jsx(Text, { color: isSelected ? "magenta" : "cyan", bold: isSelected, children: `${isSelected ? "> " : "  "}${option.title}` }) }),
                  /* @__PURE__ */ jsx(Box, { width: "100%", justifyContent: "center", children: /* @__PURE__ */ jsx(Text, { color: isSelected ? "yellow" : "gray", dimColor: !isSelected, children: option.description }) })
                ]
              },
              index
            );
          }),
          /* @__PURE__ */ jsx(Box, { marginTop: 1, width: "100%", justifyContent: "center", children: /* @__PURE__ */ jsx(Text, { color: "gray", dimColor: true, children: "Use \u2191\u2193 arrows to navigate, Enter to select" }) })
        ] })
      }
    )
  ] }) });
}

// src/tui/components/LoginScreen.tsx
import { useState as useState2 } from "react";
import { Box as Box2, Text as Text2, useInput as useInput2 } from "ink";
import TextInput from "ink-text-input";

// src/convex/auth.ts
import chalk2 from "chalk";

// src/utils/config.ts
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";
var AVAILABLE_MODELS = [
  { id: "openai/gpt-oss-20b:free", name: "OpenAI GPT OSS 20B (Free)" },
  { id: "z-ai/glm-4.5-air:free", name: "Z.AI GLM 4.5 Air (Free)" }
];
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
    mkdirSync(configDir, { recursive: true, mode: 448 });
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
    writeFileSync(configPath, JSON.stringify(config, null, 2), { encoding: "utf8", mode: 384 });
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
function setDefaultModel(model) {
  const config = loadConfig();
  config.defaultModel = model;
  saveConfig(config);
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
function secureInput(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    let input = "";
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    const onData = (key) => {
      if (key === "\r" || key === "\n") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(input);
      } else if (key === "") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        process.exit(0);
      } else if (key === "\x7F" || key === "\b") {
        if (input.length > 0) {
          input = input.slice(0, -1);
          process.stdout.write("\b \b");
        }
      } else if (key >= " " && key <= "~") {
        input += key;
        process.stdout.write("*");
      }
    };
    stdin.on("data", onData);
  });
}
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
      throw new Error("API key cannot be empty");
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
      console.error(chalk2.red("\u274C API key validation failed:"), error.message || error);
      if (error.stack) {
        console.error(chalk2.dim("Stack trace:"), error.stack);
      }
      return false;
    }
  }
  console.log(chalk2.blue("\n\u{1F511} OpenRouter API Key Login"));
  console.log("Please enter your OpenRouter API key.");
  console.log(chalk2.dim("Get your API key at: https://openrouter.ai/keys\n"));
  console.log(chalk2.green("\u2705 Backend connection successful"));
  try {
    const apiKey = await secureInput("Enter your OpenRouter API key: ");
    if (!apiKey || apiKey.trim().length === 0) {
      console.log(chalk2.red("\u274C API key cannot be empty"));
      return false;
    }
    try {
      console.log("Validating API key...");
      const validation = await validateApiKey(apiKey.trim());
      if (validation.valid) {
        setApiKey(apiKey.trim());
        console.log(chalk2.green("\u2705 API key validated and saved successfully!"));
        console.log(chalk2.dim(`Stored in: ~/.synex/config.json`));
        return true;
      } else {
        console.log(chalk2.red("\u274C Invalid API key: " + validation.message));
        console.log(chalk2.yellow("Please check your API key and try again."));
        return false;
      }
    } catch (error) {
      console.log(chalk2.red("\u274C Error validating API key: " + error.message));
      return false;
    }
  } catch (error) {
    console.log(chalk2.red("\u274C Input error: " + error.message));
    return false;
  }
}

// src/tui/components/LoginScreen.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function LoginScreen({ loginMethod, onLoginSuccess, onBack }) {
  const [apiKey, setApiKey2] = useState2("");
  const [isLoading, setIsLoading] = useState2(false);
  const [error, setError] = useState2("");
  const [showInput, setShowInput] = useState2(true);
  useInput2((input, key) => {
    if (key.escape) {
      onBack();
    }
  });
  const handleSubmit = async () => {
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
  return /* @__PURE__ */ jsx2(Box2, { flexDirection: "column", height: "100%", children: /* @__PURE__ */ jsx2(Box2, { flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1, children: /* @__PURE__ */ jsxs2(
    Box2,
    {
      flexDirection: "column",
      alignItems: "center",
      borderStyle: "single",
      borderColor: "green",
      paddingX: 6,
      paddingY: 1,
      width: 100,
      marginBottom: 2,
      children: [
        /* @__PURE__ */ jsx2(Box2, { marginBottom: 1, children: /* @__PURE__ */ jsx2(Text2, { color: "green", bold: true, children: "Get Started in Seconds" }) }),
        /* @__PURE__ */ jsxs2(Box2, { flexDirection: "column", alignItems: "center", width: "100%", children: [
          /* @__PURE__ */ jsx2(Box2, { marginBottom: 1, children: /* @__PURE__ */ jsx2(Text2, { color: "white", children: "Enter your OpenRouter API key to unlock premium features:" }) }),
          /* @__PURE__ */ jsx2(
            Box2,
            {
              marginBottom: 1,
              borderStyle: "round",
              borderColor: "blue",
              paddingX: 2,
              paddingY: 1,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              children: /* @__PURE__ */ jsxs2(Box2, { flexDirection: "column", alignItems: "center", justifyContent: "center", children: [
                /* @__PURE__ */ jsx2(Text2, { color: "blue", bold: true, children: "How to get your API key:" }),
                /* @__PURE__ */ jsxs2(Box2, { marginTop: 1, justifyContent: "center", children: [
                  /* @__PURE__ */ jsx2(Text2, { color: "cyan", children: "1. Visit: " }),
                  /* @__PURE__ */ jsx2(Text2, { color: "yellow", bold: true, children: "https://openrouter.ai/keys" })
                ] }),
                /* @__PURE__ */ jsx2(Box2, { justifyContent: "center", children: /* @__PURE__ */ jsx2(Text2, { color: "cyan", children: "2. Create an account or sign in" }) }),
                /* @__PURE__ */ jsx2(Box2, { justifyContent: "center", children: /* @__PURE__ */ jsx2(Text2, { color: "cyan", children: "3. Generate a new API key" }) }),
                /* @__PURE__ */ jsx2(Box2, { justifyContent: "center", children: /* @__PURE__ */ jsx2(Text2, { color: "cyan", children: "4. Copy and paste it below" }) })
              ] })
            }
          ),
          showInput && /* @__PURE__ */ jsx2(
            Box2,
            {
              marginBottom: 1,
              width: "100%",
              borderStyle: "single",
              borderColor: "cyan",
              paddingX: 2,
              paddingY: 1,
              alignItems: "center",
              justifyContent: "center",
              children: /* @__PURE__ */ jsxs2(Box2, { flexDirection: "column", children: [
                /* @__PURE__ */ jsx2(Box2, { marginBottom: 1, alignItems: "center", justifyContent: "center", children: /* @__PURE__ */ jsx2(Text2, { color: "cyan", bold: true, children: "API Key:" }) }),
                /* @__PURE__ */ jsx2(
                  TextInput,
                  {
                    value: apiKey,
                    onChange: setApiKey2,
                    onSubmit: handleSubmit,
                    placeholder: "sk-or-v1-...",
                    mask: "*"
                  }
                )
              ] })
            }
          ),
          error && /* @__PURE__ */ jsxs2(
            Box2,
            {
              marginBottom: 2,
              borderStyle: "double",
              borderColor: "red",
              paddingX: 3,
              paddingY: 1,
              width: "100%",
              children: [
                /* @__PURE__ */ jsx2(Box2, { flexDirection: "row", alignItems: "center", justifyContent: "center", children: /* @__PURE__ */ jsx2(Text2, { color: "red", bold: true, children: "Authentication Failed" }) }),
                /* @__PURE__ */ jsx2(Box2, { justifyContent: "center", marginTop: 1, children: /* @__PURE__ */ jsx2(Text2, { color: "white", children: error }) })
              ]
            }
          ),
          isLoading && /* @__PURE__ */ jsx2(
            Box2,
            {
              borderStyle: "round",
              borderColor: "yellow",
              paddingX: 3,
              paddingY: 1,
              children: /* @__PURE__ */ jsx2(Box2, { flexDirection: "row", alignItems: "center", children: /* @__PURE__ */ jsx2(Text2, { color: "yellow", children: "Validating your API key..." }) })
            }
          )
        ] })
      ]
    }
  ) }) });
}

// src/tui/components/ChatInterface.tsx
import { useState as useState3, useEffect as useEffect2 } from "react";
import { Box as Box3, Text as Text3, useInput as useInput3 } from "ink";
import TextInput2 from "ink-text-input";
import { Fragment, jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function ChatInterface({ onLogout }) {
  const [messages, setMessages] = useState3([]);
  const [currentInput, setCurrentInput] = useState3("");
  const [isLoading, setIsLoading] = useState3(false);
  const [showCommands, setShowCommands] = useState3(false);
  const [error, setError] = useState3("");
  const [selectedModel, setSelectedModel] = useState3(getDefaultModel());
  const [showModelSelector, setShowModelSelector] = useState3(false);
  const [modelSelectorIndex, setModelSelectorIndex] = useState3(0);
  const [progress, setProgress] = useState3(0);
  const [progressText, setProgressText] = useState3("");
  useEffect2(() => {
    let interval;
    if (isLoading) {
      setProgress(0);
      setProgressText("Initializing...");
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 15 + 5;
          if (newProgress < 30) {
            setProgressText("Connecting to AI...");
          } else if (newProgress < 60) {
            setProgressText("Processing request...");
          } else if (newProgress < 85) {
            setProgressText("Generating response...");
          } else {
            setProgressText("Finalizing...");
          }
          return Math.min(newProgress, 90);
        });
      }, 200);
    } else {
      setProgress(0);
      setProgressText("");
    }
    return () => {
      if (interval)
        clearInterval(interval);
    };
  }, [isLoading]);
  useInput3((input, key) => {
    if (showModelSelector) {
      if (key.upArrow) {
        setModelSelectorIndex((prev) => Math.max(0, prev - 1));
        return;
      } else if (key.downArrow) {
        setModelSelectorIndex((prev) => Math.min(AVAILABLE_MODELS.length - 1, prev + 1));
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
    if (key.ctrl && input === "l") {
      onLogout();
      return;
    }
    if (key.ctrl && input === "h") {
      setShowCommands(!showCommands);
      return;
    }
    if (key.ctrl && (input === "m" || key.name === "m") || key.sequence === "\r" || key.ctrl && key.sequence === "\r" || key.name === "m" && key.ctrl) {
      setShowModelSelector(!showModelSelector);
      setModelSelectorIndex(AVAILABLE_MODELS.findIndex((m) => m.id === selectedModel));
      return;
    }
    if (key.ctrl && input === "c" && isLoading) {
      setIsLoading(false);
      setError("Request cancelled");
      return;
    }
  }, { isActive: true });
  const handleSubmit = async () => {
    if (!currentInput.trim())
      return;
    if (currentInput.startsWith("/")) {
      const parts = currentInput.trim().split(/\s+/);
      const command = parts[0].toLowerCase();
      const commandArgs = parts.slice(1);
      switch (command) {
        case "/help":
          setShowCommands(true);
          setCurrentInput("");
          return;
        case "/clear":
          setMessages([]);
          setCurrentInput("");
          setIsLoading(false);
          setError("");
          return;
        case "/model":
          if (commandArgs.length === 0) {
            setShowModelSelector(true);
            setModelSelectorIndex(AVAILABLE_MODELS.findIndex((m) => m.id === selectedModel));
          } else {
            const target = commandArgs.join(" ").toLowerCase();
            const found = AVAILABLE_MODELS.find((m) => {
              const id = m.id.toLowerCase();
              const name = m.name.toLowerCase();
              return id === target || name === target || name.replace(/\s*\(.*?\)$/, "") === target || name.includes(target);
            });
            if (found) {
              setSelectedModel(found.id);
              setDefaultModel(found.id);
              const confirmMsg = {
                role: "assistant",
                content: `Switched model to: ${found.name}`,
                timestamp: /* @__PURE__ */ new Date(),
                model: found.id
              };
              setMessages((prev) => [...prev, confirmMsg]);
            } else {
              const errMsg = {
                role: "assistant",
                content: `Unknown model: ${target}. Use /model to list available models.`,
                timestamp: /* @__PURE__ */ new Date(),
                model: selectedModel
              };
              setMessages((prev) => [...prev, errMsg]);
            }
          }
          setCurrentInput("");
          return;
        case "/logout":
          onLogout();
          return;
        default:
          const errorMessage = {
            role: "assistant",
            content: `Unknown command: ${currentInput}

Available commands:
\u2022 /help - Show keyboard shortcuts
\u2022 /model - Select AI model
\u2022 /clear - Clear current conversation
\u2022 /logout - Logout and return to welcome`,
            timestamp: /* @__PURE__ */ new Date(),
            model: selectedModel
          };
          setMessages((prev) => [...prev, errorMessage]);
          setCurrentInput("");
          return;
      }
    }
    const userMessage = {
      role: "user",
      content: currentInput,
      timestamp: /* @__PURE__ */ new Date(),
      model: selectedModel
    };
    setMessages((prev) => [...prev, userMessage]);
    setCurrentInput("");
    setIsLoading(true);
    try {
      const response = await sendChatRequest({
        messages: [
          ...messages.map((msg) => ({ role: msg.role, content: msg.content })),
          { role: "user", content: currentInput.trim() }
        ],
        model: selectedModel
      });
      setProgress(100);
      setProgressText("Response received!");
      await new Promise((resolve) => setTimeout(resolve, 300));
      const assistantMessage = {
        role: "assistant",
        content: response.message.content,
        timestamp: /* @__PURE__ */ new Date(),
        model: response.model
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      let errorMessage;
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = "Failed to send message";
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCommand = async (command) => {
    const cmd = command.toLowerCase();
    if (cmd === "/clear") {
      setMessages([]);
      setIsLoading(false);
      setError("");
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
Ctrl+M - Select AI model
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
    showCommands && /* @__PURE__ */ jsx3(
      Box3,
      {
        borderStyle: "double",
        borderColor: "yellow",
        paddingX: 3,
        paddingY: 2,
        marginBottom: 2,
        marginX: 2,
        children: /* @__PURE__ */ jsxs3(Box3, { flexDirection: "column", children: [
          /* @__PURE__ */ jsx3(Box3, { marginBottom: 2, justifyContent: "center", children: /* @__PURE__ */ jsx3(Text3, { color: "yellow", bold: true, children: " Command Reference Guide" }) }),
          /* @__PURE__ */ jsxs3(Box3, { flexDirection: "column", paddingLeft: 2, children: [
            /* @__PURE__ */ jsx3(Box3, { marginBottom: 1, children: /* @__PURE__ */ jsx3(Text3, { color: "cyan", bold: true, children: "Chat Commands:" }) }),
            /* @__PURE__ */ jsxs3(Text3, { children: [
              "  \u2022 ",
              /* @__PURE__ */ jsx3(Text3, { color: "green", children: "/clear" }),
              " - Clear entire chat history"
            ] }),
            /* @__PURE__ */ jsxs3(Text3, { children: [
              "  \u2022 ",
              /* @__PURE__ */ jsx3(Text3, { color: "green", children: "/help" }),
              " - Show this comprehensive help"
            ] }),
            /* @__PURE__ */ jsxs3(Text3, { children: [
              "  \u2022 ",
              /* @__PURE__ */ jsx3(Text3, { color: "green", children: "/model <name/id>" }),
              " - Quick switch AI model"
            ] }),
            /* @__PURE__ */ jsxs3(Text3, { children: [
              "  \u2022 ",
              /* @__PURE__ */ jsx3(Text3, { color: "green", children: "/logout" }),
              " - Logout and return to welcome"
            ] }),
            /* @__PURE__ */ jsx3(Box3, { marginTop: 1, marginBottom: 1, children: /* @__PURE__ */ jsx3(Text3, { color: "cyan", bold: true, children: "Keyboard Shortcuts:" }) }),
            /* @__PURE__ */ jsxs3(Text3, { children: [
              "  \u2022 ",
              /* @__PURE__ */ jsx3(Text3, { color: "magenta", children: "Ctrl+H" }),
              " - Toggle this help panel"
            ] }),
            /* @__PURE__ */ jsxs3(Text3, { children: [
              "  \u2022 ",
              /* @__PURE__ */ jsx3(Text3, { color: "magenta", children: "Ctrl+M" }),
              " - Open model selector"
            ] }),
            /* @__PURE__ */ jsxs3(Text3, { children: [
              "  \u2022 ",
              /* @__PURE__ */ jsx3(Text3, { color: "magenta", children: "Ctrl+L" }),
              " - Quick logout"
            ] }),
            /* @__PURE__ */ jsxs3(Text3, { children: [
              "  \u2022 ",
              /* @__PURE__ */ jsx3(Text3, { color: "magenta", children: "Ctrl+C" }),
              " - Exit application"
            ] })
          ] }),
          /* @__PURE__ */ jsx3(Box3, { marginTop: 2, justifyContent: "center", children: /* @__PURE__ */ jsx3(Text3, { color: "yellow", dimColor: true, children: " Press Ctrl+H again to hide this panel" }) })
        ] })
      }
    ),
    showModelSelector && /* @__PURE__ */ jsx3(
      Box3,
      {
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        position: "absolute",
        width: "100%",
        children: /* @__PURE__ */ jsx3(
          Box3,
          {
            borderStyle: "double",
            borderColor: "green",
            paddingX: 6,
            paddingY: 3,
            width: 60,
            children: /* @__PURE__ */ jsxs3(Box3, { flexDirection: "column", children: [
              /* @__PURE__ */ jsx3(Box3, { marginBottom: 2, justifyContent: "center", children: /* @__PURE__ */ jsx3(Text3, { color: "green", bold: true, children: " AI Model Selection Center" }) }),
              /* @__PURE__ */ jsx3(Box3, { flexDirection: "column", alignItems: "center", children: AVAILABLE_MODELS.map((model, index) => {
                const isSelected = index === modelSelectorIndex;
                const isCurrent = model.id === selectedModel;
                return /* @__PURE__ */ jsx3(
                  Box3,
                  {
                    marginBottom: 1,
                    borderStyle: isSelected ? "single" : void 0,
                    borderColor: isSelected ? "cyan" : void 0,
                    paddingX: isSelected ? 2 : 0,
                    paddingY: isSelected ? 1 : 0,
                    children: /* @__PURE__ */ jsxs3(Box3, { flexDirection: "row", alignItems: "center", children: [
                      /* @__PURE__ */ jsx3(Text3, { color: isSelected ? "cyan" : "white", bold: true, children: isSelected ? "> " : "  " }),
                      /* @__PURE__ */ jsx3(Text3, { color: isSelected ? "cyan" : "white", bold: isSelected, children: model.name }),
                      isCurrent && /* @__PURE__ */ jsx3(Text3, { color: "yellow", bold: true, children: " (Active)" })
                    ] })
                  },
                  model.id
                );
              }) }),
              /* @__PURE__ */ jsx3(Box3, { marginTop: 2, justifyContent: "center", children: /* @__PURE__ */ jsx3(Text3, { color: "green", dimColor: true, children: " Use \u2191\u2193 to navigate \u2022 Enter to select \u2022 Escape to cancel" }) })
            ] })
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs3(Box3, { flexDirection: "column", flexGrow: 1, paddingX: 3, paddingY: 2, children: [
      messages.length === 0 ? /* @__PURE__ */ jsx3(Box3, { flexDirection: "column", flexGrow: 1 }) : /* @__PURE__ */ jsxs3(Fragment, { children: [
        messages.map((message, index) => {
          const isUser = message.role === "user";
          const timestamp = message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return /* @__PURE__ */ jsx3(Box3, { marginBottom: 1, width: "100%", height: 20, children: /* @__PURE__ */ jsx3(Box3, { flexDirection: "row", width: "100%", height: 20, children: isUser ? (
            // User Message on Right
            /* @__PURE__ */ jsxs3(Fragment, { children: [
              /* @__PURE__ */ jsx3(Box3, { flexGrow: 1 }),
              /* @__PURE__ */ jsxs3(Box3, { width: "50%", height: 20, borderStyle: "single", borderColor: "green", paddingX: 2, paddingY: 1, children: [
                /* @__PURE__ */ jsxs3(Box3, { flexDirection: "row", alignItems: "center", height: 1, children: [
                  /* @__PURE__ */ jsx3(Text3, { color: "green", bold: true, children: "You" }),
                  /* @__PURE__ */ jsx3(Box3, { flexGrow: 1 }),
                  /* @__PURE__ */ jsx3(Text3, { color: "gray", dimColor: true, children: timestamp })
                ] }),
                /* @__PURE__ */ jsx3(Box3, { height: 17, overflow: "hidden", children: /* @__PURE__ */ jsx3(Text3, { color: "white", wrap: "wrap", children: message.content }) })
              ] })
            ] })
          ) : (
            // AI Message on Left
            /* @__PURE__ */ jsxs3(Fragment, { children: [
              /* @__PURE__ */ jsxs3(Box3, { width: "50%", height: 20, borderStyle: "single", borderColor: "cyan", paddingX: 2, paddingY: 1, children: [
                /* @__PURE__ */ jsxs3(Box3, { flexDirection: "row", alignItems: "center", height: 1, children: [
                  /* @__PURE__ */ jsx3(Text3, { color: "cyan", bold: true, children: "AI" }),
                  message.model && /* @__PURE__ */ jsxs3(Text3, { color: "yellow", dimColor: true, children: [
                    " \u2022 ",
                    AVAILABLE_MODELS.find((m) => m.id === message.model)?.name || message.model
                  ] }),
                  /* @__PURE__ */ jsx3(Box3, { flexGrow: 1 }),
                  /* @__PURE__ */ jsx3(Text3, { color: "gray", dimColor: true, children: timestamp })
                ] }),
                /* @__PURE__ */ jsx3(Box3, { height: 17, overflow: "hidden", children: /* @__PURE__ */ jsx3(Text3, { color: "white", wrap: "wrap", children: message.content }) })
              ] }),
              /* @__PURE__ */ jsx3(Box3, { flexGrow: 1 })
            ] })
          ) }) }, index);
        }),
        isLoading && /* @__PURE__ */ jsx3(Box3, { marginBottom: 3, children: /* @__PURE__ */ jsx3(Box3, { flexDirection: "column", alignItems: "flex-start", children: /* @__PURE__ */ jsxs3(
          Box3,
          {
            borderStyle: "double",
            borderColor: "cyan",
            paddingX: 4,
            paddingY: 2,
            width: 85,
            children: [
              /* @__PURE__ */ jsxs3(Box3, { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 1, children: [
                /* @__PURE__ */ jsxs3(Box3, { flexDirection: "row", alignItems: "center", children: [
                  /* @__PURE__ */ jsx3(Text3, { color: "cyan", bold: true, children: "AI Assistant" }),
                  /* @__PURE__ */ jsxs3(Text3, { color: "yellow", dimColor: true, children: [
                    " \u2022 ",
                    selectedModel
                  ] })
                ] }),
                /* @__PURE__ */ jsx3(Text3, { color: "gray", dimColor: true, children: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
              ] }),
              /* @__PURE__ */ jsx3(
                Box3,
                {
                  paddingX: 2,
                  paddingY: 1,
                  borderStyle: "single",
                  borderColor: "cyan",
                  children: /* @__PURE__ */ jsxs3(Box3, { flexDirection: "column", children: [
                    /* @__PURE__ */ jsx3(Text3, { color: "cyan", children: progressText }),
                    /* @__PURE__ */ jsx3(Box3, { marginTop: 1, children: /* @__PURE__ */ jsxs3(Box3, { flexDirection: "row", alignItems: "flex-start", children: [
                      /* @__PURE__ */ jsx3(Text3, { color: "cyan", children: "Progress: " }),
                      /* @__PURE__ */ jsx3(Box3, { marginLeft: 2, children: /* @__PURE__ */ jsx3(Box3, { height: 10, width: 3, borderStyle: "single", borderColor: "gray", flexDirection: "column", justifyContent: "flex-end", children: /* @__PURE__ */ jsx3(Box3, { height: Math.floor(progress * 10 / 100), backgroundColor: "cyan", width: 1, children: /* @__PURE__ */ jsx3(Text3, { children: " " }) }) }) }),
                      /* @__PURE__ */ jsx3(Box3, { marginLeft: 2, children: /* @__PURE__ */ jsxs3(Text3, { color: "yellow", children: [
                        Math.floor(progress),
                        "%"
                      ] }) })
                    ] }) })
                  ] })
                }
              ),
              /* @__PURE__ */ jsx3(Box3, { marginTop: 1, justifyContent: "center", children: /* @__PURE__ */ jsx3(Text3, { color: "cyan", dimColor: true, children: "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500" }) })
            ]
          }
        ) }) })
      ] }),
      error && /* @__PURE__ */ jsx3(Box3, { flexDirection: "column", alignItems: "center", marginBottom: 3, children: /* @__PURE__ */ jsxs3(
        Box3,
        {
          borderStyle: "double",
          borderColor: "red",
          paddingX: 4,
          paddingY: 3,
          width: 85,
          children: [
            /* @__PURE__ */ jsxs3(Box3, { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2, children: [
              /* @__PURE__ */ jsx3(Box3, { flexDirection: "row", alignItems: "center", children: /* @__PURE__ */ jsx3(Text3, { color: "red", bold: true, children: "Error Occurred" }) }),
              /* @__PURE__ */ jsx3(Text3, { color: "gray", dimColor: true, children: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
            ] }),
            /* @__PURE__ */ jsx3(
              Box3,
              {
                paddingX: 3,
                paddingY: 2,
                borderStyle: "single",
                borderColor: "red",
                children: /* @__PURE__ */ jsx3(Text3, { color: "white", wrap: "wrap", children: error })
              }
            ),
            /* @__PURE__ */ jsxs3(Box3, { marginTop: 2, flexDirection: "column", alignItems: "center", children: [
              /* @__PURE__ */ jsx3(Text3, { color: "yellow", dimColor: true, children: "Troubleshooting Tips:" }),
              /* @__PURE__ */ jsxs3(Box3, { flexDirection: "column", paddingLeft: 2, marginTop: 1, children: [
                /* @__PURE__ */ jsx3(Text3, { color: "cyan", dimColor: true, children: "\u2022 Check your internet connection" }),
                /* @__PURE__ */ jsx3(Text3, { color: "green", dimColor: true, children: "\u2022 Verify your API key is valid" }),
                /* @__PURE__ */ jsx3(Text3, { color: "magenta", dimColor: true, children: "\u2022 Try a different model if available" })
              ] }),
              /* @__PURE__ */ jsx3(Box3, { marginTop: 2, children: /* @__PURE__ */ jsx3(Text3, { color: "red", dimColor: true, children: "Please try again or use /help for assistance" }) })
            ] })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs3(Box3, { flexDirection: "column", paddingX: 3, paddingY: 2, children: [
      currentInput.startsWith("/") && /* @__PURE__ */ jsxs3(
        Box3,
        {
          borderStyle: "round",
          borderColor: "yellow",
          paddingX: 3,
          paddingY: 1,
          marginBottom: 1,
          children: [
            /* @__PURE__ */ jsx3(Text3, { color: "yellow", bold: true, children: "Command Palette" }),
            /* @__PURE__ */ jsxs3(Box3, { flexDirection: "column", paddingLeft: 2, marginTop: 1, children: [
              /* @__PURE__ */ jsx3(Text3, { color: "cyan", children: "\u2022 /help - Show keyboard shortcuts" }),
              /* @__PURE__ */ jsx3(Text3, { color: "green", children: "\u2022 /clear - Clear current conversation" }),
              /* @__PURE__ */ jsx3(Text3, { color: "green", children: "\u2022 /model - Select AI model" }),
              /* @__PURE__ */ jsx3(Text3, { color: "magenta", children: "\u2022 /logout - Logout and return to welcome" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs3(
        Box3,
        {
          borderStyle: "single",
          borderColor: currentInput.startsWith("/") ? "yellow" : "blue",
          paddingX: 3,
          paddingY: 2,
          minHeight: 5,
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx3(Box3, { flexGrow: 1, children: /* @__PURE__ */ jsx3(
              TextInput2,
              {
                value: currentInput,
                onChange: setCurrentInput,
                onSubmit: handleSubmit,
                placeholder: currentInput.startsWith("/") ? "Type a command... (e.g., /help, /clear)" : "Type your message here... (Press Enter to send)"
              }
            ) }),
            /* @__PURE__ */ jsx3(
              Box3,
              {
                marginTop: 1,
                justifyContent: "flex-start",
                children: /* @__PURE__ */ jsx3(Text3, { color: "cyan", dimColor: true, children: selectedModel })
              }
            )
          ]
        }
      )
    ] })
  ] });
}

// src/tui/App.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function App() {
  const [currentState, setCurrentState] = useState4("welcome");
  const [loginMethod, setLoginMethod] = useState4(null);
  const [isAuthenticated, setIsAuthenticated] = useState4(false);
  const { exit } = useApp();
  useEffect3(() => {
    setCurrentState("welcome");
    if (hasApiKey()) {
      setIsAuthenticated(true);
    }
    const handleSigInt = () => {
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
    try {
      removeApiKey();
    } catch (error) {
      console.error("Failed to remove API key during logout:", error instanceof Error ? error.message : error);
    }
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
try {
  if (process.stdout.isTTY) {
    process.stdout.write("\x1Bc");
  }
  render(/* @__PURE__ */ jsx5(App, {}));
} catch (error) {
  console.error("Failed to start Synex TUI:", error instanceof Error ? error.message : error);
  if (error instanceof Error && error.stack) {
    console.error("Stack trace:", error.stack);
  }
  process.stderr.write("Synex TUI failed to initialize. Please check your terminal environment.\n");
  process.exit(1);
}
