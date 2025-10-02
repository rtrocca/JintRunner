# jr - JavaScript Runner

A lightweight, cross-platform JavaScript execution engine built with .NET and [Jint](https://github.com/sebastienros/jint). Execute JavaScript code interactively or run scripts with multiple execution modes.

## 🚀 Features

- **Multiple Execution Modes**: Run scripts, interactive chat, or CLI/REPL mode
- **Cross-Platform**: Windows (ARM64/x86) and Linux (ARM64) support
- **Self-Contained**: Single executable with no external dependencies
- **Script Loading**: Custom `loadScript()` function for importing external JavaScript files
- **Interactive REPL**: Built-in JavaScript Read-Eval-Print Loop
- **Lightweight**: Optimized builds with trimming and single-file output

## 📋 Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or later
- `zip` utility (for creating distribution packages)

## 🛠️ Building from Source

### Quick Build

```bash
# Clone the repository
git clone https://github.com/rtrocca/JintRunner.git
cd JintRunner

# Build all platforms and create distribution packages
./build-all.sh
```

### Manual Build

```bash
# Restore dependencies
dotnet restore

# Build for specific platform
dotnet publish -c Release -r win-arm64 --self-contained true -p:PublishSingleFile=true -p:PublishTrimmed=true
dotnet publish -c Release -r win-x86 --self-contained true -p:PublishSingleFile=true -p:PublishTrimmed=true
dotnet publish -c Release -r linux-arm64 --self-contained true -p:PublishSingleFile=true -p:PublishTrimmed=true
```

### Build Output

The build script creates:
- Self-contained executables in `bin/Release/net8.0/<platform>/publish/`
- Distribution packages in `build/jr-<platform>-YYYYMMDD.zip`

## 📖 Usage

### Command Line Interface

```bash
jr <mode> [script]
```

### Execution Modes

#### 1. Run Mode
Execute a JavaScript file directly:
```bash
jr run script.js
```

#### 2. Chat Mode
Interactive mode with script execution:
```bash
jr chat [script.js]
```

#### 3. CLI Mode (REPL)
Interactive JavaScript console:
```bash
jr cli [script.js]
```

### Examples

```bash
# Run a JavaScript file
jr run examples/hello.js

# Start interactive REPL
jr cli

# Start REPL with a preloaded script
jr cli utils.js

# Interactive chat mode
jr chat
```

## 🔧 JavaScript Features

### Built-in Functions

#### `write(message)`
Output text to the console:

```javascript
write('Hello, World!');
write('Result: ' + (5 + 3));
```

#### `loadScript(filename)`
Load and execute external JavaScript files:

```javascript
// Load utility functions
loadScript('utils.js');

// Use functions from loaded script
write('Sum: ' + add(5, 3));
```

**Note**: Use `write()` for output instead of `console.log()` which is not implemented.

**Important**: The `loadScript()` function resolves paths relative to the directory where the `jr` executable is run, not relative to the script file location.

### Example Scripts

#### Simple Script (`hello.js`)
```javascript
write('Hello from jr!');
const result = 2 + 2;
write('2 + 2 = ' + result);
```

#### Module-like Script (`utils.js`)
```javascript
function add(a, b) {
    return a + b;
}

function multiply(a, b) {
    return a * b;
}

write('Utility functions loaded');
```

#### Using External Scripts (`main.js`)
```javascript
// Load utility functions (relative to current directory)
loadScript('utils.js');

// Use the loaded functions
write('5 + 3 = ' + add(5, 3));
write('4 * 7 = ' + multiply(4, 7));
```

## 🏗️ Project Structure

```
JintRunner/
├── Program.cs              # Main application entry point
├── JintRunner.csproj        # Project configuration
├── build-all.sh            # Multi-platform build script
├── README.md               # This file
├── scripts/                # Example JavaScript files
│   ├── simple-test.js
│   ├── sample-bot.js
│   └── cli-test.js
├── bin/                    # Build output
└── build/                  # Distribution packages
```

## 🔨 Development

### Adding New Features

1. **Extend Jint Engine**: Modify `InitializeJsEngine()` in `Program.cs`
2. **Add CLI Options**: Update argument parsing in `Main()` method
3. **Custom Functions**: Register new JavaScript functions in the engine setup

### Example: Adding a Custom Function

```csharp
private static Engine InitializeJsEngine()
{
    var engine = new Engine();
    
    // Add custom function
    engine.SetValue("customFunction", new Action<string>((message) => {
        Console.WriteLine($"Custom: {message}");
    }));
    
    // ... existing setup
    return engine;
}
```

### Building for Additional Platforms

To add support for more platforms, update the `build-all.sh` script:

```bash
# Add new target
echo "🔨 Building macOS ARM64 (osx-arm64)..."
dotnet publish -c Release -r osx-arm64 --self-contained true \
    -p:PublishSingleFile=true -p:PublishTrimmed=true
```

## 📦 Distribution

### Automated Packaging

The `build-all.sh` script automatically creates distribution packages:

- `jr-win-arm64-YYYYMMDD.zip` - Windows ARM64
- `jr-win-x86-YYYYMMDD.zip` - Windows x86
- `jr-linux-arm64-YYYYMMDD.zip` - Linux ARM64

### Manual Installation

1. Download the appropriate package for your platform
2. Extract the executable
3. Make executable (Linux/macOS): `chmod +x jr`
4. Run: `./jr cli`

## 🧪 Testing

```bash
# Test script execution
echo 'write("Hello World!");' > test.js
jr run test.js

# Test script loading (in same directory)
echo 'function test() { return "loaded"; }' > lib.js
echo 'loadScript("lib.js"); write(test());' > main.js
jr run main.js

# Test CLI mode
jr cli

# Test from scripts directory
cd scripts
jr run simple-test.js
```

## ⚡ Performance Notes

- Uses trimmed .NET runtime for smaller executable size
- Single-file deployment eliminates dependency issues
- Jint provides fast JavaScript execution without V8 overhead
- Self-contained builds include .NET runtime (13-15MB per executable)

## 🐛 Troubleshooting

### Build Issues

**Missing .NET SDK**
```bash
# Install .NET 8.0 SDK
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install -y dotnet-sdk-8.0

# Or download from https://dotnet.microsoft.com/download
```

**Trim Warnings**
Trim warnings from Jint library are expected and don't affect functionality.

### Runtime Issues

**Permission Denied (Linux/macOS)**
```bash
chmod +x jr
```

**Script Not Found**
Ensure JavaScript files are in the current directory or provide full paths.

**loadScript() Path Issues**
The `loadScript()` function resolves paths relative to where `jr` is executed, not relative to the script file. Use absolute paths or ensure dependency scripts are in the working directory.

**console.log Not Defined**
Use `write()` instead of `console.log()` for output. The `console` object is not implemented in the current Jint setup.

## 📄 License

This project is open source. Check the repository for license details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📚 Related Projects

- [Jint](https://github.com/sebastienros/jint) - JavaScript engine for .NET
- [Node.js](https://nodejs.org/) - Full-featured JavaScript runtime
- [QuickJS](https://bellard.org/quickjs/) - Lightweight JavaScript engine

---

Built with ❤️ using .NET and Jint