using System.Collections;
using System.Collections.Generic;
using XKS.Data.Model.Card;
using XKS.Data.Model.Card.Backing;

namespace XKS.Data.Model
{
	public class DeckModel : ModelBase
	{
		public string Name { get; set; }

		public IEnumerable<DataHolderModel> Cards { get; set; }
	}
}
