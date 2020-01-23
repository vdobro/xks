using XKS.Model;

namespace XKS.Service
{
	public interface ITableCellValidationService
	{
		(bool isValid, object? convertedValue) IsValueValid(TableCell cell, string value);
	}
}