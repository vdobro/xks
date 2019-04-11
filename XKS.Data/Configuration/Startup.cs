using Microsoft.Extensions.DependencyInjection;
using XKS.Data.Model;
using XKS.Data.Model.Adapter;
using XKS.Data.Repository.Local;
using XKS.Domain.Model;
using XKS.Domain.Repository;

namespace XKS.Data.Configuration
{
	public static class Startup
	{
		public static void SetUpDataLayerInjection(IServiceCollection serviceCollection)
		{
			serviceCollection.AddSingleton<IBaseRepository<Deck>, DeckRepository>();
			serviceCollection.AddSingleton<IEntityModelConverter<DeckModel, Deck>, DeckModelConverter>();
		}
	}
}
