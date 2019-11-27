using System;

namespace XKS.Model
{
	public class TableCell : Entity
	{
		public virtual TableRow ParentRow { get; private set; }

		public virtual ColumnDefinition Column { get; private set; }

		public string TextValue { get; set; }

		public DateTime DateValue { get; set; }

		public Decimal NumericValue { get; set; }

		public Boolean BooleanValue { get; set; }

		public TableCell(TableRow         row,
		                 ColumnDefinition column,
		                 string           value) : this(row, column)
		{
			void FailConversion()
			{
				throw new ArgumentException(
					$"Cannot convert {value} to type " +
					Enum.GetName(typeof(ColumnTypes), column.Type));
			}
			
			switch (column.Type)
			{
				case ColumnTypes.TEXT:
					TextValue = value;
					break;
				case ColumnTypes.DATE:
					if (DateTime.TryParse(value, out var dateVal))
					{
						DateValue = dateVal;
					}
					else
					{
						FailConversion();
					}
					break;
				case ColumnTypes.NUMERIC:
					if (Decimal.TryParse(value, out var decimalVal))
					{
						NumericValue = decimalVal;
					}
					else
					{
						FailConversion();
					}
					break;
				case ColumnTypes.BOOLEAN:
					if (Boolean.TryParse(value, out var boolVal))
					{
						BooleanValue = boolVal;
					}
					else
					{
						FailConversion();
					}
					break;
				default:
					throw new ArgumentOutOfRangeException();
			}
		}
		
		private TableCell(TableRow         parentRow,
		                  ColumnDefinition column)
		{
			this.ParentRow = parentRow;
			this.Column = column;
		}
		
		protected TableCell()
		{
		}
	}
}