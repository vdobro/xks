using System.Collections.Generic;

namespace XKS.Core.Entities
{
	public class Deck : Entity
	{
		public string Name { get; set; }
		
		public ICollection<Card> Cards { get; private set; }

		public Deck()
		{
			Cards = new HashSet<Card>();
		}
	}
}