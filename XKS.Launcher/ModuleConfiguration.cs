using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using XKS.Domain.Configuration;

namespace XKS.Launcher
{
	public static class ModuleConfiguration
	{
		private static readonly object LockKey = new object();
		private static readonly ICollection<IApplicationModule> modules 
			= new List<IApplicationModule>();
		private static bool AlreadyStarted = false;

		public static void StartApplication()
		{
			lock (LockKey)
			{
				if (AlreadyStarted)
				{
					throw new Exception("Application has already been started");
				}
				
				RegisterModules();
				
				InitializeEverything();
				
				CheckInitializationErrors();
				
				StartSingleLaunchableModule();
			}
		}
		
		private static void RegisterModules()
		{
			lock (LockKey)
			{	
				foreach (var moduleType in AssemblyUtilities.RegisteredModuleTypes)
				{
					modules.Add((IApplicationModule) 
						Activator.CreateInstance(moduleType));
				}
			}
		}

		private static void InitializeEverything()
		{
			IServiceCollection services = new ServiceCollection();
			foreach (var module in modules)
			{
				module.InitializeBeforeStartup(services);
			}
		}

		private static void CheckInitializationErrors()
		{
			lock (LockKey)
			{
				var failedInitializations = modules.Where(module => !module.InitializedSuccessfully).ToList();
				if (failedInitializations.Any())
				{
					throw new Exception("Initialization failure in modules: " +
					                    string.Join(", ", 
						                    failedInitializations.Select(module => module.DisplayName)));
				}
			}
		}

		private static void StartSingleLaunchableModule()
		{
			lock (LockKey)
			{
				foreach (var module in modules)
				{
					module.OnStartup();
				}
			}
		}
	}
}
