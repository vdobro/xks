using System.Collections.Generic;

namespace XKS.Model
{
	public class DirectedGraph : Entity
	{
		public virtual Deck? Deck { get; private set; }
		
		public virtual ICollection<GraphNode> Nodes { get; set; } = new List<GraphNode>();
		
		public virtual GraphNode? RootNode { get; set; }

		public DirectedGraph(Deck parent)
		{
			this.Deck = parent;
		}

		protected DirectedGraph()
		{
			
		}
	}
}