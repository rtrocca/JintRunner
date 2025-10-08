using Jint;
using Jint.Native;
using Jint.Native.Function;
using System.Collections.Generic;
using Jint.Native.Json;

namespace JintRunner
{
    enum RunMode
    {
        Run,    // Execute script and quit
        Chat,   // Execute script and start chat loop
        Cli     // Execute script and start REPL
    }

    class Program
    {
        private static Engine? _jsEngine;
        private static Dictionary<string, JsValue> _eventHandlers = new();
        private static RunMode _currentMode = RunMode.Chat;
        private static bool _shouldQuit = false;

        static int Main(string[] args)
        {
            if (args.Length == 0)
            {
                Console.WriteLine("Usage:");
                Console.WriteLine("  jr run <script.js>   - Execute script and quit");
                Console.WriteLine("  jr chat <script.js>  - Execute script and start chat");
                Console.WriteLine("  jr cli [script.js]   - Execute script (optional) and start REPL");
                return 1;
            }

            string command = args[0].ToLower();
            string? scriptPath = null;

            // Parse the command and script path
            switch (command)
            {
                case "run":
                case "chat":
                    if (args.Length != 2)
                    {
                        Console.WriteLine($"Error: '{command}' command requires a script file.");
                        Console.WriteLine($"Usage: JintRunner {command} <script.js>");
                        return 1;
                    }
                    scriptPath = args[1];
                    break;
                case "cli":
                    if (args.Length > 2)
                    {
                        Console.WriteLine("Error: 'cli' command accepts at most one script file.");
                        Console.WriteLine("Usage: JintRunner cli [script.js]");
                        return 1;
                    }
                    if (args.Length == 2)
                    {
                        scriptPath = args[1];
                    }
                    // scriptPath can be null for cli mode
                    break;
                default:
                    Console.WriteLine($"Error: Unknown command '{command}'");
                    Console.WriteLine("Valid commands are: run, chat, cli");
                    return 1;
            }

            // Set the current mode
            switch (command)
            {
                case "run":
                    _currentMode = RunMode.Run;
                    break;
                case "chat":
                    _currentMode = RunMode.Chat;
                    break;
                case "cli":
                    _currentMode = RunMode.Cli;
                    break;
            }

            // Validate script file if provided
            if (scriptPath != null && !File.Exists(scriptPath))
            {
                Console.WriteLine($"Error: Script file '{scriptPath}' not found.");
                return 1;
            }

            try
            {
                ExecuteMode(_currentMode, scriptPath);
                return 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return 1;
            }
        }

        private static void ExecuteMode(RunMode mode, string? scriptPath)
        {
            _currentMode = mode;

            try
            {
                InitializeJsEngine();

                // Load and execute script if provided
                if (scriptPath != null)
                {
                    if (!File.Exists(scriptPath))
                    {
                        Console.WriteLine($"Error: Script file '{scriptPath}' not found.");
                        Environment.Exit(1);
                    }
                    LoadAndExecuteScript(scriptPath);
                }

                // Handle different modes
                switch (_currentMode)
                {
                    case RunMode.Run:
                        if (scriptPath == null)
                        {
                            Console.WriteLine("Error: Script file is required for run mode.");
                            Environment.Exit(1);
                        }
                        // Script executed, now quit
                        break;
                    case RunMode.Chat:
                        if (scriptPath == null)
                        {
                            Console.WriteLine("Error: Script file is required for chat mode.");
                            Environment.Exit(1);
                        }
                        StartChatLoop();
                        break;
                    case RunMode.Cli:
                        if (scriptPath != null)
                        {
                            Console.WriteLine($"Script '{scriptPath}' executed. Starting JavaScript REPL...");
                        }
                        else
                        {
                            Console.WriteLine("Starting JavaScript REPL...");
                        }
                        StartCliLoop();
                        break;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Environment.Exit(1);
            }
        }

        private static void InitializeJsEngine()
        {
            _jsEngine = new Engine();

            // Add the register function
            _jsEngine.SetValue("register", new Action<string, JsValue>((eventName, handler) =>
            {
                // Check if the handler is actually a function using the pattern from your reference
                if (handler.IsObject() && handler.AsObject() is Function func)
                {
                    _eventHandlers[eventName] = handler;
                }
                else
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"Error: Handler for event '{eventName}' is not a function");
                    Console.ResetColor();
                }
            }));

            // Add the write function
            _jsEngine.SetValue("write", new Action<string>((message) =>
            {
                WriteMessage(message);
            }));

            // Add the quit function
            _jsEngine.SetValue("quit", new Action(() =>
            {
                _shouldQuit = true;
            }));

