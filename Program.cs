using Jint;
using Jint.Native;
using Jint.Native.Function;
using System.Collections.Generic;

namespace JintRunner
{
    class Program
    {
        private static Engine? _jsEngine;
        private static Dictionary<string, JsValue> _eventHandlers = new();

        static void Main(string[] args)
        {
            if (args.Length != 1)
            {
                Console.WriteLine("Usage: JintRunner <script.js>");
                Environment.Exit(1);
            }

            string scriptPath = args[0];
            
            if (!File.Exists(scriptPath))
            {
                Console.WriteLine($"Error: Script file '{scriptPath}' not found.");
                Environment.Exit(1);
            }

            try
            {
                InitializeJsEngine();
                LoadAndExecuteScript(scriptPath);
                StartChatLoop();
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
                WriteAssistantMessage(message);
            }));
        }

        private static void LoadAndExecuteScript(string scriptPath)
        {
            string scriptContent = File.ReadAllText(scriptPath);
            _jsEngine!.Execute(scriptContent);
        }

        private static void StartChatLoop()
        {
            while (true)
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
                        var eventData = new {
                            name = "message",
                            data = new {
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
