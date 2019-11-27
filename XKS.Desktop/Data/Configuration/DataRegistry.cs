using Microsoft.EntityFrameworkCore;
using StructureMap;
using XKS.Model;
using static XKS.Data.Configuration.PersistenceConfiguration;

namespace XKS.Data
{
	public class DataRegistry : Registry
	{
		public DataRegistry()
		{
			For<DbContextOptions<StandardDbContext>>()
			   .Use(() => ConfigDbContextOptions(new DbContextOptionsBuilder<StandardDbContext>()));
			For<DbContext>().Use<StandardDbContext>();

			For<IEntityRepository<Deck>>().Use<DeckRepository>();
		}
	}
}