            // Add a simple script loading function
            _jsEngine.SetValue("loadScript", new Action<string>((relativePath) =>
            {
                try
                {
                    // Get the directory of the currently executing script
                    string currentDir = Path.GetDirectoryName(Environment.CurrentDirectory) ?? Environment.CurrentDirectory;
                    string fullPath = Path.Combine(Environment.CurrentDirectory, "scripts", relativePath);

                    if (!File.Exists(fullPath))
                    {
                        throw new FileNotFoundException($"Script file not found: {fullPath}");
                    }

                    string scriptContent = File.ReadAllText(fullPath);
                    _jsEngine!.Execute(scriptContent);
                }
                catch (Exception ex)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"Error loading script '{relativePath}': {ex.Message}");
                    Console.ResetColor();
                }
            }));
        }

        private static void LoadAndExecuteScript(string scriptPath)
        {
            string scriptContent = File.ReadAllText(scriptPath);
            _jsEngine!.Execute(scriptContent);
        }

        private static void StartChatLoop()
        {
            while (!_shouldQuit)
            {
                // Display user prompt
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.Write("User> ");


                // Read user input
                string? userInput = Console.ReadLine();

                if (string.IsNullOrEmpty(userInput))
                    continue;

                // Check for exit commands
                if (userInput.ToLower() == "exit" || userInput.ToLower() == "quit")
                    break;

                Console.ResetColor();
                // Trigger the message event
                TriggerMessageEvent(userInput);
            }
        }

        private static void StartCliLoop()
        {
            Console.WriteLine("JavaScript REPL started. Type expressions to evaluate, or 'exit'/'quit' to leave.");

            var serializer = new JsonSerializer(_jsEngine);

            while (!_shouldQuit)
            {
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.Write("js> ");
                Console.ResetColor();

                string? userInput = Console.ReadLine();

                if (string.IsNullOrEmpty(userInput))
                    continue;

                // Check for exit commands
                if (userInput.ToLower() == "exit" || userInput.ToLower() == "quit")
                    break;

                try
                {
                    // Execute the user input and get the result
                    var result = _jsEngine!.Evaluate(userInput);

                    Console.ForegroundColor = ConsoleColor.Yellow;
                    // Print the result (unless it's undefined)
                    if (result.IsUndefined())
                    {
                        Console.WriteLine("=> undefined");
                    }
                    else if (result.IsNull())
                    {
                        Console.WriteLine("=> null");
                    }
                    else if (result.IsObject())
                    {
                        // Special handling for objects to print JSON representation
                        var obj = result.AsObject();

                        var json = serializer.Serialize(obj);
                        Console.WriteLine($"=> {json}");
                    }
                    else if (result.IsArray())
                    {
                        // Special handling for arrays to print contents
                        var array = result.AsArray();
                        var items = new List<string>();
                        foreach (var item in array)
                        {
                            items.Add(item.ToString() ?? "undefined");
                        }
                        Console.WriteLine($"=> [{string.Join(", ", items)}]");
                    }
                    else
                    {
                        Console.WriteLine($"=> {result}");
                    }
                    Console.ResetColor();
                }
                catch (Exception ex)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"Error: {ex.Message}");
                    Console.ResetColor();
                }
            }
        }

        private static void WriteMessage(string message)
        {
            if (_currentMode == RunMode.Chat)
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.Write("Assistant> ");
                Console.WriteLine(message);
                Console.ResetColor();
            }
            else
            {
                // In run and cli modes, just print the message without prefix
                Console.WriteLine(message);
            }
        }

        private static void WriteAssistantMessage(string message)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write("Assistant> ");
            Console.WriteLine(message);
            Console.ResetColor();
        }

        private static void TriggerMessageEvent(string text)
        {
            try
            {
                // Check if there's a handler for the 'message' event
                if (_eventHandlers.ContainsKey("message"))
                {
                    var handler = _eventHandlers["message"];

                    // Verify the handler is a function and invoke it properly
                    if (handler.IsObject() && handler.AsObject() is Function func)
                    {
                        // Create the event object using JsValue.FromObject
                        var eventData = new
                        {
                            name = "message",
                            data = new
                            {
                                text = text
                            }
                        };
                        var eventObject = JsValue.FromObject(_jsEngine!, eventData);

                        // Call the function with the event object as parameter
                        func.Call(JsValue.Undefined, new JsValue[] { eventObject });
                    }
                    else
                    {
                        Console.ForegroundColor = ConsoleColor.Red;
                        Console.WriteLine("Error: Registered handler is not a valid function");
                        Console.ResetColor();
                    }
                }
                else
                {
                    Console.ForegroundColor = ConsoleColor.Yellow;
                    Console.WriteLine("Warning: No event handler registered for 'message'");
                    Console.ResetColor();
                }
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"Error executing message handler: {ex.Message}");
                Console.ResetColor();
            }
        }
    }
}
