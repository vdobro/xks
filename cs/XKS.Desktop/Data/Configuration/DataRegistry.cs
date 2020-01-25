using Microsoft.EntityFrameworkCore;
using StructureMap;
using XKS.Data.Repository;
using XKS.Data.Repository.Utility;
using XKS.Model;

namespace XKS.Data.Configuration
{
	public class DataRegistry : Registry
	{
		public DataRegistry()
		{
			For<DbContextOptions<StandardDbContext>>()
			   .Use(() => ConnectionConfiguration.ConfigDbContextOptions(
				        new DbContextOptionsBuilder<StandardDbContext>()));
			For<DbContext>().Use<StandardDbContext>();

			For<IEntityRepository<Deck>>().Use<DeckRepository>();
			For<IEntityRepository<Table>>().Use<TableRepository>();
		}
	}
}