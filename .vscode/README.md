# VS Code Configuration for JintRunner

This document describes the VS Code configuration for the JintRunner C# console application.

## 📁 Configuration Files

### `.vscode/launch.json` - Debug Configurations

**Available Debug Configurations:**

1. **JintRunner - CLI Mode** - Start in interactive CLI/REPL mode
2. **JintRunner - Run Simple Test** - Run the simple test script
3. **JintRunner - Chat Mode** - Start in chat mode
4. **JintRunner - Run Sample Bot** - Run the sample bot script  
5. **JintRunner - Custom Script** - Prompts for a script path to run
6. **Attach to Process** - Attach debugger to running process

**Usage:**
- Press `F5` to start debugging with the default configuration
- Press `Ctrl+Shift+P` → "Debug: Select and Start Debugging" to choose a configuration
- Set breakpoints by clicking in the gutter next to line numbers

### `.vscode/tasks.json` - Build Tasks

**Available Tasks:**

1. **build** (default) - Build the project in Debug mode
2. **publish** - Publish the project
3. **watch** - Build and watch for changes
4. **clean** - Clean build artifacts
5. **restore** - Restore NuGet packages
6. **build-all-platforms** - Run the build-all.sh script
7. **run-cli-mode** - Run in CLI mode without debugging
8. **run-custom-script** - Run a custom script without debugging

**Usage:**
- Press `Ctrl+Shift+P` → "Tasks: Run Task" to run a task
- Press `Ctrl+Shift+B` to run the default build task
- Tasks can be run from the Terminal menu → "Run Task..."

### `.vscode/settings.json` - Workspace Settings

**Key Settings:**
- **Solution Configuration**: Points to JintRunner.sln
- **Format on Save**: Automatically formats code when saving
- **Code Actions**: Organizes imports and fixes issues on save
- **File Exclusions**: Hides bin/, obj/, .vs/ folders from explorer
- **C# Semantic Highlighting**: Enhanced syntax highlighting

### `.vscode/extensions.json` - Recommended Extensions

**Essential Extensions:**
- `ms-dotnettools.csharp` - C# language support
- `ms-dotnettools.csdevkit` - C# Dev Kit
- `ms-dotnettools.vscode-dotnet-runtime` - .NET Runtime support
- `formulahendry.dotnet-test-explorer` - Test explorer
- `jchannon.csharpextensions` - C# productivity extensions

**Installation:**
VS Code will automatically suggest installing these extensions when you open the workspace.

### `.editorconfig` - Code Formatting

**Formatting Rules:**
- **C# Files**: 4 spaces indentation
- **JSON/Project Files**: 2 spaces indentation  
- **JavaScript**: 2 spaces indentation
- **UTF-8 encoding** with LF line endings
- **Trim trailing whitespace** and insert final newline

## 🚀 Getting Started

### 1. Install Required Extensions

When you open the project, VS Code will prompt you to install recommended extensions. Click "Install All" or install them manually:

```bash
code --install-extension ms-dotnettools.csharp
code --install-extension ms-dotnettools.csdevkit
```

### 2. Build the Project

- Press `Ctrl+Shift+B` to build
- Or use Command Palette: `Ctrl+Shift+P` → "Tasks: Run Build Task"

### 3. Start Debugging

- Press `F5` to start debugging (CLI mode by default)
- Or press `Ctrl+Shift+P` → "Debug: Select and Start Debugging"

### 4. Run Without Debugging

- Press `Ctrl+F5` to run without debugging
- Or use tasks: `Ctrl+Shift+P` → "Tasks: Run Task" → "run-cli-mode"

## 🔧 Development Workflow

### Typical Development Session

1. **Open Terminal**: `Ctrl+Shift+`` 
2. **Build**: `Ctrl+Shift+B`
3. **Set Breakpoints**: Click in gutter next to line numbers
4. **Start Debugging**: `F5`
5. **Test Different Modes**: Use different launch configurations

### Code Editing Features

- **IntelliSense**: Autocomplete and suggestions
- **Go to Definition**: `F12` or `Ctrl+Click`
- **Find All References**: `Shift+F12`
- **Rename Symbol**: `F2`
- **Format Document**: `Shift+Alt+F`
- **Quick Fix**: `Ctrl+.`

### Running Scripts

**Method 1: Debug Configuration**
1. Select "JintRunner - Custom Script" configuration
2. Press `F5`
3. Enter script path when prompted

**Method 2: Task**
1. `Ctrl+Shift+P` → "Tasks: Run Task"
2. Select "run-custom-script"
3. Enter script path when prompted

**Method 3: Terminal**
```bash
dotnet run -- cli
dotnet run -- run scripts/sample-bot.js
dotnet run -- chat
```

### Multi-Platform Building

Use the "build-all-platforms" task to create executables for all platforms:

1. `Ctrl+Shift+P` → "Tasks: Run Task"
2. Select "build-all-platforms"
3. Check `build/` folder for zip files

## 🐛 Debugging Tips

### Setting Breakpoints

- **Line Breakpoint**: Click in gutter
- **Conditional Breakpoint**: Right-click in gutter → "Add Conditional Breakpoint"
- **Logpoint**: Right-click in gutter → "Add Logpoint"

### Debug Console

- Access with `Ctrl+Shift+Y` during debugging
- Execute C# expressions in the debug context
- Inspect variables and call methods

### Common Debugging Scenarios

**Debug CLI Input Processing:**
```csharp
// Set breakpoint in StartCliLoop() method
// Step through input parsing logic
```

**Debug Script Execution:**
```csharp
// Set breakpoint in ExecuteScript() method  
// Inspect Jint engine state and variables
```

**Debug loadScript() Function:**
```csharp
// Set breakpoint in loadScript implementation
// Check file path resolution and script loading
```

## 📋 Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Build | `Ctrl+Shift+B` |
| Start Debugging | `F5` |
| Start Without Debugging | `Ctrl+F5` |
| Stop Debugging | `Shift+F5` |
| Restart Debugging | `Ctrl+Shift+F5` |
| Step Over | `F10` |
| Step Into | `F11` |
| Step Out | `Shift+F11` |
| Toggle Breakpoint | `F9` |
| Run Task | `Ctrl+Shift+P` → "Tasks: Run Task" |
| Open Terminal | `Ctrl+Shift+`` |

## 🔍 Troubleshooting

### Build Errors

**"Project file not found"**
- Ensure you're in the correct workspace folder
- Check that JintRunner.csproj exists

**"SDK not found"**
- Install .NET 8.0 SDK
- Restart VS Code after installation

### Debugging Issues

**"Cannot find executable"**
- Build the project first (`Ctrl+Shift+B`)
- Check that `bin/Debug/net8.0/jr.dll` exists

**Breakpoints not hitting**
- Ensure you're running in Debug configuration
- Check that symbols are loaded (Output → C#)

### Extension Issues

**C# features not working**
- Install the recommended extensions
- Reload the window: `Ctrl+Shift+P` → "Developer: Reload Window"
- Check Output → C# for error messages

---

This configuration provides a complete development environment for building, debugging, and testing the JintRunner application in VS Code.