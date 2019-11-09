using System.Collections.Generic;

namespace XKS.Common.Entities
{
	public class Card : Entity
	{
		public virtual ICollection<Tag> Tags { get; private set; }

		public Card()
		{
			Tags = new HashSet<Tag>();
		}
	}
}