using Microsoft.Extensions.DependencyInjection;

namespace XKS.Core.Configuration
{
	public interface IApplicationModule
	{
		string DisplayName { get; }
		
		bool InitializedSuccessfully { get; }
		
		void InitializeBeforeStartup(IServiceCollection services);

		void OnStartup();
	}
}
