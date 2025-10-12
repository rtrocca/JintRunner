namespace JintRunner.Models
{
    /// <summary>
    /// Configuration settings for JintRunner execution
    /// </summary>
    public class JintRunnerConfig
    {
        public RunMode Mode { get; set; }
        public string? ScriptPath { get; set; }
        public Dictionary<string, string> EnvironmentVariables { get; set; } = new();

        /// <summary>
        /// Creates a new instance of JintRunnerConfig
        /// </summary>
        /// <param name="mode">The execution mode</param>
        /// <param name="scriptPath">Optional path to the JavaScript file</param>
        public JintRunnerConfig(RunMode mode, string? scriptPath = null)
        {
            Mode = mode;
            ScriptPath = scriptPath;
        }
    }
}