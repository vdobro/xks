using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using XKS.Core.Configuration;
using XKS.Core.Infrastructure;

namespace XKS.Launcher
{
	public static class ModuleConfiguration
	{
		private static readonly object LockKey = new object();

		private static readonly ICollection<IApplicationModule> Modules
			= new List<IApplicationModule>();

		private static bool _alreadyStarted = false;

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
					Modules.Add((IApplicationModule)
						Activator.CreateInstance(moduleType));
				}
			}
		}

		private static void InitializeEverything()
		{
			IServiceCollection services = new ServiceCollection();
			foreach (var module in Modules)
			{
				module.InitializeBeforeStartup(services);
			}
		}

		private static void CheckInitializationErrors()
		{
			lock (LockKey)
			{
				var failedInitializations = Modules.Where(module => 
					!module.InitializedSuccessfully).ToList();
				if (failedInitializations.Any())
				{
					throw new Exception("Initialization failure in modules: " +
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
					module.OnStartup();
				}
			}
		}
	}
}