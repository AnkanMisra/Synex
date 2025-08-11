Didnt had time to make the readme will do this shit later on

**currently phase 2**

but if you wana run ts:

Clone the repo if you cant do that go fuck yourself

Universal CMD:
```
pnpm install
pnpm build
```
```
node bin/synex.js
```


or if ur fucking stuck
```
synex --help
```

Notes

- macOS & Linux:
  - Run these commands in your terminal (Terminal, iTerm2, GNOME Terminal, etc.).
  - To run as a global CLI, use:
    ```
    pnpm link
    synex
    ```

- Windows:
  - Run these commands in Command Prompt, PowerShell, or Windows Terminal.
  - If you see ```'pnpm'``` is not recognized, install pnpm globally:
    ```
    npm install -g pnpm
    ```
  - If you see ```'node'``` is not recognized, install node globally:
    ```
    npm install -g node
    ```
  - If you see ```'chmod'``` is not recognized, install chmod globally:
    ```
    npm install -g chmod
    ```
  - If you see ```'synex'``` is not recognized, install synex globally:
    ```
    pnpm link
    ```
  - If you see ```'synex'``` is not recognized, install synex globally:
    ```
    pnpm link
    ```
  - To run as a global CLI:
    ```
    pnpm link
    synex
    ```

- Shebang Compatibility:
  - If you want to run ```bin/synex.js``` directly (e.g., ```./bin/synex.js```), make sure it starts with:
    ```
    #!/usr/bin/env node
    ```
  - On macOS/Linux, make it executable:
    ```
    chmod +x bin/synex.js
    ./bin/synex.js
  - On Windows, use:
    ```node bin/synex.js```

---
