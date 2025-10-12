using JintRunner.Models;

namespace JintRunner.Runners
{
    /// <summary>
    /// Runner for CLI mode - executes script and starts REPL (Read-Eval-Print Loop)
    /// </summary>
    public class CliModeRunner : BaseJavaScriptRunner
    {
        /// <summary>
        /// Executes CLI mode logic - starts REPL
        /// </summary>
        /// <param name="config">Configuration for the runner</param>
        protected override async Task ExecuteModeLogicAsync(JintRunnerConfig config)
        {
            Console.WriteLine("Starting JavaScript REPL...");
            Console.WriteLine("JavaScript REPL started. Type expressions to evaluate, or 'exit'/'quit' to leave.");

            await StartReplLoopAsync();

            // Call onExit handler if registered
            CallEventHandler("exit");
        }

        /// <summary>
        /// Starts the REPL (Read-Eval-Print Loop)
        /// </summary>
        private async Task StartReplLoopAsync()
        {
            while (!_shouldQuit)
            {
                Console.Write("js> ");
                var input = Console.ReadLine();

                if (string.IsNullOrEmpty(input))
                {
                    continue;
                }

                if (input.ToLower() is "exit" or "quit")
                {
                    break;
                }

                try
                {
                    var result = EvaluateExpression(input);

                    // Check if the result is an error message
                    if (result.StartsWith("Error:"))
                    {
                        // Display errors in red
                        Console.ForegroundColor = ConsoleColor.Red;
                        Console.WriteLine($"{result}");
                        Console.ResetColor();
                    }
                    else
                    {
                        // Display successful results in yellow
                        Console.ForegroundColor = ConsoleColor.Yellow;
                        Console.WriteLine($"{result}");
                        Console.ResetColor();
                    }
                }
                catch (Exception ex)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"Error: {ex.Message}");
                    Console.ResetColor();
                }

                await Task.Delay(50); // Small delay to prevent tight loop
            }
        }
    }
}