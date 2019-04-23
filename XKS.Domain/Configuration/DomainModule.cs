using System;
using System.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using XKS.Domain.Service;
using XKS.Domain.Service.Default;
using DefaultAnswerCheckService = XKS.Domain.Service.Default.DefaultAnswerCheckService;

namespace XKS.Domain.Configuration
{
	[RegisteredModule("Domain module")]
	// ReSharper disable once UnusedMember.Global
	internal sealed class DomainModule : IApplicationModule
	{
		public string DisplayName => GetType().AssemblyQualifiedName;
		public bool InitializedSuccessfully { get; private set; }

		public void InitializeBeforeStartup(IServiceCollection services)
		{
			try
			{
				services.AddSingleton<IAnswerLogService, DefaultAnswerLogService>();
				services.AddSingleton<IAnswerCheckService, DefaultAnswerCheckService>();
				
				InitializedSuccessfully = true;
			}
			catch (Exception e)
			{
				Console.WriteLine(e);
				InitializedSuccessfully = false;
			}
		}

		public void OnStartup()
		{
			
		}
	}
}
