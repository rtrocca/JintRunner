using JintRunner.Models;
using JintRunner.Core;

namespace JintRunner.Services
{
    /// <summary>
    /// Factory for creating JavaScript runners based on RunMode
    /// </summary>
    public class JavaScriptRunnerFactory
    {
        private readonly Dictionary<RunMode, Func<IJavaScriptRunner>> _runnerFactories;

        public JavaScriptRunnerFactory()
        {
            _runnerFactories = new Dictionary<RunMode, Func<IJavaScriptRunner>>
            {
                { RunMode.Run, () => new Runners.RunModeRunner() },
                { RunMode.Chat, () => new Runners.ChatModeRunner() },
                { RunMode.Cli, () => new Runners.CliModeRunner() }
            };
        }

        /// <summary>
        /// Creates a runner for the specified mode
        /// </summary>
        /// <param name="mode">The execution mode</param>
        /// <returns>A JavaScript runner instance</returns>
        /// <exception cref="ArgumentException">Thrown when an unsupported mode is provided</exception>
        public IJavaScriptRunner CreateRunner(RunMode mode)
        {
            if (_runnerFactories.TryGetValue(mode, out var factory))
            {
                return factory();
            }

            throw new ArgumentException($"Unsupported run mode: {mode}", nameof(mode));
        }
    }
}