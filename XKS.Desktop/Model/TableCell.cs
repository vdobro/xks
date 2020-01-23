using System;

namespace XKS.Model
{
	public class TableCell : Entity
	{
		public virtual TableRow? ParentRow { get; }

		public virtual ColumnDefinition? Column { get; }

		public string? TextValue { get; set; }

		public DateTime? DateValue { get; set; }

		public decimal? NumericValue { get; set; }

		public bool? BooleanValue { get; set; }

		public TableCell(TableRow         row,
		                 ColumnDefinition column,
		                 string           textValue) : this(row, column)
		{
			TextValue = textValue;
		}


		public TableCell(TableRow         row,
		                 ColumnDefinition column,
		                 DateTime         dateTimeValue) : this(row, column)
		{
			DateValue = dateTimeValue;
		}

		public TableCell(TableRow         row,
		                 ColumnDefinition column,
		                 decimal          numericValue) : this(row, column)
		{
			NumericValue = numericValue;
		}

		public TableCell(TableRow         row,
		                 ColumnDefinition column,
		                 bool             value) : this(row, column)
		{
			BooleanValue = value;
		}

		protected TableCell()
		{
		}

		private TableCell(TableRow         parentRow,
		                  ColumnDefinition column)
		{
			ParentRow = parentRow;
			Column = column;
		}
	}
}