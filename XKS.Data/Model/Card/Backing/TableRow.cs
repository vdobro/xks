using System.Collections.Generic;

namespace XKS.Data.Model.Card.Backing
{
	public class TableRow : DataHolderModel
	{
		public List<TableColumn> Columns { get; set; }
	}
}