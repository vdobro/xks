using XKS.Data.Configuration;
using XKS.Model;

namespace XKS.Data
{
	public class DeckRepository : BasicRepository<Deck>
	{
		public DeckRepository(StandardDbContext dbContext) 
			: base(dbContext, dbContext.Decks!)
		{
		}
	}
}