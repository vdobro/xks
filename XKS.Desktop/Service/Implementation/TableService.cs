using System;
using System.Threading.Tasks;
using XKS.Data;
using XKS.Model;

namespace XKS.Service.Implementation
{
	public class TableService : ITableService
	{
		private readonly IEntityRepository<Table> _tableRepository;

		public TableService(IEntityRepository<Table> tableRepository)
		{
			_tableRepository = tableRepository ?? throw new ArgumentNullException(nameof(tableRepository));
		}
		
		public async Task<Table> Create(string title, Deck deck)
		{
			var table = new Table(title, deck);
			return await _tableRepository.Save(table);
		}

		public async Task<ColumnDefinition> AddColumn(Table table, string name, ColumnTypes type)
		{
			var column = new ColumnDefinition(table, name, type);
			table.Columns.Add(column);
			await _tableRepository.Save(table);
			return column;
		}

		public async Task AddRow(Table table)
		{
			var row = new TableRow();
			table.Rows.Add(row);
			await _tableRepository.Save(table);
		}
	}
}