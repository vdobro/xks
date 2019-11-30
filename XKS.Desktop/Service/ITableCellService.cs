using System.Threading.Tasks;
using XKS.Model;

namespace XKS.Service.Implementation
{
	public interface ITableCellService
	{
		Task SetCellValue(TableCell cell, string value);
	}
}