using System.Collections.Generic;

namespace XKS.Common.Entities.Cards
{
	public sealed class Node : Entity
	{
		public Answer Answer { get; set; }
		public ICollection<Node> Neighbours { get; }

		public Node()
		{
			Neighbours = new HashSet<Node>();
		}
	}
}