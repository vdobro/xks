using System.Collections.Generic;

namespace XKS.Common.Entities
{
	public class Tag : Entity
	{
		public string Name { get; set; }
		
		public virtual ICollection<Card> Cards { get; set; }
	}
}