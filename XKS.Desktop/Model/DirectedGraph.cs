using System.Collections.Generic;

namespace XKS.Model
{
	public class DirectedGraph : Entity
	{
		public Deck Deck { get; private set; }
		
		public virtual ICollection<GraphNode> Nodes { get; set; } = new List<GraphNode>();
		
		public GraphNode RootNode { get; set; }
	}

	public class GraphNode : Entity
	{
		public string Value { get; set; }
		
		public virtual ICollection<GraphNode> Adjacent { get; private set; } 
			= new List<GraphNode>();
		
		public GraphNode Parent { get; set; }
	} 
}