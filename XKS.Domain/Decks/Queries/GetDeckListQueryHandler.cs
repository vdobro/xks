using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using XKS.Core.Entities;
using XKS.Domain.Decks.Models;
using XKS.Domain.Repository;

namespace XKS.Domain.Decks.Queries
{
	public class GetDeckListQueryHandler : IRequestHandler<GetDeckListQuery, ICollection<DeckDto>>
	{
		private readonly IEntityRepository<Deck> _repository;

		public GetDeckListQueryHandler(IEntityRepository<Deck> repository)
		{
			_repository = repository;
		}
		
		public Task<ICollection<DeckDto>> Handle(GetDeckListQuery request, 
			CancellationToken cancellationToken)
		{
			var all = _repository.GetAll();
			return Task.FromResult<ICollection<DeckDto>>(
				all.Select(DeckDto.Projection).ToList());
		}
	}
}