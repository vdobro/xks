using Microsoft.Extensions.DependencyInjection;

namespace XKS.Domain.Configuration
{
	public interface IApplicationModule
	{
		string DisplayName { get; }
		
		bool InitializedSuccessfully { get; }
		
		void InitializeBeforeStartup(IServiceCollection services);

		void OnStartup();
	}
}
