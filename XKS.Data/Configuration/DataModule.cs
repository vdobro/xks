using Microsoft.Extensions.DependencyInjection;
using XKS.Data.Model;
using XKS.Data.Model.Adapter;
using XKS.Data.Repository.Local;
using XKS.Domain.Configuration;
using XKS.Domain.Model;
using XKS.Domain.Repository;

namespace XKS.Data.Configuration
{
	[RegisteredModule("Data module")]
	sealed class DataModule : IApplicationModule
	{
		public string DisplayName => GetType().AssemblyQualifiedName;
		
		public bool InitializedSuccessfully { get; private set; }
		
		public void InitializeBeforeStartup(IServiceCollection services)
		{
			services.AddSingleton<IBaseRepository<Deck>, DeckRepository>();
			services.AddSingleton<IEntityModelConverter<DeckModel, Deck>, DeckModelConverter>();
			
			InitializedSuccessfully = true;
		}

		public void OnStartup()
		{
			
		}
	}
}
