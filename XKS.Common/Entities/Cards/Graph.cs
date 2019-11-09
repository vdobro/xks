using System.Collections.Generic;

namespace XKS.Common.Entities.Cards
{
	public class Graph : Card
	{
		public ICollection<Node> Nodes { get; }
		
		public Graph()
		{
			this.Nodes = new HashSet<Node>();
		}
	}
}