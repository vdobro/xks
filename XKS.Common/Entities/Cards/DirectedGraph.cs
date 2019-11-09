using System;

namespace XKS.Common.Entities.Cards
{
	public sealed class DirectedGraph : Graph
	{
		public Node Root
		{
			get => _root;
			set
			{
				if (value == null)
				{
					throw new ArgumentException("Root node cannot be null");
				}

				if (!Nodes.Contains(value))
				{
					throw new ArgumentException("Root node must belong to the graph");
				}
				_root = value;
			} 
		}

		private Node _root;
	}
}