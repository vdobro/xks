using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using XKS.Model;

namespace XKS.Data
{
	public class DeckRepository: IEntityRepository<Deck>
	{
		private readonly StandardDbContext _dbContext;

		public DeckRepository(StandardDbContext dbContext)
		{
			_dbContext = dbContext;
		}
		
		public async Task<IEnumerable<Deck>> GetAll()
		{
			return await _dbContext.Decks!.ToListAsync();
		}

		public async Task<Deck> Find(Guid id)
		{
			return await _dbContext.Decks!.FindAsync(id);
		}

		public async Task<Deck> Save(Deck entity)
		{
			var old = await Find(entity.ID);
			Guid id;
			if (old != null)
			{
				old.Name = entity.Name;
				id = old.ID;
			}
			else
			{
				_dbContext.Decks!.Add(entity);
				id = entity.ID;
			}
			await _dbContext.SaveChangesAsync();
			return await Find(id);
		}

		public async Task Delete(Deck entity)
		{
			_dbContext.Decks?.Remove(entity);
			await _dbContext.SaveChangesAsync();
		}
	}
}