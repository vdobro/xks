using System;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using XKS.Core.Configuration;

namespace XKS.Domain
{
	[RegisteredModule("Domain module")]
	// ReSharper disable once UnusedMember.Global
	internal sealed class Module : IApplicationModule
	{
		public string DisplayName => GetType().AssemblyQualifiedName;
		public bool InitializedSuccessfully { get; private set; }

		public void InitializeBeforeStartup(IServiceCollection services)
		{
			try
			{
				services.AddMediatR(typeof(Module).Assembly);
				
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
