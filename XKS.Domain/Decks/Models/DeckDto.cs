using System;
using System.Linq.Expressions;
using XKS.Core.Entities;

namespace XKS.Domain.Decks.Models
{
	public sealed class DeckDto
	{
		public Guid ID { get; }
		public string Name { get; }
	
		public DeckDto(string name)
		{
			Name = name;
		}

		public static Expression<Func<Deck, DeckDto>> Projection => (x) => new DeckDto(x.Name);
	}
}