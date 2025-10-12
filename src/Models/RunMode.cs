namespace JintRunner.Models
{
    /// <summary>
    /// Represents the different execution modes available in JintRunner
    /// </summary>
    public enum RunMode
    {
        /// <summary>
        /// Execute script and quit
        /// </summary>
        Run,

        /// <summary>
        /// Execute script and start chat loop
        /// </summary>
        Chat,

        /// <summary>
        /// Execute script and start REPL (Read-Eval-Print Loop)
        /// </summary>
        Cli
    }
}