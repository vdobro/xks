using System.Threading.Tasks;
using XKS.Model;

namespace XKS.Service
{
	public interface ITableService
	{
		Task<Table>            Create(string   title, Deck   deck);
		Task<ColumnDefinition> AddColumn(Table table, string name, ColumnTypes type);
		Task                   AddRow(Table    table);
	}
}