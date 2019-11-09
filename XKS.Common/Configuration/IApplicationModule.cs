using System;
using Microsoft.Extensions.DependencyInjection;
using StructureMap;

namespace XKS.Common.Configuration
{
	public interface IApplicationModule
	{
		string DisplayName { get; }

		bool InitializedSuccessfully { get; }

		Registry InitializeBeforeStartup();

		void OnStartup(Container container);
	}
}
