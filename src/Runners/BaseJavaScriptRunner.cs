using Jint;
using Jint.Native;
using Jint.Native.Function;
using Jint.Native.Json;
using Jint.Runtime;
using JintRunner.Core;
using JintRunner.Models;
using System.Collections;

namespace JintRunner.Runners
{
    /// <summary>
    /// Base class for JavaScript runners providing common functionality
    /// </summary>
    public abstract class BaseJavaScriptRunner : IJavaScriptRunner
    {
        protected Engine? _jsEngine;
        protected Dictionary<string, JsValue> _eventHandlers = new();
        protected bool _shouldQuit = false;

        /// <summary>
        /// Executes the JavaScript runner with the provided configuration
        /// </summary>
        /// <param name="config">Configuration for the runner</param>
        /// <returns>Exit code (0 for success, non-zero for failure)</returns>
        public virtual async Task<int> ExecuteAsync(JintRunnerConfig config)
        {
            try
            {
                // Initialize JavaScript engine
                InitializeJsEngine();

                // Execute script if provided
                if (!string.IsNullOrEmpty(config.ScriptPath))
                {
                    if (!File.Exists(config.ScriptPath))
                    {
                        Console.WriteLine($"Error: Script file '{config.ScriptPath}' not found.");
                        return 1;
                    }

                    await ExecuteScriptAsync(config.ScriptPath);
                }

                // Execute mode-specific logic
                await ExecuteModeLogicAsync(config);

                return 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return 1;
            }
        }

        /// <summary>
        /// Executes mode-specific logic - implemented by derived classes
        /// </summary>
        /// <param name="config">Configuration for the runner</param>
        protected abstract Task ExecuteModeLogicAsync(JintRunnerConfig config);

        /// <summary>
        /// Initializes the Jint JavaScript engine with standard functions
        /// </summary>
        protected virtual void InitializeJsEngine()
        {
            _jsEngine = new Engine();

            // Add write function
            _jsEngine.SetValue("write", new Action<object>((value) =>
            {
                Console.WriteLine(value?.ToString() ?? "null");
            }));

            // Add loadScript function
            _jsEngine.SetValue("loadScript", new Action<string>((filename) =>
            {
                try
                {
                    if (File.Exists(filename))
                    {
                        var scriptContent = File.ReadAllText(filename);
                        _jsEngine.Execute(scriptContent);
                    }
                    else
                    {
                        Console.WriteLine($"Error loading script '{filename}': Script file not found: {Path.GetFullPath(filename)}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error loading script '{filename}': {ex.Message}");
                }
            }));

            // Add quit function
            _jsEngine.SetValue("quit", new Action(() =>
            {
                _shouldQuit = true;
            }));

            // Add handler registration functions
            _jsEngine.SetValue("onMessage", new Action<JsValue>((handler) =>
            {
                if (handler is ScriptFunction)
                {
                    _eventHandlers["message"] = handler;
                }
            }));

            _jsEngine.SetValue("onStart", new Action<JsValue>((handler) =>
            {
                if (handler is ScriptFunction)
                {
                    _eventHandlers["start"] = handler;
                }
            }));

            _jsEngine.SetValue("onExit", new Action<JsValue>((handler) =>
            {
                if (handler is ScriptFunction)
                {
                    _eventHandlers["exit"] = handler;
                }
            }));

            // Add backward compatibility for register function
            _jsEngine.SetValue("register", new Action<string, JsValue>((eventName, handler) =>
            {
                if (handler is ScriptFunction)
                {
                    _eventHandlers[eventName] = handler;
                }
            }));

            // Add process.env object for environment variables (Node.js compatibility)
            var processEnv = new Dictionary<string, object>();
            foreach (DictionaryEntry env in Environment.GetEnvironmentVariables())
            {
                if (env.Key != null && env.Value != null)
                {
                    processEnv[env.Key.ToString()!] = env.Value.ToString()!;
                }
            }

            var processObject = new
            {
                env = processEnv
            };

            _jsEngine.SetValue("process", processObject);
        }

        /// <summary>
        /// Executes a JavaScript file
        /// </summary>
        /// <param name="scriptPath">Path to the JavaScript file</param>
        protected virtual async Task ExecuteScriptAsync(string scriptPath)
        {
            try
            {
                var scriptContent = await File.ReadAllTextAsync(scriptPath);
                _jsEngine?.Execute(scriptContent);

                // Call onStart handler if registered
                if (_eventHandlers.TryGetValue("start", out var startHandler))
                {
                    try
                    {
                        if (startHandler is ScriptFunction func && _jsEngine != null)
                        {
                            _jsEngine.Invoke(func);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error in onStart handler: {ex.Message}");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error executing script '{scriptPath}': {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Calls an event handler if it exists
        /// </summary>
        /// <param name="eventName">Name of the event</param>
        /// <param name="args">Arguments to pass to the handler</param>
        protected virtual void CallEventHandler(string eventName, params JsValue[] args)
        {
            if (_eventHandlers.TryGetValue(eventName, out var handler))
            {
                try
                {
                    if (handler is ScriptFunction func && _jsEngine != null)
                    {
                        _jsEngine.Invoke(func, args);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error in {eventName} handler: {ex.Message}");
                }
            }
        }

        /// <summary>
        /// Evaluates a JavaScript expression and returns the result
        /// </summary>
        /// <param name="expression">JavaScript expression to evaluate</param>
        /// <returns>Result of the evaluation</returns>
        protected virtual string EvaluateExpression(string expression)
        {
            try
            {
                var result = _jsEngine?.Evaluate(expression);

                if (result == null)
                {
                    return "undefined";
                }

                // Handle undefined
                if (result.IsUndefined())
                {
                    return "undefined";
                }

                // Handle null
                if (result.IsNull())
                {
                    return "null";
                }

                // Handle objects - serialize to JSON
                if (result.Type == Jint.Runtime.Types.Object && _jsEngine != null)
                {
                    try
                    {
                        var jsonSerializer = new JsonSerializer(_jsEngine);
                        var obj = result.AsObject();
                        var json = jsonSerializer.Serialize(obj);
                        return json.ToString() ?? "{}";
                    }
                    catch
                    {
                        // Fallback if JSON serialization fails
                        return result.ToString() ?? "{}";
                    }
                }

                // Handle arrays
                if (result.IsArray() && _jsEngine != null)
                {
                    try
                    {
                        var jsonSerializer = new JsonSerializer(_jsEngine);
                        var array = result.AsArray();
                        var json = jsonSerializer.Serialize(array);
                        return json.ToString() ?? "[]";
                    }
                    catch
                    {
                        // Fallback to manual array display
                        var array = result.AsArray();
                        var items = new List<string>();
                        for (uint i = 0; i < array.Length; i++)
                        {
                            var item = array.Get(i.ToString());
                            items.Add(item?.ToString() ?? "undefined");
                        }
                        return $"[{string.Join(", ", items)}]";
                    }
                }

                // Handle other types (strings, numbers, booleans, etc.)
                return result.ToString() ?? "undefined";
            }
            catch (Exception ex)
            {
                return $"Error: {ex.Message}";
            }
        }
    }
}