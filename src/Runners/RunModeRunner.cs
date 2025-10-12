using JintRunner.Models;

namespace JintRunner.Runners
{
    /// <summary>
    /// Runner for Run mode - executes script and exits
    /// </summary>
    public class RunModeRunner : BaseJavaScriptRunner
    {
        /// <summary>
        /// Executes run mode logic - simply exits after script execution
        /// </summary>
        /// <param name="config">Configuration for the runner</param>
        protected override async Task ExecuteModeLogicAsync(JintRunnerConfig config)
        {
            // In run mode, we just execute the script and exit
            // The script execution is handled by the base class

            // Call onExit handler if registered
            CallEventHandler("exit");

            // No additional logic needed for run mode
            await Task.CompletedTask;
        }
    }
}