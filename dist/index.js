#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_commander = require("commander");
var import_chalk3 = __toESM(require("chalk"));
var import_fs = require("fs");
var import_path = require("path");

// src/commands/login.ts
function loginCommand() {
  console.log("Login command placeholder");
}

// src/commands/prompt.ts
function promptCommand(message, options) {
  const model = options.model || "gpt-oss-2b";
  console.log(`Message: ${message}`);
  console.log(`Model: ${model}`);
}

// src/commands/analyze.ts
function analyzeCommand() {
  console.log("Analyze command placeholder");
}

// src/commands/history.ts
function historyCommand() {
  console.log("History command placeholder");
}

// src/output/welcome.ts
var import_chalk2 = __toESM(require("chalk"));
var import_string_width = __toESM(require("string-width"));

// src/output/banner.ts
var import_chalk = __toESM(require("chalk"));
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

// src/output/welcome.ts
function centerText(text, width) {
  const visibleWidth = (0, import_string_width.default)(text);
  const padding = Math.max(0, Math.floor((width - visibleWidth) / 2));
  return " ".repeat(padding) + text;
}
function createWelcomeBox(width) {
  const boxText = "\u273B Welcome to Synex \u273B";
  const boxWidth = Math.max(boxText.length + 4, 30);
  const leftPadding = Math.max(0, Math.floor((width - boxWidth) / 2));
  const padding = " ".repeat(leftPadding);
  const innerWidth = boxWidth - 2;
  const textPadding = Math.max(0, Math.floor((innerWidth - boxText.length) / 2));
  const rightTextPadding = innerWidth - boxText.length - textPadding;
  return [
    padding + "\u256D" + "\u2500".repeat(boxWidth - 2) + "\u256E",
    padding + "\u2502" + " ".repeat(textPadding) + boxText + " ".repeat(rightTextPadding) + "\u2502",
    padding + "\u2570" + "\u2500".repeat(boxWidth - 2) + "\u256F"
  ];
}
async function showWelcomeScreen() {
  process.stdout.write("\x1Bc");
  const terminalWidth = process.stdout.columns || 80;
  const terminalHeight = process.stdout.rows || 24;
  const logoHeight = SYNEX_LOGO.length;
  const welcomeBoxHeight = 3;
  const descriptionHeight = 1;
  const selectTextHeight = 1;
  const promptHeight = 5;
  const spacingHeight = 6;
  const totalContentHeight = welcomeBoxHeight + logoHeight + descriptionHeight + selectTextHeight + promptHeight + spacingHeight;
  const verticalPadding = Math.max(1, Math.floor((terminalHeight - totalContentHeight) / 2));
  for (let i = 0; i < verticalPadding; i++) {
    console.log();
  }
  const welcomeBox = createWelcomeBox(terminalWidth);
  welcomeBox.forEach((line) => {
    console.log(import_chalk2.default.cyan(line));
  });
  console.log();
  const colors = [
    import_chalk2.default.hex("#00FFFF"),
    // bright cyan
    import_chalk2.default.hex("#00CED1"),
    // dark turquoise
    import_chalk2.default.hex("#1E90FF")
    // dodger blue
  ];
  SYNEX_LOGO.forEach((line, index) => {
    const colorIndex = index % colors.length;
    console.log(colors[colorIndex](centerText(line, terminalWidth)));
  });
  console.log();
  const description = "AI tool for code review, analysis and smart automation.";
  console.log(centerText(description, terminalWidth));
  console.log();
  const menuOptions = [
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
  let selectedIndex = 0;
  let userChoice = null;
  function displayCenteredMenu() {
    process.stdout.write("\x1B[2J\x1B[H");
    for (let i = 0; i < verticalPadding; i++) {
      console.log();
    }
    const welcomeBox2 = createWelcomeBox(terminalWidth);
    welcomeBox2.forEach((line) => {
      console.log(import_chalk2.default.cyan(line));
    });
    console.log();
    SYNEX_LOGO.forEach((line, index) => {
      const colorIndex = index % colors.length;
      console.log(colors[colorIndex](centerText(line, terminalWidth)));
    });
    console.log();
    const description2 = "Synex is your AI-powered CLI for code analysis, prompts, and automation.";
    console.log(centerText(description2, terminalWidth));
    console.log();
    const selectText = import_chalk2.default.cyan("Select login method:");
    console.log(centerText(selectText, terminalWidth));
    console.log();
    menuOptions.forEach((option, index) => {
      const isSelected = index === selectedIndex;
      const prefix = isSelected ? import_chalk2.default.cyan("\u276F ") : "  ";
      const title = isSelected ? import_chalk2.default.cyan.bold(option.title) : import_chalk2.default.cyan(option.title);
      const description3 = import_chalk2.default.dim(`(${option.description})`);
      const optionLine = prefix + title + " " + description3;
      console.log(centerText(optionLine, terminalWidth));
    });
    console.log();
    const hint = import_chalk2.default.dim("Use arrow keys to navigate, Enter to select, Ctrl+C to exit");
    console.log(centerText(hint, terminalWidth));
  }
  displayCenteredMenu();
  const response = await new Promise((resolve) => {
    if (process.stdin.isTTY && typeof process.stdin.setRawMode === "function") {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
      const keyHandler = (key) => {
        if (key === "") {
          process.stdout.write("\x1Bc");
          process.exit(0);
        } else if (key === "\x1B[A" || key === "\x1B[D") {
          selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : menuOptions.length - 1;
          displayCenteredMenu();
        } else if (key === "\x1B[B" || key === "\x1B[C") {
          selectedIndex = selectedIndex < menuOptions.length - 1 ? selectedIndex + 1 : 0;
          displayCenteredMenu();
        } else if (key === "\r" || key === "\n") {
          userChoice = menuOptions[selectedIndex].value;
          process.stdin.setRawMode(false);
          process.stdin.removeListener("data", keyHandler);
          process.stdin.pause();
          resolve({ loginMethod: userChoice });
        }
      };
      process.stdin.on("data", keyHandler);
    } else {
      console.log();
      console.log(centerText(import_chalk2.default.yellow("Interactive mode not available. Using fallback."), terminalWidth));
      console.log();
      console.log(centerText("Enter 1 for Free API Login, 2 for API Key Login:", terminalWidth));
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
      const inputHandler = (input) => {
        const choice = input.trim();
        if (choice === "1") {
          userChoice = "free";
          process.stdin.removeListener("data", inputHandler);
          process.stdin.pause();
          resolve({ loginMethod: userChoice });
        } else if (choice === "2") {
          userChoice = "apikey";
          process.stdin.removeListener("data", inputHandler);
          process.stdin.pause();
          resolve({ loginMethod: userChoice });
        } else {
          console.log(centerText(import_chalk2.default.red("Invalid choice. Please enter 1 or 2:"), terminalWidth));
        }
      };
      process.stdin.on("data", inputHandler);
    }
  });
  if (!response.loginMethod) {
    process.stdout.write("\x1Bc");
    process.exit(0);
  }
  console.log();
  const confirmationMsg = response.loginMethod === "free" ? import_chalk2.default.green("\u2713 Selected: Free API Login") : import_chalk2.default.green("\u2713 Selected: API Key Login");
  console.log(centerText(confirmationMsg, terminalWidth));
  console.log();
  return response.loginMethod;
}

// src/convex/auth.ts
function isAuthenticated() {
  return false;
}
async function loginWithFreeAPI() {
  console.log("\nInitiating free API login...");
  console.log("This would redirect to authentication flow.");
  return true;
}
async function loginWithAPIKey() {
  console.log("\nInitiating API key login...");
  console.log("This would prompt for OpenRouter/Convex API key.");
  return true;
}

// src/index.ts
async function main() {
  const packageJson = JSON.parse((0, import_fs.readFileSync)((0, import_path.join)(__dirname, "../package.json"), "utf8"));
  if (!isAuthenticated()) {
    const loginMethod = await showWelcomeScreen();
    let loginSuccess = false;
    if (loginMethod === "free") {
      loginSuccess = await loginWithFreeAPI();
    } else if (loginMethod === "apikey") {
      loginSuccess = await loginWithAPIKey();
    }
    if (!loginSuccess) {
      console.log(import_chalk3.default.red("Login failed. Please try again."));
      process.exit(1);
    }
    console.log(import_chalk3.default.green(`Login successful! Selected method: ${loginMethod}`));
    console.log("You can now use Synex commands.");
    console.log();
  }
  const program = new import_commander.Command();
  program.name("synex").description("Synex - AI-powered CLI for developers").version(packageJson.version);
  program.command("login").description("Login to Synex").action(() => {
    loginCommand();
  });
  program.command("prompt <message>").description("Send a prompt to AI").option("-m, --model <model>", "AI model to use", "gpt-oss-2b").action((message, options) => {
    promptCommand(message, options);
  });
  program.command("analyze").description("Analyze codebase").action(() => {
    analyzeCommand();
  });
  program.command("history").description("Show command history").action(() => {
    historyCommand();
  });
  program.parse();
}
main().catch((error) => {
  console.error(import_chalk3.default.red("Error:"), error.message);
  process.exit(1);
});
