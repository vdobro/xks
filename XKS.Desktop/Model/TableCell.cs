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
		                 string           value) : this(row, column)
		{
			void FailConversion()
			{
				var type = Enum.GetName(typeof(ColumnTypes), column.Type!);
				throw new ArgumentException($"Cannot convert {value} to type " + type);
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
					if (decimal.TryParse(value, out var decimalVal))
					{
						NumericValue = decimalVal;
					}
					else
					{
						FailConversion();
					}

					break;
				case ColumnTypes.BOOLEAN:
					if (bool.TryParse(value, out var boolVal))
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
			ParentRow = parentRow;
			Column = column;
		}

		protected TableCell()
		{
		}
	}
}