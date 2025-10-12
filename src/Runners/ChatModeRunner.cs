using Jint.Native;
using Jint.Native.Function;
using Jint.Runtime.Interop;
using JintRunner.Models;

namespace JintRunner.Runners
{
    /// <summary>
    /// Runner for Chat mode - executes script and starts interactive chat loop
    /// </summary>
    public class ChatModeRunner : BaseJavaScriptRunner
    {
        /// <summary>
        /// Executes chat mode logic - starts interactive chat loop
        /// </summary>
        /// <param name="config">Configuration for the runner</param>
        protected override async Task ExecuteModeLogicAsync(JintRunnerConfig config)
        {
            Console.WriteLine("Starting chat mode...");
            Console.WriteLine("Type messages to interact with the bot, or 'exit'/'quit' to leave.");

            await StartChatLoopAsync();

            // Call onExit handler if registered
            CallEventHandler("exit");
        }

        /// <summary>
        /// Starts the interactive chat loop
        /// </summary>
        private async Task StartChatLoopAsync()
        {
            while (!_shouldQuit)
            {
                Console.Write("You: ");
                var input = Console.ReadLine();

                if (string.IsNullOrEmpty(input))
                {
                    continue;
                }

                if (input.ToLower() is "exit" or "quit")
                {
                    break;
                }

                // Call message handler if registered
                if (_eventHandlers.TryGetValue("message", out var messageHandler))
                {
                    try
                    {
                        if (_jsEngine != null && messageHandler is ScriptFunction func)
                        {
                            // Create event object matching expected structure
                            var eventData = new
                            {
                                name = "message",
                                data = new
                                {
                                    text = input
                                }
                            };
                            var jsEventData = JsValue.FromObject(_jsEngine, eventData);
                            _jsEngine.Invoke(func, jsEventData);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error processing message: {ex.Message}");
                    }
                }
                else
                {
                    Console.WriteLine("Bot: No message handler registered. Use onMessage(function(msg) { ... }) in your script.");
                }

                await Task.Delay(50); // Small delay to prevent tight loop
            }
        }
    }
}