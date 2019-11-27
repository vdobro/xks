using System.Collections.Generic;

namespace XKS.Model
{
	public class Table : Entity
	{
		public virtual Deck? Deck { get; private set; }
		
		public virtual ICollection<ColumnDefinition> Columns { get; private set; } 
			= new List<ColumnDefinition>();
		
		public virtual ICollection<TableRow> Rows { get; private set; }
			= new List<TableRow>();

		protected Table()
		{
			
		}
	}
}