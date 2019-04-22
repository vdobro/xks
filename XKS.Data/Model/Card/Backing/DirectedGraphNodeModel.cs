using System.Collections.Generic;

namespace XKS.Data.Model.Card.Backing
{
	public class DirectedGraphNodeModel : DataHolderModel
	{
		/// <summary>
		/// Nodes connected by edges pointing from this node
		/// </summary>
		public List<DirectedGraphNodeModel> Adjacent { get; set; }
	}
}