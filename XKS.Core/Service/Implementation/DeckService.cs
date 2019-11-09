using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XKS.Common.Entities;
using XKS.Core.Decks.Models;
using XKS.Core.Repository;

namespace XKS.Core.Service.Implementation
{
	public class DeckService : IDeckService
	{
		private readonly IEntityRepository<Deck> _repository;

		public DeckService(IEntityRepository<Deck> repository)
		{
			_repository = repository ?? throw new ArgumentNullException(nameof(repository));
		}

		public async Task<IEnumerable<DeckDto>> GetAll()
		{
			var all = await _repository.GetAll();
			return all.Select(DeckDto.Projection);
		}
	}
}