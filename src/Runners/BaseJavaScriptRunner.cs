using Jint;
using Jint.Native;
using Jint.Native.Function;
using Jint.Native.Json;
using Jint.Runtime;
using JintRunner.Core;
using JintRunner.Models;
using System.Collections;
using Fluid;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;
using YamlDotNet.RepresentationModel;

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

            // Add render_template function for template rendering with Fluid
            _jsEngine.SetValue("render_template", new Func<JsValue, JsValue, string>((templateArg, dataArg) =>
            {
                try
                {
                    // Type check: first argument must be a string
                    if (!templateArg.IsString())
                    {
                        throw new ArgumentException("render_template: First argument must be a string (template)");
                    }

                    // Type check: second argument must be an object
                    if (!dataArg.IsObject() || dataArg.IsNull() || dataArg.IsUndefined())
                    {
                        throw new ArgumentException("render_template: Second argument must be an object (data)");
                    }

                    var templateString = templateArg.AsString();
                    var dataObject = dataArg.AsObject();

                    return RenderTemplate(templateString, dataObject);
                }
                catch (ArgumentException)
                {
                    // Re-throw argument exceptions
                    throw;
                }
                catch (Exception ex)
                {
                    throw new Exception($"render_template: {ex.Message}");
                }
            }));

            // Add parse_yaml function for parsing YAML strings to JavaScript objects
            _jsEngine.SetValue("parse_yaml", new Func<JsValue, object>((yamlArg) =>
            {
                try
                {
                    // Type check: argument must be a string
                    if (!yamlArg.IsString())
                    {
                        throw new ArgumentException("parse_yaml: Argument must be a string containing YAML");
                    }

                    var yamlString = yamlArg.AsString();
                    return ParseYamlToObject(yamlString);
                }
                catch (ArgumentException)
                {
                    // Re-throw argument exceptions
                    throw;
                }
                catch (Exception ex)
                {
                    throw new Exception($"parse_yaml: {ex.Message}");
                }
            }));
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
        /// Renders a template using Fluid template engine
        /// </summary>
        /// <param name="templateString">The template string</param>
        /// <param name="dataObject">The data object to use in the template</param>
        /// <returns>Rendered template as string</returns>
        private string RenderTemplate(string templateString, Jint.Native.Object.ObjectInstance dataObject)
        {
            try
            {
                // Parse the template
                var parser = new FluidParser();
                if (!parser.TryParse(templateString, out var template, out var error))
                {
                    throw new Exception($"Template parsing error: {error}");
                }

                // Convert Jint object to .NET dictionary for Fluid
                var context = new TemplateContext();
                ConvertJintObjectToFluidContext(dataObject, context);

                // Render the template
                var result = template.Render(context);

                // Return the rendered string directly
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception($"Template rendering failed: {ex.Message}");
            }
        }

        /// <summary>
        /// Parses a YAML string and converts it to a .NET object that preserves order
        /// Always returns an array of documents (single element for single document, multiple elements for multi-document)
        /// </summary>
        /// <param name="yamlString">The YAML string to parse</param>
        /// <returns>Array of parsed document objects</returns>
        private object ParseYamlToObject(string yamlString)
        {
            try
            {
                // Create a deserializer that preserves the order of properties and types
                var deserializer = new DeserializerBuilder()
                    .WithNamingConvention(UnderscoredNamingConvention.Instance)
                    .IgnoreUnmatchedProperties()
                    .Build();

                // Use YamlStream to handle both single and multi-document YAML
                var yamlStream = new YamlStream();
                using (var reader = new StringReader(yamlString))
                {
                    yamlStream.Load(reader);
                }

                var documents = new List<object>();

                // Process each document in the stream
                foreach (var document in yamlStream.Documents)
                {
                    if (document.RootNode != null)
                    {
                        // Convert YamlNode back to string for deserializer
                        using (var stringWriter = new StringWriter())
                        {
                            var yamlDocument = new YamlDocument(document.RootNode);
                            var tempStream = new YamlStream(yamlDocument);
                            tempStream.Save(stringWriter);
                            var documentYaml = stringWriter.ToString().Trim();

                            // Skip effectively empty documents
                            if (!string.IsNullOrWhiteSpace(documentYaml) && documentYaml != "...")
                            {
                                var yamlObject = deserializer.Deserialize<object>(documentYaml);
                                var convertedObject = ConvertYamlObjectToOrderedObject(yamlObject);
                                if (convertedObject != null)
                                {
                                    documents.Add(convertedObject);
                                }
                            }
                        }
                    }
                }

                // Always return an array - single element for single document, multiple for multi-document
                return documents.Count == 0
                    ? new object[] { new Dictionary<string, object>() }
                    : documents.ToArray();
            }
            catch (Exception ex)
            {
                throw new Exception($"YAML parsing failed: {ex.Message}");
            }
        }

        /// <summary>
        /// Converts a YAML object to a .NET object that preserves order and is JavaScript-friendly
        /// </summary>
        /// <param name="yamlObject">The object from YAML deserialization</param>
        /// <returns>Converted object that maintains order</returns>
        private object? ConvertYamlObjectToOrderedObject(object? yamlObject)
        {
            if (yamlObject == null)
            {
                return null;
            }

            // Handle dictionaries (YAML objects) - preserve order
            if (yamlObject is Dictionary<object, object> dict)
            {
                var orderedDict = new Dictionary<string, object?>();
                foreach (var kvp in dict)
                {
                    var key = kvp.Key?.ToString() ?? "";
                    var value = ConvertYamlObjectToOrderedObject(kvp.Value);
                    orderedDict[key] = value;
                }
                return orderedDict;
            }

            // Handle lists (YAML arrays) - convert to regular arrays for better JS compatibility
            if (yamlObject is List<object> list)
            {
                var convertedArray = new object?[list.Count];
                for (int i = 0; i < list.Count; i++)
                {
                    convertedArray[i] = ConvertYamlObjectToOrderedObject(list[i]);
                }
                return convertedArray;
            }

            // Handle primitive types - preserve original types
            if (yamlObject is string str)
            {
                return str;
            }

            if (yamlObject is int || yamlObject is long || yamlObject is double ||
                yamlObject is float || yamlObject is decimal)
            {
                return yamlObject;
            }

            if (yamlObject is bool)
            {
                return yamlObject;
            }

            if (yamlObject is DateTime)
            {
                return yamlObject;
            }

            // For other types, convert to string as fallback
            return yamlObject?.ToString();
        }

        /// <summary>
        /// Converts a Jint ObjectInstance to Fluid template context
        /// </summary>
        /// <param name="jsObject">Jint object instance</param>
        /// <param name="context">Fluid template context</param>
        private void ConvertJintObjectToFluidContext(Jint.Native.Object.ObjectInstance jsObject, TemplateContext context)
        {
            foreach (var property in jsObject.GetOwnProperties())
            {
                var key = property.Key.AsString();
                var value = property.Value.Value;

                if (value != null)
                {
                    var convertedValue = ConvertJsValueToNetObject(value);
                    context.SetValue(key, convertedValue);
                }
            }
        }

        /// <summary>
        /// Converts a JsValue to a .NET object for use with Fluid
        /// </summary>
        /// <param name="jsValue">The JsValue to convert</param>
        /// <returns>Converted .NET object</returns>
        private object? ConvertJsValueToNetObject(JsValue jsValue)
        {
            if (jsValue.IsNull() || jsValue.IsUndefined())
            {
                return null;
            }

            if (jsValue.IsString())
            {
                return jsValue.AsString();
            }

            if (jsValue.IsNumber())
            {
                return jsValue.AsNumber();
            }

            if (jsValue.IsBoolean())
            {
                return jsValue.AsBoolean();
            }

            if (jsValue.IsArray())
            {
                var array = jsValue.AsArray();
                var list = new List<object?>();
                for (uint i = 0; i < array.Length; i++)
                {
                    var item = array.Get(i.ToString());
                    list.Add(ConvertJsValueToNetObject(item));
                }
                return list;
            }

            if (jsValue.IsObject())
            {
                var obj = jsValue.AsObject();
                var dictionary = new Dictionary<string, object?>();
                foreach (var property in obj.GetOwnProperties())
                {
                    var key = property.Key.AsString();
                    var value = property.Value.Value;
                    dictionary[key] = ConvertJsValueToNetObject(value);
                }
                return dictionary;
            }

            // Fallback to string representation
            return jsValue.ToString();
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