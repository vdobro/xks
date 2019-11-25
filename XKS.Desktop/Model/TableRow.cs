using System.Collections.Generic;

namespace XKS.Model
{
	public class TableRow : Entity
	{
		public virtual ICollection<TableCell> Cells { get; private set; } = new List<TableCell>();
	}
}