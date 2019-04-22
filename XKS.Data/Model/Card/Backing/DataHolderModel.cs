using System;

namespace XKS.Data.Model.Card.Backing
{
	public class DataHolderModel : ModelBase
	{
		public DateTime Created { get; set; }

		public DateTime LastEdited { get; set; }

		public DateTime LastSeen { get; set; }
	}
}