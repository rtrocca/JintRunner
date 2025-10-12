using JintRunner.Models;
using JintRunner.Services;

namespace JintRunner
{
    class Program
    {
        static async Task<int> Main(string[] args)
        {
            try
            {
                // Load environment variables from .env file
                var envVars = EnvironmentService.LoadEnvironmentVariables();

                // Parse command line arguments
                var config = ParseArguments(args);
                if (config == null)
                {
                    return 1;
                }

                // Set environment variables in config
                config.EnvironmentVariables = envVars;

                // Create runner factory and get appropriate runner
                var runnerFactory = new JavaScriptRunnerFactory();
                var runner = runnerFactory.CreateRunner(config.Mode);

                // Execute the runner
                return await runner.ExecuteAsync(config);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Fatal error: {ex.Message}");
                return 1;
            }
        }

        /// <summary>
        /// Parses command line arguments and creates configuration
        /// </summary>
        /// <param name="args">Command line arguments</param>
        /// <returns>Configuration object or null if parsing failed</returns>
        private static JintRunnerConfig? ParseArguments(string[] args)
        {
            if (args.Length == 0)
            {
                ShowUsage();
                return null;
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
                        Console.WriteLine($"Usage: jr {command} <script.js>");
                        return null;
                    }
                    scriptPath = args[1];
                    break;

                case "cli":
                    if (args.Length > 2)
                    {
                        Console.WriteLine("Error: 'cli' command accepts at most one script file.");
                        Console.WriteLine("Usage: jr cli [script.js]");
                        return null;
                    }
                    if (args.Length == 2)
                    {
                        scriptPath = args[1];
                    }
                    break;

                default:
                    Console.WriteLine($"Error: Unknown command '{command}'");
                    Console.WriteLine("Valid commands are: run, chat, cli");
                    return null;
            }

            // Validate script file if provided
            if (scriptPath != null && !File.Exists(scriptPath))
            {
                Console.WriteLine($"Error: Script file '{scriptPath}' not found.");
                return null;
            }

            // Create and return configuration
            var mode = command switch
            {
                "run" => RunMode.Run,
                "chat" => RunMode.Chat,
                "cli" => RunMode.Cli,
                _ => throw new ArgumentException($"Unsupported command: {command}")
            };

            return new JintRunnerConfig(mode, scriptPath);
        }

        /// <summary>
        /// Shows usage information
        /// </summary>
        private static void ShowUsage()
        {
            Console.WriteLine("Usage:");
            Console.WriteLine("  jr run <script.js>   - Execute script and quit");
            Console.WriteLine("  jr chat <script.js>  - Execute script and start chat");
            Console.WriteLine("  jr cli [script.js]   - Execute script (optional) and start REPL");
            Console.WriteLine();
            Console.WriteLine("Environment:");
            Console.WriteLine("  Place a .env file in the current directory to set environment variables");
            Console.WriteLine("  See .env.example for available configuration options");
        }
    }
}
