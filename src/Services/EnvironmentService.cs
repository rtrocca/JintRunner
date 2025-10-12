using DotNetEnv;
using System.Collections;

namespace JintRunner.Services
{
    /// <summary>
    /// Service for loading and managing environment variables from .env file
    /// </summary>
    public class EnvironmentService
    {
        private const string DEFAULT_ENV_FILE = ".env";

        /// <summary>
        /// Loads environment variables from the .env file
        /// </summary>
        /// <param name="envFilePath">Path to the .env file (optional, defaults to ".env")</param>
        /// <returns>Dictionary of loaded environment variables</returns>
        public static Dictionary<string, string> LoadEnvironmentVariables(string? envFilePath = null)
        {
            var filePath = envFilePath ?? DEFAULT_ENV_FILE;
            var envVars = new Dictionary<string, string>();

            try
            {
                if (File.Exists(filePath))
                {
                    Console.WriteLine($"Loading environment variables from: {filePath}");

                    // Load .env file
                    Env.Load(filePath);

                    // Get all environment variables and filter out system ones
                    foreach (DictionaryEntry env in Environment.GetEnvironmentVariables())
                    {
                        if (env.Key != null && env.Value != null)
                        {
                            var key = env.Key.ToString()!;
                            var value = env.Value.ToString()!;
                            envVars[key] = value;
                        }
                    }

                    Console.WriteLine($"Loaded {envVars.Count} environment variables");
                }
                else
                {
                    Console.WriteLine($"No .env file found at: {filePath}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Warning: Failed to load .env file: {ex.Message}");
            }

            return envVars;
        }

        /// <summary>
        /// Gets a specific environment variable value
        /// </summary>
        /// <param name="key">The environment variable key</param>
        /// <param name="defaultValue">Default value if the key is not found</param>
        /// <returns>The environment variable value or default value</returns>
        public static string GetEnvironmentVariable(string key, string defaultValue = "")
        {
            return Environment.GetEnvironmentVariable(key) ?? defaultValue;
        }

        /// <summary>
        /// Sets an environment variable
        /// </summary>
        /// <param name="key">The environment variable key</param>
        /// <param name="value">The environment variable value</param>
        public static void SetEnvironmentVariable(string key, string value)
        {
            Environment.SetEnvironmentVariable(key, value);
        }
    }
}