using System.Collections.Generic;

namespace XKS.Core.Entities.Cards
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