using System.Collections.Generic;

namespace XKS.Model
{
	public class GraphNode : Entity
	{
		public string? Value { get; set; }

		public virtual ICollection<GraphNode> Adjacent { get; }
			= new List<GraphNode>();

		public virtual GraphNode? Parent { get; set; }

		protected GraphNode()
		{
		}
	}
}