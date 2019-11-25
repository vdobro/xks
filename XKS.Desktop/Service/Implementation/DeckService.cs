using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using XKS.Data;
using XKS.Model;

namespace XKS.Service.Implementation
{
	public class DeckService : IDeckService
	{
		private readonly IEntityRepository<Deck> _repository;

		public DeckService(IEntityRepository<Deck> repository)
		{
			_repository = repository ?? throw new ArgumentNullException(nameof(repository));
		}

		public async Task<IEnumerable<Deck>> GetAll()
		{
			return await _repository.GetAll();
		}

		public async Task<Deck> Find(Guid id)
		{
			return await _repository.Find(id);
		}

		public async Task<Deck> Create(Deck deck)
		{
			return await _repository.Save(deck);
		}
	}
}