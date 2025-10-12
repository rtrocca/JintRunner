using JintRunner.Models;

namespace JintRunner.Core
{
    /// <summary>
    /// Interface for JavaScript runners
    /// </summary>
    public interface IJavaScriptRunner
    {
        /// <summary>
        /// Executes the JavaScript runner with the provided configuration
        /// </summary>
        /// <param name="config">Configuration for the runner</param>
        /// <returns>Exit code (0 for success, non-zero for failure)</returns>
        Task<int> ExecuteAsync(JintRunnerConfig config);
    }
}