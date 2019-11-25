using System;

namespace XKS.Model
{
	public class TableCell : Entity
	{
		public virtual TableRow ParentRow { get; private set; }
		
		public ColumnDefinition Column { get; set; }
		
		public string TextValue { get; set; }
		
		public DateTime DateValue { get; set; }
		
		public Decimal NumericValue { get; set; }
		
		public Boolean BooleanValue { get; set; }
	}
}