using System;
using System.Diagnostics;
using Microsoft.Extensions.DependencyInjection;

namespace XKS.Domain.Configuration
{
	[RegisteredModule("Domain module")]
	sealed class DomainModule : IApplicationModule
	{
		public string DisplayName => GetType().AssemblyQualifiedName;
		public bool InitializedSuccessfully { get; private set; }

		public void InitializeBeforeStartup(IServiceCollection services)
		{
			try
			{
				//TODO:

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
