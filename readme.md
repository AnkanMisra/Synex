<img width="1470" height="956" alt="Screenshot 2025-08-11 at 21 57 08" src="https://github.com/user-attachments/assets/270e1776-99b9-47ec-8671-381ba5a1b985" />

Didnt had time to make the readme will do this shit later on

**currently phase 2**

but if you wana run ts:

Clone the repo if you cant do that go fuck yourself

Universal CMD:
```zsh
pnpm install
pnpm build
```
```zsh
node bin/synex.js
```
run the fucking backend by yourself
```zsh
pnpm run dev
```
run the fucking frontend by yourself
```zsh
pnpm run dev
```

or if ur fucking stuck
```zsh
synex --help
```

Notes

- macOS & Linux:
  - Run these commands in your terminal (Terminal, iTerm2, GNOME Terminal, etc.).
  - To run as a global CLI, use:
    ```zsh
    pnpm link
    synex
    ```

- Windows:
  - Run these commands in Command Prompt, PowerShell, or Windows Terminal.
  - If you see ```'pnpm'``` is not recognized, install pnpm globally:
    ```zsh
    npm install -g pnpm
    ```
  - If you see ```'node'``` is not recognized, install node globally:
    ```zsh
    # Node.js should be installed from nodejs.org, not via npm
    ```
  - If you see ```'chmod'``` is not recognized, install chmod globally:
    ```zsh
    # chmod is a system command, not an npm package
    ```
  - If you see ```'synex'``` is not recognized, install synex globally:
    ```zsh
    pnpm link
    ```
  - If you see ```'synex'``` is not recognized, install synex globally:
    ```zsh
    pnpm link
    ```
  - To run as a global CLI:
    ```zsh
    pnpm link
    synex
    ```

- Shebang Compatibility:
  - If you want to run ```bin/synex.js``` directly (e.g., ```./bin/synex.js```), make sure it starts with:
    ```zsh
    #!/usr/bin/env node
    ```
  - On macOS/Linux, make it executable:
    ```zsh
    chmod +x bin/synex.js
    ./bin/synex.js
  - On Windows, use:
    ```node bin/synex.js```

---
