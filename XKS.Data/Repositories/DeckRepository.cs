using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using XKS.Core.Entities;
using XKS.Domain.Repository;

namespace XKS.Data.Repositories
{
	public class DeckRepository: IEntityRepository<Deck>
	{
		private readonly StandardDbContext _dbContext;
		private readonly IMapper mapper;

		public DeckRepository(StandardDbContext dbContext,
			IMapper mapper)
		{
			_dbContext = dbContext;
			this.mapper = mapper;
		}
		
		public IQueryable<Deck> GetAll()
		{
			return mapper.ProjectTo<Deck>(_dbContext.Decks);
		}

		public async Task<Deck> Find(Guid id)
		{
			var result = await _dbContext.Decks.FindAsync(id);
			return mapper.Map<Deck>(result);
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
				var mapped = mapper.Map<Data.Backing.Deck>(entity);
				_dbContext.Decks.Add(mapped);
				id = mapped.ID;
			}
			await _dbContext.SaveChangesAsync();
			return await Find(id);
		}

		public async Task Delete(Deck entity)
		{
			var dbEntity = _dbContext.Decks.Find(entity.ID);
			_dbContext.Decks.Remove(dbEntity);
			await _dbContext.SaveChangesAsync();
		}
	}
}