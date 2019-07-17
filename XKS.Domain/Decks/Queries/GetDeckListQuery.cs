using System.Collections.Generic;
using MediatR;
using XKS.Domain.Decks.Models;

namespace XKS.Domain.Decks.Queries
{
	public class GetDeckListQuery : IRequest<ICollection<DeckDto>>
	{
		
	}
}