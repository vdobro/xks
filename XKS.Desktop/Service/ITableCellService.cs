using System.Threading.Tasks;
using XKS.Model;

namespace XKS.Service
{
	public interface ITableCellService
	{
		Task SetCellValue(TableCell cell, string value);
	}
}