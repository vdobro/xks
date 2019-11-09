using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using StructureMap;
using XKS.Common.Configuration;
using XKS.Common.Infrastructure;

namespace XKS.Launcher
{
	public static class ModuleConfiguration
	{
		private static readonly object LockKey = new object();

		private static readonly ICollection<IApplicationModule> Modules
			= new List<IApplicationModule>();

		private static bool _alreadyStarted = false;

		private static Container? _serviceContainer;
		
		public static void StartApplication()
		{
			lock (LockKey)
			{
				if (_alreadyStarted)
				{
					throw new Exception("Application has already been started");
				}

				_alreadyStarted = true;

				RegisterModules();

				InitializeEverything();

				CheckInitializationErrors();

				StartSingleModule();
			}
		}

		private static void RegisterModules()
		{
			lock (LockKey)
			{
				foreach (var moduleType in AssemblyUtilities.RegisteredModuleTypes)
				{
					var instance = Activator.CreateInstance(moduleType);
					Modules.Add((IApplicationModule) instance!);
				}
			}
		}

		private static void InitializeEverything()
		{
			var registries = Modules.Select(x => x.InitializeBeforeStartup());
			
			var rootRegistry = new Registry();
			foreach (var registry in registries)
			{
				rootRegistry.IncludeRegistry(registry);
			}
			_serviceContainer = new Container(rootRegistry);
		}

		private static void CheckInitializationErrors()
		{
			lock (LockKey)
			{
				var failedInitializations = Modules.Where(module => 
					!module.InitializedSuccessfully).ToList();
				if (failedInitializations.Any())
				{
					throw new Exception("Module initialization failure: " +
					                    string.Join(", ",
						                    failedInitializations
						                    .Select(module => module.DisplayName)));
				}
			}
		}

		private static void StartSingleModule()
		{
			lock (LockKey)
			{
				foreach (var module in Modules)
				{
					module.OnStartup(_serviceContainer!);
				}
			}
		}
	}
}