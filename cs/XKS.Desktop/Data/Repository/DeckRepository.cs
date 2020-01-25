using XKS.Data.Configuration;
using XKS.Data.Repository.Utility;
using XKS.Model;

namespace XKS.Data.Repository
{
	public class DeckRepository : BasicRepository<Deck>
	{
		public DeckRepository(StandardDbContext dbContext) 
			: base(dbContext, dbContext.Decks!)
		{
		}
	}
}