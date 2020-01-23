using System;
using XKS.Model;

namespace XKS.Service.Implementation
{
	public sealed class TableCellValidationService
		: ITableCellValidationService
	{
		public (bool isValid, object convertedValue) IsValueValid(TableCell cell, string value)
		{
			switch (cell.Column?.Type ??
			        throw new ArgumentException("Corresponding column of a cell cannot be null"))
			{
				case ColumnTypes.Text:
					return (true, value);
				case ColumnTypes.Date:
					if (DateTime.TryParse(value, out var dateVal))
					{
						return (true, dateVal);
					}

					break;
				case ColumnTypes.Numeric:
					if (decimal.TryParse(value, out var decimalVal))
					{
						return (true, decimalVal);
					}

					break;
				case ColumnTypes.Boolean:
					if (bool.TryParse(value, out var boolVal))
					{
						return (true, boolVal);
					}

					break;
				default:
					throw new ArgumentOutOfRangeException();
			}

			return (false, new object());
		}
	}
}