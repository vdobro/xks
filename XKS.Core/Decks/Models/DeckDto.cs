using System;
using System.Linq.Expressions;
using XKS.Common.Entities;

namespace XKS.Core.Decks.Models
{
	public sealed class DeckDto
	{
		public Guid ID { get; }
		public string Name { get; }
	
		public DeckDto(Guid id, string name)
		{
			ID = id;
			Name = name;
		}
		
		public static Func<Deck, DeckDto> Projection = (x) => new DeckDto(x.ID, x.Name);
	}
}