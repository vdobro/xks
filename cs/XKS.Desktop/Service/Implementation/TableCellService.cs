using System;
using System.Threading.Tasks;
using XKS.Data;
using XKS.Data.Repository.Utility;
using XKS.Model;

namespace XKS.Service.Implementation
{
	public sealed class TableCellService : ITableCellService
	{
		private readonly IEntityRepository<TableCell> _cellRepository;
		private readonly ITableCellValidationService  _validationService;

		public TableCellService(IEntityRepository<TableCell> cellRepository,
		                        ITableCellValidationService  validationService)
		{
			_cellRepository = cellRepository ?? throw new ArgumentNullException(nameof(cellRepository));
			_validationService = validationService ?? throw new ArgumentNullException(nameof(validationService));
		}

		public async Task SetCellValue(TableCell cell, string value)
		{
			void FailConversion()
			{
				var typeFormatted = Enum.GetName(typeof(ColumnTypes), GetCellType(cell));
				throw new ArgumentException($"Cannot convert {value} to type " + typeFormatted);
			}

			var (isValid, returnedValue) = _validationService.IsValueValid(cell, value);
			if (!isValid || returnedValue == null)
			{
				FailConversion();
				return;
			}

			switch (GetCellType(cell))
			{
				case ColumnTypes.Text:
					cell.TextValue = (string) returnedValue;
					break;
				case ColumnTypes.Date:
					cell.DateValue = (DateTime) returnedValue;
					break;
				case ColumnTypes.Numeric:
					cell.NumericValue = (decimal) returnedValue;
					break;
				case ColumnTypes.Boolean:
					cell.BooleanValue = (bool?) returnedValue;
					break;
				default:
					throw new ArgumentOutOfRangeException();
			}

			await _cellRepository.Save(cell);
		}

		private static ColumnTypes GetCellType(TableCell cell) =>
			cell.Column?.Type ?? throw new ArgumentException(
				"Column corresponding to a cell cannot be null");
	}
}